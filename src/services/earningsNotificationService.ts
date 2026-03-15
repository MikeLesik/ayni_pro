import { useNotificationStore } from '@/stores/notificationStore';
import { useUiStore } from '@/stores/uiStore';
import { useSimulationStore } from '@/stores/simulation';
import { formatCurrency } from '@/lib/formatters';

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export function sendDailyEarningsSummary(): void {
  const ui = useUiStore.getState();
  if (!ui.notifyDailyEarnings) return;

  const sim = useSimulationStore.getState();
  const positions = sim.positions.filter((p) => p.status === 'active');

  let todayTotal = 0;
  let todayGrams = 0;

  for (const pos of positions) {
    if (pos.dailyRewards.length > 0) {
      const last = pos.dailyRewards[pos.dailyRewards.length - 1]!;
      todayTotal += last.netRewardUsd;
      todayGrams += last.netRewardGrams;
    }
  }

  if (todayTotal > 0) {
    useNotificationStore.getState().addNotification({
      type: 'daily_earnings_summary',
      message: `Your positions earned ${formatCurrency(todayTotal)} (${todayGrams.toFixed(4)}g) in gold today`,
      params: { amount: todayTotal, grams: todayGrams },
    });
  }
}

export function sendStreakNotification(streakDays: number): void {
  const ui = useUiStore.getState();
  if (!ui.notifyStreaks) return;

  if (STREAK_MILESTONES.includes(streakDays)) {
    useNotificationStore.getState().addNotification({
      type: 'streak_milestone',
      message: `${streakDays}-day streak! Your mine is thriving`,
      params: { days: streakDays },
    });
  }
}

export function sendPriceAlert(changePercent: number, portfolioGrowthUsd: number): void {
  const ui = useUiStore.getState();
  if (!ui.notifyPriceAlerts) return;
  if (Math.abs(changePercent) < 2) return;

  const direction = changePercent > 0 ? 'up' : 'down';
  const verb = changePercent > 0 ? 'grew' : 'changed';

  useNotificationStore.getState().addNotification({
    type: 'price_alert',
    message: `Gold price ${direction} ${Math.abs(changePercent).toFixed(1)}% — your portfolio ${verb} by ${formatCurrency(Math.abs(portfolioGrowthUsd))}`,
    params: { change: changePercent, growth: portfolioGrowthUsd },
  });
}
