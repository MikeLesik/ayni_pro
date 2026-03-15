import { describe, it, expect } from 'vitest';
import {
  getSuccessFeeRate,
  calculateDailyReward,
  calculateProjection,
  TOKENOMICS,
} from './rewardEngine';

describe('getSuccessFeeRate', () => {
  it('returns 0.70 for $100 / 1 month', () => {
    expect(getSuccessFeeRate(100, 1)).toBe(0.7);
  });

  it('returns 0.55 for $100 / 12 months', () => {
    expect(getSuccessFeeRate(100, 12)).toBe(0.55);
  });

  it('returns 0.30 for $5000 / 48 months', () => {
    expect(getSuccessFeeRate(5000, 48)).toBe(0.3);
  });

  it('returns 0.70 fallback for null fee tier ($100000 / 1 month)', () => {
    expect(getSuccessFeeRate(100000, 1)).toBe(0.7);
  });

  it('uses correct tier for boundary values', () => {
    expect(getSuccessFeeRate(999, 12)).toBe(0.55); // below 1000 → tier 100
    expect(getSuccessFeeRate(1000, 12)).toBe(0.5); // exactly 1000 → tier 1000
  });

  it('applies 5% contributor tier discount', () => {
    const base = getSuccessFeeRate(1000, 12); // 0.5
    const discounted = getSuccessFeeRate(1000, 12, 5);
    expect(discounted).toBeCloseTo(base * 0.95, 10);
  });

  it('applies 15% principal tier discount', () => {
    const base = getSuccessFeeRate(5000, 24); // 0.4
    const discounted = getSuccessFeeRate(5000, 24, 15);
    expect(discounted).toBeCloseTo(base * 0.85, 10);
  });

  it('zero tier discount returns unchanged rate', () => {
    expect(getSuccessFeeRate(100, 12, 0)).toBe(getSuccessFeeRate(100, 12));
  });
});

describe('calculateDailyReward', () => {
  it('returns positive net reward for reasonable inputs', () => {
    const result = calculateDailyReward(1000, 300, 12);
    expect(result.netRewardGrams).toBeGreaterThan(0);
    expect(result.netRewardPaxg).toBeGreaterThan(0);
    expect(result.netRewardUsd).toBeGreaterThan(0);
  });

  it('gold production equals tokens * capacity * goldContent * hours', () => {
    const tokens = 500;
    const result = calculateDailyReward(tokens, 150, 12);
    const expected =
      tokens * TOKENOMICS.tokenCapacity * TOKENOMICS.goldContent * TOKENOMICS.dailyOperatingHours;
    expect(result.goldProductionGrams).toBeCloseTo(expected, 10);
  });

  it('net reward = production - extraction - successFee', () => {
    const result = calculateDailyReward(1000, 300, 12);
    const expectedNet = result.rewardBeforeFeeGrams - result.successFeeGrams;
    expect(result.netRewardGrams).toBeCloseTo(expectedNet, 10);
  });
});

describe('calculateProjection', () => {
  it('returns correct token amount for given USD and price', () => {
    const proj = calculateProjection(100, 12);
    expect(proj.ayniTokenAmount).toBeCloseTo(100 / TOKENOMICS.defaultAyniPrice, 4);
  });

  it('total reward scales linearly with term length', () => {
    const proj12 = calculateProjection(1000, 12);
    const proj24 = calculateProjection(1000, 24);
    // 24-month has lower fee, so total should be more than 2x of 12-month
    expect(proj24.totalRewardUsd).toBeGreaterThan(proj12.totalRewardUsd * 1.5);
  });

  it('totalPayouts is floor(termMonths / 3)', () => {
    expect(calculateProjection(100, 12).totalPayouts).toBe(4);
    expect(calculateProjection(100, 24).totalPayouts).toBe(8);
    expect(calculateProjection(100, 1).totalPayouts).toBe(0);
  });
});
