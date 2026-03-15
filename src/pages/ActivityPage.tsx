import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardList, Download } from 'lucide-react';
import { AnimatedPage } from '@/components/ui/AnimatedPage';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ContextualHint } from '@/components/onboarding/ContextualHint';
import { ActivityFilterBar } from '@/components/activity/ActivityFilterBar';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { useActivity } from '@/hooks/useActivity';
import { useTranslation } from '@/i18n';
import { exportCsv } from '@/lib/exportCsv';
import type { ActivityFilter } from '@/types/activity';

function ActivitySkeletons() {
  return (
    <div className="flex flex-col gap-3 mt-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <SkeletonLoader variant="avatar" width="32px" height="32px" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonLoader variant="text" width="180px" />
            <SkeletonLoader variant="text" width="120px" />
          </div>
          <SkeletonLoader variant="number" width="60px" height="20px" />
        </div>
      ))}
    </div>
  );
}

export default function ActivityPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('filter') as ActivityFilter) || 'all';
  const [filter, setFilter] = useState<ActivityFilter>(initialFilter);
  const { data, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useActivity(filter);

  const allEvents = useMemo(() => data?.pages.flatMap((p) => p.events) ?? [], [data]);

  const handleExport = useCallback(() => {
    if (allEvents.length > 0) exportCsv(allEvents);
  }, [allEvents]);

  if (isLoading) {
    return (
      <AnimatedPage className="flex flex-col gap-3 max-w-[720px] mx-auto">
        <div className="pt-1 md:pt-6">
          <h1 className="font-display text-xl md:text-2xl text-text-primary">
            {t('activity.page.title')}
          </h1>
        </div>
        <div className="sticky top-0 lg:top-16 z-10 bg-surface-bg -mx-4 px-4 md:mx-0 md:px-0 py-2">
          <ActivityFilterBar activeFilter={filter} onChange={setFilter} />
        </div>
        <ActivitySkeletons />
      </AnimatedPage>
    );
  }

  if (isError) {
    return (
      <AnimatedPage className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-body-lg text-text-secondary">{t('activity.page.errorMessage')}</p>
        <Button variant="primary" onClick={() => refetch()}>
          {t('common.retry')}
        </Button>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex flex-col gap-3 max-w-[720px] mx-auto">
      <div className="pt-1 md:pt-6 flex items-center justify-between">
        <ContextualHint id="hint-activity" text={t('activity.page.hint')} position="bottom">
          <h1 className="font-display text-xl md:text-2xl text-text-primary">
            {t('activity.page.title')}
          </h1>
        </ContextualHint>

        {allEvents.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download size={14} />}
            aria-label={t('activity.page.downloadCsv')}
          >
            <span className="hidden sm:inline">{t('activity.page.downloadCsv')}</span>
          </Button>
        )}
      </div>

      <div className="sticky top-0 lg:top-16 z-10 bg-surface-bg -mx-4 px-4 md:mx-0 md:px-0 py-2">
        <ActivityFilterBar activeFilter={filter} onChange={setFilter} />
      </div>

      {allEvents.length === 0 ? (
        <EmptyState
          illustration={<ClipboardList size={48} className="text-text-muted" />}
          title={t('activity.page.emptyTitle')}
          description={t('activity.page.emptyDescription')}
        />
      ) : (
        <ActivityFeed
          events={allEvents}
          hasMore={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      )}
    </AnimatedPage>
  );
}
