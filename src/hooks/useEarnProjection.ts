import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProjection } from '@/services/earnService';

export function useEarnProjection(amount: number, termMonths: number) {
  // Only debounce amount (keyboard input). Slider (termMonths) goes straight through.
  const [debouncedAmount, setDebouncedAmount] = useState(amount);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 300);
    return () => clearTimeout(timer);
  }, [amount]);

  const query = useQuery({
    queryKey: ['earn-projection', debouncedAmount, termMonths],
    queryFn: () => getProjection(debouncedAmount, termMonths),
    enabled: debouncedAmount >= 100,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  // Stale = store values differ from what the projection was calculated with
  const isStale =
    query.data != null &&
    (query.data.participationAmount !== amount || query.data.termMonths !== termMonths);

  return { ...query, isStale };
}
