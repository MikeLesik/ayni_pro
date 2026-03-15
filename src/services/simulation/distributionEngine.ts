// ═══════════════════════════════════════════════════════════════
// AYNI GOLD — Distribution Calculation Engine
// Implements quarterly payout model from whitepaper
// ═══════════════════════════════════════════════════════════════

import { getSuccessFeeRate, TOKENOMICS } from '@/lib/rewardEngine';
import { TROY_OUNCE_GRAMS } from '@/lib/constants';
import { toISODate } from '@/lib/dateUtils';
import { dateToSeed, goldPriceForDate } from '@/lib/deterministicHash';
import type { DailyAccrual, QuarterlyPeriod, QuarterlyPayout } from '@/types/distributions';
import type { SimPosition } from '@/stores/simulation';

// ── Daily Accrual Calculation ───────────────────────────────

export interface DailyAccrualResult {
  goldProductionGrams: number;
  costsUsd: number;
  costsGrams: number;
  successFeeGrams: number;
  netGoldGrams: number;
  netPaxg: number;
  netUsd: number;
  goldPriceUsd: number;
  paxgPriceUsd: number;
}

/**
 * Calculate daily accrual for a position.
 * Applies ±variation for realism (no two days identical).
 */
export function calculateDailyAccrual(
  numTokens: number,
  investmentUsd: number,
  termMonths: number,
  goldPriceUsd: number, // per gram
  paxgPriceUsd: number,
  variationSeed?: number, // 0-1, for deterministic variation
  tierDiscount: number = 0,
): DailyAccrualResult {
  const { tokenCapacity, goldContent, dailyOperatingHours, opexPerCubicMeter } = TOKENOMICS;

  // Apply ±8% variation to gold production for realism
  const variationFactor =
    variationSeed !== undefined
      ? 1 + (variationSeed - 0.5) * 0.16 // ±8% range
      : 1 + (Math.random() - 0.5) * 0.16;

  // 1. Gold production (grams) with variation
  const goldProductionGrams =
    numTokens * tokenCapacity * goldContent * dailyOperatingHours * variationFactor;

  // 2. Costs in USD, then convert to grams
  const costsUsd = opexPerCubicMeter * dailyOperatingHours * numTokens * tokenCapacity;
  const costsGrams = costsUsd / goldPriceUsd;

  // 3. Reward before fee
  const rewardBeforeFee = goldProductionGrams - costsGrams;

  // 4. Success fee
  const feeRate = getSuccessFeeRate(investmentUsd, termMonths, tierDiscount);
  const successFeeGrams = Math.max(0, rewardBeforeFee * feeRate);

  // 5. Net reward
  const netGoldGrams = Math.max(0, rewardBeforeFee - successFeeGrams);
  const netPaxg = netGoldGrams / TROY_OUNCE_GRAMS;
  const netUsd = netGoldGrams * goldPriceUsd;

  return {
    goldProductionGrams,
    costsUsd,
    costsGrams,
    successFeeGrams,
    netGoldGrams,
    netPaxg,
    netUsd,
    goldPriceUsd,
    paxgPriceUsd,
  };
}

// ── Quarterly Periods ───────────────────────────────────────

/**
 * Generate quarterly periods for a position.
 * Quarters are counted from activation date, NOT calendar Q1-Q4.
 */
export function generateQuarterlyPeriods(
  positionId: string,
  activationDate: Date,
  termMonths: number,
  currentDate: Date,
): QuarterlyPeriod[] {
  const quarters: QuarterlyPeriod[] = [];
  const totalQuarters = Math.ceil(termMonths / 3);

  for (let q = 0; q < totalQuarters; q++) {
    const start = new Date(activationDate);
    start.setUTCMonth(start.getUTCMonth() + q * 3);

    const end = new Date(activationDate);
    end.setUTCMonth(end.getUTCMonth() + (q + 1) * 3);
    end.setUTCDate(end.getUTCDate() - 1); // last day of quarter

    // Payout: 3 business days after quarter end
    const payout = new Date(end);
    payout.setUTCDate(payout.getUTCDate() + 3);

    let status: QuarterlyPeriod['status'];
    if (currentDate < start) {
      status = 'future';
    } else if (currentDate <= end) {
      status = 'accruing';
    } else if (currentDate <= payout) {
      status = 'pending_payout';
    } else {
      status = 'paid';
    }

    quarters.push({
      id: `Q${q + 1}-${positionId}`,
      positionId,
      quarterNumber: q + 1,
      startDate: toISODate(start),
      endDate: toISODate(end),
      payoutDate: toISODate(payout),
      status,
    });
  }

  return quarters;
}

// ── Accrual History Generation ──────────────────────────────

/**
 * Generate full accrual history from activation to today (or position end date).
 * All variations are deterministic (seeded by date + positionId).
 */
