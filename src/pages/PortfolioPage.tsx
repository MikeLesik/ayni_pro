import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PieChart, Download, ClipboardList } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { ContextualHint } from '@/components/onboarding/ContextualHint';
import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview';
import { PositionTabs } from '@/components/portfolio/PositionTabs';
import { AdvancedToggle } from '@/components/portfolio/AdvancedToggle';
import { ReinvestModal } from '@/components/portfolio/ReinvestModal';
import { WithdrawModal } from '@/components/portfolio/WithdrawModal';
import { StakeModal } from '@/components/portfolio/StakeModal';
import { SellAyniModal } from '@/components/portfolio/SellAyniModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/Button';
import { ActivityFilterBar } from '@/components/activity/ActivityFilterBar';
import { ActivityFeed } from '@/components/activity/ActivityFeed';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useActivity } from '@/hooks/useActivity';
import { useSimulationStore } from '@/stores/simulation';
import { useTranslation } from '@/i18n';
import { exportCsv } from '@/lib/exportCsv';
import { ContributorStatus } from '@/components/portfolio/ContributorStatus';
import type { ActivityFilter } from '@/types/activity';

/* ── History tab content ── */
function HistoryTabContent() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useActivity(filter);

  const allEvents = useMemo(() => data?.pages.flatMap((p) => p.events) ?? [], [data]);

  const handleExport = useCallback(() => {
    if (allEvents.length > 0) exportCsv(allEvents);
  }, [allEvents]);

  if (isLoading) {
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

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 lg:top-16 z-10 bg-surface-bg py-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <ActivityFilterBar activeFilter={filter} onChange={setFilter} />
          </div>
          {allEvents.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              leftIcon={<Download size={14} />}
              className="shrink-0"
            >
              CSV
            </Button>
          )}
        </div>
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
    </div>
  );
}

/* ── Portfolio page ── */
export default function PortfolioPage() {
  const { data, isLoading } = usePortfolio();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showReinvest, setShowReinvest] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawDefaultTab, setWithdrawDefaultTab] = useState<'paxg' | 'ayni'>('paxg');
  const [showStake, setShowStake] = useState(false);
  const [showSellAyni, setShowSellAyni] = useState(false);
  const { t } = useTranslation();

  const { balances, prices } = useSimulationStore();

  const pageTab = searchParams.get('tab') || 'positions';

  const pageTabs = [
    { id: 'positions', label: t('nav.portfolio') },
    { id: 'history', label: t('portfolio.positionTabs.history') },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 pt-8">
        <SkeletonLoader variant="heading" />
        <div className="flex flex-col gap-4 lg:flex-row">
          <SkeletonLoader variant="card" className="flex-1" height="160px" />
          <SkeletonLoader variant="card" className="flex-1" height="160px" />
        </div>
        <SkeletonLoader variant="card" height="200px" />
        <SkeletonLoader variant="card" height="200px" />
      </div>
    );
  }

  const isEmpty = !data || data.positions.length === 0;

  return (
    <div className="space-y-3 pt-6">
      <ContextualHint id="hint-portfolio" text={t('portfolio.page.hint')} position="bottom">
        <h1 className="font-display text-heading-1 text-text-primary text-center sm:text-left">
          {t('portfolio.page.title')}
        </h1>
      </ContextualHint>

      {/* Page-level tabs: Positions | History */}
      <Tabs
        items={pageTabs}
        activeId={pageTab}
        onChange={(id) => setSearchParams({ tab: id })}
        variant="underline"
        size="md"
      />

      {pageTab === 'positions' ? (
        isEmpty ? (
          <EmptyState
            illustration={<PieChart size={48} className="text-text-muted" />}
            title={t('portfolio.page.emptyTitle')}
            description={t('portfolio.page.emptyDescription')}
            ctaLabel={t('portfolio.page.emptyCta')}
            onCtaClick={() => navigate('/participate')}
            className="mt-4"
          />
        ) : (
          <>
            <PortfolioOverview
              summary={data!.summary}
              onWithdraw={(tab) => {
                setWithdrawDefaultTab(tab || 'paxg');
                setShowWithdraw(true);
              }}
              onReinvest={() => setShowReinvest(true)}
              onStake={() => setShowStake(true)}
              onSellAyni={() => setShowSellAyni(true)}
            />

            <PositionTabs
              positions={data!.positions}
              onWithdraw={() => setShowWithdraw(true)}
              className="mt-4"
            />

            <AdvancedToggle />

            {/* Contributor Status */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                {t('contributorStatus.title')}
              </h2>
              <ContributorStatus />
            </div>
          </>
        )
      ) : (
        <HistoryTabContent />
      )}

      {/* Modals */}
      <ReinvestModal
        open={showReinvest}
        onClose={() => setShowReinvest(false)}
        paxgBalance={balances.paxgBalance}
        prices={{
          paxgUsd: prices.paxgUsd,
          ayniUsd: prices.ayniUsd,
          goldPerGram: prices.goldPerGram,
        }}
      />
      <WithdrawModal
        open={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        ayniAvailable={balances.ayniAvailable}
        paxgBalance={balances.paxgBalance}
        prices={{
          paxgUsd: prices.paxgUsd,
          ayniUsd: prices.ayniUsd,
        }}
        defaultTab={withdrawDefaultTab}
        walletAddress={data?.positions[0]?.walletAddress}
      />
      <StakeModal
        open={showStake}
        onClose={() => setShowStake(false)}
        ayniAvailable={balances.ayniAvailable}
        prices={{
          ayniUsd: prices.ayniUsd,
          goldPerGram: prices.goldPerGram,
          paxgUsd: prices.paxgUsd,
        }}
      />
      <SellAyniModal
        open={showSellAyni}
        onClose={() => setShowSellAyni(false)}
        ayniAmount={balances.ayniAvailable}
      />
    </div>
  );
}
