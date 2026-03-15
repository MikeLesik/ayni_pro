import { describe, it, expect } from 'vitest';
import { dateToSeed, goldPriceForDate } from './deterministicHash';

describe('dateToSeed', () => {
  it('returns same seed for same inputs (deterministic)', () => {
    const s1 = dateToSeed('2025-01-15', 'pos-abc');
    const s2 = dateToSeed('2025-01-15', 'pos-abc');
    expect(s1).toBe(s2);
  });

  it('returns value in [0, 1) range', () => {
    const seed = dateToSeed('2025-06-20', 'pos-xyz');
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThan(1);
  });

  it('returns different seeds for different dates', () => {
    const s1 = dateToSeed('2025-01-15', 'pos-abc');
    const s2 = dateToSeed('2025-01-16', 'pos-abc');
    expect(s1).not.toBe(s2);
  });

  it('returns different seeds for different positions', () => {
    const s1 = dateToSeed('2025-01-15', 'pos-abc');
    const s2 = dateToSeed('2025-01-15', 'pos-xyz');
    expect(s1).not.toBe(s2);
  });
});

describe('goldPriceForDate', () => {
  it('returns price within ±2% of base', () => {
    const base = 2000;
    for (let i = 0; i < 100; i++) {
      const price = goldPriceForDate(base, `2025-01-${String(i + 1).padStart(2, '0')}`);
      expect(price).toBeGreaterThanOrEqual(base * 0.98);
      expect(price).toBeLessThanOrEqual(base * 1.02);
    }
  });

  it('is deterministic', () => {
    const p1 = goldPriceForDate(1500, '2025-03-10');
    const p2 = goldPriceForDate(1500, '2025-03-10');
    expect(p1).toBe(p2);
  });
});
