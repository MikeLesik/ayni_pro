import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { EventCounts } from '@/components/analytics/EventCounts';
import { FunnelChart } from '@/components/analytics/FunnelChart';
import { EventList } from '@/components/analytics/EventList';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { useErrorStore } from '@/stores/errorStore';
import { BarChart3, AlertTriangle, Activity, Trash2 } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const totalEvents = useAnalyticsStore((s) => s.events.length);
  const clearEvents = useAnalyticsStore((s) => s.clearEvents);
  const totalErrors = useErrorStore((s) => s.errors.length);
  const clearErrors = useErrorStore((s) => s.clearErrors);
  const uniqueTypes = useAnalyticsStore(
    (s) => new Set(s.events.map((e) => e.type)).size,
  );

  return (
    <div className="max-w-[960px] mx-auto pt-6 pb-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Analytics Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Mock event tracking & error monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={clearEvents}>
            <Trash2 size={14} className="mr-1" />
            Clear Events
          </Button>
          <Button variant="ghost" size="sm" onClick={clearErrors}>
            <Trash2 size={14} className="mr-1" />
            Clear Errors
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Activity size={16} />}
          iconColor="text-primary"
          label="Total Events"
          value={String(totalEvents)}
        />
        <StatCard
          icon={<BarChart3 size={16} />}
          iconColor="text-info"
          label="Unique Types"
          value={String(uniqueTypes)}
        />
        <StatCard
          icon={<AlertTriangle size={16} />}
          iconColor="text-warning"
          label="Errors Captured"
          value={String(totalErrors)}
          trend={totalErrors > 0 ? 'warning' : undefined}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FunnelChart />
        <EventCounts />
      </div>

      <EventList />
    </div>
  );
}
