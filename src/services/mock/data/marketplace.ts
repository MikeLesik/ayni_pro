import type { MarketplaceListing, MarketplaceStats } from '@/types/marketplace';

const OFFICIAL_PRICE = 0.3; // current official AYNI price in USDC

export const mockListings: MarketplaceListing[] = [
  // ── Small lots (1000–4000 AYNI) ──────────────────────────────
  {
    id: 'lst-001',
    sellerId: 'usr-a1b2c3',
    sellerName: 'Carlos M.',
    sellerKycLevel: 'standard',
    sellerCompletionRate: 95,
    sellerTotalDeals: 12,
    ayniAmount: 1500,
    askPriceUsdc: 420,
    pricePerAyni: 0.28,
    officialPricePerAyni: OFFICIAL_PRICE,
    priceDeviation: -6.7,
    positionHistory: {
      stakedSince: '2025-06-01T00:00:00Z',
      quartersPaid: 3,
      totalPaxgEarned: 0.042,
      positionDurationMonths: 9,
    },
    status: 'active',
    createdAt: '2026-02-28T14:30:00Z',
    expiresAt: '2026-03-14T14:30:00Z',
    escrowTxHash: null,
    positionType: 'completed',
  },
  {
    id: 'lst-002',
    sellerId: 'usr-d4e5f6',
    sellerName: 'Ana R.',
    sellerKycLevel: 'enhanced',
    sellerCompletionRate: 100,
    sellerTotalDeals: 27,
    ayniAmount: 3000,
    askPriceUsdc: 930,
    pricePerAyni: 0.31,
    officialPricePerAyni: OFFICIAL_PRICE,
    priceDeviation: 3.3,
    positionHistory: {
      stakedSince: '2025-01-15T00:00:00Z',
      quartersPaid: 5,
      totalPaxgEarned: 0.11,
      positionDurationMonths: 14,
    },
    status: 'active',
    createdAt: '2026-03-01T09:00:00Z',
    expiresAt: '2026-03-15T09:00:00Z',
    escrowTxHash: null,
  },
  {
    id: 'lst-003',
    sellerId: 'usr-g7h8i9',
    sellerName: 'Pedro L.',
    sellerKycLevel: 'standard',
    sellerCompletionRate: 88,
    sellerTotalDeals: 5,
    ayniAmount: 4000,
    askPriceUsdc: 1080,
    pricePerAyni: 0.27,
    officialPricePerAyni: OFFICIAL_PRICE,
    priceDeviation: -10.0,
    positionHistory: {
      stakedSince: '2025-09-01T00:00:00Z',
      quartersPaid: 2,
      totalPaxgEarned: 0.028,
      positionDurationMonths: 6,
    },
    status: 'active',
    createdAt: '2026-03-02T18:45:00Z',
    expiresAt: '2026-03-09T18:45:00Z',
    escrowTxHash: null,
    positionType: 'completed',
  },

  // ── Medium lots (5000–30000 AYNI) ────────────────────────────
  {
    id: 'lst-004',
    sellerId: 'usr-j1k2l3',
    sellerName: 'Maria S.',
    sellerKycLevel: 'enhanced',
    sellerCompletionRate: 97,
    sellerTotalDeals: 34,
    ayniAmount: 8000,
    askPriceUsdc: 2480,
    pricePerAyni: 0.31,
    officialPricePerAyni: OFFICIAL_PRICE,
    priceDeviation: 3.3,
    positionHistory: {
      stakedSince: '2024-09-01T00:00:00Z',
      quartersPaid: 6,
      totalPaxgEarned: 0.35,
      positionDurationMonths: 18,
    },
    status: 'active',
    createdAt: '2026-02-25T11:20:00Z',
    expiresAt: '2026-03-25T11:20:00Z',
    escrowTxHash: null,
    positionType: 'completed',
  },
  {
    id: 'lst-005',
    sellerId: 'usr-m4n5o6',
    sellerName: 'Jorge V.',
    sellerKycLevel: 'standard',
    sellerCompletionRate: 82,
    sellerTotalDeals: 3,
    ayniAmount: 15000,
    askPriceUsdc: 3900,
    pricePerAyni: 0.26,
    officialPricePerAyni: OFFICIAL_PRICE,
    priceDeviation: -13.3,
    positionHistory: {
      stakedSince: '2025-03-01T00:00:00Z',
      quartersPaid: 4,
      totalPaxgEarned: 0.21,
      positionDurationMonths: 12,
    },
    status: 'reserved',
    createdAt: '2026-02-20T16:00:00Z',
    expiresAt: '2026-03-20T16:00:00Z',
    escrowTxHash: '0x7a3f...b9c1',
    positionType: 'completed',
  },
  {
    id: 'lst-006',
    sellerId: 'usr-p7q8r9',
    sellerName: 'Elena D.',
    sellerKycLevel: 'enhanced',
    sellerCompletionRate: 100,
    sellerTotalDeals: 41,
    ayniAmount: 25000,
    askPriceUsdc: 8000,
    pricePerAyni: 0.32,
    officialPricePerAyni: OFFICIAL_PRICE,
    priceDeviation: 6.7,
    positionHistory: {
      stakedSince: '2024-03-15T00:00:00Z',
      quartersPaid: 8,
      totalPaxgEarned: 1.45,
      positionDurationMonths: 24,
    },
    status: 'active',
    createdAt: '2026-03-03T08:15:00Z',
    expiresAt: '2026-04-02T08:15:00Z',
    escrowTxHash: null,
    positionType: 'completed',
  },

  // ── Large lots (50000+ AYNI) ─────────────────────────────────
  {
    id: 'lst-007',
    sellerId: 'usr-s1t2u3',
    sellerName: 'Ricardo F.',
    sellerKycLevel: 'enhanced',
    sellerCompletionRate: 98,
    sellerTotalDeals: 19,
    ayniAmount: 50000,
    askPriceUsdc: 15500,
    pricePerAyni: 0.31,
    officialPricePerAyni: OFFICIAL_PRICE,
    priceDeviation: 3.3,
    positionHistory: {
      stakedSince: '2024-06-01T00:00:00Z',
      quartersPaid: 7,
      totalPaxgEarned: 2.55,
      positionDurationMonths: 21,
    },
    status: 'active',
    createdAt: '2026-03-01T20:00:00Z',
    expiresAt: '2026-03-31T20:00:00Z',
    escrowTxHash: null,
    positionType: 'completed',
  },
  {
    id: 'lst-008',
    sellerId: 'usr-v4w5x6',
    sellerName: 'Isabella G.',
    sellerKycLevel: 'enhanced',
    sellerCompletionRate: 100,
    sellerTotalDeals: 53,
    ayniAmount: 80000,
    askPriceUsdc: 22400,
    pricePerAyni: 0.28,
    officialPricePerAyni: OFFICIAL_PRICE,
    priceDeviation: -6.7,
    positionHistory: {
      stakedSince: '2024-01-01T00:00:00Z',
      quartersPaid: 8,
      totalPaxgEarned: 4.68,
      positionDurationMonths: 24,
    },
    status: 'completed',
    createdAt: '2026-02-15T12:00:00Z',
    expiresAt: '2026-03-15T12:00:00Z',
    escrowTxHash: '0x2e8d...f4a7',
    positionType: 'completed',
  },
];

