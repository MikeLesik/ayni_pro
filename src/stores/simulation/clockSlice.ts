import { TROY_OUNCE_GRAMS } from '@/lib/constants';
import { addDays, addMonths, dateLte, dateLt, daysBetween } from '@/lib/dateUtils';
import { dateToSeed, goldPriceForDate } from '@/lib/deterministicHash';
import { calculateDailyAccrual } from '@/services/simulation/distributionEngine';
import { uid } from '@/lib/uid';
import type { SimDailyReward, SimPayout, SimSet, SimGet } from './types';

export function createClockSlice(set: SimSet, get: SimGet) {
  return {
    advanceDay: () => {
      const state = get();
      const newDate = addDays(state.simulationDate, 1);
      const newPositions = state.positions.map((pos) => ({
        ...pos,
        dailyRewards: [...pos.dailyRewards],
        payouts: [...pos.payouts],
      }));
      const newActivities = [...state.activities];
      const newBalances = { ...state.balances };

      for (const pos of newPositions) {
        if (pos.status !== 'active') continue;

        // Check if position ended
        if (dateLt(pos.endDate, newDate)) {
          pos.status = 'completed';
          newBalances.ayniActivated -= pos.ayniActivated;
          newBalances.ayniAvailable += pos.ayniActivated;

          newActivities.unshift({
            id: uid(),
            type: 'complete',
            timestamp: newDate,
            title: `Lock completed: ${pos.ayniActivated.toFixed(2)} AYNI returned`,
            description: `Position ${pos.id} completed after ${pos.termMonths} months. ${pos.ayniActivated.toFixed(2)} AYNI returned to your wallet.`,
            amount: { value: pos.ayniActivated, currency: 'AYNI', direction: 'in' },
          });
          continue;
        }

        // Calculate daily reward — deterministic, matching distributionEngine
        const newDateKey = newDate.split('T')[0]!;
        const seed = dateToSeed(newDateKey, pos.id);
        const dayGoldPrice = goldPriceForDate(state.prices.goldPerGram, newDateKey);
        const dayPaxgPrice = dayGoldPrice * TROY_OUNCE_GRAMS;

        const daily = calculateDailyAccrual(
          pos.ayniActivated,
          pos.participatedUsd,
          pos.termMonths,
          dayGoldPrice,
          dayPaxgPrice,
          seed,
        );

        const dailyRecord: SimDailyReward = {
          date: newDate,
          goldProductionGrams: daily.goldProductionGrams,
          extractionCostGrams: daily.costsGrams,
          extractionCostUsd: daily.costsUsd,
          successFeeGrams: daily.successFeeGrams,
          netRewardGrams: daily.netGoldGrams,
          netRewardPaxg: daily.netPaxg,
          netRewardUsd: daily.netUsd,
        };

        pos.dailyRewards.push(dailyRecord);
        pos.totalDistributedPaxg += daily.netPaxg;
        pos.totalDistributedUsd += daily.netUsd;
        newBalances.paxgBalance += daily.netPaxg;

        // Safety: recompute nextPayoutDate if missing/invalid (stale persisted data)
        if (!pos.nextPayoutDate || typeof pos.nextPayoutDate !== 'string') {
          pos.nextPayoutDate = addMonths(pos.startDate, 3);
        }
        // Safety: ensure distributedAtLastPayout is a number
        if (typeof pos.distributedAtLastPayout !== 'number') {
          pos.distributedAtLastPayout = 0;
        }

        // Check quarterly payout
        if (dateLte(pos.nextPayoutDate, newDate)) {
          const quarterPaxg = pos.totalDistributedPaxg - pos.distributedAtLastPayout;
          const payout: SimPayout = {
            date: newDate,
            amountPaxg: quarterPaxg,
            amountUsd: quarterPaxg * state.prices.paxgUsd,
            status: 'paid',
          };

          pos.payouts.push(payout);
          pos.distributedAtLastPayout = pos.totalDistributedPaxg;
          pos.nextPayoutDate = addMonths(pos.nextPayoutDate, 3);

          if (payout.amountPaxg > 0) {
            newActivities.unshift({
              id: uid(),
              type: 'payout',
              timestamp: newDate,
              title: `Quarterly payout: ${payout.amountPaxg.toFixed(6)} PAXG`,
              description: `Quarterly payout of ${payout.amountPaxg.toFixed(6)} PAXG ($${payout.amountUsd.toFixed(2)})`,
              amount: { value: payout.amountPaxg, currency: 'PAXG', direction: 'in' },
            });
          }
        }
      }

      set({
        simulationDate: newDate,
        positions: newPositions,
        activities: newActivities,
        balances: newBalances,
      });

      // Auto-reinvest quarterly payouts
      for (const pos of newPositions) {
        if (pos.status !== 'active') continue;
        const lastPayout = pos.payouts[pos.payouts.length - 1];
        if (lastPayout && lastPayout.date === newDate && lastPayout.amountPaxg > 0) {
          const s = get();
          const posOverride = s.positionAutoReinvest?.[pos.id];
          const shouldReinvest = posOverride ?? s.autoReinvestEnabled;
          if (shouldReinvest) {
            try {
              s.reinvest(lastPayout.amountPaxg, s.autoReinvestTermMonths ?? 12);
            } catch (_e) {
              /* minimum not met — skip */
            }
          }
        }
      }

      // Daily earnings notification
      import('@/services/earningsNotificationService')
        .then(({ sendDailyEarningsSummary }) => sendDailyEarningsSummary())
        .catch(() => {});

      // Auto-claim for gamification streak
      if (get().autoClaimOnAdvance) {
        import('@/stores/mineStore').then(({ useMineStore }) => {
          useMineStore.getState().autoClaimDay(newDate);
        });
      }
    },

    advanceDays: (n: number) => {
      for (let i = 0; i < n; i++) {
        get().advanceDay();
      }
    },

    advanceToNextPayout: () => {
      const state = get();
      const activePositions = state.positions.filter((p) => p.status === 'active');
      if (activePositions.length === 0) return;

      let nextDate = activePositions[0]!.nextPayoutDate;
      for (const pos of activePositions) {
        if (dateLt(pos.nextPayoutDate, nextDate)) {
          nextDate = pos.nextPayoutDate;
        }
      }

      const days = daysBetween(state.simulationDate, nextDate);
      if (days > 0) {
        get().advanceDays(days);
      }
    },
  };
}
