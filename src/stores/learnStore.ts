import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSimulationStore } from '@/stores/simulation';
import { trackEvent } from '@/hooks/useAnalytics';

export interface LearnModule {
  id: string;
  type: 'article' | 'video' | 'quiz';
  reward: number;
}

export const LEARN_MODULES: LearnModule[] = [
  { id: 'how-it-works', type: 'video', reward: 10 },
  { id: 'first-investment', type: 'video', reward: 10 },
  { id: 'understanding-earnings', type: 'article', reward: 5 },
  { id: 'quiz-tokenomics', type: 'quiz', reward: 25 },
  { id: 'quiz-risk', type: 'quiz', reward: 25 },
];

export const TOTAL_POSSIBLE_AYNI = LEARN_MODULES.reduce((s, m) => s + m.reward, 0);

interface LearnState {
  completedModules: Record<string, string>;
  claimedRewards: Record<string, boolean>;
  totalEarnedAyni: number;
  showRewardToast: boolean;
  lastRewardAmount: number;

  completeModule: (id: string) => void;
  claimModuleReward: (id: string) => void;
  dismissRewardToast: () => void;
  isCompleted: (id: string) => boolean;
  isPendingClaim: (id: string) => boolean;
  getPendingTotal: () => number;
  claimAllPending: () => void;
  reset: () => void;
}

export const useLearnStore = create<LearnState>()(
  persist(
    (set, get) => ({
      completedModules: {},
      claimedRewards: {},
      totalEarnedAyni: 0,
      showRewardToast: false,
      lastRewardAmount: 0,

      completeModule: (id: string) => {
        if (get().completedModules[id]) return;
        const simDate = useSimulationStore.getState().simulationDate;
        set((s) => ({
          completedModules: { ...s.completedModules, [id]: simDate },
        }));
        trackEvent('learn_module_completed', { module: id });
      },

      claimModuleReward: (id: string) => {
        const state = get();
        if (!state.completedModules[id] || state.claimedRewards[id]) return;
        const mod = LEARN_MODULES.find((m) => m.id === id);
        if (!mod) return;

        set((s) => ({
          claimedRewards: { ...s.claimedRewards, [id]: true },
          totalEarnedAyni: s.totalEarnedAyni + mod.reward,
          showRewardToast: true,
          lastRewardAmount: mod.reward,
        }));
      },

      dismissRewardToast: () => set({ showRewardToast: false }),

      isCompleted: (id: string) => !!get().completedModules[id],

      isPendingClaim: (id: string) => {
        const s = get();
        return !!s.completedModules[id] && !s.claimedRewards[id];
      },

      getPendingTotal: () => {
        const s = get();
        return LEARN_MODULES.filter(
          (m) => s.completedModules[m.id] && !s.claimedRewards[m.id],
        ).reduce((sum, m) => sum + m.reward, 0);
      },

      claimAllPending: () => {
        const s = get();
        let totalClaimed = 0;
        const newClaimed = { ...s.claimedRewards };
        for (const mod of LEARN_MODULES) {
          if (s.completedModules[mod.id] && !s.claimedRewards[mod.id]) {
            newClaimed[mod.id] = true;
            totalClaimed += mod.reward;
          }
        }
        if (totalClaimed > 0) {
          set({
            claimedRewards: newClaimed,
            totalEarnedAyni: s.totalEarnedAyni + totalClaimed,
            showRewardToast: true,
            lastRewardAmount: totalClaimed,
          });
        }
      },

      reset: () =>
        set({
          completedModules: {},
          claimedRewards: {},
          totalEarnedAyni: 0,
          showRewardToast: false,
          lastRewardAmount: 0,
        }),
    }),
    {
      name: 'ayni-learn',
      partialize: (s) => ({
        completedModules: s.completedModules,
        claimedRewards: s.claimedRewards,
        totalEarnedAyni: s.totalEarnedAyni,
      }),
    },
  ),
);
