export type TierLevel = 'explorer' | 'contributor' | 'operator' | 'principal';

export const TIER_ORDER: TierLevel[] = ['explorer', 'contributor', 'operator', 'principal'];

export interface TierConfig {
  level: TierLevel;
  label: string;
  minAYNI: number;
  minMonths: number;
  successFeeDiscount: number; // 0 | 5 | 10 | 15
  colorBorder: string; // CSS hex
  colorBadgeBg: string; // CSS hex
  iconName: 'Compass' | 'Pickaxe' | 'Settings' | 'Crown';
  perks: string[];
}

export interface UserTierData {
  currentTier: TierLevel;
  highestAchievedTier: TierLevel; // Permanence: does not decrease
  tierSource: 'calculated' | 'permanent' | 'lifetime_grams';
  lockedAYNI: number;
  participationMonths: number;
  lifetimeGrams: number; // Lifetime Net Allocation in grams
  miningPowerM3h: number; // lockedAYNI * 4 * 0.000001
  progressToNext: {
    percentage: number | null; // null if Principal
    ayniCurrent: number;
    ayniRequired: number;
    monthsCurrent: number;
    monthsRequired: number;
    nextTierLabel: string | null;
  };
}
