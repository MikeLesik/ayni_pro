import { describe, it, expect } from 'vitest';
import {
  TROY_OUNCE_GRAMS,
  PENALTY_RATE,
  SWAP_FEE_RATE,
  MIN_PARTICIPATION_USD,
  MARKETPLACE_COMMISSION_RATE,
  MARKETPLACE_BURN_RATE,
} from './constants';

describe('business constants', () => {
  it('TROY_OUNCE_GRAMS is 31.1035', () => {
    expect(TROY_OUNCE_GRAMS).toBe(31.1035);
  });

  it('PENALTY_RATE is 5%', () => {
    expect(PENALTY_RATE).toBe(0.05);
  });

  it('SWAP_FEE_RATE is 1.5%', () => {
    expect(SWAP_FEE_RATE).toBe(0.015);
  });

  it('MIN_PARTICIPATION_USD is 100', () => {
    expect(MIN_PARTICIPATION_USD).toBe(100);
  });

  it('MARKETPLACE_COMMISSION_RATE is 2.5%', () => {
    expect(MARKETPLACE_COMMISSION_RATE).toBe(0.025);
  });

  it('MARKETPLACE_BURN_RATE is 1%', () => {
    expect(MARKETPLACE_BURN_RATE).toBe(0.01);
  });
});
