import type { AchievementDefinition } from '@/types/mine';

export const ACHIEVEMENT_DEFS: AchievementDefinition[] = [
  // ── Participation ──
  {
    id: 'first-participation',
    titleKey: 'mine.achievement.firstParticipation',
    descriptionKey: 'mine.achievement.firstParticipationDesc',
    icon: 'Gem',
    category: 'participation',
    condition: (ctx) => ctx.hasFirstParticipation,
  },
  {
    id: 'participate-1000',
    titleKey: 'mine.achievement.participate1000',
    descriptionKey: 'mine.achievement.participate1000Desc',
    icon: 'TrendingUp',
    category: 'participation',
    condition: (ctx) => ctx.totalParticipatedUsd >= 1000,
  },
  {
    id: 'participate-5000',
    titleKey: 'mine.achievement.participate5000',
    descriptionKey: 'mine.achievement.participate5000Desc',
    icon: 'TrendingUp',
    category: 'participation',
    condition: (ctx) => ctx.totalParticipatedUsd >= 5000,
  },
  {
    id: 'participate-25000',
    titleKey: 'mine.achievement.participate25000',
    descriptionKey: 'mine.achievement.participate25000Desc',
    icon: 'TrendingUp',
    category: 'participation',
    condition: (ctx) => ctx.totalParticipatedUsd >= 25000,
  },

  // ── Production ──
  {
    id: 'first-reward',
    titleKey: 'mine.achievement.firstGold',
    descriptionKey: 'mine.achievement.firstGoldDesc',
    icon: 'Coins',
    category: 'production',
    condition: (ctx) => ctx.hasFirstReward,
  },
  {
    id: 'first-payout',
    titleKey: 'mine.achievement.payday',
    descriptionKey: 'mine.achievement.paydayDesc',
    icon: 'Download',
    category: 'production',
    condition: (ctx) => ctx.hasFirstPayout,
  },
  {
    id: 'gold-1g',
    titleKey: 'mine.achievement.gold1g',
    descriptionKey: 'mine.achievement.gold1gDesc',
    icon: 'Coins',
    category: 'production',
    condition: (ctx) => ctx.totalGoldMinedGrams >= 1,
  },
  {
    id: 'gold-10g',
    titleKey: 'mine.achievement.gold10g',
    descriptionKey: 'mine.achievement.gold10gDesc',
    icon: 'Coins',
    category: 'production',
    condition: (ctx) => ctx.totalGoldMinedGrams >= 10,
  },
  {
    id: 'gold-100g',
    titleKey: 'mine.achievement.gold100g',
    descriptionKey: 'mine.achievement.gold100gDesc',
    icon: 'Coins',
    category: 'production',
    condition: (ctx) => ctx.totalGoldMinedGrams >= 100,
  },

  // ── Streak ──
  {
    id: 'streak-7',
    titleKey: 'mine.achievement.streak7',
    descriptionKey: 'mine.achievement.streak7Desc',
    icon: 'Flame',
    category: 'streak',
    condition: (ctx) => ctx.currentStreak >= 7,
  },
  {
    id: 'streak-14',
    titleKey: 'mine.achievement.streak14',
    descriptionKey: 'mine.achievement.streak14Desc',
    icon: 'Flame',
    category: 'streak',
    condition: (ctx) => ctx.currentStreak >= 14,
  },
  {
    id: 'streak-30',
    titleKey: 'mine.achievement.streak30',
    descriptionKey: 'mine.achievement.streak30Desc',
    icon: 'Flame',
    category: 'streak',
    condition: (ctx) => ctx.currentStreak >= 30,
  },
  {
    id: 'streak-60',
    titleKey: 'mine.achievement.streak60',
    descriptionKey: 'mine.achievement.streak60Desc',
    icon: 'Flame',
    category: 'streak',
    condition: (ctx) => ctx.currentStreak >= 60,
  },

  // ── Milestones ──
  {
    id: 'level-2',
    titleKey: 'mine.achievement.level2',
    descriptionKey: 'mine.achievement.level2Desc',
    icon: 'Pickaxe',
    category: 'milestone',
    condition: (ctx) => ctx.currentLevel >= 2,
  },
  {
    id: 'level-3',
    titleKey: 'mine.achievement.level3',
    descriptionKey: 'mine.achievement.level3Desc',
    icon: 'Pickaxe',
    category: 'milestone',
    condition: (ctx) => ctx.currentLevel >= 3,
  },
  {
    id: 'level-4',
    titleKey: 'mine.achievement.level4',
    descriptionKey: 'mine.achievement.level4Desc',
    icon: 'Pickaxe',
    category: 'milestone',
    condition: (ctx) => ctx.currentLevel >= 4,
  },
  {
    id: 'level-5',
    titleKey: 'mine.achievement.level5',
    descriptionKey: 'mine.achievement.level5Desc',
    icon: 'Pickaxe',
    category: 'milestone',
    condition: (ctx) => ctx.currentLevel >= 5,
  },
];

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENT_DEFS.length;
