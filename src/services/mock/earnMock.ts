import { calculateProjection } from '@/lib/rewardEngine';
import { generateQuarterlyProjections } from '@/services/simulation/distributionEngine';
import type { EarnProjectionResponse, CreateParticipationResponse } from '@/services/earnService';
import { delay, getState, getTierDiscount } from './helpers';

// ── GET /api/earn/projection ─────────────────────────────────

export async function getProjection(
  amount: number,
  months: number,
): Promise<EarnProjectionResponse> {
  await delay(150);
  const state = getState();
  const tierDiscount = getTierDiscount();
  const projection = calculateProjection(
    amount,
    months,
    state.prices.ayniUsd,
    state.prices.goldPerGram,
    state.prices.paxgUsd,
    tierDiscount,
  );

  const firstPayout = new Date(state.simulationDate);
  firstPayout.setMonth(firstPayout.getMonth() + 3);

  // Generate quarterly projections
  const quarterlyProjections = generateQuarterlyProjections(
    projection.ayniTokenAmount,
    amount,
    months,
    state.prices.goldPerGram,
    state.prices.paxgUsd,
    new Date(state.simulationDate),
    tierDiscount,
  ).map((q) => ({
    quarterNumber: q.quarterNumber,
    estimatedUsd: q.estimatedUsd,
    estimatedPaxg: q.estimatedPaxg,
    payoutDate: q.payoutDate,
    label: q.label,
  }));

  const totalDays = months * 30;
  const dailyGoldGrams = projection.dailyBreakdown.netRewardGrams;

  return {
    participationAmount: amount,
    termMonths: months,
    estimatedDistributions: projection.totalRewardUsd,
    monthlyDistributions: projection.monthlyRewardUsd,
    dailyDistributions: projection.dailyRewardUsd,
    totalGoldGrams: dailyGoldGrams * totalDays,
    monthlyGoldGrams: dailyGoldGrams * 30,
    dailyGoldGrams,
    firstPayoutDate: firstPayout.toISOString(),
    goldPriceUsed: projection.goldPriceUsed,
    tokensReceived: projection.ayniTokenAmount,
    disclaimer:
      'Projections are estimates based on current mining performance and gold prices. Actual distributions may vary.',
    quarterlyProjections,
    totalPayouts: quarterlyProjections.length,
    annualYieldPercent: projection.estimatedOutputPercent,
  };
}

// ── POST /api/earn/participate ───────────────────────────────

export async function participate(
  amountUsd: number,
  termMonths: number,
  autoActivate = true,
): Promise<CreateParticipationResponse> {
  await delay(500);
  const state = getState();
  const tierDiscount = getTierDiscount();

  // 1. Top up (simulate payment)
  state.topUp(amountUsd);

  // 2. Buy AYNI
  const ayniAmount = state.buyAyni(amountUsd);

  // 3. Create position
  const posId = state.createPosition({
    ayniAmount,
    amountUsd,
    termMonths,
    autoActivate,
    tierDiscount,
  });

  const projection = calculateProjection(
    amountUsd,
    termMonths,
    state.prices.ayniUsd,
    state.prices.goldPerGram,
    state.prices.paxgUsd,
    tierDiscount,
  );

  const firstPayout = new Date(state.simulationDate);
  firstPayout.setMonth(firstPayout.getMonth() + 3);

  return {
    id: posId,
    status: 'confirmed',
    amount: amountUsd,
    termMonths,
    estimatedDistributions: projection.totalRewardUsd,
    firstPayoutDate: firstPayout.toISOString(),
    createdAt: state.simulationDate,
  };
}
