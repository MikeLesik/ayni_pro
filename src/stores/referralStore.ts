import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '@/lib/uid';
import { useSimulationStore } from '@/stores/simulation';
import { trackEvent } from '@/hooks/useAnalytics';

const REFERRAL_BONUS_AYNI = 50;

export interface ReferralEvent {
  id: string;
  refereeEmail: string;
  timestamp: string;
  status: 'pending' | 'completed';
  bonusAyni: number;
}

interface ReferralState {
  referralCode: string;
  referralEvents: ReferralEvent[];
  totalReferrals: number;
  totalBonusEarned: number;

  generateCode: () => void;
  simulateReferral: (email: string) => void;
  reset: () => void;
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referralCode: '',
      referralEvents: [],
      totalReferrals: 0,
      totalBonusEarned: 0,

      generateCode: () => {
        if (get().referralCode) return;
        set({ referralCode: uid() + uid() });
      },

      simulateReferral: (email: string) => {
        const simDate = useSimulationStore.getState().simulationDate;

        const event: ReferralEvent = {
          id: uid(),
          refereeEmail: email,
          timestamp: simDate,
          status: 'completed',
          bonusAyni: REFERRAL_BONUS_AYNI,
        };

        set((s) => ({
          referralEvents: [event, ...s.referralEvents],
          totalReferrals: s.totalReferrals + 1,
          totalBonusEarned: s.totalBonusEarned + REFERRAL_BONUS_AYNI,
        }));
        trackEvent('referral_shared', { email });
      },

      reset: () =>
        set({
          referralCode: '',
          referralEvents: [],
          totalReferrals: 0,
          totalBonusEarned: 0,
        }),
    }),
    {
      name: 'ayni-referral',
      partialize: (s) => ({
        referralCode: s.referralCode,
        referralEvents: s.referralEvents,
        totalReferrals: s.totalReferrals,
        totalBonusEarned: s.totalBonusEarned,
      }),
    },
  ),
);

export { REFERRAL_BONUS_AYNI };
