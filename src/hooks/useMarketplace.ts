import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getListings,
  getListingById,
  getMarketplaceStats,
  createListing,
  purchaseListing,
} from '@/services/marketplace';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatInteger } from '@/lib/formatters';
import type { CreateListingInput } from '@/types/marketplace';

export function useMarketplaceListings() {
  const listingsQuery = useQuery({
    queryKey: ['marketplace', 'listings'],
    queryFn: () => getListings(),
    staleTime: 30_000,
  });

  const statsQuery = useQuery({
    queryKey: ['marketplace', 'stats'],
    queryFn: getMarketplaceStats,
    staleTime: 30_000,
  });

  return {
    listings: listingsQuery.data ?? [],
    stats: statsQuery.data ?? null,
    isLoading: listingsQuery.isLoading || statsQuery.isLoading,
    error: listingsQuery.error || statsQuery.error,
  };
}

export function useListingDetail(id: string) {
  return useQuery({
    queryKey: ['marketplace', 'listing', id],
    queryFn: () => getListingById(id),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateListingInput) => createListing(input),
    onSuccess: (_data, input) => {
      useNotificationStore.getState().addNotification({
        type: 'listing_created',
        message: '',
        params: { amount: formatInteger(input.ayniAmount) },
      });
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
  });

  return {
    createListing: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}

export function usePurchaseListing() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, paymentMethod }: { id: string; paymentMethod: string }) =>
      purchaseListing(id, paymentMethod),
    onSuccess: () => {
      useNotificationStore.getState().addNotification({
        type: 'marketplace_purchased',
        message: '',
      });
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });

  return {
    purchase: mutation.mutateAsync,
    isPurchasing: mutation.isPending,
  };
}
