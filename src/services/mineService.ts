import type { MineLevel, MineStats, Achievement } from '@/types/mine';
import { ACHIEVEMENT_DEFS } from '@/lib/achievementDefs';

// ─── Shared Achievements (for testLevel mode) ──────────────────────
function achievementsForLevel(level: MineLevel): Achievement[] {
  const now = '2026-02-15T00:00:00Z';
  return ACHIEVEMENT_DEFS.map((def) => {
    const ctx = {
      totalParticipatedUsd:
        level === 1 ? 500 : level === 2 ? 2500 : level === 3 ? 12000 : level === 4 ? 50000 : 250000,
      totalGoldMinedGrams:
        level === 1 ? 0.14 : level === 2 ? 0.84 : level === 3 ? 4.2 : level === 4 ? 14.4 : 72,
      currentLevel: level,
      currentStreak:
        level === 1 ? 15 : level === 2 ? 22 : level === 3 ? 45 : level === 4 ? 60 : 120,
      hasFirstReward: true,
      hasFirstPayout: level >= 3,
      hasFirstParticipation: true,
    };
    const unlocked = def.condition(ctx);
    return {
      id: def.id,
      title: def.titleKey,
      description: def.descriptionKey,
      icon: def.icon,
      unlockedAt: unlocked ? now : null,
      category: def.category,
    };
  });
}

// ─── Mock stats per level ───────────────────────────────────────────
const LEVEL_STATS: Record<MineLevel, Omit<MineStats, 'achievements'>> = {
  1: {
    currentLevel: 1,
    levelName: 'Explorer',
    totalParticipated: 414.68,
    nextLevelThreshold: 1000,
    amountToNextLevel: 585.32,
    progressToNextLevel: 41.5,
    nextLevelName: 'Prospector',
    dailyProduction: { goldGrams: 0.002, usdValue: 0.39 },
    weeklyProduction: { goldGrams: 0.014, usdValue: 2.73 },
    totalProduction: { goldGrams: 0.14, usdValue: 27.3 },
    streak: { currentDays: 15, longestDays: 15, lastVisit: new Date().toISOString() },
    mineDetails: {
      workers: 1,
      equipment: 'Basic pickaxe & pan',
      efficiency: 80,
      outputPerDay: '0.002g/day',
    },
  },
  2: {
    currentLevel: 2,
    levelName: 'Prospector',
    totalParticipated: 2500,
    nextLevelThreshold: 5000,
    amountToNextLevel: 2500,
    progressToNextLevel: 37.5,
    nextLevelName: 'Operation',
    dailyProduction: { goldGrams: 0.006, usdValue: 1.17 },
    weeklyProduction: { goldGrams: 0.042, usdValue: 8.19 },
    totalProduction: { goldGrams: 0.84, usdValue: 163.8 },
    streak: { currentDays: 22, longestDays: 22, lastVisit: new Date().toISOString() },
    mineDetails: {
      workers: 3,
      equipment: 'Sluice box & hand tools',
      efficiency: 85,
      outputPerDay: '0.006g/day',
    },
  },
  3: {
    currentLevel: 3,
    levelName: 'Operation',
    totalParticipated: 12000,
    nextLevelThreshold: 25000,
    amountToNextLevel: 13000,
    progressToNextLevel: 35,
    nextLevelName: 'Mining Camp',
    dailyProduction: { goldGrams: 0.024, usdValue: 4.68 },
    weeklyProduction: { goldGrams: 0.168, usdValue: 32.76 },
    totalProduction: { goldGrams: 4.2, usdValue: 819 },
    streak: { currentDays: 45, longestDays: 45, lastVisit: new Date().toISOString() },
    mineDetails: {
      workers: 8,
      equipment: 'Excavator & conveyor',
      efficiency: 88,
      outputPerDay: '0.024g/day',
    },
  },
  4: {
    currentLevel: 4,
    levelName: 'Mining Camp',
    totalParticipated: 50000,
    nextLevelThreshold: 100000,
    amountToNextLevel: 50000,
    progressToNextLevel: 33.3,
    nextLevelName: 'Gold Empire',
    dailyProduction: { goldGrams: 0.08, usdValue: 15.6 },
    weeklyProduction: { goldGrams: 0.56, usdValue: 109.2 },
    totalProduction: { goldGrams: 14.4, usdValue: 2808 },
    streak: { currentDays: 60, longestDays: 60, lastVisit: new Date().toISOString() },
    mineDetails: {
      workers: 15,
      equipment: 'Multi-line processing',
      efficiency: 92,
      outputPerDay: '0.08g/day',
    },
  },
  5: {
    currentLevel: 5,
    levelName: 'Gold Empire',
    totalParticipated: 250000,
    nextLevelThreshold: null,
    amountToNextLevel: null,
    progressToNextLevel: 100,
    nextLevelName: null,
    dailyProduction: { goldGrams: 0.6, usdValue: 117 },
    weeklyProduction: { goldGrams: 4.2, usdValue: 819 },
    totalProduction: { goldGrams: 72, usdValue: 14040 },
    streak: { currentDays: 120, longestDays: 120, lastVisit: new Date().toISOString() },
    mineDetails: {
      workers: 50,
      equipment: 'Full industrial complex',
      efficiency: 97,
      outputPerDay: '0.6g/day',
    },
  },
};

// ─── Public API ─────────────────────────────────────────────────────

/** Returns mock mine stats for a specific level (for visual testing) */
export function getMineStatsByLevel(level: MineLevel): MineStats {
  const base = LEVEL_STATS[level];
  return { ...base, achievements: achievementsForLevel(level) };
}

/** Default getMineStats — accepts optional override level for ?testLevel param */
export async function getMineStats(overrideLevel?: MineLevel): Promise<MineStats> {
  await new Promise((r) => setTimeout(r, 600));

  if (overrideLevel) {
    return getMineStatsByLevel(overrideLevel);
  }

  return getMineStatsByLevel(1);
}
