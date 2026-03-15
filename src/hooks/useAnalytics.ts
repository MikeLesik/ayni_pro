import { useAnalyticsStore, type AnalyticsEventType } from '@/stores/analyticsStore';

export function useAnalytics() {
  const track = useAnalyticsStore((s) => s.track);
  return { track };
}

/** Standalone track function for use outside React components (stores, services) */
export function trackEvent(
  type: AnalyticsEventType,
  properties?: Record<string, string | number | boolean>,
) {
  useAnalyticsStore.getState().track(type, properties);
}
