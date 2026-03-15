import { create } from 'zustand';
import type { MarketplaceListing, MarketplaceFilters, MarketplaceStats } from '@/types/marketplace';

interface MarketplaceState {
  listings: MarketplaceListing[];
  filters: MarketplaceFilters;
  stats: MarketplaceStats | null;
  selectedListingId: string | null;
  isCreateModalOpen: boolean;
  setListings: (listings: MarketplaceListing[]) => void;
  setFilters: (filters: Partial<MarketplaceFilters>) => void;
  setStats: (stats: MarketplaceStats | null) => void;
  setSelectedListing: (id: string | null) => void;
  toggleCreateModal: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>()((set) => ({
  listings: [],
  filters: { lotSize: 'all', priceRange: 'all', sortBy: 'newest' },
  stats: null,
  selectedListingId: null,
  isCreateModalOpen: false,

  setListings: (listings) => set({ listings }),

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

  setStats: (stats) => set({ stats }),

  setSelectedListing: (selectedListingId) => set({ selectedListingId }),

  toggleCreateModal: () => set((state) => ({ isCreateModalOpen: !state.isCreateModalOpen })),
}));

// Selector: filtered & sorted listings
export const useFilteredListings = (): MarketplaceListing[] => {
  const { listings, filters } = useMarketplaceStore();

  let result = listings.filter((l) => l.status === 'active');

  // Lot size filter
  if (filters.lotSize === 'small') {
    result = result.filter((l) => l.ayniAmount < 5_000);
  } else if (filters.lotSize === 'medium') {
    result = result.filter((l) => l.ayniAmount >= 5_000 && l.ayniAmount <= 50_000);
  } else if (filters.lotSize === 'large') {
    result = result.filter((l) => l.ayniAmount > 50_000);
  }

  // Price range filter
  if (filters.priceRange === 'discount') {
    result = result.filter((l) => l.priceDeviation < 0);
  } else if (filters.priceRange === 'at_market') {
    result = result.filter((l) => l.priceDeviation >= -1 && l.priceDeviation <= 1);
  } else if (filters.priceRange === 'premium') {
    result = result.filter((l) => l.priceDeviation > 0);
  }

  // Sort
  switch (filters.sortBy) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'price_low':
      result.sort((a, b) => a.pricePerAyni - b.pricePerAyni);
      break;
    case 'price_high':
      result.sort((a, b) => b.pricePerAyni - a.pricePerAyni);
      break;
    case 'amount_high':
      result.sort((a, b) => b.ayniAmount - a.ayniAmount);
      break;
  }

  return result;
};
