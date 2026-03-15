import { useDashboard } from '@/hooks/useDashboard';
import { usePremium } from '@/hooks/usePremium';
import { useTranslation } from '@/i18n';
import { AnimatedPage, StaggerItem } from '@/components/ui/AnimatedPage';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GreetingSection } from '@/components/home/GreetingSection';
import { HeroEarningsCard } from '@/components/home/HeroEarningsCard';
import { QuickStatsRow } from '@/components/home/QuickStatsRow';
import { ChartJournalBlock } from '@/components/home/ChartJournalBlock';
import { CtaBanner } from '@/components/home/CtaBanner';
import { HomeEmptyState } from '@/components/home/HomeEmptyState';
import { OnboardingCarousel } from '@/components/onboarding/OnboardingCarousel';
import { MinePreviewCard } from '@/components/home/MinePreviewCard';
import { TierCard } from '@/components/ui/TierCard';
import { CommunityStats } from '@/components/home/CommunityStats';
import { ParticipantsBadge } from '@/components/shared/ParticipantsBadge';
import { ActivityTicker } from '@/components/shared/ActivityTicker';
import { DemoPositionCard } from '@/components/home/DemoPositionCard';
import { ClaimButton } from '@/components/home/ClaimButton';
import { useMineStore } from '@/stores/mineStore';
import { useUiStore } from '@/stores/uiStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

function HomeSkeletons() {
  return (
    <div className="flex flex-col gap-3">
      {/* Greeting skeleton */}
      <div>
        <SkeletonLoader variant="heading" width="200px" />
      </div>

      {/* Hero skeleton */}
      <Card variant="stat" className="px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <SkeletonLoader variant="text" width="100px" />
          <SkeletonLoader variant="number" width="180px" />
          <SkeletonLoader variant="text" width="160px" />
        </div>
      </Card>

      {/* Quick Stats skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} variant="stat" className="p-3">
            <SkeletonLoader variant="text" width="60px" />
            <SkeletonLoader variant="number" width="80px" height="20px" className="mt-1" />
          </Card>
        ))}
      </div>

      {/* Chart skeleton */}
      <SkeletonLoader variant="chart" />
    </div>
  );
}

export default function HomePage() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const isPremium = usePremium();
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const mineRefresh = useMineStore((s) => s.refresh);
  const mineStats = useMineStore((s) => s.computedStats);
  const showGamification = useUiStore((s) => s.showGamification);

  useEffect(() => {
    track('page_view', { page: 'home' });
  }, [track]);

  useEffect(() => {
    mineRefresh();
  }, [mineRefresh]);

  if (isLoading) {
    return (
      <AnimatedPage className="flex flex-col">
        <HomeSkeletons />
      </AnimatedPage>
    );
  }

  if (isError) {
    return (
      <AnimatedPage className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-body-lg text-text-secondary">{t('home.page.errorMessage')}</p>
        <Button variant="primary" onClick={() => refetch()}>
          {t('home.page.retryButton')}
        </Button>
      </AnimatedPage>
    );
  }

  if (!data) return null;

  const isEmpty = data.positions.activeCount === 0;

  if (isEmpty) {
    return (
      <AnimatedPage className="flex flex-col">
        <GreetingSection />
        <DemoPositionCard className="mb-3" />
        <HomeEmptyState totalParticipants={data.socialProof.totalParticipants} />
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage stagger className="flex flex-col">
      {/* Greeting */}
      <StaggerItem className="mb-2">
        <GreetingSection className="!mb-0" />
      </StaggerItem>

      {/* Demo position card (onboarding) */}
      <StaggerItem className="mb-3">
        <DemoPositionCard />
      </StaggerItem>

      {/* Block 1: Hero — total accrued + today + progress ring */}
      <StaggerItem className="mb-3">
        <HeroEarningsCard
          distributions={data.distributions}
          nextPayout={data.nextPayout}
          quarterly={data.quarterly}
          isPremium={isPremium}
        />
      </StaggerItem>

      {/* Contributor Status */}
      <StaggerItem className="mb-3">
        <TierCard variant="compact" />
      </StaggerItem>

      {/* Community Overview */}
      <StaggerItem className="mb-3">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          {t('home.community.title')}
        </h3>
        <CommunityStats />
      </StaggerItem>

      {/* Claim daily reward */}
      {showGamification && mineStats && (
        <StaggerItem className="mb-3">
          <ClaimButton
            dailyGoldGrams={mineStats.dailyProduction.goldGrams}
            dailyUsdValue={mineStats.dailyProduction.usdValue}
          />
        </StaggerItem>
      )}

      {/* Social proof badge */}
      <StaggerItem className="mb-3">
        <ParticipantsBadge className="justify-center" />
      </StaggerItem>


      {/* Block 2: Quick Stats Row — 3 compact cards */}
      <StaggerItem className="mb-3">
        <QuickStatsRow
          positions={data.positions}
          distributions={data.distributions}
          nextPayout={data.nextPayout}
          className="!mt-0"
        />
      </StaggerItem>

      {/* Mine preview — link to My Mine */}
      {showGamification && (
        <StaggerItem className="mb-3">
          <MinePreviewCard />
        </StaggerItem>
      )}

      {/* Block 3: Chart / Journal — tabbed */}
      <StaggerItem className="mb-3">
        <ChartJournalBlock
          chartData={data.chartData}
          dailyRewards={data.dailyRewards}
          totalParticipatedAyni={data.positions.totalParticipatedAyni}
          ayniPrice={data.positions.ayniPrice}
          goldRewardsPaxg={data.positions.goldRewardsPaxg}
        />
      </StaggerItem>

      {/* Block 4: Personalized CTA */}
      <StaggerItem>
        <CtaBanner
          positionCount={data.positions.activeCount}
          availableBalance={data.quarterly.claimableUsd}
          totalParticipated={data.positions.totalParticipated}
        />
      </StaggerItem>

      <OnboardingCarousel />
    </AnimatedPage>
  );
}
