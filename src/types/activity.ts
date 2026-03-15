export type ActivityEventType =
  | 'reward_credited'
  | 'participation_confirmed'
  | 'payout_completed'
  | 'quarterly_payout'
  | 'system_announcement';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  subtitle?: string;
  amount?: number;
  timestamp: string; // ISO
  titleKey?: string;
  titleVars?: Record<string, string | number>;
  subtitleKey?: string;
  subtitleVars?: Record<string, string | number>;
}

export type ActivityFilter = 'all' | 'distributions' | 'payments' | 'payouts' | 'system';

export interface ActivityPage {
  events: ActivityEvent[];
  hasMore: boolean;
  nextPage: number | null;
}
