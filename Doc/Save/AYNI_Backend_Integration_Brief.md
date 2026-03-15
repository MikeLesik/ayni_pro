# AYNI Gold — Backend Integration Brief

> Frontend ready for API integration. This document describes mock data architecture, expected API contracts, and replacement patterns.

---

## Architecture Overview

```
React App
  └── TanStack Query hooks (useDashboard, usePortfolio, useActivity, useEarnProjection)
        └── Service layer (dashboardService, portfolioService, earnService, activityService)
              └── mockApi.ts  ← REPLACE THIS WITH REAL fetch() CALLS
                    └── simulationStore (Zustand + localStorage) ← REMOVE AFTER INTEGRATION
```

**Key principle**: The service layer (`src/services/*Service.ts`) is the only place that calls `mockApi`. Replace those calls with `fetch()` to your real endpoints. Everything above (hooks, components, pages) stays untouched.

---

## Files to Modify for Backend Integration

| File | Action |
|------|--------|
| `src/services/dashboardService.ts` | Replace `mockApi.getDashboard()` → `fetch('/api/dashboard')` |
| `src/services/portfolioService.ts` | Replace all `mockApi.*` calls → real API fetch |
| `src/services/earnService.ts` | Replace `mockApi.getProjection()` / `mockApi.participate()` |
| `src/services/activityService.ts` | Replace `mockApi.getActivity()` |
| `src/services/simulationStore.ts` | Remove after integration (dev-only simulation engine) |
| `src/services/mockApi.ts` | Remove after integration |
| `src/services/mockData.ts` | Remove after integration |
| `src/stores/mineStore.ts` | Keep `claimDates` + `unlockedAchievements` local, but `refresh()` should fetch from API |
| `src/stores/distributionStore.ts` | Replace with API calls to `/api/distributions/*` |

---

## API Endpoints Required

### Priority 1 — Core

#### `POST /api/auth/login`
```json
// Request
{ "email": "string", "password": "string" }

// Response
{ "token": "jwt-string", "user": { "id", "firstName", "email", "registeredAt", "kycVerified", "tier" } }
```

#### `GET /api/user`
```json
// Response
{
  "id": "string",
  "firstName": "string",
  "email": "string",
  "registeredAt": "2026-01-02T00:00:00Z",
  "kycVerified": true,
  "tier": "standard" | "premium"
}
```

#### `GET /api/wallet/balances`
```json
// Response
{
  "usdBalance": 0,
  "ayniAvailable": 1756.55,
  "ayniActivated": 3520.10,
  "paxgBalance": 0.00166,
  "paxgClaimed": 0
}
```

#### `GET /api/prices`
```json
// Response — real-time feed
{
  "ayniUsd": 0.2937,
  "paxgUsd": 5192.28,
  "goldPerGram": 166.95
}
```

#### `POST /api/earn/participate`
```json
// Request
{ "amountUsd": 500, "termMonths": 12, "autoActivate": true }

// Response
{
  "id": "pos-uuid",
  "status": "confirmed",
  "amount": 500,
  "termMonths": 12,
  "estimatedDistributions": 87.60,
  "firstPayoutDate": "2026-06-02T00:00:00Z",
  "createdAt": "2026-03-02T00:00:00Z"
}
```

#### `GET /api/positions`
```json
// Response — array of positions
[{
  "id": "pos-001",
  "status": "active" | "completed" | "cancelled",
  "participatedUsd": 200,
  "ayniActivated": 681.04,
  "termMonths": 12,
  "startDate": "2026-01-02T00:00:00Z",
  "endDate": "2027-01-02T00:00:00Z",
  "nextPayoutDate": "2026-04-02T00:00:00Z",
  "successFeeRate": 0.46,
  "totalDistributedUsd": 5.83,
  "totalDistributedPaxg": 0.00112,
  "totalClaimedPaxg": 0,
  "progress": 21,
  "daysActive": 60,
  "dailyRewardUsd": 0.10,
  "dailyRewardGrams": 0.00058
}]
```

#### `GET /api/positions/:id`
```json
// Response — position detail with transaction history
{
  "position": { /* same shape as above */ },
  "transactions": [{
    "id": "tx-001",
    "type": "participation" | "payout",
    "amount": 200,
    "date": "2026-01-02T00:00:00Z",
    "status": "completed"
  }]
}
```

#### `POST /api/positions/:id/claim`
```json
// Response
{ "success": true, "claimedPaxg": 0.00112, "claimedUsd": 5.83 }
```

#### `POST /api/positions/:id/cancel`
```json
// Response
{
  "success": true,
  "positionId": "pos-001",
  "refundAmount": 190,
  "penaltyAmount": 10,
  "penaltyPercent": 5,
  "message": "Position cancelled. 5% early exit fee applied."
}
```

#### `POST /api/positions/reinvest`
```json
// Request
{ "amountPaxg": 0.001, "termMonths": 12 }

// Response
{ "success": true, "newPositionId": "pos-new", "amountPaxg": 0.001, "swapFeePercent": 1.5 }
```

