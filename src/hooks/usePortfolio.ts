import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPortfolio,
  cancelPosition,
  reinvest,
  stakeAyni,
  withdrawPaxg,
  withdrawAyni,
} from '@/services/portfolioService';
import { formatInteger } from '@/lib/formatters';
import { useSimulationStore } from '@/stores/simulation';
import { useNotificationStore } from '@/stores/notificationStore';

export function usePortfolio() {
  const queryClient = useQueryClient();
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const posCount = useSimulationStore((s) => s.positions.length);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['portfolio'] });
  }, [simulationDate, posCount, queryClient]);

  return useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
    staleTime: 0,
  });
}

export function useCancelPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (positionId: string) => cancelPosition(positionId),
    onSuccess: () => {
      useNotificationStore.getState().addNotification({
        type: 'position_cancelled',
        message: '',
      });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useReinvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ amountPaxg, termMonths }: { amountPaxg: number; termMonths: number }) =>
      reinvest(amountPaxg, termMonths),
    onSuccess: (_data, { amountPaxg }) => {
      useNotificationStore.getState().addNotification({
        type: 'reinvest_completed',
        message: '',
        params: { amount: amountPaxg.toFixed(4) },
      });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useStakeAyni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ayniAmount, termMonths }: { ayniAmount: number; termMonths: number }) =>
      stakeAyni(ayniAmount, termMonths),
    onSuccess: (_data, { ayniAmount, termMonths }) => {
      useNotificationStore.getState().addNotification({
        type: 'position_activated',
        message: '',
        params: { amount: formatInteger(ayniAmount), term: termMonths },
      });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useWithdrawPaxg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => withdrawPaxg(amount),
    onSuccess: (_data, amount) => {
      useNotificationStore.getState().addNotification({
        type: 'withdraw_completed',
        message: '',
        params: { amount: `${amount.toFixed(4)} PAXG` },
      });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useWithdrawAyni() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => withdrawAyni(amount),
    onSuccess: (_data, amount) => {
      useNotificationStore.getState().addNotification({
        type: 'withdraw_completed',
        message: '',
        params: { amount: `${formatInteger(amount)} AYNI` },
      });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}
