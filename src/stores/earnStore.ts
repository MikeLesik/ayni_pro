import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EarnState {
  amount: number;
  termMonths: number;
  autoActivate: boolean;
  setAmount: (amount: number) => void;
  setTermMonths: (months: number) => void;
  setAutoActivate: (auto: boolean) => void;
  reset: () => void;
}

const initialState = {
  amount: 500,
  termMonths: 12,
  autoActivate: true,
};

export const useEarnStore = create<EarnState>()(
  persist(
    (set) => ({
      ...initialState,
      setAmount: (amount) => set({ amount }),
      setTermMonths: (months) => set({ termMonths: months }),
      setAutoActivate: (auto) => set({ autoActivate: auto }),
      reset: () => set(initialState),
    }),
    {
      name: 'ayni-earn',
      partialize: (state) => ({
        amount: state.amount,
        termMonths: state.termMonths,
        autoActivate: state.autoActivate,
      }),
    },
  ),
);