#### `POST /api/positions/stake-ayni`
```json
// Request
{ "ayniAmount": 500, "termMonths": 6 }

// Response
{ "success": true, "positionId": "pos-new" }
```

#### `POST /api/wallet/withdraw-paxg`
```json
// Request
{ "amount": 0.001, "walletAddress": "0x..." }

// Response
{ "status": "confirmed", "txHash": "..." }
```

#### `POST /api/wallet/withdraw-ayni`
```json
// Request
{ "amount": 500, "walletAddress": "0x..." }

// Response
{ "status": "confirmed", "txHash": "..." }
```

---

### Priority 2 — Dashboard Aggregation

#### `GET /api/dashboard`
This is the main aggregated endpoint for the home screen.

```json
// Response
{
  "user": {
    "firstName": "Mikhail",
    "joinedAt": "2026-01-02T00:00:00Z",
    "tier": "premium"
  },
  "distributions": {
    "totalDistributed": 8.63,
    "totalDistributedPaxg": 0.00166,
    "todayDistribution": 0.39,
    "dailyRate": 0.39,
    "startDate": "2026-01-02T00:00:00Z"
  },
  "nextPayout": {
    "date": "2026-04-03T00:00:00Z",
    "daysRemaining": 32,
    "progressPercent": 65,
    "estimatedAmount": 12.50,
    "quarterLabel": "Q2 2026"
  },
  "positions": {
    "totalParticipated": 514.68,
    "activeCount": 3,
    "completedCount": 1,
    "totalParticipatedAyni": 1753.12,
    "availableBalanceAyni": 0,
    "ayniPrice": 0.2937,
    "goldRewardsPaxg": 0.00166
  },
  "chartData": [
    { "date": "2026-01-02", "dailyUsd": 0.08, "cumulativeUsd": 0.08 },
    { "date": "2026-01-03", "dailyUsd": 0.09, "cumulativeUsd": 0.17 }
  ],
  "dailyRewards": [
    {
      "date": "2026-03-01",
      "netRewardUsd": 0.39,
      "netRewardPaxg": 0.000075,
      "status": "accruing",
      "goldMinedGrams": 0.0024,
      "extractionCostUsd": 0.014,
      "platformFeeUsd": 0.006
    }
  ],
  "quarterly": {
    "accruedThisQuarter": 12.50,
    "accruedThisQuarterPaxg": 0.0024,
    "totalAccrued": 8.63,
    "totalAccruedPaxg": 0.00166,
    "claimableUsd": 0,
    "claimablePaxg": 0,
    "hasHadPayout": false,
    "quarterStartDate": "2026-01-02T00:00:00Z",
    "quarterEndDate": "2026-04-02T00:00:00Z"
  },
  "socialProof": {
    "totalParticipants": 1247
  }
}
```

---

### Priority 3 — Distributions Detail

#### `GET /api/distributions/accruing`
```json
{
  "quarterId": "Q1-2026",
  "totalGoldGrams": 0.145,
  "totalPaxg": 0.00466,
  "totalUsd": 24.21,
  "daysInQuarter": 60,
  "totalDaysInQuarter": 91,
  "startDate": "2026-01-02",
  "endDate": "2026-04-02",
  "estimatedPayoutDate": "2026-04-05"
}
```

#### `GET /api/distributions/claimable`
```json
{ "totalPaxg": 0, "totalGoldGrams": 0, "totalUsd": 0 }
```

#### `GET /api/distributions/history`
```json
[{
  "quarterId": "Q4-2025",
  "payoutDate": "2026-01-05",
  "amountPaxg": 0.002,
  "amountUsd": 10.38,
  "status": "paid"
}]
```

#### `GET /api/distributions/daily?limit=7`
```json
[{
  "date": "2026-03-01",
  "goldGrams": 0.0024,
  "paxg": 0.000075,
  "usd": 0.39,
  "positionId": "pos-001"
}]
```

---

### Priority 4 — Activity Feed

#### `GET /api/activity?filter=all&page=0&limit=10`
```json
{
  "events": [{
    "id": "evt-001",
    "type": "reward_credited" | "participation_confirmed" | "payout_completed" | "quarterly_payout" | "system_announcement",
    "title": "Daily reward credited",
    "subtitle": "+$0.39 accrued",
    "amount": 0.39,
    "timestamp": "2026-03-01T14:00:00Z"
  }],
  "hasMore": true,
  "nextPage": 1
}
```

---

### Priority 5 — Earn Projection

