import { useDistributionStore } from '@/stores/distributionStore';
import type { DashboardResponse } from '@/types/dashboard';
import { delay, getState, buildChartData, buildDailyRewardsFromDistribution } from './helpers';

// ── GET /api/dashboard ───────────────────────────────────────

export async function getDashboard(): Promise<DashboardResponse> {
  await delay(300);
  const state = getState();
  const positions = state.positions;
  const activePositions = positions.filter((p) => p.status === 'active');
  const completedPositions = positions.filter((p) => p.status === 'completed');

  // Today's distribution -- sum of last daily reward from each active position
  let todayDistribution = 0;
  let dailyRate = 0;
  for (const pos of activePositions) {
    if (pos.dailyRewards.length > 0) {
      const last = pos.dailyRewards[pos.dailyRewards.length - 1]!;
      todayDistribution += last.netRewardUsd;
      dailyRate += last.netRewardUsd;
    }
  }

  // Total distributed across all positions
  const totalDistributed = positions.reduce((sum, p) => sum + (p.totalDistributedUsd || 0), 0);
  const totalDistributedPaxg = positions.reduce((sum, p) => sum + (p.totalDistributedPaxg || 0), 0);

  // Total participated
  const totalParticipated = activePositions.reduce((sum, p) => sum + (p.participatedUsd || 0), 0);
  const totalParticipatedAyni = activePositions.reduce((sum, p) => sum + (p.ayniActivated || 0), 0);

  // Next payout
  let nextPayoutDate = '';
  let daysRemaining = 0;
  let payoutProgress = 0;
  let estimatedPayoutAmount = 0;
  if (activePositions.length > 0) {
    const sortedByPayout = [...activePositions].sort(
      (a, b) => new Date(a.nextPayoutDate).getTime() - new Date(b.nextPayoutDate).getTime(),
    );
    const next = sortedByPayout[0]!;
    nextPayoutDate = next.nextPayoutDate;
    const simDate = new Date(state.simulationDate);
    const payoutDate = new Date(nextPayoutDate);
    daysRemaining = Math.max(
      0,
      Math.ceil((payoutDate.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    payoutProgress = Math.min(100, Math.max(0, Math.round(((90 - daysRemaining) / 90) * 100)));
    // Estimate: daily rate x days until payout
    estimatedPayoutAmount = dailyRate * daysRemaining;
  }

  // Chart data: build cumulative from all positions' daily rewards
  const chartData = buildChartData(positions);

  // Refresh distribution store to get quarterly data
  const distStore = useDistributionStore.getState();
  distStore.refresh();

  // Daily rewards: use distribution engine for variation + status
  const dailyRewards = buildDailyRewardsFromDistribution(state.simulationDate);

  // Earliest start date
  const startDate =
    positions.length > 0
      ? positions.reduce(
          (earliest, p) => (new Date(p.startDate) < new Date(earliest) ? p.startDate : earliest),
          positions[0]!.startDate,
        )
      : state.simulationDate;

  // Get quarterly info from distribution store
  const distState = useDistributionStore.getState();
  const accruedQuarter = distState.getAccruedThisQuarter();
  const claimable = distState.getClaimableBalance();
  const totalAccrued = distState.getTotalAccrued();
  const nextPayoutInfo = distState.getNextPayoutInfo();
  const hasHadPayout = distState.hasHadPayout();
  const currentQuarter = distState.getCurrentQuarter();

  return {
    user: {
      firstName: state.user?.firstName ?? 'User',
      joinedAt: state.user?.registeredAt ?? state.simulationDate,
      tier: 'premium',
    },
    distributions: {
      // Always use simulation store totals (source of truth, updated each advanceDay)
      totalDistributed,
      totalDistributedPaxg,
      todayDistribution,
      dailyRate,
      startDate,
    },
    nextPayout: {
      date: nextPayoutInfo.date || nextPayoutDate || state.simulationDate,
      daysRemaining: nextPayoutInfo.date ? nextPayoutInfo.daysRemaining : daysRemaining,
      progressPercent: nextPayoutInfo.date ? nextPayoutInfo.progressPercent : payoutProgress,
      estimatedAmount:
        nextPayoutInfo.estimatedUsd > 0 ? nextPayoutInfo.estimatedUsd : estimatedPayoutAmount,
      quarterLabel: nextPayoutInfo.quarterLabel,
    },
    positions: {
      totalParticipated,
      activeCount: activePositions.length,
      completedCount: completedPositions.length,
      totalParticipatedAyni,
      availableBalanceAyni: state.balances.ayniAvailable,
      ayniPrice: state.prices.ayniUsd,
      goldRewardsPaxg: state.balances.paxgBalance + state.balances.paxgClaimed,
    },
    chartData,
    dailyRewards,
    socialProof: {
      totalParticipants: 2847,
    },
    quarterly: {
      accruedThisQuarter: accruedQuarter.usd,
      accruedThisQuarterPaxg: accruedQuarter.paxg,
      totalAccrued: totalAccrued.usd,
      totalAccruedPaxg: totalAccrued.paxg,
      claimableUsd: claimable.usd,
      claimablePaxg: claimable.paxg,
      hasHadPayout,
      quarterStartDate: currentQuarter?.startDate ?? '',
      quarterEndDate: currentQuarter?.endDate ?? '',
    },
  };
}
