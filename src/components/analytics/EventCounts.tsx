import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '@/components/ui/Card';
import { useAnalyticsStore, type AnalyticsEventType } from '@/stores/analyticsStore';

export function EventCounts() {
  const events = useAnalyticsStore((s) => s.events);

  const chartData = useMemo(() => {
    const counts = new Map<AnalyticsEventType, number>();
    for (const e of events) {
      counts.set(e.type, (counts.get(e.type) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  if (chartData.length === 0) {
    return (
      <Card variant="stat" className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Events by Type</h3>
        <p className="text-sm text-text-muted text-center py-6">No events recorded yet</p>
      </Card>
    );
  }

  return (
    <Card variant="stat" className="p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Events by Type</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border-light)" />
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
          <YAxis type="category" dataKey="type" tick={{ fontSize: 10 }} stroke="var(--color-text-muted)" width={80} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 8,
            }}
          />
          <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
