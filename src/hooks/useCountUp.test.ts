import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCountUp } from './useCountUp';

describe('useCountUp', () => {
  it('returns formatted end value immediately when enabled=false', () => {
    const { result } = renderHook(() =>
      useCountUp({ end: 1234.56, enabled: false }),
    );
    // Default decimals=2, en-US locale formats with commas
    // "1,234.56" is the expected formatted output
    expect(result.current).toBe('1,234.56');
  });

  it('returns the formatted value when start equals end', () => {
    const { result } = renderHook(() =>
      useCountUp({ end: 500, start: 500, decimals: 0 }),
    );
    // When range is 0, the hook skips animation and returns the formatted end value
    expect(result.current).toBe('500');
  });

  it('returns a string', () => {
    const { result } = renderHook(() =>
      useCountUp({ end: 42, enabled: false }),
    );
    expect(typeof result.current).toBe('string');
  });

  it('respects decimals option', () => {
    const { result } = renderHook(() =>
      useCountUp({ end: 99.1, decimals: 3, enabled: false }),
    );
    expect(result.current).toBe('99.100');
  });
});
