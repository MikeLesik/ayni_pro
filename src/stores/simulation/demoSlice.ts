import { daysBetween } from '@/lib/dateUtils';
import type { SimSet, SimGet } from './types';
import { DEFAULT_BALANCES, DEFAULT_PRICES, today } from './helpers';

export function createDemoSlice(set: SimSet, get: SimGet) {
  return {
    resetSimulation: () => {
      set({
        user: null,
        balances: { ...DEFAULT_BALANCES },
        positions: [],
        activities: [],
        prices: { ...DEFAULT_PRICES },
        simulationDate: today(),
        autoAdvance: false,
        autoClaimOnAdvance: true,
        _initialized: false,
      });

      // Reset mine-related stores (lazy import to avoid circular deps)
      import('@/stores/mineStore')
        .then(({ useMineStore }) => useMineStore.getState().resetGameData())
        .catch(() => {});
      import('@/stores/mineNotificationStore')
        .then(({ useMineNotificationStore }) => useMineNotificationStore.getState().reset())
        .catch(() => {});
    },

    initWithDemoData: () => {
      const store = get();
      store.resetSimulation();

      // 1. Register user
      get().register('Yuriy', 'yury@demo.com');

      // 2. Set start date: ~8 months ago
      const startDate = new Date();
      startDate.setUTCMonth(startDate.getUTCMonth() - 8);
      const startDateStr = startDate.toISOString().split('T')[0] + 'T00:00:00Z';
      set({ simulationDate: startDateStr });

      // 3. First position: $5,000 for 24 months (fee 40%)
      get().topUp(5000);
      get().buyAyni(5000);
      const ayni5kA = 5000 / get().prices.ayniUsd;
      get().createPosition({
        ayniAmount: ayni5kA,
        amountUsd: 5000,
        termMonths: 24,
        autoActivate: true,
      });

      // 4. Advance 14 days
      get().advanceDays(14);

      // 5. Second position: $5,000 for 12 months (fee 45%)
      get().topUp(5000);
      get().buyAyni(5000);
      const ayni5kB = 5000 / get().prices.ayniUsd;
      get().createPosition({
        ayniAmount: ayni5kB,
        amountUsd: 5000,
        termMonths: 12,
        autoActivate: true,
      });

      // 6. Advance to today
      const daysToAdvance = daysBetween(get().simulationDate, today());
      if (daysToAdvance > 0) {
        get().advanceDays(daysToAdvance);
      }

      // 7. Add free balance: $700 → convert to AYNI
      get().topUp(700);
      get().buyAyni(700);

      set({ _initialized: true });
    },
  };
}