export function generateAccrualHistory(
  position: SimPosition,
  currentDate: Date,
  goldPricePerGram: number,
  _paxgPrice: number,
  tierDiscount: number = 0,
): { accruals: DailyAccrual[]; quarters: QuarterlyPeriod[] } {
  const activationDate = new Date(position.startDate);
  const quarters = generateQuarterlyPeriods(
    position.id,
    activationDate,
    position.termMonths,
    currentDate,
  );

  // For completed/cancelled positions, stop at the end date — no accruals past term
  const endDate = new Date(position.endDate);
  const stopDate =
    position.status === 'active' ? currentDate : endDate < currentDate ? endDate : currentDate;

  const accruals: DailyAccrual[] = [];
  const d = new Date(activationDate);
  // Start from day after activation
  d.setDate(d.getDate() + 1);

  while (d <= stopDate) {
    const dateStr = toISODate(d);
    const seed = dateToSeed(dateStr, position.id);
    const dayGoldPrice = goldPriceForDate(goldPricePerGram, dateStr);
    const dayPaxgPrice = dayGoldPrice * TROY_OUNCE_GRAMS; // approximate PAXG

    const result = calculateDailyAccrual(
      position.ayniActivated,
      position.participatedUsd,
      position.termMonths,
      dayGoldPrice,
      dayPaxgPrice,
      seed,
      tierDiscount,
    );

    // Find which quarter this day belongs to
    const quarter = quarters.find((q) => dateStr >= q.startDate && dateStr <= q.endDate);
    const quarterId = quarter?.id ?? quarters[quarters.length - 1]?.id ?? 'unknown';

    accruals.push({
      date: dateStr,
      positionId: position.id,
      goldProductionGrams: result.goldProductionGrams,
      costsUsd: result.costsUsd,
      costsGrams: result.costsGrams,
      successFeeGrams: result.successFeeGrams,
      netGoldGrams: result.netGoldGrams,
      netPaxg: result.netPaxg,
      netUsd: result.netUsd,
      goldPriceUsd: result.goldPriceUsd,
      paxgPriceUsd: result.paxgPriceUsd,
      quarterId,
    });

    d.setDate(d.getDate() + 1);
  }

  return { accruals, quarters };
}

// ── Aggregate helpers ───────────────────────────────────────

/** Sum accruals for a specific quarter */
export function sumAccrualsForQuarter(
  accruals: DailyAccrual[],
  quarterId: string,
): { totalGoldGrams: number; totalPaxg: number; totalUsd: number; days: number } {
  const filtered = accruals.filter((a) => a.quarterId === quarterId);
  return {
    totalGoldGrams: filtered.reduce((s, a) => s + a.netGoldGrams, 0),
    totalPaxg: filtered.reduce((s, a) => s + a.netPaxg, 0),
    totalUsd: filtered.reduce((s, a) => s + a.netUsd, 0),
    days: filtered.length,
  };
}

/** Build quarterly payout records for completed quarters */
export function buildQuarterlyPayouts(
  accruals: DailyAccrual[],
  quarters: QuarterlyPeriod[],
): QuarterlyPayout[] {
  return quarters
    .filter((q) => q.status === 'paid' || q.status === 'pending_payout')
    .map((q) => {
      const sums = sumAccrualsForQuarter(accruals, q.id);
      return {
        quarterId: q.id,
        positionId: q.positionId,
        quarterNumber: q.quarterNumber,
        payoutDate: q.payoutDate,
        periodStart: q.startDate,
        periodEnd: q.endDate,
        totalGoldGrams: sums.totalGoldGrams,
        totalPaxg: sums.totalPaxg,
        totalUsd: sums.totalUsd,
        daysInPeriod: sums.days,
        status: 'paid' as const,
      };
    });
}

/** Generate quarterly projections for Earn calculator */
export function generateQuarterlyProjections(
  numTokens: number,
  investmentUsd: number,
  termMonths: number,
  goldPricePerGram: number,
  paxgPrice: number,
  startDate: Date,
  tierDiscount: number = 0,
): Array<{
  quarterNumber: number;
  estimatedUsd: number;
  estimatedPaxg: number;
  startDate: string;
  endDate: string;
  payoutDate: string;
  label: string; // e.g. "Jun '26"
}> {
  const totalQuarters = Math.ceil(termMonths / 3);
  const daily = calculateDailyAccrual(
    numTokens,
    investmentUsd,
    termMonths,
    goldPricePerGram,
    paxgPrice,
    0.5,
    tierDiscount,
  );
  const daysPerQuarter = 90; // approximate

  const projections = [];
  for (let q = 0; q < totalQuarters; q++) {
    const qStart = new Date(startDate);
    qStart.setUTCMonth(qStart.getUTCMonth() + q * 3);
    const qEnd = new Date(startDate);
    qEnd.setUTCMonth(qEnd.getUTCMonth() + (q + 1) * 3);
    qEnd.setUTCDate(qEnd.getUTCDate() - 1);
    const qPayout = new Date(qEnd);
    qPayout.setUTCDate(qPayout.getUTCDate() + 3);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const shortYear = String(qPayout.getUTCFullYear()).slice(-2);

    projections.push({
      quarterNumber: q + 1,
      estimatedUsd: daily.netUsd * daysPerQuarter,
      estimatedPaxg: daily.netPaxg * daysPerQuarter,
      startDate: toISODate(qStart),
      endDate: toISODate(qEnd),
      payoutDate: toISODate(qPayout),
      label: `${monthNames[qPayout.getUTCMonth()]} '${shortYear}`,
    });
  }

  return projections;
}
