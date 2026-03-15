import { beforeEach, describe, expect, it } from 'vitest';
import { useSimulationStore } from '@/stores/simulation';

beforeEach(() => {
  useSimulationStore.setState({
    user: {
      id: 'test',
      firstName: 'Test',
      email: 'test@test.com',
      registeredAt: '2025-01-01T00:00:00Z',
      isLoggedIn: true,
      kycVerified: true,
    },
    balances: {
      usdBalance: 1000,
      ayniAvailable: 0,
      ayniActivated: 5000,
      paxgBalance: 0,
      paxgClaimed: 0,
    },
    positions: [
      {
        id: 'pos-test-1',
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2026-01-01T00:00:00Z',
        termMonths: 12,
        participatedUsd: 5000,
        ayniActivated: 5000,
        successFeeRate: 0.45,
        dailyRewards: [],
        totalDistributedPaxg: 0,
        totalDistributedUsd: 0,
        totalClaimedPaxg: 0,
        distributedAtLastPayout: 0,
        nextPayoutDate: '2025-04-01T00:00:00Z',
        payouts: [],
      },
    ],
    activities: [],
    prices: { ayniUsd: 1.0, paxgUsd: 2700, goldPerGram: 86.85 },
    simulationDate: '2025-01-01T00:00:00Z',
    autoAdvance: false,
    autoClaimOnAdvance: false,
    _initialized: true,
  });
});

describe('advanceDay', () => {
  it('increments simulationDate by 1 day', () => {
    useSimulationStore.getState().advanceDay();
    const state = useSimulationStore.getState();
    expect(state.simulationDate).toBe('2025-01-02T00:00:00Z');
  });

  it('calculates daily rewards for active positions', () => {
    useSimulationStore.getState().advanceDay();
    const state = useSimulationStore.getState();
    const pos = state.positions[0]!;

    expect(pos.dailyRewards).toHaveLength(1);
    expect(pos.dailyRewards[0]!.date).toBe('2025-01-02T00:00:00Z');
    expect(pos.dailyRewards[0]!.netRewardGrams).toBeGreaterThan(0);
    expect(pos.dailyRewards[0]!.netRewardPaxg).toBeGreaterThan(0);
    expect(pos.dailyRewards[0]!.netRewardUsd).toBeGreaterThan(0);
    expect(pos.totalDistributedPaxg).toBeGreaterThan(0);
    expect(pos.totalDistributedUsd).toBeGreaterThan(0);
    expect(state.balances.paxgBalance).toBeGreaterThan(0);
  });

  it('detects position completion when endDate is reached', () => {
    // Set simulation date to just before the end date
    useSimulationStore.setState({
      simulationDate: '2025-12-31T00:00:00Z',
    });

    useSimulationStore.getState().advanceDay();
    const state = useSimulationStore.getState();
    const pos = state.positions[0]!;

    // endDate is 2026-01-01, new date after advance is 2026-01-01
    // dateLt(pos.endDate, newDate) => dateLt('2026-01-01', '2026-01-01') => false
    // So position should still be active on the exact end date
    expect(pos.status).toBe('active');

    // Advance one more day past the end date
    useSimulationStore.getState().advanceDay();
    const state2 = useSimulationStore.getState();
    const pos2 = state2.positions[0]!;

    expect(pos2.status).toBe('completed');
    // AYNI should be returned: ayniActivated moves from activated to available
    expect(state2.balances.ayniAvailable).toBe(5000);
    expect(state2.balances.ayniActivated).toBe(0);

    // A completion activity should be added
    const completeActivity = state2.activities.find((a) => a.type === 'complete');
    expect(completeActivity).toBeDefined();
    expect(completeActivity!.title).toContain('AYNI returned');
  });
});

describe('advanceDays', () => {
  it('advances multiple days', () => {
    useSimulationStore.getState().advanceDays(10);
    const state = useSimulationStore.getState();

    expect(state.simulationDate).toBe('2025-01-11T00:00:00Z');

    const pos = state.positions[0]!;
    expect(pos.dailyRewards).toHaveLength(10);
    expect(pos.totalDistributedPaxg).toBeGreaterThan(0);
  });

  it('does nothing for 0 days', () => {
    useSimulationStore.getState().advanceDays(0);
    const state = useSimulationStore.getState();
    expect(state.simulationDate).toBe('2025-01-01T00:00:00Z');
    expect(state.positions[0]!.dailyRewards).toHaveLength(0);
  });
});

describe('advanceToNextPayout', () => {
  it('advances to next quarterly payout date', () => {
    // nextPayoutDate is 2025-04-01, current date is 2025-01-01
    // That is 90 days apart
    useSimulationStore.getState().advanceToNextPayout();
    const state = useSimulationStore.getState();

    expect(state.simulationDate).toBe('2025-04-01T00:00:00Z');

    const pos = state.positions[0]!;
    // Should have accumulated 90 daily rewards (Jan 2 through Apr 1)
    expect(pos.dailyRewards.length).toBe(90);

    // A payout should have been triggered on or before reaching the payout date
    expect(pos.payouts.length).toBeGreaterThanOrEqual(1);
    expect(pos.payouts[0]!.amountPaxg).toBeGreaterThan(0);
    expect(pos.payouts[0]!.status).toBe('paid');
  });

  it('does nothing when there are no active positions', () => {
    useSimulationStore.setState({
      positions: [
        {
          ...useSimulationStore.getState().positions[0]!,
          status: 'completed',
        },
      ],
    });

    useSimulationStore.getState().advanceToNextPayout();
    const state = useSimulationStore.getState();

    // Date should not have changed
    expect(state.simulationDate).toBe('2025-01-01T00:00:00Z');
  });
});
