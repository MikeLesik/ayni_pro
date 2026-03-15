// ═══════════════════════════════════════════════════════════════
// AYNI GOLD — Reward Calculation Engine
// Source: Ayni Token Whitepaper + Homepage Tokenomics
// ═══════════════════════════════════════════════════════════════

import { TROY_OUNCE_GRAMS } from './constants';

// ── CONSTANTS (from whitepaper) ──────────────────────────────
export const TOKENOMICS = {
  tokenCapacity: 0.000004, // m³/hour per 1 token
  goldContent: 0.1, // grams of gold per 1 m³ of ore
  dailyOperatingHours: 16, // operating hours per day
  opexPerCubicMeter: 5.92, // USD operating costs per 1 m³

  defaultAyniPrice: 0.2937, // USD per 1 AYNI
  defaultPaxgPrice: 5192.28, // USD per 1 PAXG (≈ 1 troy oz gold)
  defaultGoldPricePerGram: 5192.28 / TROY_OUNCE_GRAMS, // USD per gram (~$166.95)

  burnPercent: 0.15, // 15% of success fee goes to burn
  snapshotTimeUtc: '14:00', // daily snapshot time
} as const;

// ── SUCCESS FEE TABLE ────────────────────────────────────────
// Key: max USD threshold
// Values: [1mo, 12mo, 24mo, 36mo, 48mo]
export const SUCCESS_FEE_TABLE: Record<number, (number | null)[]> = {
  100: [0.7, 0.55, 0.5, 0.45, 0.4],
  1000: [0.7, 0.5, 0.45, 0.4, 0.35],
  5000: [0.7, 0.45, 0.4, 0.35, 0.3],
  10000: [0.7, 0.4, 0.35, 0.3, 0.27],
  100000: [null, 0.35, 0.3, 0.27, 0.25],
  1000000: [null, 0.3, 0.27, 0.25, 0.2],
};

// ── Get Success Fee Rate ─────────────────────────────────────
export function getSuccessFeeRate(amountUsd: number, termMonths: number, tierDiscount: number = 0): number {
  const thresholds = [100, 1000, 5000, 10000, 100000, 1000000];
  let tier = 100;
  for (const t of thresholds) {
    if (amountUsd >= t) tier = t;
  }

  let termIndex: number;
  if (termMonths <= 1) termIndex = 0;
  else if (termMonths <= 12) termIndex = 1;
  else if (termMonths <= 24) termIndex = 2;
  else if (termMonths <= 36) termIndex = 3;
  else termIndex = 4;

  const rate = SUCCESS_FEE_TABLE[tier]?.[termIndex];
  if (rate === null || rate === undefined) {
    return 0.7; // fallback for unavailable tiers
  }
  if (tierDiscount > 0) {
    return rate * (1 - tierDiscount / 100);
  }
  return rate;
}

// ── Calculate reward for 1 day ───────────────────────────────
export interface DailyRewardResult {
  goldProductionGrams: number;
  goldProductionUsd: number;
  extractionCostUsd: number;
  extractionCostGrams: number;
  rewardBeforeFeeGrams: number;
  successFeeGrams: number;
  successFeeUsd: number;
  netRewardGrams: number;
  netRewardPaxg: number;
  netRewardUsd: number;
}

export function calculateDailyReward(
  tokensStaked: number,
  amountUsd: number,
  termMonths: number,
  goldPricePerGram: number = TOKENOMICS.defaultGoldPricePerGram,
  _paxgPrice: number = TOKENOMICS.defaultPaxgPrice,
  tierDiscount: number = 0,
): DailyRewardResult {
  const { tokenCapacity, goldContent, dailyOperatingHours, opexPerCubicMeter } = TOKENOMICS;

  // 1. Gold Production (grams)
  const goldProductionGrams = tokensStaked * tokenCapacity * goldContent * dailyOperatingHours;
  const goldProductionUsd = goldProductionGrams * goldPricePerGram;

  // 2. Extraction Costs (USD, then convert to grams)
  const extractionCostUsd = opexPerCubicMeter * dailyOperatingHours * tokensStaked * tokenCapacity;
  const extractionCostGrams = extractionCostUsd / goldPricePerGram;

  // 3. Reward before fee
  const rewardBeforeFeeGrams = goldProductionGrams - extractionCostGrams;

  // 4. Success Fee
  const successFeeRate = getSuccessFeeRate(amountUsd, termMonths, tierDiscount);
  const successFeeGrams = Math.max(0, rewardBeforeFeeGrams * successFeeRate);
  const successFeeUsd = successFeeGrams * goldPricePerGram;

  // 5. Net Reward
  const netRewardGrams = Math.max(0, rewardBeforeFeeGrams - successFeeGrams);
  const netRewardUsd = netRewardGrams * goldPricePerGram;
  const netRewardPaxg = netRewardGrams / TROY_OUNCE_GRAMS; // grams → troy ounces → PAXG

  return {
    goldProductionGrams,
    goldProductionUsd,
    extractionCostUsd,
    extractionCostGrams,
    rewardBeforeFeeGrams,
    successFeeGrams,
    successFeeUsd,
    netRewardGrams,
    netRewardPaxg,
    netRewardUsd,
  };
}

// ── Projection for a term ────────────────────────────────────
export function calculateProjection(
  amountUsd: number,
  termMonths: number,
  ayniPrice: number = TOKENOMICS.defaultAyniPrice,
  goldPricePerGram: number = TOKENOMICS.defaultGoldPricePerGram,
  paxgPrice: number = TOKENOMICS.defaultPaxgPrice,
  tierDiscount: number = 0,
) {
  const tokensAmount = amountUsd / ayniPrice;
  const daily = calculateDailyReward(
    tokensAmount,
    amountUsd,
    termMonths,
    goldPricePerGram,
    paxgPrice,
    tierDiscount,
  );
  const totalDays = termMonths * 30;
  const totalPayouts = Math.floor(termMonths / 3);

  return {
    ayniTokenAmount: tokensAmount,
    ayniPriceUsed: ayniPrice,
    goldPriceUsed: goldPricePerGram * TROY_OUNCE_GRAMS, // per troy oz
    dailyRewardUsd: daily.netRewardUsd,
    dailyRewardPaxg: daily.netRewardPaxg,
    monthlyRewardUsd: daily.netRewardUsd * 30,
    totalRewardUsd: daily.netRewardUsd * totalDays,
    totalRewardPaxg: daily.netRewardPaxg * totalDays,
    estimatedOutputPercent: amountUsd > 0 ? ((daily.netRewardUsd * 365) / amountUsd) * 100 : 0,
    totalPayouts,
    successFeeRate: getSuccessFeeRate(amountUsd, termMonths, tierDiscount),
    dailyBreakdown: daily,
  };
}
