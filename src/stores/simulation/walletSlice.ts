import { uid } from '@/lib/uid';
import type { SimSet, SimGet } from './types';

export function createWalletSlice(set: SimSet, get: SimGet) {
  return {
    topUp: (amountUsd: number) => {
      const now = get().simulationDate;
      set((s) => ({
        balances: {
          ...s.balances,
          usdBalance: s.balances.usdBalance + amountUsd,
        },
        activities: [
          {
            id: uid(),
            type: 'topup' as const,
            timestamp: now,
            title: `Deposited $${amountUsd.toFixed(2)}`,
            description: `Added $${amountUsd.toFixed(2)} to your balance`,
            amount: { value: amountUsd, currency: 'USD', direction: 'in' as const },
          },
          ...s.activities,
        ],
      }));
    },

    buyAyni: (amountUsd: number) => {
      const state = get();
      if (state.balances.usdBalance < amountUsd) {
        throw new Error('Insufficient USD balance');
      }
      const ayniReceived = amountUsd / state.prices.ayniUsd;
      const now = state.simulationDate;

      set((s) => ({
        balances: {
          ...s.balances,
          usdBalance: s.balances.usdBalance - amountUsd,
          ayniAvailable: s.balances.ayniAvailable + ayniReceived,
        },
        activities: [
          {
            id: uid(),
            type: 'purchase' as const,
            timestamp: now,
            title: `Purchased ${ayniReceived.toFixed(2)} AYNI`,
            description: `Bought ${ayniReceived.toFixed(2)} AYNI for $${amountUsd.toFixed(2)}`,
            amount: { value: amountUsd, currency: 'USD', direction: 'out' as const },
          },
          ...s.activities,
        ],
      }));

      return ayniReceived;
    },

    sellAyni: (amount: number) => {
      const state = get();
      if (state.balances.ayniAvailable < amount) {
        throw new Error('Insufficient AYNI balance');
      }
      const usdReceived = amount * state.prices.ayniUsd;

      set((s) => ({
        balances: {
          ...s.balances,
          ayniAvailable: s.balances.ayniAvailable - amount,
          usdBalance: s.balances.usdBalance + usdReceived,
        },
        activities: [
          {
            id: uid(),
            type: 'sell' as const,
            timestamp: s.simulationDate,
            title: `Sold ${amount.toFixed(2)} AYNI for $${usdReceived.toFixed(2)}`,
            description: `Sold ${amount.toFixed(2)} AYNI at $${s.prices.ayniUsd.toFixed(4)}/AYNI`,
            amount: { value: usdReceived, currency: 'USD', direction: 'in' as const },
          },
          ...s.activities,
        ],
      }));

      return usdReceived;
    },

    withdrawPaxg: (paxgAmount: number) => {
      const state = get();
      if (paxgAmount <= 0) throw new Error('Amount must be positive');
      if (paxgAmount > state.balances.paxgBalance) {
        throw new Error('Insufficient PAXG balance');
      }

      set((s) => ({
        balances: {
          ...s.balances,
          paxgBalance: s.balances.paxgBalance - paxgAmount,
          paxgClaimed: s.balances.paxgClaimed + paxgAmount,
        },
        activities: [
          {
            id: uid(),
            type: 'withdraw' as const,
            timestamp: s.simulationDate,
            title: 'PAXG Withdrawal',
            description: `Withdrawn ${paxgAmount.toFixed(8)} PAXG (~$${(paxgAmount * s.prices.paxgUsd).toFixed(2)}) to external wallet`,
            amount: {
              value: paxgAmount * s.prices.paxgUsd,
              currency: 'PAXG',
              direction: 'out' as const,
            },
          },
          ...s.activities,
        ],
      }));
    },

    withdrawAyni: (amount: number) => {
      const state = get();
      if (amount <= 0) throw new Error('Amount must be positive');
      if (amount > state.balances.ayniAvailable) {
        throw new Error('Insufficient available AYNI');
      }

      set((s) => ({
        balances: {
          ...s.balances,
          ayniAvailable: s.balances.ayniAvailable - amount,
        },
        activities: [
          {
            id: uid(),
            type: 'withdraw' as const,
            timestamp: s.simulationDate,
            title: 'AYNI Withdrawal',
            description: `Withdrawn ${amount.toFixed(4)} AYNI (~$${(amount * s.prices.ayniUsd).toFixed(2)}) to external wallet`,
            amount: {
              value: amount * s.prices.ayniUsd,
              currency: 'AYNI',
              direction: 'out' as const,
            },
          },
          ...s.activities,
        ],
      }));
    },
  };
}
