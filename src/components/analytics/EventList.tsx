import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { useAnalyticsStore, type AnalyticsEventType } from '@/stores/analyticsStore';

export function EventList() {
  const events = useAnalyticsStore((s) => s.events);
  const [filter, setFilter] = useState<AnalyticsEventType | ''>('');

  const filtered = useMemo(() => {
    const list = filter ? events.filter((e) => e.type === filter) : events;
    return list.slice(0, 50);
  }, [events, filter]);

  const eventTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.type));
    return [...types].sort();
  }, [events]);

  return (
    <Card variant="stat" className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Recent Events ({filtered.length})
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as AnalyticsEventType | '')}
          className="text-xs bg-surface-secondary border border-border-light rounded-md px-2 py-1 text-text-primary"
        >
          <option value="">All types</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-6">No events recorded yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-light text-text-muted">
                <th className="text-left py-2 pr-3 font-medium">Type</th>
                <th className="text-left py-2 pr-3 font-medium">Page</th>
                <th className="text-left py-2 pr-3 font-medium">Properties</th>
                <th className="text-left py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map((event) => (
                <tr key={event.id}>
                  <td className="py-2 pr-3">
                    <span className="inline-block bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
                      {event.type}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-text-secondary">{event.page}</td>
                  <td className="py-2 pr-3 text-text-muted max-w-[200px] truncate">
                    {Object.keys(event.properties).length > 0
                      ? JSON.stringify(event.properties)
                      : '—'}
                  </td>
                  <td className="py-2 text-text-muted whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
