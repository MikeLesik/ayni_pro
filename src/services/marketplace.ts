import type {
  MarketplaceListing,
  MarketplaceStats,
  MarketplaceFilters,
  CreateListingInput,
  BurnTotal,
} from '@/types/marketplace';
import api from './api';
import { mockListings, computeMockStats, computeMockBurnTotal } from './mock/data/marketplace';
import { useSimulationStore } from '@/stores/simulation';
import { getTierDiscount } from './mock/helpers';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

// ── Mock helpers ────────────────────────────────────────────────

function delay(ms = 500): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function applyMockFilters(
  listings: MarketplaceListing[],
  filters?: MarketplaceFilters,
): MarketplaceListing[] {
  let result = listings.filter((l) => l.status !== 'cancelled');

  if (!filters) return result;

  if (filters.lotSize && filters.lotSize !== 'all') {
    result = result.filter((l) => {
      if (filters.lotSize === 'small') return l.ayniAmount < 5000;
      if (filters.lotSize === 'medium') return l.ayniAmount >= 5000 && l.ayniAmount <= 50000;
      return l.ayniAmount > 50000;
    });
  }

  if (filters.priceRange && filters.priceRange !== 'all') {
    result = result.filter((l) => {
      if (filters.priceRange === 'discount') return l.priceDeviation < -2;
      if (filters.priceRange === 'at_market')
        return l.priceDeviation >= -2 && l.priceDeviation <= 2;
      return l.priceDeviation > 2;
    });
  }

  if (filters.sortBy) {
    const sorters: Record<string, (a: MarketplaceListing, b: MarketplaceListing) => number> = {
      newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      price_low: (a, b) => a.pricePerAyni - b.pricePerAyni,
      price_high: (a, b) => b.pricePerAyni - a.pricePerAyni,
      amount_high: (a, b) => b.ayniAmount - a.ayniAmount,
    };
    const fn = sorters[filters.sortBy];
    if (fn) result.sort(fn);
  }

  return result;
}

// ── Error handling ──────────────────────────────────────────────

async function extractErrorMessage(error: unknown): Promise<string> {
  if (error instanceof Response) {
    try {
      const body = await error.json();
      return body.message || body.error || 'Unknown server error';
    } catch {
      return `Server error (${error.status})`;
    }
  }
  if (error instanceof Error) {
    // ky wraps HTTP errors — try to get the response body
    const httpErr = error as Error & { response?: Response };
    if (httpErr.response) {
      try {
        const body = await httpErr.response.json();
        return body.message || body.error || error.message;
      } catch {
        return `Server error (${httpErr.response.status})`;
      }
    }
    return error.message;
  }
  return 'Unknown error';
}

// ── API functions ───────────────────────────────────────────────

