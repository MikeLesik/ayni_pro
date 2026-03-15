import { useSimulationStore } from '@/stores/simulation';
import { useDistributionStore } from '@/stores/distributionStore';
import { calculateRawTier } from '@/lib/calculateTier';
import { TIER_CONFIG } from '@/lib/tierConfig';
import type { ChartDataPoint, DailyReward } from '@/types/dashboard';
import type { ActivityEvent } from '@/types/activity';

// ── Shared helpers used across mock modules ──────────────────

export function delay(ms = 200): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function getState() {
  return useSimulationStore.getState();
}

/** Compute the user's current tier discount from simulation store state */
export function getTierDiscount(): number {
  const state = useSimulationStore.getState();
  const lockedAYNI = state.balances.ayniActivated;
  // Approximate participation months from oldest active position
  const activePositions = state.positions.filter((p) => p.status === 'active');
  let months = 0;
  if (activePositions.length > 0) {
    const oldest = activePositions.reduce((a, b) =>
      new Date(a.startDate) < new Date(b.startDate) ? a : b,
    );
    const diff = new Date(state.simulationDate).getTime() - new Date(oldest.startDate).getTime();
    months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
  }
  const tier = calculateRawTier(lockedAYNI, months);
  return TIER_CONFIG[tier].successFeeDiscount;
}

// ── Map simulation activity to ActivityEvent ─────────────────

export function mapActivityToEvent(
  act: ReturnType<typeof getState>['activities'][number],
): ActivityEvent {
  const typeMap: Record<string, ActivityEvent['type']> = {
    topup: 'participation_confirmed',
    purchase: 'participation_confirmed',
    activate: 'participation_confirmed',
    reward: 'reward_credited',
    payout: 'quarterly_payout',
    claim: 'payout_completed',
    complete: 'system_announcement',
    cancel: 'system_announcement',
    sell: 'payout_completed',
    withdraw: 'payout_completed',
    reactivate: 'participation_confirmed',
    reinvest: 'participation_confirmed',
  };

  return {
    id: act.id,
    type: typeMap[act.type] ?? 'system_announcement',
    title: act.title,
    subtitle: act.description,
    amount: act.amount?.value
      ? act.amount.direction === 'out'
        ? -act.amount.value
        : act.amount.value
      : undefined,
    timestamp: act.timestamp,
  };
}

// ── Chart data builder ───────────────────────────────────────

export function buildChartData(
  positions: ReturnType<typeof getState>['positions'],
): ChartDataPoint[] {
  if (positions.length === 0) return [];

  // Collect all daily rewards across all positions, aggregate by date
  const byDate = new Map<string, number>();
  for (const pos of positions) {
    for (const dr of pos.dailyRewards) {
      const dateKey = dr.date.split('T')[0]!;
      byDate.set(dateKey, (byDate.get(dateKey) ?? 0) + dr.netRewardUsd);
    }
  }

  // Sort by date and build cumulative
  const sortedDates = [...byDate.keys()].sort();
  let cumulative = 0;
  return sortedDates.map((date) => {
    cumulative += byDate.get(date)!;
    return {
      date,
      distributedCumulative: Math.round(cumulative * 100) / 100,
    };
  });
}

// ── Daily rewards from distribution engine ───────────────────

export function buildDailyRewardsFromDistribution(simDate: string): DailyReward[] {
  const distState = useDistributionStore.getState();
  const accruals = distState.getDailyAccruals(10);

  if (accruals.length === 0) {
    // Fallback to simulation store data
    return buildDailyRewardsFallback(simDate);
  }

  // Aggregate accruals by date (multiple positions may have same date)
  const byDate = new Map<string, DailyReward>();
  for (const a of accruals) {
    const dateKey = a.date.split('T')[0]!;
    const existing = byDate.get(dateKey);

    // Determine status: accruing (current quarter) vs paid (past quarter)
    const quarter = distState.distributionState?.quarters.find((q) => q.id === a.quarterId);
    const status: DailyReward['status'] = quarter?.status === 'paid' ? 'paid' : 'accruing';

    if (existing) {
      existing.netRewardUsd += a.netUsd;
      existing.netRewardPaxg += a.netPaxg;
      existing.goldMinedGrams += a.goldProductionGrams;
      existing.extractionCostUsd += a.costsUsd;
      existing.platformFeeUsd += a.successFeeGrams * a.goldPriceUsd;
    } else {
      byDate.set(dateKey, {
        date: dateKey,
        netRewardUsd: a.netUsd,
        netRewardPaxg: a.netPaxg,
        status,
        goldMinedGrams: a.goldProductionGrams,
        extractionCostUsd: a.costsUsd,
        platformFeeUsd: a.successFeeGrams * a.goldPriceUsd,
        quarterId: a.quarterId,
      });
    }
  }

  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

/** Fallback when distribution store has no data yet */
export function buildDailyRewardsFallback(simDate: string): DailyReward[] {
  const state = getState();
  const activePositions = state.positions.filter((p) => p.status === 'active');
  if (activePositions.length === 0) return [];

  const days = 10;
  const results: DailyReward[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(simDate);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0]!;

    let netRewardUsd = 0;
    let netRewardPaxg = 0;
    let goldMinedGrams = 0;
    let extractionCostUsd = 0;
    let platformFeeUsd = 0;

    for (const pos of activePositions) {
      const dr = pos.dailyRewards.find((r) => r.date.startsWith(dateKey));
      if (dr) {
        netRewardUsd += dr.netRewardUsd;
        netRewardPaxg += dr.netRewardPaxg;
        goldMinedGrams += dr.goldProductionGrams;
        extractionCostUsd += dr.extractionCostUsd;
        platformFeeUsd += dr.successFeeGrams * state.prices.goldPerGram;
      }
    }

    if (netRewardUsd > 0 || goldMinedGrams > 0) {
      results.push({
        date: dateKey,
        netRewardUsd,
        netRewardPaxg,
        status: 'accruing',
        goldMinedGrams,
        extractionCostUsd,
        platformFeeUsd,
      });
    }
  }

  return results;
}
