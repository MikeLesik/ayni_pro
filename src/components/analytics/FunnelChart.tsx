import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAnalyticsStore } from '@/stores/analyticsStore';

const FUNNEL_STEPS = [
  { type: 'register', label: 'Register' },
  { type: 'page_view', label: 'View Participate Page', filter: (p: Record<string, string | number | boolean>) => p.page === 'participate' },
  { type: 'cta_click', label: 'Click Earn CTA' },
  { type: 'position_created', label: 'Create Position' },
] as const;

export function FunnelChart() {
  const events = useAnalyticsStore((s) => s.events);

  const funnelData = useMemo(() => {
    return FUNNEL_STEPS.map((step) => {
      const count = events.filter((e) => {
        if (e.type !== step.type) return false;
        if ('filter' in step && step.filter) return step.filter(e.properties);
        return true;
      }).length;
      return { label: step.label, count };
    });
  }, [events]);

  const maxCount = Math.max(1, ...funnelData.map((d) => d.count));

  return (
    <Card variant="stat" className="p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Conversion Funnel</h3>
      <div className="space-y-3">
        {funnelData.map((step, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-secondary">{step.label}</span>
              <span className="text-xs font-medium text-text-primary">{step.count}</span>
            </div>
            <ProgressBar percent={(step.count / maxCount) * 100} height={8} animated={false} />
          </div>
        ))}
      </div>
    </Card>
  );
}
