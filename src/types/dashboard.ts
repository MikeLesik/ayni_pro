import type { UserTier } from './auth';
import type { TierLevel } from './tier';

export interface TierResponse {
  currentTier: TierLevel;
  highestAchievedTier: TierLevel;
  tierSource: 'calculated' | 'permanent' | 'lifetime_grams';
  lockedAYNI: number;
  participationMonths: number;
  lifetimeGrams: number;
  miningPowerM3h: number;
}

export interface PlatformStatsResponse {
  totalParticipants: number;
  activePositions: number;
  platformMiningPowerM3h: number;
  avgParticipationMonths: number;
}

export interface DashboardUser {
  firstName: string;
  joinedAt: string;
  tier: UserTier;
}

export interface DashboardDistributions {
  totalDistributed: number;
  totalDistributedPaxg: number;
  todayDistribution: number;
  dailyRate: number;
  startDate: string;
}

export interface DashboardNextPayout {
  date: string;
  daysRemaining: number;
  progressPercent: number;
  estimatedAmount: number;
  quarterLabel?: string;
}

export interface DashboardQuarterlyInfo {
  accruedThisQuarter: number;
  accruedThisQuarterPaxg: number;
  totalAccrued: number;
  totalAccruedPaxg: number;
  claimableUsd: number;
  claimablePaxg: number;
  hasHadPayout: boolean;
  quarterStartDate: string;
  quarterEndDate: string;
}

export interface DashboardPositions {
  totalParticipated: number;
  activeCount: number;
  completedCount: number;
  totalParticipatedAyni: number;
  availableBalanceAyni: number;
  ayniPrice: number;
  goldRewardsPaxg: number;
}

export interface ChartDataPoint {
  date: string;
  distributedCumulative: number;
}

export type DailyRewardStatus = 'credited' | 'pending' | 'accruing' | 'paid';

export interface DailyReward {
  date: string;
  netRewardUsd: number;
  netRewardPaxg: number;
  status: DailyRewardStatus;
  goldMinedGrams: number;
  extractionCostUsd: number;
  platformFeeUsd: number;
  quarterId?: string;
}

export interface DashboardSocialProof {
  totalParticipants: number;
}

export interface DashboardResponse {
  user: DashboardUser;
  distributions: DashboardDistributions;
  nextPayout: DashboardNextPayout;
  positions: DashboardPositions;
  chartData: ChartDataPoint[];
  dailyRewards: DailyReward[];
  socialProof: DashboardSocialProof;
  quarterly: DashboardQuarterlyInfo;
}
