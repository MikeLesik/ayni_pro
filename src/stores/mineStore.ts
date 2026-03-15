// ═══════════════════════════════════════════════════════════════
// AYNI GOLD — Mine Gamification Store
// Derived Zustand store computing mine stats from simulationStore
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSimulationStore } from '@/stores/simulation';
import { getLevelForParticipation, getNextLevel, getProgressToNextLevel } from '@/lib/mineConfig';
import { ACHIEVEMENT_DEFS } from '@/lib/achievementDefs';
import type {
  MineStats,
  Achievement,
  AchievementId,
  AchievementContext,
  MineTimelineEvent,
} from '@/types/mine';
import type { SimActivity } from '@/stores/simulation';

// ── Store Interface ─────────────────────────────────────────

interface MineStore {
  // Persisted gamification state
  claimDates: string[];
  unlockedAchievements: Record<string, string>; // id → unlockDate
  previousLevel: number;

  // Computed (non-persisted)
  computedStats: MineStats | null;
  achievementToastQueue: AchievementId[];
  timelineEvents: MineTimelineEvent[];

  // Getters
  getCurrentStreak: () => number;
  getLongestStreak: () => number;
  isClaimedToday: () => boolean;

  // Actions
  claimToday: () => void;
  autoClaimDay: (dateIso: string) => void;
  dismissAchievementToast: () => void;
  refresh: () => void;
  resetGameData: () => void;
}

// ── Helpers ──────────────────────────────────────────────────

function dateKey(iso: string): string {
  return iso.split('T')[0]!;
}

function prevDay(dayStr: string): string {
  const d = new Date(dayStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split('T')[0]!;
}

function computeStreak(claimDates: string[], simDate: string): number {
  if (claimDates.length === 0) return 0;
  const today = dateKey(simDate);
  const set = new Set(claimDates);
  let streak = 0;
  let check = today;
  while (set.has(check)) {
    streak++;
    check = prevDay(check);
  }
  return streak;
}

function computeLongestStreak(claimDates: string[]): number {
  if (claimDates.length === 0) return 0;
  const sorted = [...claimDates].sort();
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const expected = prevDay(sorted[i]!);
    // Check if previous date is one day before
    if (sorted[i - 1] === expected) {
      current++;
      longest = Math.max(longest, current);
    } else if (sorted[i] !== sorted[i - 1]) {
      current = 1;
    }
  }
  return longest;
}

function buildTimelineFromActivities(
  activities: SimActivity[],
  achievements: Record<string, string>,
  nextLevelName: string | null,
): MineTimelineEvent[] {
  const events: MineTimelineEvent[] = [];

  // Position creation events
  activities
    .filter((a) => a.type === 'activate')
    .forEach((a) =>
      events.push({
        id: `tl-${a.id}`,
        type: 'position_created',
        title: a.title,
        timestamp: a.timestamp,
      }),
    );

  // Payout events
  activities
    .filter((a) => a.type === 'payout')
    .forEach((a) =>
      events.push({
        id: `tl-${a.id}`,
        type: 'payout',
        title: a.title,
        timestamp: a.timestamp,
      }),
    );

  // Achievement unlocks
  Object.entries(achievements).forEach(([id, date]) => {
    const def = ACHIEVEMENT_DEFS.find((d) => d.id === id);
    if (def) {
      events.push({
        id: `tl-ach-${id}`,
        type: 'achievement',
        title: def.titleKey,
        timestamp: date,
      });
    }
  });

  // Sort newest first
  events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Take last 10 real events
  const result = events.slice(0, 10);

  // Add future goal
  if (nextLevelName) {
    result.push({
      id: 'future-goal',
      type: 'future_goal',
      title: nextLevelName,
      timestamp: '',
    });
  }

  return result;
}

// ── Store ────────────────────────────────────────────────────

