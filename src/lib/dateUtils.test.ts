import { describe, it, expect } from 'vitest';
import { addDays, addMonths, dateLte, dateLt, daysBetween, toISODate } from './dateUtils';

describe('addDays', () => {
  it('adds days correctly', () => {
    expect(addDays('2025-01-01T00:00:00Z', 5)).toBe('2025-01-06T00:00:00Z');
  });

  it('handles month boundary', () => {
    expect(addDays('2025-01-30T00:00:00Z', 3)).toBe('2025-02-02T00:00:00Z');
  });

  it('handles year boundary', () => {
    expect(addDays('2025-12-30T00:00:00Z', 5)).toBe('2026-01-04T00:00:00Z');
  });
});

describe('addMonths', () => {
  it('adds months correctly', () => {
    expect(addMonths('2025-01-15T00:00:00Z', 3)).toBe('2025-04-15T00:00:00Z');
  });

  it('handles year boundary', () => {
    expect(addMonths('2025-11-01T00:00:00Z', 3)).toBe('2026-02-01T00:00:00Z');
  });
});

describe('dateLte', () => {
  it('returns true for equal dates', () => {
    expect(dateLte('2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z')).toBe(true);
  });

  it('returns true for earlier date', () => {
    expect(dateLte('2025-01-01T00:00:00Z', '2025-01-02T00:00:00Z')).toBe(true);
  });

  it('returns false for later date', () => {
    expect(dateLte('2025-01-02T00:00:00Z', '2025-01-01T00:00:00Z')).toBe(false);
  });
});

describe('dateLt', () => {
  it('returns false for equal dates', () => {
    expect(dateLt('2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z')).toBe(false);
  });

  it('returns true for earlier date', () => {
    expect(dateLt('2025-01-01T00:00:00Z', '2025-01-02T00:00:00Z')).toBe(true);
  });
});

describe('daysBetween', () => {
  it('returns correct day count', () => {
    expect(daysBetween('2025-01-01T00:00:00Z', '2025-01-11T00:00:00Z')).toBe(10);
  });

  it('returns 0 for same date', () => {
    expect(daysBetween('2025-06-15T00:00:00Z', '2025-06-15T00:00:00Z')).toBe(0);
  });
});

describe('toISODate', () => {
  it('converts Date to YYYY-MM-DD string', () => {
    expect(toISODate(new Date('2025-03-14T15:30:00Z'))).toBe('2025-03-14');
  });
});
