import { useDistributionStore } from '@/stores/distributionStore';
import { PENALTY_RATE, SWAP_FEE_RATE } from '@/lib/constants';
import type {
  PortfolioResponse,
  Position,
  CancelPositionResponse,
  ReinvestResponse,
  PositionDetailResponse,
} from '@/types/portfolio';
import { delay, getState, getTierDiscount } from './helpers';

// ── GET /api/portfolio ───────────────────────────────────────

export async function getPortfolio(): Promise<PortfolioResponse> {
  await delay(300);
  const state = getState();
  const simDate = new Date(state.simulationDate);

  const mappedPositions: Position[] = state.positions.map((pos, idx) => {
    const startDate = new Date(pos.startDate);
    const endDate = new Date(pos.endDate);
    const totalDays = Math.max(
      1,
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const elapsedDays = Math.max(
      0,
      (simDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const progressPercent =
      pos.status === 'completed' ? 100 : Math.min(100, Math.round((elapsedDays / totalDays) * 100));
    const monthsRemaining =
      pos.status === 'completed'
        ? 0
        : Math.max(
            0,
            Math.ceil((endDate.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24 * 30)),
          );

    // Daily rate from latest reward
    const lastDaily = pos.dailyRewards[pos.dailyRewards.length - 1];
    const dailyRate = lastDaily?.netRewardUsd ?? 0;

    // Next payout estimate: daily rate x days until payout
    let nextPayoutEstimate: number | null = null;
    if (pos.status === 'active' && pos.nextPayoutDate) {
      const daysUntilPayout = Math.max(
        0,
        (new Date(pos.nextPayoutDate).getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      nextPayoutEstimate = dailyRate * daysUntilPayout;
    }

    return {
      id: pos.id,
      positionNumber: idx + 1,
      status: pos.status,
      participatedAmount: pos.participatedUsd,
      distributedAmount: pos.totalDistributedUsd,
      claimedAmount: pos.totalClaimedPaxg * state.prices.paxgUsd,
      termMonths: pos.termMonths,
      startDate: pos.startDate,
      endDate: pos.endDate,
      progressPercent,
      monthsRemaining,
      nextPayoutDate: pos.status === 'active' ? pos.nextPayoutDate : null,
      nextPayoutEstimate,
      dailyRate,
      currentValueUsd: pos.ayniActivated * state.prices.ayniUsd,
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38',
      ayniAmount: pos.ayniActivated,
      paxgAmount: pos.totalDistributedPaxg,
      contractAddress: `0x${pos.id.replace('pos-', '')}${'0'.repeat(40)}`.slice(0, 42),
    };
  });

  const activePositions = mappedPositions.filter((p) => p.status === 'active');
  const completedPositions = mappedPositions.filter(
    (p) => p.status === 'completed' || p.status === 'cancelled',
  );

  const positionsValue = activePositions.reduce((s, p) => s + p.participatedAmount, 0);
  const totalDistributed = mappedPositions.reduce((s, p) => s + p.distributedAmount, 0);
  const totalParticipatedAyni = activePositions.reduce((s, p) => s + p.ayniAmount, 0);
  const goldRewardsPaxg = state.balances.paxgBalance + state.balances.paxgClaimed;

  // Refresh distribution store before reading (ensures it reflects latest simulation state)
  const distStore = useDistributionStore.getState();
  distStore.refresh();
  const claimable = distStore.getClaimableBalance();
  const accrued = distStore.getAccruedThisQuarter();
  const totalAccrued = distStore.getTotalAccrued();
  const nextPayoutInfo = distStore.getNextPayoutInfo();

  return {
    summary: {
      positionsValue,
      totalDistributed,
      activeCount: activePositions.length,
      completedCount: completedPositions.length,
      availableBalance: state.balances.ayniAvailable * state.prices.ayniUsd,
      availableAyni: state.balances.ayniAvailable,
      goldRewards: goldRewardsPaxg * state.prices.paxgUsd,
      totalParticipatedAyni,
      ayniPrice: state.prices.ayniUsd,
      goldRewardsPaxg,
      claimablePaxg: claimable.paxg,
      claimableUsd: claimable.usd,
      accruingPaxg: accrued.paxg,
      accruingUsd: accrued.usd,
      nextPayoutDate: nextPayoutInfo.date,
      totalAccruedUsd: totalAccrued.usd,
    },
    positions: mappedPositions,
  };
}

// ── GET /api/portfolio/:id ───────────────────────────────────

export async function getPositionDetail(id: string): Promise<PositionDetailResponse> {
  await delay(200);
  const portfolio = await getPortfolio();
  const position = portfolio.positions.find((p) => p.id === id);
  if (!position) throw new Error(`Position ${id} not found`);

  const simPos = getState().positions.find((p) => p.id === id);
  const transactions = simPos
    ? [
        {
          id: `tx-inv-${id}`,
          type: 'participation' as const,
          amount: simPos.participatedUsd,
          date: simPos.startDate,
          status: 'completed' as const,
        },
        ...simPos.payouts.map((p, i) => ({
          id: `tx-pay-${id}-${i}`,
          type: 'payout' as const,
          amount: p.amountUsd,
          date: p.date,
          status: 'completed' as const,
        })),
      ]
    : [];

  return { position, transactions };
}

// ── POST /api/portfolio/cancel ───────────────────────────────

export async function cancelPosition(id: string): Promise<CancelPositionResponse> {
  await delay(300);
  const state = getState();
  const pos = state.positions.find((p) => p.id === id);
  if (!pos) throw new Error(`Position ${id} not found`);

  const penaltyAmount = pos.participatedUsd * PENALTY_RATE;
  const refundAmount = pos.participatedUsd - penaltyAmount;

  state.cancelPosition(id);

  return {
    success: true,
    positionId: id,
    refundAmount,
    penaltyAmount,
    message: `Position cancelled. ${refundAmount.toFixed(2)} AYNI equivalent refunded (5% penalty applied).`,
  };
}

// ── POST /api/portfolio/reinvest ─────────────────────────────

export async function reinvest(amountPaxg: number, termMonths: number): Promise<ReinvestResponse> {
  await delay(300);
  const state = getState();

  const grossUsd = amountPaxg * state.prices.paxgUsd;
  const swapFeeUsd = grossUsd * SWAP_FEE_RATE;
  const netUsd = grossUsd - swapFeeUsd;
  const ayniAmount = netUsd / state.prices.ayniUsd;

  const posId = state.reinvest(amountPaxg, termMonths, getTierDiscount());

  return {
    success: true,
    newPositionId: posId,
    amountPaxg,
    termMonths,
    message: `Converted ${amountPaxg.toFixed(6)} PAXG ($${grossUsd.toFixed(2)}) → ${ayniAmount.toFixed(2)} AYNI (fee: $${swapFeeUsd.toFixed(2)}), locked for ${termMonths} months.`,
  };
}

// ── POST /api/portfolio/stake-ayni ───────────────────────────

export async function stakeAyni(
  ayniAmount: number,
  termMonths: number,
): Promise<{
  success: boolean;
  newPositionId: string;
  ayniAmount: number;
  termMonths: number;
  message: string;
}> {
  await delay(300);
  const state = getState();
  const posId = state.reactivateAyni(ayniAmount, termMonths, getTierDiscount());
  const usdValue = ayniAmount * state.prices.ayniUsd;
  return {
    success: true,
    newPositionId: posId,
    ayniAmount,
    termMonths,
    message: `Staked ${ayniAmount.toFixed(2)} AYNI (~$${usdValue.toFixed(2)}) for ${termMonths} months.`,
  };
}

// ── POST /api/portfolio/withdraw-paxg ────────────────────────

export async function withdrawPaxg(amount: number): Promise<{ status: string }> {
  await delay(200);
  getState().withdrawPaxg(amount);
  return { status: 'confirmed' };
}

// ── POST /api/portfolio/withdraw-ayni ────────────────────────

export async function withdrawAyni(amount: number): Promise<{ status: string }> {
  await delay(200);
  getState().withdrawAyni(amount);
  return { status: 'confirmed' };
}