export const useMineStore = create<MineStore>()(
  persist(
    (set, get) => ({
      // Persisted
      claimDates: [],
      unlockedAchievements: {},
      previousLevel: 0,

      // Computed
      computedStats: null,
      achievementToastQueue: [],
      timelineEvents: [],

      // ── Getters ──

      getCurrentStreak: () => {
        const simDate = useSimulationStore.getState().simulationDate;
        return computeStreak(get().claimDates, simDate);
      },

      getLongestStreak: () => computeLongestStreak(get().claimDates),

      isClaimedToday: () => {
        const simDate = useSimulationStore.getState().simulationDate;
        const today = dateKey(simDate);
        return get().claimDates.includes(today);
      },

      // ── Actions ──

      claimToday: () => {
        const simDate = useSimulationStore.getState().simulationDate;
        const today = dateKey(simDate);
        const state = get();
        if (state.claimDates.includes(today)) return;
        const updated = [...state.claimDates, today];
        // Keep only last 120 days of claim history
        const trimmed = updated.length > 120 ? updated.slice(-120) : updated;
        set({ claimDates: trimmed });
        get().refresh();
      },

      autoClaimDay: (dateIso: string) => {
        const day = dateKey(dateIso);
        const state = get();
        if (state.claimDates.includes(day)) return;
        const updated = [...state.claimDates, day];
        // Keep only last 120 days of claim history
        const trimmed = updated.length > 120 ? updated.slice(-120) : updated;
        set({ claimDates: trimmed });
      },

      dismissAchievementToast: () => {
        set((s) => ({ achievementToastQueue: s.achievementToastQueue.slice(1) }));
      },

      resetGameData: () => {
        set({
          claimDates: [],
          unlockedAchievements: {},
          previousLevel: 0,
          computedStats: null,
          achievementToastQueue: [],
          timelineEvents: [],
        });
      },

      // ── Refresh (recompute everything from simulation) ──

      refresh: () => {
        const sim = useSimulationStore.getState();
        const state = get();

        if (!sim.positions.length && !sim.activities.length) {
          set({ computedStats: null, timelineEvents: [] });
          return;
        }

        // 1. Total participated USD (all positions, any status)
        const totalParticipatedUsd = sim.positions.reduce((sum, p) => sum + p.participatedUsd, 0);

        // 2. Mine level
        const levelConfig = getLevelForParticipation(totalParticipatedUsd);
        const currentLevel = levelConfig.level;
        const nextLevel = getNextLevel(currentLevel);
        const progress = getProgressToNextLevel(totalParticipatedUsd, levelConfig);

        // 3. Gold production totals
        let totalGoldGrams = 0;
        let totalGoldUsd = 0;
        const todayKey = dateKey(sim.simulationDate);
        let dailyGoldGrams = 0;
        let dailyGoldUsd = 0;
        let weeklyGoldGrams = 0;
        let weeklyGoldUsd = 0;

        // Compute date 7 days ago
        const weekAgo = new Date(todayKey + 'T00:00:00Z');
        weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
        const weekAgoKey = weekAgo.toISOString().split('T')[0]!;

        for (const pos of sim.positions) {
          for (const r of pos.dailyRewards) {
            totalGoldGrams += r.netRewardGrams;
            totalGoldUsd += r.netRewardUsd;

            const rDay = dateKey(r.date);
            if (rDay === todayKey) {
              dailyGoldGrams += r.netRewardGrams;
              dailyGoldUsd += r.netRewardUsd;
            }
            if (rDay > weekAgoKey) {
              weeklyGoldGrams += r.netRewardGrams;
              weeklyGoldUsd += r.netRewardUsd;
            }
          }
        }

        // 4. Streak
        const currentStreak = computeStreak(state.claimDates, sim.simulationDate);
        const longestStreak = Math.max(computeLongestStreak(state.claimDates), currentStreak);

        // 5. Determine boolean conditions
        const hasFirstParticipation = sim.positions.length > 0;
        const hasFirstReward = totalGoldGrams > 0;
        const hasFirstPayout = sim.activities.some((a) => a.type === 'payout');

        // 6. Evaluate achievements
        const ctx: AchievementContext = {
          totalParticipatedUsd,
          totalGoldMinedGrams: totalGoldGrams,
          currentLevel,
          currentStreak,
          hasFirstReward,
          hasFirstPayout,
          hasFirstParticipation,
        };

        const newUnlocks: AchievementId[] = [];
        const updatedAchievements = { ...state.unlockedAchievements };

        for (const def of ACHIEVEMENT_DEFS) {
          if (updatedAchievements[def.id]) continue; // already unlocked
          if (def.condition(ctx)) {
            updatedAchievements[def.id] = sim.simulationDate;
            newUnlocks.push(def.id);
          }
        }

        // 7. Build achievements array for MineStats
        const achievements: Achievement[] = ACHIEVEMENT_DEFS.map((def) => ({
          id: def.id,
          title: def.titleKey,
          description: def.descriptionKey,
          icon: def.icon,
          unlockedAt: updatedAchievements[def.id] || null,
          category: def.category,
        }));

        // 8. Mine details from level config
        const activePositions = sim.positions.filter((p) => p.status === 'active');
        const totalActiveAyni = activePositions.reduce((s, p) => s + p.ayniActivated, 0);
        const efficiency = Math.min(
          97,
          75 + currentLevel * 4 + Math.min(totalActiveAyni / 1000, 5),
        );

        // 10. Build timeline
        const timelineEvents = buildTimelineFromActivities(
          sim.activities,
          updatedAchievements,
          nextLevel?.name ?? null,
        );

        // 11. Assemble MineStats
        const computedStats: MineStats = {
          currentLevel,
          levelName: levelConfig.name,
          totalParticipated: totalParticipatedUsd,
          nextLevelThreshold: nextLevel?.minParticipation ?? null,
          amountToNextLevel: nextLevel
            ? Math.max(0, nextLevel.minParticipation - totalParticipatedUsd)
            : null,
          progressToNextLevel: progress,
          nextLevelName: nextLevel?.name ?? null,
          dailyProduction: { goldGrams: dailyGoldGrams, usdValue: dailyGoldUsd },
          weeklyProduction: { goldGrams: weeklyGoldGrams, usdValue: weeklyGoldUsd },
          totalProduction: { goldGrams: totalGoldGrams, usdValue: totalGoldUsd },
          streak: {
            currentDays: currentStreak,
            longestDays: longestStreak,
            lastVisit:
              state.claimDates.length > 0 ? state.claimDates[state.claimDates.length - 1]! : '',
          },
          mineDetails: {
            workers: levelConfig.workers,
            equipment: levelConfig.equipment,
            efficiency: Math.round(efficiency),
            outputPerDay: `${dailyGoldGrams.toFixed(4)}g`,
          },
          achievements,
        };

        // 12. Update store
        set({
          computedStats,
          unlockedAchievements: updatedAchievements,
          previousLevel: currentLevel,
          timelineEvents,
          achievementToastQueue: [...state.achievementToastQueue, ...newUnlocks],
        });
      },
    }),
    {
      name: 'ayni-mine-game',
      partialize: (state) => ({
        claimDates: state.claimDates,
        unlockedAchievements: state.unlockedAchievements,
        previousLevel: state.previousLevel,
        achievementToastQueue: state.achievementToastQueue,
      }),
    },
  ),
);
