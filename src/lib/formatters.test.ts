import { describe, it, expect } from 'vitest';
import {
  getLocale,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatInteger,
  formatGrams,
  formatPrice,
  formatDate,
} from './formatters';

describe('getLocale', () => {
  it('returns "en-US" by default', () => {
    expect(getLocale()).toBe('en-US');
  });
});

describe('formatCurrency', () => {
  it('formats 1234.5 as "$1,234.50"', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats 0 as "$0.00"', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('formatNumber', () => {
  it('formats 1234.567 with 2 decimals as "1,234.57"', () => {
    expect(formatNumber(1234.567, 2)).toBe('1,234.57');
  });
});

describe('formatPercent', () => {
  it('multiplies by 100 when value < 1 and appends "%"', () => {
    expect(formatPercent(0.1234)).toBe('12.34%');
  });
});

describe('formatInteger', () => {
  it('formats 1234 as "1,234"', () => {
    expect(formatInteger(1234)).toBe('1,234');
  });

  it('formats NaN as "0"', () => {
    expect(formatInteger(NaN)).toBe('0');
  });
});

describe('formatGrams', () => {
  it('formats 1.2345 as "1.2345 g"', () => {
    expect(formatGrams(1.2345)).toBe('1.2345 g');
  });
});

describe('formatPrice', () => {
  it('formats 0.2937 as "$0.2937"', () => {
    expect(formatPrice(0.2937)).toBe('$0.2937');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string using "MMM d, yyyy" pattern', () => {
    const result = formatDate('2025-01-15');
    expect(result).toBe('Jan 15, 2025');
  });
});
