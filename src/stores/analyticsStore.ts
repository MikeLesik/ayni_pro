import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '@/lib/uid';

const MAX_EVENTS = 500;

export type AnalyticsEventType =
  | 'page_view'
  | 'cta_click'
  | 'register'
  | 'login'
  | 'position_created'
  | 'checkout_started'
  | 'checkout_completed'
  | 'claim_rewards'
  | 'referral_shared'
  | 'learn_module_completed'
  | 'quiz_completed'
  | 'auto_reinvest_toggled';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  properties: Record<string, string | number | boolean>;
  page: string;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  track: (type: AnalyticsEventType, properties?: Record<string, string | number | boolean>) => void;
  clearEvents: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      events: [],

      track: (type, properties = {}) => {
        const event: AnalyticsEvent = {
          id: uid(),
          type,
          timestamp: new Date().toISOString(),
          properties,
          page: typeof window !== 'undefined' ? window.location.pathname : '',
        };

        set((s) => ({
          events: [event, ...s.events].slice(0, MAX_EVENTS),
        }));
      },

      clearEvents: () => set({ events: [] }),
    }),
    {
      name: 'ayni-analytics',
      partialize: (s) => ({ events: s.events }),
    },
  ),
);
