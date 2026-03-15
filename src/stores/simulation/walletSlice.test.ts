import { beforeEach, describe, expect, it } from 'vitest';
import { useSimulationStore } from '@/stores/simulation';

beforeEach(() => {
  const store = useSimulationStore;
  store.setState({
    user: {
      id: 'test',
      firstName: 'Test',
      email: 'test@test.com',
      registeredAt: '2025-01-01T00:00:00Z',
      isLoggedIn: true,
      kycVerified: true,
    },
    balances: { usdBalance: 0, ayniAvailable: 0, ayniActivated: 0, paxgBalance: 0, paxgClaimed: 0 },
    positions: [],
    activities: [],
    prices: { ayniUsd: 1.0, paxgUsd: 2700, goldPerGram: 86.85 },
    simulationDate: '2025-06-01T00:00:00Z',
    autoAdvance: false,
    autoClaimOnAdvance: false,
    _initialized: true,
  });
});

describe('walletSlice', () => {
  describe('topUp', () => {
    it('adds to usdBalance and creates a topup activity', () => {
      const { topUp } = useSimulationStore.getState();
      topUp(500);

      const state = useSimulationStore.getState();
      expect(state.balances.usdBalance).toBe(500);
      expect(state.activities).toHaveLength(1);
      expect(state.activities[0]!.type).toBe('topup');
      expect(state.activities[0]!.amount?.value).toBe(500);
      expect(state.activities[0]!.amount?.currency).toBe('USD');
      expect(state.activities[0]!.amount?.direction).toBe('in');
    });

    it('accumulates multiple top-ups', () => {
      const { topUp } = useSimulationStore.getState();
      topUp(200);
      useSimulationStore.getState().topUp(300);

      const state = useSimulationStore.getState();
      expect(state.balances.usdBalance).toBe(500);
      expect(state.activities).toHaveLength(2);
    });
  });

  describe('buyAyni', () => {
    it('converts USD to AYNI, reduces usdBalance, increases ayniAvailable', () => {
      // Seed USD balance
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, usdBalance: 1000 },
      }));

      const ayniReceived = useSimulationStore.getState().buyAyni(500);

      const state = useSimulationStore.getState();
      // price is 1.0 USD per AYNI, so 500 USD = 500 AYNI
      expect(ayniReceived).toBe(500);
      expect(state.balances.usdBalance).toBe(500);
      expect(state.balances.ayniAvailable).toBe(500);
      expect(state.activities).toHaveLength(1);
      expect(state.activities[0]!.type).toBe('purchase');
    });

    it('throws on insufficient USD balance', () => {
      // usdBalance starts at 0
      expect(() => {
        useSimulationStore.getState().buyAyni(100);
      }).toThrow('Insufficient USD balance');
    });
  });

  describe('sellAyni', () => {
    it('converts AYNI back to USD', () => {
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, ayniAvailable: 200 },
      }));

      const usdReceived = useSimulationStore.getState().sellAyni(100);

      const state = useSimulationStore.getState();
      // price is 1.0 USD per AYNI, so 100 AYNI = 100 USD
      expect(usdReceived).toBe(100);
      expect(state.balances.ayniAvailable).toBe(100);
      expect(state.balances.usdBalance).toBe(100);
      expect(state.activities).toHaveLength(1);
      expect(state.activities[0]!.type).toBe('sell');
      expect(state.activities[0]!.amount?.direction).toBe('in');
    });

    it('throws on insufficient AYNI balance', () => {
      expect(() => {
        useSimulationStore.getState().sellAyni(50);
      }).toThrow('Insufficient AYNI balance');
    });
  });

  describe('withdrawPaxg', () => {
    it('moves from paxgBalance to paxgClaimed', () => {
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, paxgBalance: 0.5 },
      }));

      useSimulationStore.getState().withdrawPaxg(0.3);

      const state = useSimulationStore.getState();
      expect(state.balances.paxgBalance).toBeCloseTo(0.2, 10);
      expect(state.balances.paxgClaimed).toBeCloseTo(0.3, 10);
      expect(state.activities).toHaveLength(1);
      expect(state.activities[0]!.type).toBe('withdraw');
      expect(state.activities[0]!.title).toBe('PAXG Withdrawal');
    });
  });

  describe('withdrawAyni', () => {
    it('reduces ayniAvailable', () => {
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, ayniAvailable: 1000 },
      }));

      useSimulationStore.getState().withdrawAyni(400);

      const state = useSimulationStore.getState();
      expect(state.balances.ayniAvailable).toBe(600);
      expect(state.activities).toHaveLength(1);
      expect(state.activities[0]!.type).toBe('withdraw');
      expect(state.activities[0]!.title).toBe('AYNI Withdrawal');
    });

    it('throws on insufficient available AYNI', () => {
      expect(() => {
        useSimulationStore.getState().withdrawAyni(10);
      }).toThrow('Insufficient available AYNI');
    });
  });
});
