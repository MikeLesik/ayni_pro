// ═══════════════════════════════════════════════════════════════
// AYNI GOLD — Distribution Store
// Zustand store for quarterly payout model
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { useSimulationStore } from '@/stores/simulation';
import { calculateRawTier } from '@/lib/calculateTier';
import { TIER_CONFIG } from '@/lib/tierConfig';
import {
  generateAccrualHistory,
  sumAccrualsForQuarter,
  buildQuarterlyPayouts,
} from '@/services/simulation/distributionEngine';
import type {
  DailyAccrual,
  DistributionState,
  QuarterlyPayout,
  QuarterlyPeriod,
} from '@/types/distributions';

// ── Store Interface ─────────────────────────────────────────

interface DistributionStore {
  distributionState: DistributionState | null;
  isLoading: boolean;

  // Computed getters
  getAccruedThisQuarter: () => { paxg: number; usd: number; goldGrams: number };
  getClaimableBalance: () => { paxg: number; usd: number };
  getTotalAccrued: () => { paxg: number; usd: number; goldGrams: number };
  getNextPayoutInfo: () => {
    date: string;
    daysRemaining: number;
    estimatedUsd: number;
    progressPercent: number;
    quarterLabel: string;
  };
  getDailyAccruals: (limit?: number) => DailyAccrual[];
  getQuarterlyHistory: () => QuarterlyPayout[];
  getCurrentQuarter: () => QuarterlyPeriod | null;
  hasHadPayout: () => boolean;

  // Actions
  initialize: () => void;
  refresh: () => void;
}

// ── Store ───────────────────────────────────────────────────

