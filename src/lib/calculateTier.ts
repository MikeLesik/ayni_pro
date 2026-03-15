import type { TierLevel, UserTierData } from '@/types/tier';
import { TIER_ORDER } from '@/types/tier';
import { TIER_CONFIG, LIFETIME_GRAMS_THRESHOLDS } from './tierConfig';

export function compareTiers(a: TierLevel, b: TierLevel): number {
  const idxA = TIER_ORDER.indexOf(a);
  const idxB = TIER_ORDER.indexOf(b);
  if (idxA < idxB) return -1;
  if (idxA > idxB) return 1;
  return 0;
}

export function calculateRawTier(lockedAYNI: number, months: number): TierLevel {
  const tiers: TierLevel[] = ['principal', 'operator', 'contributor', 'explorer'];
  for (const tier of tiers) {
    const cfg = TIER_CONFIG[tier];
    if (lockedAYNI >= cfg.minAYNI && months >= cfg.minMonths) {
      return tier;
    }
  }
  return 'explorer';
}

export function calculateTierFromGrams(lifetimeGrams: number): TierLevel {
  const tiers: TierLevel[] = ['principal', 'operator', 'contributor', 'explorer'];
  for (const tier of tiers) {
    if (lifetimeGrams >= LIFETIME_GRAMS_THRESHOLDS[tier]) {
      return tier;
    }
  }
  return 'explorer';
}

export function resolveEffectiveTier(
  lockedAYNI: number,
  months: number,
  lifetimeGrams: number,
  previousHighest: TierLevel,
): { tier: TierLevel; source: UserTierData['tierSource'] } {
  const rawTier = calculateRawTier(lockedAYNI, months);
  const gramsTier = calculateTierFromGrams(lifetimeGrams);

  // Take the maximum of rawTier and gramsTier
  let best = compareTiers(rawTier, gramsTier) >= 0 ? rawTier : gramsTier;
  let source: UserTierData['tierSource'] =
    best === gramsTier && compareTiers(gramsTier, rawTier) > 0 ? 'lifetime_grams' : 'calculated';

  // Compare with previousHighest — permanence rule
  if (compareTiers(previousHighest, best) > 0) {
    best = previousHighest;
    source = 'permanent';
  }

  return { tier: best, source };
}

export function calcMiningPower(lockedAYNI: number): number {
  return lockedAYNI * 4 * 0.000001;
}

export function calcProgressToNext(
  lockedAYNI: number,
  months: number,
  currentTier: TierLevel,
): UserTierData['progressToNext'] {
  const currentIdx = TIER_ORDER.indexOf(currentTier);

  // Principal — max tier
  if (currentIdx >= TIER_ORDER.length - 1) {
    return {
      percentage: null,
      ayniCurrent: lockedAYNI,
      ayniRequired: TIER_CONFIG[currentTier].minAYNI,
      monthsCurrent: months,
      monthsRequired: TIER_CONFIG[currentTier].minMonths,
      nextTierLabel: null,
    };
  }

  const nextTier = TIER_ORDER[currentIdx + 1]!;
  const nextCfg = TIER_CONFIG[nextTier];

  const ayniProgress = nextCfg.minAYNI > 0 ? Math.min(1, lockedAYNI / nextCfg.minAYNI) : 1;
  const monthsProgress = nextCfg.minMonths > 0 ? Math.min(1, months / nextCfg.minMonths) : 1;

  // Combined progress — average of both dimensions
  const percentage = Math.round(((ayniProgress + monthsProgress) / 2) * 100);

  return {
    percentage,
    ayniCurrent: lockedAYNI,
    ayniRequired: nextCfg.minAYNI,
    monthsCurrent: months,
    monthsRequired: nextCfg.minMonths,
    nextTierLabel: nextCfg.label,
  };
}
