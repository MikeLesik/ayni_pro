import type { SimPrices, SimSet } from './types';

export function createPriceSlice(set: SimSet) {
  return {
    setAutoClaimOnAdvance: (v: boolean) => set({ autoClaimOnAdvance: v }),

    updatePrices: (newPrices: Partial<SimPrices>) => {
      set((s) => ({
        prices: { ...s.prices, ...newPrices },
      }));
    },
  };
}
