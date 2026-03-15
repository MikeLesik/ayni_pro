import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSimulationStore } from '@/stores/simulation';

interface MineNotificationState {
  /** ISO date string of last daily production toast shown */
  lastDailyNotification: string | null;
  /** ISO date string of the last visit */
  lastVisitDate: string | null;
  /** Current streak count */
  streakDays: number;
  /** Longest streak ever */
  longestStreak: number;
  /** Whether user has visited My Mine page (for first-visit achievement mock) */
  hasVisitedMyMine: boolean;
  /** Whether to show achievement toast right now */
  showAchievementToast: boolean;
  /** Whether to show daily production toast right now */
  showDailyToast: boolean;

  /** Call on page load (Home or My Mine) to check daily toast + streak */
  checkDailyVisit: () => void;
  /** Mark My Mine as visited (triggers achievement on first visit) */
  markMyMineVisited: () => void;
  /** Dismiss daily toast */
  dismissDailyToast: () => void;
  /** Dismiss achievement toast */
  dismissAchievementToast: () => void;
  /** Reset all notification state */
  reset: () => void;
}

export const useMineNotificationStore = create<MineNotificationState>()(
  persist(
    (set, get) => ({
      lastDailyNotification: null,
      lastVisitDate: null,
      streakDays: 1,
      longestStreak: 1,
      hasVisitedMyMine: false,
      showAchievementToast: false,
      showDailyToast: false,

      checkDailyVisit: () => {
        // Snapshot simulation date once to avoid race condition
        const simDate = useSimulationStore.getState().simulationDate;
        const today = simDate.split('T')[0]!;
        const d = new Date(simDate);
        d.setDate(d.getDate() - 1);
        const yesterday = d.toISOString().split('T')[0]!;

        const state = get();

        // Show daily toast if not shown today
        const shouldShowToast = state.lastDailyNotification !== today;

        // Update streak
        let newStreak = state.streakDays;
        if (state.lastVisitDate === null) {
          newStreak = 1;
        } else if (state.lastVisitDate === today) {
          // Already visited today, keep streak
          newStreak = state.streakDays;
        } else if (state.lastVisitDate === yesterday) {
          // Consecutive day
          newStreak = state.streakDays + 1;
        } else {
          // Streak broken
          newStreak = 1;
        }

        const newLongest = Math.max(state.longestStreak, newStreak);

        // Send streak milestone notification
        if (newStreak > state.streakDays) {
          import('@/services/earningsNotificationService')
            .then(({ sendStreakNotification }) => sendStreakNotification(newStreak))
            .catch(() => {});
        }

        set({
          lastVisitDate: today,
          streakDays: newStreak,
          longestStreak: newLongest,
          ...(shouldShowToast ? { showDailyToast: true, lastDailyNotification: today } : {}),
        });
      },

      markMyMineVisited: () => {
        const state = get();
        if (!state.hasVisitedMyMine) {
          set({ hasVisitedMyMine: true, showAchievementToast: true });
        }
      },

      dismissDailyToast: () => set({ showDailyToast: false }),
      dismissAchievementToast: () => set({ showAchievementToast: false }),

      reset: () =>
        set({
          streakDays: 0,
          longestStreak: 0,
          lastVisitDate: null,
          showDailyToast: false,
          showAchievementToast: false,
        }),
    }),
    {
      name: 'ayni-mine-notifications',
      partialize: (state) => ({
        lastDailyNotification: state.lastDailyNotification,
        lastVisitDate: state.lastVisitDate,
        streakDays: state.streakDays,
        longestStreak: state.longestStreak,
        hasVisitedMyMine: state.hasVisitedMyMine,
      }),
    },
  ),
);
