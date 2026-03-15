import { uid } from '@/lib/uid';
import type { SimSet, SimGet } from './types';

export function createAuthSlice(set: SimSet, get: SimGet) {
  return {
    register: (name: string, email: string) => {
      const now = get().simulationDate;
      set({
        user: {
          id: uid(),
          firstName: name,
          email,
          registeredAt: now,
          isLoggedIn: true,
          kycVerified: true,
        },
      });
      const state = get();
      set({
        activities: [
          {
            id: uid(),
            type: 'topup' as const,
            timestamp: now,
            title: 'Account created',
            description: `Welcome to AYNI Gold, ${name}!`,
          },
          ...state.activities,
        ],
      });

      // Track registration
      import('@/hooks/useAnalytics')
        .then(({ trackEvent }) => trackEvent('register', { name, email }))
        .catch(() => {});

      // Auto-create demo position for onboarding
      import('@/stores/onboardingStore')
        .then(({ useOnboardingStore }) => {
          const onb = useOnboardingStore.getState();
          if (!onb.demoPositionCreated) onb.createDemoPosition();
        })
        .catch(() => {});
    },

    login: (email: string) => {
      set((s) => ({
        user: s.user ? { ...s.user, isLoggedIn: true, email } : null,
      }));
    },

    logout: () => {
      set((s) => ({
        user: s.user ? { ...s.user, isLoggedIn: false } : null,
      }));
    },
  };
}
