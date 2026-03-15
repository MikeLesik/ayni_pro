import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { queryKeys } from '@/lib/queryKeys';

export function usePlatformStats() {
  return useQuery({
    queryKey: queryKeys.platform.stats(),
    queryFn: () => mockApi.getPlatformStats(),
    staleTime: 5 * 60 * 1000,
  });
}
