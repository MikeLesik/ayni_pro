import { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ActivityGroup } from './ActivityGroup';
import { useTranslation } from '@/i18n';
import { useSimulationStore } from '@/stores/simulation';
import type { ActivityEvent } from '@/types/activity';

const LOCALE_MAP: Record<string, string> = { en: 'en-US', es: 'es-ES', ru: 'ru-RU' };

interface DateLabels {
  today: string;
  yesterday: string;
  thisWeek: string;
  lastWeek: string;
}

/**
 * Bucket events into date groups: Today, Yesterday, This week, Last week, or month name.
 * Uses referenceDate (simulation date) instead of real clock.
 */
function groupByDate(
  events: ActivityEvent[],
  labels: DateLabels,
  referenceDate: Date,
  locale: string = 'en-US',
) {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - today.getDay()); // Sunday
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const groups: { label: string; events: ActivityEvent[] }[] = [];
  const map = new Map<string, ActivityEvent[]>();

  for (const event of events) {
    const d = new Date(event.timestamp);
    const eventDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let label: string;
    if (eventDay.getTime() === today.getTime()) {
      label = labels.today;
    } else if (eventDay.getTime() === yesterday.getTime()) {
      label = labels.yesterday;
    } else if (eventDay >= weekStart) {
      label = labels.thisWeek;
    } else if (eventDay >= lastWeekStart) {
      label = labels.lastWeek;
    } else {
      label = d.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
      });
    }

    const existing = map.get(label);
    if (existing) {
      existing.push(event);
    } else {
      const arr = [event];
      map.set(label, arr);
      groups.push({ label, events: arr });
    }
  }

  return groups;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  hasMore: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function ActivityFeed({
  events,
  hasMore,
  isFetchingNextPage,
  onLoadMore,
}: ActivityFeedProps) {
  const { t, language } = useTranslation();
  const sentinelRef = useRef<HTMLButtonElement | null>(null);
  const simulationDate = useSimulationStore((s) => s.simulationDate);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry?.isIntersecting && hasMore && !isFetchingNextPage) {
        onLoadMore();
      }
    },
    [hasMore, isFetchingNextPage, onLoadMore],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '100px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const dateLabels: DateLabels = {
    today: t('activity.dateGroup.today'),
    yesterday: t('activity.dateGroup.yesterday'),
    thisWeek: t('activity.dateGroup.thisWeek'),
    lastWeek: t('activity.dateGroup.lastWeek'),
  };
  const groups = groupByDate(
    events,
    dateLabels,
    new Date(simulationDate),
    LOCALE_MAP[language] ?? 'en-US',
  );

  return (
    <div>
      {groups.map((group, i) => (
        <ActivityGroup
          key={group.label}
          label={group.label}
          events={group.events}
          isFirst={i === 0}
        />
      ))}

      {hasMore && (
        <Button
          ref={sentinelRef}
          variant="text"
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
          fullWidth
          className="mt-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          {isFetchingNextPage ? (
            <Loader2 size={18} className="animate-spin mx-auto" />
          ) : (
            t('activity.loadMore')
          )}
        </Button>
      )}
    </div>
  );
}
