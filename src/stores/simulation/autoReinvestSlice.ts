import type { SimSet, SimGet } from './types';

export function createAutoReinvestSlice(set: SimSet, _get: SimGet) {
  return {
    autoReinvestEnabled: false,
    autoReinvestTermMonths: 12,
    positionAutoReinvest: {} as Record<string, boolean>,

    setAutoReinvest: (enabled: boolean) => set({ autoReinvestEnabled: enabled }),
    setAutoReinvestTerm: (months: number) => set({ autoReinvestTermMonths: months }),
    setPositionAutoReinvest: (positionId: string, enabled: boolean) =>
      set((s) => ({
        positionAutoReinvest: { ...s.positionAutoReinvest, [positionId]: enabled },
      })),
  };
}