export const useDistributionStore = create<DistributionStore>()((set, get) => ({
  distributionState: null,
  isLoading: false,

  initialize: () => {
    get().refresh();
  },

  refresh: () => {
    set({ isLoading: true });

    const simState = useSimulationStore.getState();
    const positions = simState.positions.filter(
      (p) => p.status === 'active' || p.status === 'completed',
    );

    if (positions.length === 0) {
      set({
        distributionState: null,
        isLoading: false,
      });
      return;
    }

    const currentDate = new Date(simState.simulationDate);
    const goldPricePerGram = simState.prices.goldPerGram;
    const paxgPrice = simState.prices.paxgUsd;

    // Compute tier discount from current state
    const lockedAYNI = simState.balances.ayniActivated;
    const activePos = positions.filter((p) => p.status === 'active');
    let participationMonths = 0;
    if (activePos.length > 0) {
      const oldest = activePos.reduce((a, b) =>
        new Date(a.startDate) < new Date(b.startDate) ? a : b,
      );
      const diff = currentDate.getTime() - new Date(oldest.startDate).getTime();
      participationMonths = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
    }
    const tierDiscount = TIER_CONFIG[calculateRawTier(lockedAYNI, participationMonths)].successFeeDiscount;

    // Generate accrual history for all positions
    let allAccruals: DailyAccrual[] = [];
    let allQuarters: QuarterlyPeriod[] = [];

    for (const pos of positions) {
      const { accruals, quarters } = generateAccrualHistory(
        pos,
        currentDate,
        goldPricePerGram,
        paxgPrice,
        tierDiscount,
      );
      allAccruals = allAccruals.concat(accruals);
      allQuarters = allQuarters.concat(quarters);
    }

    // Sort accruals by date descending (most recent first)
    allAccruals.sort((a, b) => b.date.localeCompare(a.date));

    // Find current accruing quarter (earliest one that's still accruing)
    const accruingQuarters = allQuarters.filter((q) => q.status === 'accruing');
    const currentQuarter = accruingQuarters.sort((a, b) =>
      a.startDate.localeCompare(b.startDate),
    )[0];

    // Sum accruals for current quarter
    const accruingTotals = { totalGoldGrams: 0, totalPaxg: 0, totalUsd: 0, days: 0 };
    if (currentQuarter) {
      // Sum across all accruing quarters
      for (const q of accruingQuarters) {
        const sums = sumAccrualsForQuarter(allAccruals, q.id);
        accruingTotals.totalGoldGrams += sums.totalGoldGrams;
        accruingTotals.totalPaxg += sums.totalPaxg;
        accruingTotals.totalUsd += sums.totalUsd;
        accruingTotals.days += sums.days;
      }
    }

    // Quarterly payouts from completed quarters
    const quarterlyPayouts = buildQuarterlyPayouts(allAccruals, allQuarters);

    // Claimable PAXG: paxgBalance minus what's still accruing in the current quarter.
    // Use simulation store ground truth (not distribution engine recalculation) to avoid drift.
    // For each ACTIVE position: totalDistributedPaxg − distributedAtLastPayout = current-quarter accrual.
    // Completed positions have no accruing portion — all their PAXG is claimable.
    const accruingPaxg = simState.positions
      .filter((p) => p.status === 'active')
      .reduce((sum, pos) => {
        const distributed = pos.totalDistributedPaxg ?? 0;
        const lastPayout = pos.distributedAtLastPayout ?? 0;
        return sum + (distributed - lastPayout);
      }, 0);
    const claimablePaxg = Math.max(0, simState.balances.paxgBalance - accruingPaxg);

    const withdrawnPaxg = simState.balances.paxgClaimed ?? 0;
    const withdrawnUsd = withdrawnPaxg * paxgPrice;

    // Total accrued all time
    const totalAccruedGoldGrams = allAccruals.reduce((s, a) => s + a.netGoldGrams, 0);
    const totalAccruedPaxg = allAccruals.reduce((s, a) => s + a.netPaxg, 0);
    const totalAccruedUsd = allAccruals.reduce((s, a) => s + a.netUsd, 0);

    // Calculate total days in current quarter
    let totalDaysInQuarter = 90;
    if (currentQuarter) {
      const qStart = new Date(currentQuarter.startDate);
      const qEnd = new Date(currentQuarter.endDate);
      totalDaysInQuarter =
        Math.round((qEnd.getTime() - qStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    const state: DistributionState = {
      accruing: {
        quarterId: currentQuarter?.id ?? '',
        totalGoldGrams: accruingTotals.totalGoldGrams,
        totalPaxg: accruingTotals.totalPaxg,
        totalUsd: accruingTotals.totalUsd,
        daysInQuarter: accruingTotals.days,
        totalDaysInQuarter,
        startDate: currentQuarter?.startDate ?? '',
        endDate: currentQuarter?.endDate ?? '',
        estimatedPayoutDate: currentQuarter?.payoutDate ?? '',
      },
      claimable: {
        totalPaxg: claimablePaxg,
        totalGoldGrams: claimablePaxg * 31.1035,
        totalUsd: claimablePaxg * paxgPrice,
      },
      withdrawn: {
        totalPaxg: withdrawnPaxg,
        totalUsd: withdrawnUsd,
      },
      quarterlyPayouts,
      dailyAccruals: allAccruals,
      quarters: allQuarters,
      totalAccruedAllTime: {
        totalGoldGrams: totalAccruedGoldGrams,
        totalPaxg: totalAccruedPaxg,
        totalUsd: totalAccruedUsd,
      },
    };

    set({ distributionState: state, isLoading: false });
  },

  // ── Getters ──────────────────────────────────────────────

  getAccruedThisQuarter: () => {
    const state = get().distributionState;
    if (!state) return { paxg: 0, usd: 0, goldGrams: 0 };
    return {
      paxg: state.accruing.totalPaxg,
      usd: state.accruing.totalUsd,
      goldGrams: state.accruing.totalGoldGrams,
    };
  },

  getClaimableBalance: () => {
    const state = get().distributionState;
    if (!state) return { paxg: 0, usd: 0 };
    return {
      paxg: state.claimable.totalPaxg,
      usd: state.claimable.totalUsd,
    };
  },

  getTotalAccrued: () => {
    const state = get().distributionState;
    if (!state) return { paxg: 0, usd: 0, goldGrams: 0 };
    return {
      paxg: state.totalAccruedAllTime.totalPaxg,
      usd: state.totalAccruedAllTime.totalUsd,
      goldGrams: state.totalAccruedAllTime.totalGoldGrams,
    };
  },

  getNextPayoutInfo: () => {
    const state = get().distributionState;
    if (!state || !state.accruing.estimatedPayoutDate) {
      return { date: '', daysRemaining: 0, estimatedUsd: 0, progressPercent: 0, quarterLabel: '' };
    }

    const simDate = new Date(useSimulationStore.getState().simulationDate);
    const payoutDate = new Date(state.accruing.estimatedPayoutDate);
    const daysRemaining = Math.max(
      0,
      Math.ceil((payoutDate.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24)),
    );

    // Calculate progress from actual dates, not accrual record counts
    // (accrual counts are per-position and inflate with multiple positions)
    const qStart = new Date(state.accruing.startDate);
    const qEnd = new Date(state.accruing.endDate);
    const totalDays = Math.max(
      1,
      Math.round((qEnd.getTime() - qStart.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const elapsedDays = Math.max(
      0,
      Math.round((simDate.getTime() - qStart.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

    // Estimate: extrapolate current accrual rate to end of quarter
    const dailyAvg =
      state.accruing.daysInQuarter > 0 ? state.accruing.totalUsd / state.accruing.daysInQuarter : 0;
    const estimatedUsd = dailyAvg * state.accruing.totalDaysInQuarter;

    // Find the quarter label
    const quarter = state.quarters.find((q) => q.id === state.accruing.quarterId);
    const quarterLabel = quarter ? `Q${quarter.quarterNumber}` : '';

    return {
      date: state.accruing.estimatedPayoutDate,
      daysRemaining,
      estimatedUsd,
      progressPercent,
      quarterLabel,
    };
  },

  getDailyAccruals: (days = 7) => {
    const state = get().distributionState;
    if (!state) return [];
    // Accruals are sorted descending by date. Multiple positions produce
    // multiple entries per day, so we need to slice enough raw entries
    // to cover the requested number of *days*.
    const posCount = Math.max(
      1,
      useSimulationStore.getState().positions.filter((p) => p.status === 'active').length,
    );
    return state.dailyAccruals.slice(0, days * posCount);
  },

  getQuarterlyHistory: () => {
    const state = get().distributionState;
    if (!state) return [];
    return state.quarterlyPayouts;
  },

  getCurrentQuarter: () => {
    const state = get().distributionState;
    if (!state) return null;
    return state.quarters.find((q) => q.status === 'accruing') ?? null;
  },

  hasHadPayout: () => {
    const state = get().distributionState;
    if (!state) return false;
    return state.quarterlyPayouts.length > 0;
  },
}));