#### `GET /api/earn/projection?amount=500&termMonths=12`
```json
{
  "participationAmount": 500,
  "termMonths": 12,
  "tokensReceived": 1702.76,
  "estimatedDistributions": 87.60,
  "monthlyDistributions": 7.30,
  "dailyDistributions": 0.24,
  "totalGoldGrams": 0.524,
  "monthlyGoldGrams": 0.044,
  "dailyGoldGrams": 0.0014,
  "firstPayoutDate": "2026-06-02T00:00:00Z",
  "goldPriceUsed": 166.95,
  "disclaimer": "Projections are estimates...",
  "quarterlyProjections": [{
    "quarterNumber": 1,
    "estimatedUsd": 21.90,
    "estimatedPaxg": 0.00422,
    "startDate": "2026-03-02",
    "endDate": "2026-06-02",
    "payoutDate": "2026-06-05",
    "label": "Jun '26"
  }],
  "totalPayouts": 4
}
```

---

### Priority 6 — Gamification (Optional)

#### `GET /api/gamification/stats`
```json
{
  "currentLevel": 2,
  "levelName": "Prospector",
  "totalParticipated": 1500,
  "progressToNextLevel": 10,
  "dailyProduction": { "goldGrams": 0.0024, "usdValue": 0.39 },
  "weeklyProduction": { "goldGrams": 0.0168, "usdValue": 2.73 },
  "streak": { "currentDays": 15, "longestDays": 22 },
  "achievements": [{ "id": "first-participation", "unlockedAt": "2026-01-02" }]
}
```

#### `POST /api/gamification/claim`
```json
// Response
{ "success": true, "streak": 16 }
```

---

## Tokenomics Constants (Server-Side)

These are hardcoded in `src/lib/rewardEngine.ts` — backend must use the same values:

```
Token capacity:       0.000004 m³/hour per token
Gold content:         0.1 grams per m³
Operating hours:      16 hours/day
OPEX per m³:          $5.92
Default AYNI price:   $0.2937
Default PAXG price:   $5,192.28
Gold price per gram:  $166.95
Burn/success fee:     15% base (tiered by amount + term, see getSuccessFeeRate())
Daily snapshot time:  14:00 UTC
```

**Success fee tiers** (`rewardEngine.ts:getSuccessFeeRate()`):

| USD Amount | 1 mo | 6 mo | 12 mo | 24 mo | 36+ mo |
|------------|------|------|-------|-------|--------|
| < $500 | 70% | 55% | 46% | 40% | 36% |
| $500–$999 | 65% | 50% | 42% | 37% | 33% |
| $1K–$4,999 | 60% | 45% | 38% | 34% | 30% |
| $5K–$24,999 | 55% | 42% | 35% | 31% | 28% |
| $25K–$99,999 | 50% | 38% | 32% | 29% | 27% |
| $100K–$999,999 | 45% | 35% | 30% | 28% | 26% |
| $1M+ | 40% | 32% | 28% | 27% | 25% |

---

## TanStack Query Keys

The frontend uses these query keys for caching/invalidation:

| Key | Hook | Invalidated On |
|-----|------|----------------|
| `['dashboard']` | `useDashboard` | Position create/cancel, claim, payout |
| `['portfolio']` | `usePortfolio` | Position create/cancel, reinvest, withdraw, stake |
| `['activity', filter]` | `useActivity` | Any transaction |
| `['earn-projection', amount, months]` | `useEarnProjection` | Price changes (staleTime: 30s) |

After real API integration, invalidation should be triggered by mutation `onSuccess` callbacks (already wired in `usePortfolio` hook).

---

## Replacement Example

**Before** (`src/services/dashboardService.ts`):
```typescript
import { mockApi } from './mockApi';

export async function getDashboard() {
  return mockApi.getDashboard();
}
```

**After**:
```typescript
import { apiClient } from './apiClient'; // your HTTP client (axios/fetch wrapper)

export async function getDashboard(): Promise<DashboardResponse> {
  const { data } = await apiClient.get('/api/dashboard');
  return data;
}
```

---

## Auth Flow

Currently: `localStorage.getItem('ayni-auth')` checked by `RequireAuth` guard in `src/app/routes.tsx`.

For real auth:
1. Login → store JWT in `localStorage` or `httpOnly cookie`
2. `RequireAuth` checks token validity
3. `apiClient` attaches `Authorization: Bearer <token>` header
4. On 401 → redirect to `/auth`

---

## What Can Stay Client-Side

| Store | Keep? | Why |
|-------|-------|-----|
| `uiStore` | Yes | Theme, language, view mode — pure UI state |
| `earnStore` | Yes | Form state (amount, term) — no backend needed |
| `mineStore.claimDates` | Partial | Streak can stay local for now, or sync with backend |
| `mineStore.unlockedAchievements` | Partial | Can stay local or sync |
| `mineNotificationStore` | Yes | Toast/notification UI state |
| `simulationStore` | Remove | Replace entirely with real API |
| `distributionStore` | Remove | Data comes from `/api/distributions/*` |

---

## Running the Frontend

```bash
npm install
npm run dev        # Development server at localhost:5173
npm run build      # Production build
```

Environment variable for API base URL (add to `.env`):
```
VITE_API_BASE_URL=https://api.ayni.gold
```