export async function getListings(filters?: MarketplaceFilters): Promise<MarketplaceListing[]> {
  if (useMocks) {
    await delay();
    return applyMockFilters(mockListings, filters);
  }

  const searchParams: Record<string, string> = {};
  if (filters?.lotSize && filters.lotSize !== 'all') searchParams.lotSize = filters.lotSize;
  if (filters?.priceRange && filters.priceRange !== 'all')
    searchParams.priceRange = filters.priceRange;
  if (filters?.sortBy) searchParams.sortBy = filters.sortBy;

  try {
    return await api.get('marketplace/listings', { searchParams }).json<MarketplaceListing[]>();
  } catch (error) {
    const msg = await extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function getListingById(id: string): Promise<MarketplaceListing> {
  if (useMocks) {
    await delay(300);
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) throw new Error(`Listing ${id} not found`);
    return listing;
  }

  try {
    return await api.get(`marketplace/listings/${id}`).json<MarketplaceListing>();
  } catch (error) {
    const msg = await extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function createListing(input: CreateListingInput): Promise<MarketplaceListing> {
  if (useMocks) {
    await delay(600);
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + input.durationDays * 86_400_000).toISOString();
    const pricePerAyni = input.askPriceUsdc / input.ayniAmount;
    const store = useSimulationStore.getState();
    const officialPrice = store.prices.ayniUsd;

    // Read real position data from simulation store
    const simPos = store.positions.find((p) => p.id === input.positionId);
    const simDate = store.simulationDate;

    const elapsedMs = simPos
      ? new Date(simDate).getTime() - new Date(simPos.startDate).getTime()
      : 0;
    const totalMs = simPos
      ? new Date(simPos.endDate).getTime() - new Date(simPos.startDate).getTime()
      : 1;
    const elapsedMonths = Math.round(elapsedMs / (30.44 * 86_400_000));
    const remainingMonths = simPos
      ? Math.max(
          0,
          Math.round(
            (new Date(simPos.endDate).getTime() - new Date(simDate).getTime()) /
              (30.44 * 86_400_000),
          ),
        )
      : 0;
    const progressPercent = simPos ? Math.min(100, Math.round((elapsedMs / totalMs) * 100)) : 100;

    const newListing: MarketplaceListing = {
      id: `lst-${Date.now().toString(36)}`,
      sellerId: 'usr-current',
      sellerName: 'You',
      sellerKycLevel: 'enhanced',
      sellerCompletionRate: 100,
      sellerTotalDeals: 0,
      ayniAmount: input.ayniAmount,
      askPriceUsdc: input.askPriceUsdc,
      pricePerAyni,
      officialPricePerAyni: officialPrice,
      priceDeviation: Math.round(((pricePerAyni - officialPrice) / officialPrice) * 1000) / 10,
      positionHistory: simPos
        ? {
            stakedSince: simPos.startDate,
            quartersPaid: simPos.payouts.length,
            totalPaxgEarned: simPos.totalDistributedPaxg,
            positionDurationMonths: elapsedMonths,
            ...(simPos.status === 'active' ? { remainingMonths, progressPercent } : {}),
          }
        : {
            stakedSince: '2025-06-01T00:00:00Z',
            quartersPaid: 0,
            totalPaxgEarned: 0,
            positionDurationMonths: 0,
          },
      status: 'active',
      createdAt: now,
      expiresAt: expires,
      escrowTxHash: null,
      positionType: simPos?.status === 'active' ? 'active' : 'completed',
      sourcePositionId: input.positionId,
    };

    mockListings.push(newListing);
    return newListing;
  }

  try {
    return await api
      .post('marketplace/listings', {
        json: {
          positionId: input.positionId,
          ayniAmount: input.ayniAmount,
          askPriceUsdc: input.askPriceUsdc,
          durationDays: input.durationDays,
        },
      })
      .json<MarketplaceListing>();
  } catch (error) {
    const msg = await extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function cancelListing(id: string): Promise<void> {
  if (useMocks) {
    await delay(400);
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) throw new Error(`Listing ${id} not found`);
    listing.status = 'cancelled';
    return;
  }

  try {
    await api.delete(`marketplace/listings/${id}`);
  } catch (error) {
    const msg = await extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function purchaseListing(
  id: string,
  paymentMethod: string,
): Promise<{ txHash: string }> {
  if (useMocks) {
    await delay(600);
    const listing = mockListings.find((l) => l.id === id);
    if (!listing) throw new Error(`Listing ${id} not found`);
    if (listing.status !== 'active') {
      throw new Error(`Listing ${id} is not available (status: ${listing.status})`);
    }
    listing.status = 'completed';
    listing.escrowTxHash = `0x${Date.now().toString(16)}abcdef`;

    // Add purchased AYNI to buyer's portfolio
    const amountUsd = listing.askPriceUsdc;
    const ayniAmount = listing.ayniAmount;

    // If sold from an active position, complete the seller's position
    // (AYNI leaves seller's activated balance — does NOT return to seller)
    if (listing.positionType === 'active' && listing.sourcePositionId) {
      const sellerPos = useSimulationStore
        .getState()
        .positions.find((p) => p.id === listing.sourcePositionId);
      if (sellerPos && sellerPos.status === 'active') {
        useSimulationStore.setState((s) => ({
          positions: s.positions.map((p) =>
            p.id === listing.sourcePositionId
              ? { ...p, status: 'completed' as const, endDate: s.simulationDate }
              : p,
          ),
          balances: {
            ...s.balances,
            ayniActivated: s.balances.ayniActivated - sellerPos.ayniActivated,
          },
        }));
      }
    }

    // Compute remaining term for buyer (inherit seller's original end date)
    const sourcePos = listing.sourcePositionId
      ? useSimulationStore.getState().positions.find((p) => p.id === listing.sourcePositionId)
      : null;
    const buyerTermMonths =
      listing.positionHistory.remainingMonths ??
      (sourcePos
        ? Math.max(
            1,
            Math.round((new Date(sourcePos.endDate).getTime() - Date.now()) / (30.44 * 86_400_000)),
          )
        : 12);

    // Credit AYNI to buyer's available balance
    useSimulationStore.setState((s) => ({
      balances: {
        ...s.balances,
        ayniAvailable: s.balances.ayniAvailable + ayniAmount,
      },
    }));

    // Create buyer's position (autoActivate locks the AYNI)
    useSimulationStore.getState().createPosition({
      ayniAmount,
      amountUsd,
      termMonths: buyerTermMonths,
      autoActivate: true,
      tierDiscount: getTierDiscount(),
    });

    return { txHash: listing.escrowTxHash };
  }

  try {
    return await api
      .post(`marketplace/listings/${id}/purchase`, {
        json: { paymentMethod },
      })
      .json<{ txHash: string }>();
  } catch (error) {
    const msg = await extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function getMarketplaceStats(): Promise<MarketplaceStats> {
  if (useMocks) {
    await delay(200);
    return computeMockStats();
  }

  try {
    return await api.get('marketplace/stats').json<MarketplaceStats>();
  } catch (error) {
    const msg = await extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function getBurnTotal(): Promise<BurnTotal> {
  if (useMocks) {
    await delay(200);
    return computeMockBurnTotal();
  }

  try {
    return await api.get('marketplace/burn-total').json<BurnTotal>();
  } catch (error) {
    const msg = await extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function getMyListings(): Promise<MarketplaceListing[]> {
  if (useMocks) {
    await delay();
    return mockListings.filter((l) => l.sellerId === 'usr-current');
  }

  try {
    return await api.get('marketplace/my-listings').json<MarketplaceListing[]>();
  } catch (error) {
    const msg = await extractErrorMessage(error);
    throw new Error(msg);
  }
}