/** Compute stats dynamically from current listings */
export function computeMockStats(): MarketplaceStats {
  const active = mockListings.filter((l) => l.status === 'active');
  const totalListings = active.length;
  const totalVolume = active.reduce((s, l) => s + l.askPriceUsdc, 0);
  const avgPriceDeviation =
    totalListings > 0
      ? Math.round((active.reduce((s, l) => s + l.priceDeviation, 0) / totalListings) * 100) / 100
      : 0;

  // Average days remaining until expiry for active listings
  const now = Date.now();
  const avgTimeToFill =
    totalListings > 0
      ? Math.round(
          (active.reduce((s, l) => {
            const remaining = (new Date(l.expiresAt).getTime() - now) / 86_400_000;
            return s + Math.max(remaining, 0);
          }, 0) /
            totalListings) *
            10,
        ) / 10
      : 0;

  return { totalListings, totalVolume, avgPriceDeviation, avgTimeToFill };
}

/** Compute burn total from completed marketplace transactions */
export function computeMockBurnTotal() {
  const completed = mockListings.filter((l) => l.status === 'completed');
  const totalBurned = completed.reduce((s, l) => s + l.ayniAmount, 0);
  const totalBurnedUsd = completed.reduce((s, l) => s + l.askPriceUsdc, 0);
  return { totalBurned, totalBurnedUsd };
}
