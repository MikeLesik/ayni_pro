// Marketplace types — AYNI P2P OTC marketplace

export type ListingStatus = 'active' | 'reserved' | 'completed' | 'expired' | 'cancelled';

export interface PositionHistory {
  stakedSince: string; // ISO 8601
  quartersPaid: number;
  totalPaxgEarned: number;
  positionDurationMonths: number;
  remainingMonths?: number; // only for active-position listings
  progressPercent?: number; // only for active-position listings
}

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerName: string; // KYC verified name
  sellerKycLevel: 'standard' | 'enhanced';
  sellerCompletionRate: number; // 0–100
  sellerTotalDeals: number;
  ayniAmount: number;
  askPriceUsdc: number; // total price
  pricePerAyni: number;
  officialPricePerAyni: number;
  priceDeviation: number; // % from official, e.g. -5 or +3
  positionHistory: PositionHistory;
  status: ListingStatus;
  createdAt: string; // ISO 8601
  expiresAt: string; // ISO 8601
  escrowTxHash: string | null;
  positionType?: 'active' | 'completed'; // source position type
  sourcePositionId?: string; // link to seller's SimPosition
}

export interface MarketplaceFilters {
  lotSize: 'all' | 'small' | 'medium' | 'large';
  // small < 5000 AYNI, medium 5000–50000, large > 50000
  priceRange: 'all' | 'discount' | 'at_market' | 'premium';
  sortBy: 'newest' | 'price_low' | 'price_high' | 'amount_high';
}

export interface CreateListingInput {
  positionId: string;
  ayniAmount: number;
  askPriceUsdc: number;
  durationDays: 7 | 14 | 30;
}

export interface MarketplaceStats {
  totalListings: number;
  totalVolume: number;
  avgPriceDeviation: number;
  avgTimeToFill: number; // days
}

export interface BurnTotal {
  totalBurned: number;
  totalBurnedUsd: number;
}
