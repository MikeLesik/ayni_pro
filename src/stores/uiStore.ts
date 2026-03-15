import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types/theme';

export type DisplayCurrency = 'usd' | 'ayni' | 'both';
export type Language = 'en' | 'es' | 'ru';
export type MineViewMode = 'visual' | 'data';

interface UiState {
  theme: ThemeMode;
  advancedView: boolean;
  miningDetailsExpanded: boolean;
  displayCurrency: DisplayCurrency;
  language: Language;
  mineViewMode: MineViewMode;
  showGamification: boolean;
  browserNotificationsEnabled: boolean;
  notifyDailyEarnings: boolean;
  notifyStreaks: boolean;
  notifyPriceAlerts: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleAdvancedView: () => void;
  toggleMiningDetails: () => void;
  setDisplayCurrency: (currency: DisplayCurrency) => void;
  setLanguage: (language: Language) => void;
  setMineViewMode: (mode: MineViewMode) => void;
  setShowGamification: (v: boolean) => void;
  setBrowserNotificationsEnabled: (v: boolean) => void;
  setNotifyDailyEarnings: (v: boolean) => void;
  setNotifyStreaks: (v: boolean) => void;
  setNotifyPriceAlerts: (v: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'system',
      advancedView: false,
      miningDetailsExpanded: false,
      displayCurrency: 'usd',
      language: 'en',
      mineViewMode: 'data',
      showGamification: false,
      browserNotificationsEnabled: false,
      notifyDailyEarnings: true,
      notifyStreaks: true,
      notifyPriceAlerts: true,
      setTheme: (theme) => set({ theme }),
      toggleAdvancedView: () => set((s) => ({ advancedView: !s.advancedView })),
      toggleMiningDetails: () => set((s) => ({ miningDetailsExpanded: !s.miningDetailsExpanded })),
      setDisplayCurrency: (displayCurrency) => set({ displayCurrency }),
      setLanguage: (language) => set({ language }),
      setMineViewMode: (mineViewMode) => set({ mineViewMode }),
      setShowGamification: (showGamification) => set({ showGamification }),
      setBrowserNotificationsEnabled: (browserNotificationsEnabled) =>
        set({ browserNotificationsEnabled }),
      setNotifyDailyEarnings: (notifyDailyEarnings) => set({ notifyDailyEarnings }),
      setNotifyStreaks: (notifyStreaks) => set({ notifyStreaks }),
      setNotifyPriceAlerts: (notifyPriceAlerts) => set({ notifyPriceAlerts }),
    }),
    {
      name: 'ayni-ui',
      partialize: (state) => ({
        theme: state.theme,
        advancedView: state.advancedView,
        miningDetailsExpanded: state.miningDetailsExpanded,
        displayCurrency: state.displayCurrency,
        language: state.language,
        mineViewMode: state.mineViewMode,
        showGamification: state.showGamification,
        browserNotificationsEnabled: state.browserNotificationsEnabled,
        notifyDailyEarnings: state.notifyDailyEarnings,
        notifyStreaks: state.notifyStreaks,
        notifyPriceAlerts: state.notifyPriceAlerts,
      }),
    },
  ),
);
