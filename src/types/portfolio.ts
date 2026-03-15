export type PositionStatus = 'active' | 'completed' | 'cancelled';

export interface Position {
  id: string;
  positionNumber: number;
  status: PositionStatus;
  participatedAmount: number;
  distributedAmount: number;
  claimedAmount?: number;
  termMonths: number;
  startDate: string;
  endDate: string;
  progressPercent: number;
  monthsRemaining: number;
  nextPayoutDate: string | null;
  nextPayoutEstimate: number | null;
  dailyRate: number;
  currentValueUsd: number;
  // Advanced details
  walletAddress: string;
  ayniAmount: number;
  paxgAmount: number;
  contractAddress: string;
}

export interface PortfolioSummary {
  positionsValue: number;
  totalDistributed: number;
  activeCount: number;
  completedCount: number;
  availableBalance: number;
  availableAyni: number;
  goldRewards: number;
  totalParticipatedAyni: number;
  ayniPrice: number;
  goldRewardsPaxg: number;
  // Quarterly payout fields
  claimablePaxg: number;
  claimableUsd: number;
  accruingPaxg: number;
  accruingUsd: number;
  nextPayoutDate: string;
  totalAccruedUsd: number;
}

export interface ExitOption {
  id: string;
  label: string;
  description: string;
}

export interface PortfolioResponse {
  summary: PortfolioSummary;
  positions: Position[];
}

export interface PositionDetailResponse {
  position: Position;
  transactions: PositionTransaction[];
}

export interface PositionTransaction {
  id: string;
  type: 'reward' | 'payout' | 'participation';
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface CancelPositionResponse {
  success: boolean;
  positionId: string;
  refundAmount: number;
  penaltyAmount: number;
  message: string;
}

export interface ReinvestResponse {
  success: boolean;
  newPositionId: string;
  amountPaxg: number;
  termMonths: number;
  message: string;
}

export interface StakeResponse {
  success: boolean;
  newPositionId: string;
  ayniAmount: number;
  termMonths: number;
  message: string;
}
