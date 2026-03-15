import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboard } from '@/services/dashboardService';
import { useSimulationStore } from '@/stores/simulation';

export function useDashboard() {
  const queryClient = useQueryClient();
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const posCount = useSimulationStore((s) => s.positions.length);

  // When simulation state changes, invalidate dashboard (background refetch, old data stays visible)
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }, [simulationDate, posCount, queryClient]);

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    staleTime: 0,
  });
}
