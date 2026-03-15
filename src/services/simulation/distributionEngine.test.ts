import { describe, expect, it } from 'vitest';
import { calculateDailyAccrual } from '@/services/simulation/distributionEngine';

// ── Realistic baseline inputs ──────────────────────────────────
const ayniAmount = 5000;
const participatedUsd = 5000;
const termMonths = 12;
const goldPricePerGram = 86.85;
const paxgPrice = goldPricePerGram * 31.1035; // ~2700.84
const seed = 0.42; // deterministic seed in [0, 1)

describe('calculateDailyAccrual', () => {
  // ── Basic validity ──────────────────────────────────────────

  it('returns positive goldProductionGrams for valid inputs', () => {
    const result = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      seed,
    );
    expect(result.goldProductionGrams).toBeGreaterThan(0);
  });

  it('returns netPaxg > 0 (net after costs and fees)', () => {
    const result = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      seed,
    );
    expect(result.netPaxg).toBeGreaterThan(0);
  });

  it('netGoldGrams < goldProductionGrams (costs are deducted)', () => {
    const result = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      seed,
    );
    expect(result.netGoldGrams).toBeLessThan(result.goldProductionGrams);
  });

  it('successFeeGrams is deducted from the result', () => {
    const result = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      seed,
    );
    expect(result.successFeeGrams).toBeGreaterThan(0);
    // netGoldGrams should equal production - costs - successFee
    const rewardBeforeFee = result.goldProductionGrams - result.costsGrams;
    const expectedNet = rewardBeforeFee - result.successFeeGrams;
    expect(result.netGoldGrams).toBeCloseTo(expectedNet, 10);
  });

  // ── Determinism ─────────────────────────────────────────────

  it('different seed values produce different (but deterministic) outputs', () => {
    const resultA = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      0.1,
    );
    const resultB = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      0.9,
    );
    // Both should be valid positive results
    expect(resultA.goldProductionGrams).toBeGreaterThan(0);
    expect(resultB.goldProductionGrams).toBeGreaterThan(0);
    // But they should differ because the seeds differ
    expect(resultA.goldProductionGrams).not.toBeCloseTo(resultB.goldProductionGrams, 10);
  });

  it('same seed value produces identical results (determinism)', () => {
    const resultA = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      0.73,
    );
    const resultB = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      0.73,
    );
    expect(resultA.goldProductionGrams).toBe(resultB.goldProductionGrams);
    expect(resultA.costsUsd).toBe(resultB.costsUsd);
    expect(resultA.costsGrams).toBe(resultB.costsGrams);
    expect(resultA.successFeeGrams).toBe(resultB.successFeeGrams);
    expect(resultA.netGoldGrams).toBe(resultB.netGoldGrams);
    expect(resultA.netPaxg).toBe(resultB.netPaxg);
    expect(resultA.netUsd).toBe(resultB.netUsd);
  });

  // ── Proportionality ─────────────────────────────────────────

  it('higher ayniAmount leads to higher production (proportional)', () => {
    // Keep investmentUsd the same so the success fee tier doesn't change.
    // Only vary numTokens to test linear scaling of production and costs.
    const resultSmall = calculateDailyAccrual(
      1000,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      0.5,
    );
    const resultLarge = calculateDailyAccrual(
      10000,
      participatedUsd,
      termMonths,
      goldPricePerGram,
      paxgPrice,
      0.5,
    );
    // 10x tokens should produce 10x gold (production scales linearly)
    expect(resultLarge.goldProductionGrams).toBeCloseTo(resultSmall.goldProductionGrams * 10, 8);
    // With the same fee tier, net gold also scales linearly
    expect(resultLarge.netGoldGrams).toBeCloseTo(resultSmall.netGoldGrams * 10, 8);
  });

  // ── Gold price sensitivity ──────────────────────────────────

  it('different goldPricePerGram affects USD values but keeps gram values consistent', () => {
    const lowPrice = 50; // USD per gram
    const highPrice = 150; // USD per gram

    const resultLow = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      lowPrice,
      lowPrice * 31.1035,
      0.5,
    );
    const resultHigh = calculateDailyAccrual(
      ayniAmount,
      participatedUsd,
      termMonths,
      highPrice,
      highPrice * 31.1035,
      0.5,
    );

    // Gold production in grams is independent of gold price
    expect(resultLow.goldProductionGrams).toBe(resultHigh.goldProductionGrams);

    // Costs in USD are independent of gold price (opex is fixed in USD)
    expect(resultLow.costsUsd).toBe(resultHigh.costsUsd);

    // But costs in grams differ (same USD cost / different price per gram)
    expect(resultLow.costsGrams).toBeGreaterThan(resultHigh.costsGrams);

    // Higher gold price means lower cost in grams, so more net gold
    expect(resultHigh.netGoldGrams).toBeGreaterThan(resultLow.netGoldGrams);

    // USD value of net gold should be higher with higher price
    expect(resultHigh.netUsd).toBeGreaterThan(resultLow.netUsd);
  });

  // ── Edge case ───────────────────────────────────────────────

  it('very small ayniAmount (1 AYNI) still produces valid results', () => {
    const result = calculateDailyAccrual(1, 1, termMonths, goldPricePerGram, paxgPrice, 0.5);
    // All numeric fields should be finite numbers
    expect(Number.isFinite(result.goldProductionGrams)).toBe(true);
    expect(Number.isFinite(result.costsUsd)).toBe(true);
    expect(Number.isFinite(result.costsGrams)).toBe(true);
    expect(Number.isFinite(result.successFeeGrams)).toBe(true);
    expect(Number.isFinite(result.netGoldGrams)).toBe(true);
    expect(Number.isFinite(result.netPaxg)).toBe(true);
    expect(Number.isFinite(result.netUsd)).toBe(true);

    // Production should still be positive
    expect(result.goldProductionGrams).toBeGreaterThan(0);

    // Net values should be non-negative (Math.max(0, ...) in implementation)
    expect(result.netGoldGrams).toBeGreaterThanOrEqual(0);
    expect(result.netPaxg).toBeGreaterThanOrEqual(0);
    expect(result.netUsd).toBeGreaterThanOrEqual(0);
  });
});
