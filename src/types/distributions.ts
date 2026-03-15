// ═══════════════════════════════════════════════════════════════
// AYNI GOLD — Quarterly Distribution Types
// ═══════════════════════════════════════════════════════════════

/** Quarterly period — tracks each 3-month cycle from position activation */
export interface QuarterlyPeriod {
  id: string; // e.g. "Q1-pos-abc123"
  positionId: string;
  quarterNumber: number; // 1, 2, 3, ...
  startDate: string; // ISO date — start of quarter
  endDate: string; // ISO date — end of quarter
  payoutDate: string; // ISO date — payout date (endDate + ~3 business days)
  status: 'accruing' | 'pending_payout' | 'paid' | 'future';
}

/** Daily accrual — one entry per day per position */
export interface DailyAccrual {
  date: string; // ISO date
  positionId: string;
  goldProductionGrams: number; // gold mined by user's token share
  costsUsd: number; // operating expenses (USD)
  costsGrams: number; // costs converted to grams via gold price
  successFeeGrams: number; // platform fee in grams
  netGoldGrams: number; // net gold after deductions
  netPaxg: number; // PAXG equivalent (netGold / 31.1035)
  netUsd: number; // USD equivalent via gold price
  goldPriceUsd: number; // gold price per gram at snapshot
  paxgPriceUsd: number; // PAXG price at snapshot
  quarterId: string; // which quarter this accrual belongs to
}

/** Completed quarterly payout record */
export interface QuarterlyPayout {
  quarterId: string;
  positionId: string;
  quarterNumber: number;
  payoutDate: string;
  periodStart: string;
  periodEnd: string;
  totalGoldGrams: number;
  totalPaxg: number;
  totalUsd: number;
  daysInPeriod: number;
  status: 'paid' | 'claimed' | 'reinvested';
  claimedDate?: string;
}

/** Full distribution state for a user across all positions */
export interface DistributionState {
  /** Current quarter — accruing but not yet paid out */
  accruing: {
    quarterId: string;
    totalGoldGrams: number;
    totalPaxg: number;
    totalUsd: number;
    daysInQuarter: number;
    totalDaysInQuarter: number;
    startDate: string;
    endDate: string;
    estimatedPayoutDate: string;
  };

  /** Available to withdraw — past quarters already paid out */
  claimable: {
    totalPaxg: number;
    totalGoldGrams: number;
    totalUsd: number;
  };

  /** Already withdrawn by user */
  withdrawn: {
    totalPaxg: number;
    totalUsd: number;
  };

  /** History of quarterly payouts */
  quarterlyPayouts: QuarterlyPayout[];

  /** All daily accruals */
  dailyAccruals: DailyAccrual[];

  /** All quarterly periods */
  quarters: QuarterlyPeriod[];

  /** Aggregated totals */
  totalAccruedAllTime: {
    totalGoldGrams: number;
    totalPaxg: number;
    totalUsd: number;
  };
}
