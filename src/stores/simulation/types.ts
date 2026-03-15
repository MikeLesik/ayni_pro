// ── Simulation Store Types ────────────────────────────────────

export interface SimDailyReward {
  date: string;
  goldProductionGrams: number;
  extractionCostGrams: number;
  extractionCostUsd: number;
  successFeeGrams: number;
  netRewardGrams: number;
  netRewardPaxg: number;
  netRewardUsd: number;
}

export interface SimPayout {
  date: string;
  amountPaxg: number;
  amountUsd: number;
  status: 'paid' | 'pending' | 'scheduled';
}

export interface SimPosition {
  id: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  startDate: string;
  endDate: string;
  termMonths: number;
  participatedUsd: number;
  ayniActivated: number;
  successFeeRate: number;
  dailyRewards: SimDailyReward[];
  totalDistributedPaxg: number;
  totalDistributedUsd: number;
  totalClaimedPaxg: number;
  /** Distributed PAXG at last quarterly payout — used to compute per-quarter amounts */
  distributedAtLastPayout: number;
  nextPayoutDate: string;
  payouts: SimPayout[];
}

export interface SimActivity {
  id: string;
  type:
    | 'topup'
    | 'purchase'
    | 'activate'
    | 'reward'
    | 'payout'
    | 'claim'
    | 'complete'
    | 'cancel'
    | 'sell'
    | 'withdraw'
    | 'reactivate'
    | 'reinvest';
  timestamp: string;
  title: string;
  description: string;
  amount?: { value: number; currency: string; direction: 'in' | 'out' };
}

export interface SimulationUser {
  id: string;
  firstName: string;
  email: string;
  registeredAt: string;
  isLoggedIn: boolean;
  kycVerified: boolean;
}

export interface SimBalances {
  usdBalance: number;
  ayniAvailable: number;
  ayniActivated: number;
  paxgBalance: number;
  paxgClaimed: number;
}

export interface SimPrices {
  ayniUsd: number;
  paxgUsd: number;
  goldPerGram: number;
}

export interface SimulationState {
  user: SimulationUser | null;
  balances: SimBalances;
  positions: SimPosition[];
  activities: SimActivity[];
  prices: SimPrices;
  simulationDate: string;
  autoAdvance: boolean;
  autoClaimOnAdvance: boolean;
  _initialized: boolean;

  register: (name: string, email: string) => void;
  login: (email: string) => void;
  logout: () => void;

  topUp: (amountUsd: number) => void;
  buyAyni: (amountUsd: number) => number;

  createPosition: (params: {
    ayniAmount: number;
    amountUsd: number;
    termMonths: number;
    autoActivate: boolean;
    tierDiscount?: number;
  }) => string;

  advanceDay: () => void;
  advanceDays: (n: number) => void;
  advanceToNextPayout: () => void;

  claimRewards: (positionId: string) => number;
  claimAllRewards: () => number;

  completePosition: (positionId: string) => void;
  forceCompletePosition: (positionId: string) => void;
  cancelPosition: (positionId: string) => void;

  reactivateAyni: (ayniAmount: number, termMonths: number, tierDiscount?: number) => string;
  sellAyni: (ayniAmount: number) => number;
  withdrawPaxg: (paxgAmount: number) => void;
  withdrawAyni: (amount: number) => void;
  reinvest: (paxgAmount: number, termMonths: number, tierDiscount?: number) => string;

  autoReinvestEnabled: boolean;
  autoReinvestTermMonths: number;
  positionAutoReinvest: Record<string, boolean>;
  setAutoReinvest: (enabled: boolean) => void;
  setAutoReinvestTerm: (months: number) => void;
  setPositionAutoReinvest: (positionId: string, enabled: boolean) => void;

  setAutoClaimOnAdvance: (v: boolean) => void;
  updatePrices: (prices: Partial<SimPrices>) => void;
  resetSimulation: () => void;
  initWithDemoData: () => void;
}

/** set/get pair passed to each slice creator */
export type SimSet = {
  (
    partial:
      | SimulationState
      | Partial<SimulationState>
      | ((state: SimulationState) => SimulationState | Partial<SimulationState>),
  ): void;
};
export type SimGet = () => SimulationState;
