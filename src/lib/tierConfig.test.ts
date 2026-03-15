import { describe, it, expect } from 'vitest';
import { TIER_CONFIG, LIFETIME_GRAMS_THRESHOLDS } from './tierConfig';
import type { TierLevel } from '@/types/tier';

const TIERS: TierLevel[] = ['explorer', 'contributor', 'operator', 'principal'];

describe('TIER_CONFIG', () => {
  it('contains all 4 tiers', () => {
    expect(Object.keys(TIER_CONFIG)).toEqual(
      expect.arrayContaining(TIERS),
    );
    expect(Object.keys(TIER_CONFIG)).toHaveLength(4);
  });

  it('has successFeeDiscount values 0, 5, 10, 15', () => {
    expect(TIER_CONFIG.explorer.successFeeDiscount).toBe(0);
    expect(TIER_CONFIG.contributor.successFeeDiscount).toBe(5);
    expect(TIER_CONFIG.operator.successFeeDiscount).toBe(10);
    expect(TIER_CONFIG.principal.successFeeDiscount).toBe(15);
  });

  it('has ascending minAYNI values: 0, 5000, 25000, 100000', () => {
    const values = TIERS.map((t) => TIER_CONFIG[t].minAYNI);
    expect(values).toEqual([0, 5000, 25000, 100000]);
  });

  it('has ascending minMonths values: 0, 6, 12, 24', () => {
    const values = TIERS.map((t) => TIER_CONFIG[t].minMonths);
    expect(values).toEqual([0, 6, 12, 24]);
  });
});

describe('LIFETIME_GRAMS_THRESHOLDS', () => {
  it('contains all 4 tiers', () => {
    expect(Object.keys(LIFETIME_GRAMS_THRESHOLDS)).toEqual(
      expect.arrayContaining(TIERS),
    );
    expect(Object.keys(LIFETIME_GRAMS_THRESHOLDS)).toHaveLength(4);
  });

  it('has strictly ascending threshold values', () => {
    const values = TIERS.map((t) => LIFETIME_GRAMS_THRESHOLDS[t]);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});
