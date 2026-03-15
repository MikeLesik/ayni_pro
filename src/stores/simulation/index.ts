import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SimulationState, SimPosition } from './types';
import { DEFAULT_BALANCES, DEFAULT_PRICES, today } from './helpers';
import { createAuthSlice } from './authSlice';
import { createWalletSlice } from './walletSlice';
import { createPositionSlice } from './positionSlice';
import { createClockSlice } from './clockSlice';
import { createPriceSlice } from './priceSlice';
import { createDemoSlice } from './demoSlice';
import { createAutoReinvestSlice } from './autoReinvestSlice';

// Re-export all types for consumers
export type {
  SimDailyReward,
  SimPayout,
  SimPosition,
  SimActivity,
  SimulationUser,
  SimBalances,
  SimPrices,
  SimulationState,
} from './types';

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, get) => ({
      // ── Default State ──────────────────────────────────────
      user: null,
      balances: { ...DEFAULT_BALANCES },
      positions: [],
      activities: [],
      prices: { ...DEFAULT_PRICES },
      simulationDate: today(),
      autoAdvance: false,
      autoClaimOnAdvance: true,
      _initialized: false,

      // ── Slices ─────────────────────────────────────────────
      ...createAuthSlice(set, get),
      ...createWalletSlice(set, get),
      ...createPositionSlice(set, get),
      ...createClockSlice(set, get),
      ...createPriceSlice(set),
      ...createDemoSlice(set, get),
      ...createAutoReinvestSlice(set, get),
    }),
    {
      name: 'ayni-simulation',
      version: 6,
      partialize: (state) => ({
        user: state.user,
        balances: state.balances,
        positions: state.positions,
        activities: state.activities,
        prices: state.prices,
        simulationDate: state.simulationDate,
        autoAdvance: state.autoAdvance,
        autoClaimOnAdvance: state.autoClaimOnAdvance,
        autoReinvestEnabled: state.autoReinvestEnabled,
        autoReinvestTermMonths: state.autoReinvestTermMonths,
        positionAutoReinvest: state.positionAutoReinvest,
        _initialized: state._initialized,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        const positions = (state.positions as SimPosition[]) ?? [];

        if (version < 1) {
          for (const pos of positions) {
            if (pos.distributedAtLastPayout === undefined) {
              const payoutSum = pos.payouts?.reduce((s, p) => s + p.amountPaxg, 0) ?? 0;
              pos.distributedAtLastPayout = payoutSum;
            }
          }
        }

        if (version < 6) {
          state.autoReinvestEnabled = false;
          state.autoReinvestTermMonths = 12;
          state.positionAutoReinvest = {};
        }

        if (version < 5) {
          state._initialized = false;
          state.user = null;
        }

        if (version < 4) {
          state._initialized = false;
          state.user = null;
        }

        if (version < 3) {
          state._initialized = false;
          state.user = null;
        }

        if (version < 2) {
          for (const pos of positions) {
            if (!pos.nextPayoutDate || typeof pos.nextPayoutDate !== 'string') {
              const start = new Date(pos.startDate);
              const simDate = new Date(
                (state.simulationDate as string) ?? new Date().toISOString(),
              );
              const nextPayout = new Date(start);
              nextPayout.setUTCMonth(nextPayout.getUTCMonth() + 3);
              while (nextPayout.getTime() <= simDate.getTime()) {
                nextPayout.setUTCMonth(nextPayout.getUTCMonth() + 3);
              }
              pos.nextPayoutDate = nextPayout.toISOString().split('T')[0] + 'T00:00:00Z';
            }
            if (pos.distributedAtLastPayout === undefined || pos.distributedAtLastPayout === null) {
              const payoutSum = pos.payouts?.reduce((s, p) => s + p.amountPaxg, 0) ?? 0;
              pos.distributedAtLastPayout = payoutSum;
            }
            if (pos.totalClaimedPaxg === undefined) {
              pos.totalClaimedPaxg = 0;
            }
          }

          const balances = state.balances as Record<string, number> | undefined;
          if (balances && balances.paxgClaimed === undefined) {
            balances.paxgClaimed = 0;
          }
        }

        return state;
      },
    },
  ),
);
