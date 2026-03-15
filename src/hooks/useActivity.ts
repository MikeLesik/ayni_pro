import { useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getActivity } from '@/services/activityService';
import { useSimulationStore } from '@/stores/simulation';
import type { ActivityFilter } from '@/types/activity';

export function useActivity(filter: ActivityFilter) {
  const queryClient = useQueryClient();
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const activityCount = useSimulationStore((s) => s.activities.length);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['activity'] });
  }, [simulationDate, activityCount, queryClient]);

  return useInfiniteQuery({
    queryKey: ['activity', filter],
    queryFn: ({ pageParam = 0 }) => getActivity(filter, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 0,
  });
}
