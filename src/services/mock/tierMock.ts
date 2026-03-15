import { delay, getState } from './helpers';
import { tierScenarios } from '@/services/mock/data/tier';
import { calculateRawTier, calculateTierFromGrams, compareTiers } from '@/lib/calculateTier';
import type { TierResponse, PlatformStatsResponse } from '@/types/dashboard';

// ── Tier scenario state ──────────────────────────────────────

let _activeTierScenario = 'scenario_operator';

export function setMockTierScenario(scenario: string) {
  if (tierScenarios[scenario]) {
    _activeTierScenario = scenario;
  }
}

// ── GET /api/user/tier ───────────────────────────────────────

export async function getUserTier(): Promise<TierResponse> {
  await delay(200);
  const state = getState();
  const activePositions = state.positions.filter((p) => p.status === 'active');

  // If no positions exist, fall back to hardcoded scenario
  if (activePositions.length === 0 && state.positions.length === 0) {
    return tierScenarios[_activeTierScenario] ?? tierScenarios.scenario_operator!;
  }

  // Calculate lockedAYNI from active positions
  const lockedAYNI = activePositions.reduce((sum, p) => sum + p.ayniActivated, 0);

  // Calculate participation months from the earliest position start date
  let participationMonths = 0;
  if (state.positions.length > 0) {
    const earliestStart = state.positions.reduce(
      (earliest, p) => (new Date(p.startDate) < new Date(earliest) ? p.startDate : earliest),
      state.positions[0]!.startDate,
    );
    const simDate = new Date(state.simulationDate);
    const startDate = new Date(earliestStart);
    participationMonths = Math.max(
      0,
      Math.floor((simDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)),
    );
  }

  // Lifetime grams from total distributed PAXG across all positions
  const lifetimeGrams = state.positions.reduce((sum, p) => sum + (p.totalDistributedPaxg || 0), 0);

  // Calculate highest achieved tier from actual position data
  const rawTier = calculateRawTier(lockedAYNI, participationMonths);
  const gramsTier = calculateTierFromGrams(lifetimeGrams);
  const calculatedTier = compareTiers(rawTier, gramsTier) >= 0 ? rawTier : gramsTier;

  return {
    currentTier: calculatedTier,
    highestAchievedTier: calculatedTier,
    tierSource: 'calculated',
    lockedAYNI,
    participationMonths,
    lifetimeGrams,
    miningPowerM3h: lockedAYNI * 4 * 0.000001,
  };
}

// ── GET /api/platform/stats ──────────────────────────────────

export async function getPlatformStats(): Promise<PlatformStatsResponse> {
  await delay(200);
  return {
    totalParticipants: 47,
    activePositions: 89,
    platformMiningPowerM3h: 14.2,
    avgParticipationMonths: 11.4,
  };
}
