export type MineLevel = 1 | 2 | 3 | 4 | 5;

export interface MineLevelConfig {
  level: MineLevel;
  name: string;
  minParticipation: number;
  maxParticipation: number | null;
  description: string;
  workers: number;
  equipment: string;
  outputMultiplier: number;
  illustrationId: string;
}

export interface MineStats {
  currentLevel: MineLevel;
  levelName: string;
  totalParticipated: number;
  nextLevelThreshold: number | null;
  amountToNextLevel: number | null;
  progressToNextLevel: number;
  nextLevelName: string | null;

  dailyProduction: {
    goldGrams: number;
    usdValue: number;
  };
  weeklyProduction: {
    goldGrams: number;
    usdValue: number;
  };
  totalProduction: {
    goldGrams: number;
    usdValue: number;
  };

  streak: {
    currentDays: number;
    longestDays: number;
    lastVisit: string;
  };

  mineDetails: {
    workers: number;
    equipment: string;
    efficiency: number;
    outputPerDay: string;
  };

  achievements: Achievement[];
}

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  category: 'production' | 'streak' | 'participation' | 'milestone';
}

export type AchievementId =
  | 'first-participation'
  | 'first-reward'
  | 'streak-7'
  | 'streak-14'
  | 'streak-30'
  | 'streak-60'
  | 'participate-1000'
  | 'participate-5000'
  | 'participate-25000'
  | 'first-payout'
  | 'gold-1g'
  | 'gold-10g'
  | 'gold-100g'
  | 'level-2'
  | 'level-3'
  | 'level-4'
  | 'level-5';

export interface AchievementDefinition {
  id: AchievementId;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  category: 'production' | 'streak' | 'participation' | 'milestone';
  condition: (ctx: AchievementContext) => boolean;
}

export interface AchievementContext {
  totalParticipatedUsd: number;
  totalGoldMinedGrams: number;
  currentLevel: MineLevel;
  currentStreak: number;
  hasFirstReward: boolean;
  hasFirstPayout: boolean;
  hasFirstParticipation: boolean;
}

export interface MineTimelineEvent {
  id: string;
  type: 'position_created' | 'level_up' | 'achievement' | 'payout' | 'future_goal';
  title: string;
  description?: string;
  timestamp: string;
}

export interface MineEvent {
  type: 'level_up' | 'achievement' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
}
