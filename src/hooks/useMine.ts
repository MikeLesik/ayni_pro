import { useEffect } from 'react';
import { useMineStore } from '@/stores/mineStore';
import { useSimulationStore } from '@/stores/simulation';
import { getMineStatsByLevel } from '@/services/mineService';
import type { MineLevel } from '@/types/mine';

export function useMine(overrideLevel?: MineLevel) {
  const refresh = useMineStore((s) => s.refresh);
  const stats = useMineStore((s) => s.computedStats);
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const posCount = useSimulationStore((s) => s.positions.length);

  useEffect(() => {
    if (!overrideLevel) refresh();
  }, [refresh, overrideLevel, simulationDate, posCount]);

  // For ?testLevel= visual testing, use old mock data
  if (overrideLevel) {
    return {
      data: getMineStatsByLevel(overrideLevel),
      isLoading: false,
    };
  }

  return {
    data: stats,
    isLoading: !stats,
  };
}
