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

describe('positionSlice', () => {
  describe('createPosition', () => {
    it('creates a position with correct fields and moves AYNI from available to activated', () => {
      // Seed AYNI balance
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, ayniAvailable: 500 },
      }));

      const posId = useSimulationStore.getState().createPosition({
        ayniAmount: 200,
        amountUsd: 200,
        termMonths: 12,
        autoActivate: true,
      });

      const state = useSimulationStore.getState();

      // Balance changes
      expect(state.balances.ayniAvailable).toBe(300);
      expect(state.balances.ayniActivated).toBe(200);

      // Position was created
      expect(state.positions).toHaveLength(1);
      const pos = state.positions[0]!;
      expect(pos.id).toBe(posId);
      expect(pos.status).toBe('active');
      expect(pos.termMonths).toBe(12);
      expect(pos.participatedUsd).toBe(200);
      expect(pos.ayniActivated).toBe(200);
      expect(pos.startDate).toBe('2025-06-01T00:00:00Z');
      // endDate should be 12 months from simulation date
      expect(pos.endDate).toBe('2026-06-01T00:00:00Z');
      expect(pos.totalDistributedPaxg).toBe(0);
      expect(pos.totalClaimedPaxg).toBe(0);
      expect(pos.dailyRewards).toEqual([]);

      // Activity logged
      expect(state.activities).toHaveLength(1);
      expect(state.activities[0]!.type).toBe('activate');
    });

    it('throws when insufficient AYNI balance with autoActivate', () => {
      expect(() => {
        useSimulationStore.getState().createPosition({
          ayniAmount: 100,
          amountUsd: 100,
          termMonths: 12,
          autoActivate: true,
        });
      }).toThrow('Insufficient AYNI balance');
    });
  });

  describe('cancelPosition', () => {
    it('returns AYNI minus 5% penalty', () => {
      // Setup: create a position first
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, ayniAvailable: 1000 },
      }));

      const posId = useSimulationStore.getState().createPosition({
        ayniAmount: 400,
        amountUsd: 400,
        termMonths: 12,
        autoActivate: true,
      });

      // Verify pre-cancel state
      let state = useSimulationStore.getState();
      expect(state.balances.ayniAvailable).toBe(600);
      expect(state.balances.ayniActivated).toBe(400);

      // Cancel the position
      useSimulationStore.getState().cancelPosition(posId);

      state = useSimulationStore.getState();

      // 5% penalty on 400 = 20, returned = 380
      expect(state.balances.ayniAvailable).toBe(600 + 380);
      expect(state.balances.ayniActivated).toBe(0);

      // Position status
      const pos = state.positions.find((p) => p.id === posId);
      expect(pos?.status).toBe('cancelled');

      // Cancel activity
      const cancelActivity = state.activities.find((a) => a.type === 'cancel');
      expect(cancelActivity).toBeDefined();
      expect(cancelActivity?.title).toContain('5% penalty');
      expect(cancelActivity?.amount?.value).toBe(380);
    });
  });

  describe('claimRewards', () => {
    it('moves PAXG from unclaimed to claimed', () => {
      // Setup: create a position with some distributed rewards
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, ayniAvailable: 500, paxgBalance: 0.01 },
      }));

      const posId = useSimulationStore.getState().createPosition({
        ayniAmount: 500,
        amountUsd: 500,
        termMonths: 12,
        autoActivate: true,
      });

      // Manually inject distributed PAXG into the position and paxgBalance
      const unclaimedPaxg = 0.005;
      useSimulationStore.setState((s) => ({
        positions: s.positions.map((p) =>
          p.id === posId ? { ...p, totalDistributedPaxg: unclaimedPaxg, totalClaimedPaxg: 0 } : p,
        ),
        balances: { ...s.balances, paxgBalance: unclaimedPaxg },
      }));

      // Claim rewards
      const claimed = useSimulationStore.getState().claimRewards(posId);

      const state = useSimulationStore.getState();
      expect(claimed).toBe(unclaimedPaxg);
      expect(state.balances.paxgBalance).toBe(0);
      expect(state.balances.paxgClaimed).toBe(unclaimedPaxg);

      // Position's claimed tracking updated
      const pos = state.positions.find((p) => p.id === posId);
      expect(pos?.totalClaimedPaxg).toBe(unclaimedPaxg);

      // Activity
      const claimActivity = state.activities.find((a) => a.type === 'claim');
      expect(claimActivity).toBeDefined();
      expect(claimActivity?.amount?.currency).toBe('PAXG');
      expect(claimActivity?.amount?.direction).toBe('in');
    });

    it('returns 0 when there is nothing to claim', () => {
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, ayniAvailable: 500 },
      }));

      const posId = useSimulationStore.getState().createPosition({
        ayniAmount: 500,
        amountUsd: 500,
        termMonths: 12,
        autoActivate: true,
      });

      const claimed = useSimulationStore.getState().claimRewards(posId);
      expect(claimed).toBe(0);
    });
  });

  describe('reinvest', () => {
    it('converts PAXG to new position with 1.5% swap fee', () => {
      // Seed paxgBalance: need enough so that after 1.5% fee, netUsd >= $100
      // paxgUsd = 2700, so 0.05 PAXG = $135 gross, fee = $2.025, net = $132.975
      const paxgAmount = 0.05;
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, paxgBalance: paxgAmount },
      }));

      const posId = useSimulationStore.getState().reinvest(paxgAmount, 12);

      const state = useSimulationStore.getState();

      const grossUsd = paxgAmount * 2700; // 135
      const swapFee = grossUsd * 0.015; // 2.025
      const netUsd = grossUsd - swapFee; // 132.975
      const expectedAyni = netUsd / 1.0; // ayniUsd=1.0 -> 132.975

      // Balance changes
      expect(state.balances.paxgBalance).toBe(0);
      expect(state.balances.ayniActivated).toBeCloseTo(expectedAyni, 6);

      // Position created
      expect(state.positions).toHaveLength(1);
      const pos = state.positions[0]!;
      expect(pos.id).toBe(posId);
      expect(pos.status).toBe('active');
      expect(pos.participatedUsd).toBeCloseTo(netUsd, 6);
      expect(pos.ayniActivated).toBeCloseTo(expectedAyni, 6);
      expect(pos.termMonths).toBe(12);

      // Activity
      const reinvestActivity = state.activities.find((a) => a.type === 'reinvest');
      expect(reinvestActivity).toBeDefined();
      expect(reinvestActivity?.title).toBe('Reinvested Distributions');
    });

    it('throws when net amount after fee is below $100 minimum', () => {
      // 0.03 PAXG = $81 gross, after 1.5% fee = $79.785 < $100
      useSimulationStore.setState((s) => ({
        balances: { ...s.balances, paxgBalance: 0.03 },
      }));

      expect(() => {
        useSimulationStore.getState().reinvest(0.03, 12);
      }).toThrow('Minimum participation is $100');
    });

    it('throws on insufficient PAXG balance', () => {
      expect(() => {
        useSimulationStore.getState().reinvest(1, 12);
      }).toThrow('Insufficient PAXG balance');
    });
  });
});
