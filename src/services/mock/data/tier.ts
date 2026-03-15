import type { TierResponse } from '@/types/dashboard';

export const tierScenarios: Record<string, TierResponse> = {
  scenario_explorer: {
    currentTier: 'explorer',
    highestAchievedTier: 'explorer',
    tierSource: 'calculated',
    lockedAYNI: 1200,
    participationMonths: 3,
    lifetimeGrams: 0.8,
    miningPowerM3h: 1200 * 4 * 0.000001,
  },
  scenario_operator: {
    currentTier: 'operator',
    highestAchievedTier: 'operator',
    tierSource: 'calculated',
    lockedAYNI: 30000,
    participationMonths: 18,
    lifetimeGrams: 62.0,
    miningPowerM3h: 30000 * 4 * 0.000001,
  },
  scenario_permanent: {
    currentTier: 'operator',
    highestAchievedTier: 'operator',
    tierSource: 'permanent',
    lockedAYNI: 2000,
    participationMonths: 14,
    lifetimeGrams: 55.0,
    miningPowerM3h: 2000 * 4 * 0.000001,
  },
  scenario_principal: {
    currentTier: 'principal',
    highestAchievedTier: 'principal',
    tierSource: 'calculated',
    lockedAYNI: 120000,
    participationMonths: 30,
    lifetimeGrams: 620.0,
    miningPowerM3h: 120000 * 4 * 0.000001,
  },
};
