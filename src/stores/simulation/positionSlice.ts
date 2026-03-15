import { getSuccessFeeRate } from '@/lib/rewardEngine';
import { PENALTY_RATE, SWAP_FEE_RATE } from '@/lib/constants';
import { addMonths } from '@/lib/dateUtils';
import { uid } from '@/lib/uid';
import type { SimPosition, SimSet, SimGet } from './types';

export function createPositionSlice(set: SimSet, get: SimGet) {
  return {
    createPosition: ({
      ayniAmount,
      amountUsd,
      termMonths,
      autoActivate,
      tierDiscount = 0,
    }: {
      ayniAmount: number;
      amountUsd: number;
      termMonths: number;
      autoActivate: boolean;
      tierDiscount?: number;
    }) => {
      const state = get();
      const posId = `pos-${uid()}`;
      const now = state.simulationDate;
      const endDate = addMonths(now, termMonths);
      const nextPayoutDate = addMonths(now, 3);
      const feeRate = getSuccessFeeRate(amountUsd, termMonths, tierDiscount);

      const newBalances = { ...state.balances };
      if (autoActivate) {
        if (newBalances.ayniAvailable < ayniAmount) {
          throw new Error('Insufficient AYNI balance');
        }
        newBalances.ayniAvailable -= ayniAmount;
        newBalances.ayniActivated += ayniAmount;
      }

      const position: SimPosition = {
        id: posId,
        status: 'active',
        createdAt: now,
        startDate: now,
        endDate,
        termMonths,
        participatedUsd: amountUsd,
        ayniActivated: ayniAmount,
        successFeeRate: feeRate,
        dailyRewards: [],
        totalDistributedPaxg: 0,
        totalDistributedUsd: 0,
        totalClaimedPaxg: 0,
        distributedAtLastPayout: 0,
        nextPayoutDate,
        payouts: [],
      };

      // Remove the separate purchase activity that buyAyni added — merge into one
      const mergedActivities = state.activities.filter(
        (a) => !(a.type === 'purchase' && a.timestamp === now),
      );

      set({
        balances: newBalances,
        positions: [...state.positions, position],
        activities: [
          {
            id: uid(),
            type: 'activate' as const,
            timestamp: now,
            title: `Participated $${amountUsd.toFixed(2)}`,
            description: `${ayniAmount.toFixed(2)} AYNI locked for ${termMonths} months`,
            amount: { value: amountUsd, currency: 'USD', direction: 'out' as const },
          },
          ...mergedActivities,
        ],
      });

      // Track position creation
      import('@/hooks/useAnalytics')
        .then(({ trackEvent }) =>
          trackEvent('position_created', { amountUsd, termMonths, ayniAmount }),
        )
        .catch(() => {});

      return posId;
    },

    claimRewards: (positionId: string) => {
      const state = get();
      const pos = state.positions.find((p) => p.id === positionId);
      if (!pos) throw new Error('Position not found');

      const unclaimed = pos.totalDistributedPaxg - pos.totalClaimedPaxg;
      if (unclaimed <= 0) return 0;

      const unclaimedUsd = unclaimed * state.prices.paxgUsd;

      set((s) => ({
        positions: s.positions.map((p) =>
          p.id === positionId ? { ...p, totalClaimedPaxg: p.totalDistributedPaxg } : p,
        ),
        balances: {
          ...s.balances,
          paxgBalance: s.balances.paxgBalance - unclaimed,
          paxgClaimed: s.balances.paxgClaimed + unclaimed,
        },
        activities: [
          {
            id: uid(),
            type: 'claim' as const,
            timestamp: s.simulationDate,
            title: `Claimed ${unclaimed.toFixed(6)} PAXG`,
            description: `Claimed ${unclaimed.toFixed(6)} PAXG ($${unclaimedUsd.toFixed(2)}) from position ${positionId}`,
            amount: { value: unclaimed, currency: 'PAXG', direction: 'in' as const },
          },
          ...s.activities,
        ],
      }));

      return unclaimed;
    },

    claimAllRewards: () => {
      const state = get();
      let totalClaimed = 0;
      for (const pos of state.positions) {
        if (pos.status === 'active' || pos.status === 'completed') {
          const unclaimed = pos.totalDistributedPaxg - pos.totalClaimedPaxg;
          if (unclaimed > 0) {
            get().claimRewards(pos.id);
            totalClaimed += unclaimed;
          }
        }
      }
      return totalClaimed;
    },

    completePosition: (positionId: string) => {
      const state = get();
      const pos = state.positions.find((p) => p.id === positionId);
      if (!pos || pos.status !== 'active') return;

      set((s) => ({
        positions: s.positions.map((p) =>
          p.id === positionId
            ? { ...p, status: 'completed' as const, endDate: s.simulationDate }
            : p,
        ),
        balances: {
          ...s.balances,
          ayniActivated: s.balances.ayniActivated - pos.ayniActivated,
          ayniAvailable: s.balances.ayniAvailable + pos.ayniActivated,
        },
        activities: [
          {
            id: uid(),
            type: 'complete' as const,
            timestamp: s.simulationDate,
            title: `Position completed: ${pos.ayniActivated.toFixed(2)} AYNI returned`,
            description: `Lock completed. ${pos.ayniActivated.toFixed(2)} AYNI returned to your wallet.`,
            amount: { value: pos.ayniActivated, currency: 'AYNI', direction: 'in' as const },
          },
          ...s.activities,
        ],
      }));
    },

    forceCompletePosition: (positionId: string) => {
      const state = get();
      const pos = state.positions.find((p) => p.id === positionId);
      if (!pos || pos.status !== 'active') return;

      set((s) => ({
        positions: s.positions.map((p) =>
          p.id === positionId
            ? { ...p, status: 'completed' as const, endDate: s.simulationDate }
            : p,
        ),
        balances: {
          ...s.balances,
          ayniActivated: s.balances.ayniActivated - pos.ayniActivated,
          ayniAvailable: s.balances.ayniAvailable + pos.ayniActivated,
        },
        activities: [
          {
            id: `act-${Date.now()}-fc`,
            type: 'complete' as const,
            timestamp: s.simulationDate,
            title: `Lock completed: ${pos.ayniActivated.toFixed(2)} AYNI returned`,
            description: `Position ${pos.id} force-completed. ${pos.ayniActivated.toFixed(2)} AYNI returned to your wallet.`,
            amount: {
              value: pos.ayniActivated,
              currency: 'AYNI' as const,
              direction: 'in' as const,
            },
          },
          ...s.activities,
        ],
      }));
    },

    cancelPosition: (positionId: string) => {
      const state = get();
      const pos = state.positions.find((p) => p.id === positionId);
      if (!pos || pos.status !== 'active') return;

      const penaltyAyni = pos.ayniActivated * PENALTY_RATE;
      const returnedAyni = pos.ayniActivated - penaltyAyni;

      set((s) => ({
        positions: s.positions.map((p) =>
          p.id === positionId ? { ...p, status: 'cancelled' as const } : p,
        ),
        balances: {
          ...s.balances,
          ayniActivated: s.balances.ayniActivated - pos.ayniActivated,
          ayniAvailable: s.balances.ayniAvailable + returnedAyni,
        },
        activities: [
          {
            id: uid(),
            type: 'cancel' as const,
            timestamp: s.simulationDate,
            title: `Position cancelled (5% penalty)`,
            description: `Cancelled early. Returned ${returnedAyni.toFixed(2)} AYNI (penalty: ${penaltyAyni.toFixed(2)} AYNI).`,
            amount: { value: returnedAyni, currency: 'AYNI', direction: 'in' as const },
          },
          ...s.activities,
        ],
      }));
    },

    reactivateAyni: (ayniAmount: number, termMonths: number, tierDiscount: number = 0) => {
      const state = get();
      if (state.balances.ayniAvailable < ayniAmount) {
        throw new Error('Insufficient AYNI balance');
      }
      const amountUsd = ayniAmount * state.prices.ayniUsd;
      return get().createPosition({
        ayniAmount,
        amountUsd,
        termMonths,
        autoActivate: true,
        tierDiscount,
      });
    },

    reinvest: (paxgAmount: number, termMonths: number, tierDiscount: number = 0) => {
      const state = get();
      if (paxgAmount <= 0) throw new Error('Amount must be positive');
      if (paxgAmount > state.balances.paxgBalance) throw new Error('Insufficient PAXG balance');
      if (termMonths < 1 || termMonths > 48) throw new Error('Invalid term');

      const grossUsd = paxgAmount * state.prices.paxgUsd;
      const swapFeeUsd = grossUsd * SWAP_FEE_RATE;
      const netUsd = grossUsd - swapFeeUsd;

      if (netUsd < 100) {
        throw new Error(
          `Minimum participation is $100 after conversion fee (1.5%). ` +
            `Your PAXG is worth ~$${grossUsd.toFixed(2)}, after fee: ~$${netUsd.toFixed(2)}`,
        );
      }

      const ayniAmount = netUsd / state.prices.ayniUsd;

      const positionId = `pos-${uid()}`;
      const now = state.simulationDate;
      const endDate = addMonths(now, termMonths);
      const nextPayoutDate = addMonths(now, 3);
      const feeRate = getSuccessFeeRate(netUsd, termMonths, tierDiscount);

      const position: SimPosition = {
        id: positionId,
        status: 'active',
        createdAt: now,
        startDate: now,
        endDate,
        termMonths,
        participatedUsd: netUsd,
        ayniActivated: ayniAmount,
        successFeeRate: feeRate,
        dailyRewards: [],
        totalDistributedPaxg: 0,
        totalDistributedUsd: 0,
        totalClaimedPaxg: 0,
        distributedAtLastPayout: 0,
        nextPayoutDate,
        payouts: [],
      };

      set((s) => ({
        balances: {
          ...s.balances,
          paxgBalance: s.balances.paxgBalance - paxgAmount,
          ayniActivated: s.balances.ayniActivated + ayniAmount,
        },
        positions: [...s.positions, position],
        activities: [
          {
            id: uid(),
            type: 'reinvest' as const,
            timestamp: now,
            title: 'Reinvested Distributions',
            description: `Converted ${paxgAmount.toFixed(8)} PAXG ($${grossUsd.toFixed(2)}) → ${ayniAmount.toFixed(4)} AYNI (fee: $${swapFeeUsd.toFixed(2)}), locked for ${termMonths} months`,
            amount: { value: netUsd, currency: 'AYNI', direction: 'in' as const },
          },
          ...s.activities,
        ],
      }));

      return positionId;
    },
  };
}
