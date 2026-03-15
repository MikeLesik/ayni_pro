import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSimulationStore } from '@/stores/simulation';

interface OnboardingState {
  carouselCompleted: boolean;
  hintsShown: Record<string, boolean>;
  demoPositionCreated: boolean;
  demoPositionCreatedAt: string | null;
  demoPositionDismissed: boolean;
  completeCarousel: () => void;
  markHintShown: (id: string) => void;
  isHintShown: (id: string) => boolean;
  createDemoPosition: () => void;
  dismissDemoPosition: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      carouselCompleted: false,
      hintsShown: {},
      demoPositionCreated: false,
      demoPositionCreatedAt: null,
      demoPositionDismissed: false,

      completeCarousel: () => set({ carouselCompleted: true }),

      markHintShown: (id) =>
        set((state) => ({
          hintsShown: { ...state.hintsShown, [id]: true },
        })),

      isHintShown: (id) => !!get().hintsShown[id],

      createDemoPosition: () =>
        set({
          demoPositionCreated: true,
          demoPositionCreatedAt: useSimulationStore.getState().simulationDate,
        }),

      dismissDemoPosition: () => set({ demoPositionDismissed: true }),

      resetOnboarding: () =>
        set({
          carouselCompleted: false,
          hintsShown: {},
          demoPositionCreated: false,
          demoPositionCreatedAt: null,
          demoPositionDismissed: false,
        }),
    }),
    {
      name: 'ayni-onboarding',
      partialize: (state) => ({
        carouselCompleted: state.carouselCompleted,
        hintsShown: state.hintsShown,
        demoPositionCreated: state.demoPositionCreated,
        demoPositionCreatedAt: state.demoPositionCreatedAt,
        demoPositionDismissed: state.demoPositionDismissed,
      }),
    },
  ),
);
