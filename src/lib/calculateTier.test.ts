import { describe, it, expect } from 'vitest';
import {
  calculateRawTier,
  resolveEffectiveTier,
  compareTiers,
  calculateTierFromGrams,
  calcMiningPower,
  calcProgressToNext,
} from './calculateTier';

describe('calculateRawTier', () => {
  // All amounts below contributor threshold (5000 AYNI, 6 months) → explorer
  it('returns explorer for 0 AYNI', () => {
    expect(calculateRawTier(0, 0)).toBe('explorer');
  });

  it('returns explorer for 99 AYNI with 12 months', () => {
    expect(calculateRawTier(99, 12)).toBe('explorer');
  });

  it('returns explorer for 100 AYNI with 12 months', () => {
    expect(calculateRawTier(100, 12)).toBe('explorer');
  });

  it('returns explorer for 499 AYNI with 12 months', () => {
    expect(calculateRawTier(499, 12)).toBe('explorer');
  });

  it('returns explorer for 500 AYNI with 12 months', () => {
    expect(calculateRawTier(500, 12)).toBe('explorer');
  });

  it('returns explorer for 2499 AYNI with 12 months', () => {
    expect(calculateRawTier(2499, 12)).toBe('explorer');
  });

  it('returns explorer for 2500 AYNI with 12 months', () => {
    expect(calculateRawTier(2500, 12)).toBe('explorer');
  });

  it('returns explorer for 4999 AYNI with 6 months (just below contributor)', () => {
    expect(calculateRawTier(4999, 6)).toBe('explorer');
  });

  it('returns contributor for 5000 AYNI with 6 months (exact threshold)', () => {
    expect(calculateRawTier(5000, 6)).toBe('contributor');
  });

  it('returns explorer for 5000 AYNI with 5 months (months too low)', () => {
    expect(calculateRawTier(5000, 5)).toBe('explorer');
  });

  it('returns contributor for 9999 AYNI with 12 months', () => {
    expect(calculateRawTier(9999, 12)).toBe('contributor');
  });

  it('returns contributor for 10000 AYNI with 12 months', () => {
    expect(calculateRawTier(10000, 12)).toBe('contributor');
  });

  it('returns operator for 25000 AYNI with 12 months (exact threshold)', () => {
    expect(calculateRawTier(25000, 12)).toBe('operator');
  });

  it('returns contributor for 25000 AYNI with 11 months (months too low for operator)', () => {
    expect(calculateRawTier(25000, 11)).toBe('contributor');
  });

  it('returns operator for 99999 AYNI with 23 months', () => {
    expect(calculateRawTier(99999, 23)).toBe('operator');
  });

  it('returns principal for 100000 AYNI with 24 months (exact threshold)', () => {
    expect(calculateRawTier(100000, 24)).toBe('principal');
  });

  it('returns principal for 200000 AYNI with 48 months', () => {
    expect(calculateRawTier(200000, 48)).toBe('principal');
  });
});

describe('resolveEffectiveTier', () => {
  it('returns calculated source when raw tier is highest', () => {
    const result = resolveEffectiveTier(5000, 6, 0, 'explorer');
    expect(result.tier).toBe('contributor');
    expect(result.source).toBe('calculated');
  });

  it('returns lifetime_grams source when grams tier exceeds raw tier', () => {
    // lockedAYNI=0 → raw tier = explorer, but lifetime grams >= 4.63 → contributor
    const result = resolveEffectiveTier(0, 0, 5.0, 'explorer');
    expect(result.tier).toBe('contributor');
    expect(result.source).toBe('lifetime_grams');
  });

  it('returns permanent source when previousHighest exceeds current', () => {
    // Currently explorer by AYNI and grams, but was previously operator
    const result = resolveEffectiveTier(0, 0, 0, 'operator');
    expect(result.tier).toBe('operator');
    expect(result.source).toBe('permanent');
  });

  it('uses calculated when raw and grams produce same tier', () => {
    // raw tier = contributor (5000 AYNI, 6 months), grams tier = contributor (5.0 grams)
    const result = resolveEffectiveTier(5000, 6, 5.0, 'explorer');
    expect(result.tier).toBe('contributor');
    expect(result.source).toBe('calculated');
  });

  it('does not downgrade from previousHighest (permanence rule)', () => {
    // Current calculation yields contributor, but previousHighest is principal
    const result = resolveEffectiveTier(5000, 6, 0, 'principal');
    expect(result.tier).toBe('principal');
    expect(result.source).toBe('permanent');
  });

  it('upgrades past previousHighest when current is better', () => {
    // previousHighest = contributor, but current calc → operator
    const result = resolveEffectiveTier(25000, 12, 0, 'contributor');
    expect(result.tier).toBe('operator');
    expect(result.source).toBe('calculated');
  });
});

describe('compareTiers', () => {
  it('returns 0 for equal tiers', () => {
    expect(compareTiers('explorer', 'explorer')).toBe(0);
    expect(compareTiers('principal', 'principal')).toBe(0);
  });

  it('returns -1 when first tier is lower', () => {
    expect(compareTiers('explorer', 'contributor')).toBe(-1);
    expect(compareTiers('contributor', 'operator')).toBe(-1);
  });

  it('returns 1 when first tier is higher', () => {
    expect(compareTiers('principal', 'explorer')).toBe(1);
    expect(compareTiers('operator', 'contributor')).toBe(1);
  });
});

describe('calculateTierFromGrams', () => {
  it('returns explorer for 0 grams', () => {
    expect(calculateTierFromGrams(0)).toBe('explorer');
  });

  it('returns contributor for 4.63 grams (exact threshold)', () => {
    expect(calculateTierFromGrams(4.63)).toBe('contributor');
  });

  it('returns operator for 54.67 grams (exact threshold)', () => {
    expect(calculateTierFromGrams(54.67)).toBe('operator');
  });

  it('returns principal for 588.76 grams (exact threshold)', () => {
    expect(calculateTierFromGrams(588.76)).toBe('principal');
  });

  it('returns explorer for grams just below contributor threshold', () => {
    expect(calculateTierFromGrams(4.62)).toBe('explorer');
  });
});

describe('calcMiningPower', () => {
  it('returns correct mining power', () => {
    expect(calcMiningPower(1000)).toBeCloseTo(1000 * 4 * 0.000001, 10);
  });

  it('returns 0 for 0 AYNI', () => {
    expect(calcMiningPower(0)).toBe(0);
  });
});

describe('calcProgressToNext', () => {
  it('returns null percentage for principal (max tier)', () => {
    const result = calcProgressToNext(100000, 24, 'principal');
    expect(result.percentage).toBeNull();
    expect(result.nextTierLabel).toBeNull();
  });

  it('returns progress towards contributor for explorer', () => {
    const result = calcProgressToNext(2500, 3, 'explorer');
    expect(result.percentage).toBeGreaterThan(0);
    expect(result.percentage).toBeLessThan(100);
    expect(result.ayniRequired).toBe(5000);
    expect(result.monthsRequired).toBe(6);
  });

  it('returns 100% when meeting next tier requirements from below', () => {
    // Explorer with enough for contributor: 5000 AYNI, 6 months
    const result = calcProgressToNext(5000, 6, 'explorer');
    expect(result.percentage).toBe(100);
  });
});
