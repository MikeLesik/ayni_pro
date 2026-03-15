import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { mockApi } from '@/services/mockApi';
import { queryKeys } from '@/lib/queryKeys';
import { TIER_CONFIG } from '@/lib/tierConfig';
import { resolveEffectiveTier, calcMiningPower, calcProgressToNext } from '@/lib/calculateTier';
import type { UserTierData } from '@/types/tier';
import type { TierConfig } from '@/types/tier';

export function useTierData() {
  const query = useQuery({
    queryKey: queryKeys.tier.data(),
    queryFn: () => mockApi.getUserTier(),
    staleTime: 5 * 60 * 1000,
  });

  const tierData = useMemo<UserTierData | undefined>(() => {
    if (!query.data) return undefined;
    const d = query.data;

    const { tier, source } = resolveEffectiveTier(
      d.lockedAYNI,
      d.participationMonths,
      d.lifetimeGrams,
      d.highestAchievedTier,
    );

    const progressToNext = calcProgressToNext(d.lockedAYNI, d.participationMonths, tier);

    return {
      currentTier: tier,
      highestAchievedTier: d.highestAchievedTier,
      tierSource: source,
      lockedAYNI: d.lockedAYNI,
      participationMonths: d.participationMonths,
      lifetimeGrams: d.lifetimeGrams,
      miningPowerM3h: calcMiningPower(d.lockedAYNI),
      progressToNext,
    };
  }, [query.data]);

  return {
    ...query,
    tierData,
  };
}

export function useTierConfig(): TierConfig | undefined {
  const { tierData } = useTierData();
  if (!tierData) return undefined;
  return TIER_CONFIG[tierData.currentTier];
}
