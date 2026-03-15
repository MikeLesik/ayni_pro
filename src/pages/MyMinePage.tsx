import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatedPage, StaggerItem } from '@/components/ui/AnimatedPage';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { MineIllustration } from '@/components/mine/MineIllustration';
import { MineHeader } from '@/components/mine/MineHeader';
import { MineLevelProgress } from '@/components/mine/MineLevelProgress';
import { DailyProductionCard } from '@/components/mine/DailyProductionCard';
import { MineStatsGrid } from '@/components/mine/MineStatsGrid';
import { UpgradeCTA } from '@/components/mine/UpgradeCTA';
import { AchievementsSection } from '@/components/mine/AchievementsSection';
import { MineDataView } from '@/components/mine/MineDataView';
import { StreakCalendar } from '@/components/mine/StreakCalendar';
import { MilestoneTimeline } from '@/components/mine/MilestoneTimeline';
import { AchievementToast } from '@/components/mine/AchievementToast';
import { LiveProductionTicker } from '@/components/mine/LiveProductionTicker';
import { MineOperationsCard } from '@/components/mine/MineOperationsCard';
import { ProductionChart } from '@/components/mine/ProductionChart';
import { StreakBadge } from '@/components/mine/StreakBadge';
import { useMine } from '@/hooks/useMine';
import { useMineStore } from '@/stores/mineStore';
import { useSimulationStore } from '@/stores/simulation';
import { useUiStore } from '@/stores/uiStore';
import { useTranslation } from '@/i18n';
import { Tabs } from '@/components/ui/Tabs';
import type { MineLevel } from '@/types/mine';

function MyMineLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <SkeletonLoader variant="heading" />
        <SkeletonLoader variant="text" width="50%" className="mt-2" />
      </div>
      <SkeletonLoader variant="chart" height="220px" className="rounded-xl" />
      <SkeletonLoader variant="text" className="h-3" />
      <SkeletonLoader variant="card" height="200px" />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonLoader variant="card" height="100px" />
        <SkeletonLoader variant="card" height="100px" />
        <SkeletonLoader variant="card" height="100px" />
        <SkeletonLoader variant="card" height="100px" />
      </div>
      <SkeletonLoader variant="card" height="140px" />
      <SkeletonLoader variant="card" height="200px" />
    </div>
  );
}

export default function MyMinePage() {
  // Support ?testLevel=1..5 for visual testing of all mine levels
  const [searchParams] = useSearchParams();
  const testLevelRaw = searchParams.get('testLevel');
  const parsed = Number(testLevelRaw);
  const testLevel =
    testLevelRaw && !isNaN(parsed)
      ? (Math.min(5, Math.max(1, Math.round(parsed))) as MineLevel)
      : undefined;

  const { data: stats, isLoading } = useMine(testLevel);
  const mineRefresh = useMineStore((s) => s.refresh);
  const claimDates = useMineStore((s) => s.claimDates);
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const isClaimed = claimDates.includes(simulationDate.split('T')[0]!);
  const mineViewMode = useUiStore((s) => s.mineViewMode);
  const setMineViewMode = useUiStore((s) => s.setMineViewMode);
  const { t } = useTranslation();

  useEffect(() => {
    mineRefresh();
  }, [mineRefresh]);

  // Claim burst animation: detect transition from unclaimed → claimed
  const [claimActive, setClaimActive] = useState(false);
  const prevClaimedRef = useRef(isClaimed);

  useEffect(() => {
    if (isClaimed && !prevClaimedRef.current) {
      setClaimActive(true);
      const timer = setTimeout(() => setClaimActive(false), 2000);
      prevClaimedRef.current = isClaimed;
      return () => clearTimeout(timer);
    }
    prevClaimedRef.current = isClaimed;
  }, [isClaimed]);

  if (isLoading || !stats) {
    return (
      <AnimatedPage className="flex flex-col gap-4">
        <MyMineLoading />
      </AnimatedPage>
    );
  }

  const isMaxLevel = stats.currentLevel === 5;

  // Translate level names and equipment via i18n
  const levelKey = `mine.levels.${stats.currentLevel}` as const;
  const translatedLevelName = t(levelKey as any);
  const nextLevelKey = stats.nextLevelName
    ? (`mine.levels.${stats.currentLevel + 1}` as const)
    : null;
  const translatedNextLevelName = nextLevelKey ? t(nextLevelKey as any) : null;

  const equipmentKeyMap: Record<string, string> = {
    'Basic pickaxe & pan': 'mine.equip.basicPickaxe',
    'Sluice box & hand tools': 'mine.equip.sluiceBox',
    'Excavator & conveyor': 'mine.equip.excavatorConveyor',
    'Multi-line processing': 'mine.equip.multiLine',
    'Full industrial complex': 'mine.equip.fullIndustrial',
  };
  const eqKey = equipmentKeyMap[stats.mineDetails.equipment];
  const translatedEquipment = eqKey ? t(eqKey as any) : stats.mineDetails.equipment;

  return (
    <AnimatedPage stagger className="flex flex-col gap-0 pb-8">
      {/* Header + Streak Badge */}
      <StaggerItem className="pt-5">
        <div className="flex items-start justify-between">
          <MineHeader level={stats.currentLevel} levelName={translatedLevelName} />
          <StreakBadge />
        </div>
      </StaggerItem>

      {/* View toggle */}
      <StaggerItem className="mt-3">
        <Tabs
          items={[
            { id: 'visual', label: t('mine.viewToggle.visual') },
            { id: 'data', label: t('mine.viewToggle.data') },
          ]}
          activeId={mineViewMode}
          onChange={(id) => setMineViewMode(id as 'visual' | 'data')}
          variant="pill"
          size="sm"
        />
      </StaggerItem>

      {mineViewMode === 'visual' ? (
        <>
          {/* Illustration */}
          <StaggerItem className="mt-3">
            <MineIllustration
              level={stats.currentLevel}
              animated
              claimActive={claimActive}
              className="shadow-md"
            />
          </StaggerItem>

          {/* Level progress */}
          <StaggerItem className="mt-2">
            <MineLevelProgress
              currentName={translatedLevelName}
              nextName={translatedNextLevelName}
              progress={stats.progressToNextLevel}
              amountNeeded={stats.amountToNextLevel}
              isMaxLevel={isMaxLevel}
            />
          </StaggerItem>

          {/* Daily production + Stats grid — side by side on desktop */}
          <StaggerItem className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DailyProductionCard
                goldGrams={stats.dailyProduction.goldGrams}
                usdValue={stats.dailyProduction.usdValue}
                activeDays={stats.streak.currentDays}
                weeklyGrams={stats.weeklyProduction.goldGrams}
                weeklyUsd={stats.weeklyProduction.usdValue}
              />
              <MineStatsGrid
                workers={stats.mineDetails.workers}
                equipment={translatedEquipment}
                outputPerDay={stats.mineDetails.outputPerDay}
                efficiency={stats.mineDetails.efficiency}
              />
            </div>
          </StaggerItem>

          {/* Live production ticker */}
          <StaggerItem className="mt-3">
            <LiveProductionTicker />
          </StaggerItem>

          {/* Mine operations */}
          <StaggerItem className="mt-3">
            <MineOperationsCard />
          </StaggerItem>

          {/* 7-day production chart */}
          <StaggerItem className="mt-3">
            <ProductionChart />
          </StaggerItem>

          {/* Upgrade CTA */}
          <StaggerItem className="mt-3">
            <UpgradeCTA
              currentLevel={stats.currentLevel}
              amountToNextLevel={stats.amountToNextLevel}
              nextLevelName={translatedNextLevelName}
            />
          </StaggerItem>

          {/* Achievements */}
          <StaggerItem className="mt-5">
            <AchievementsSection achievements={stats.achievements} />
          </StaggerItem>

          {/* Streak Calendar */}
          <StaggerItem className="mt-5">
            <div className="rounded-xl bg-surface-card border border-border-light p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                {t('mine.calendar.title' as any)}
              </h3>
              <StreakCalendar />
            </div>
          </StaggerItem>

          {/* Milestone Timeline */}
          <StaggerItem className="mt-5">
            <MilestoneTimeline />
          </StaggerItem>
        </>
      ) : (
        <StaggerItem className="mt-4">
          <MineDataView stats={stats} />
        </StaggerItem>
      )}

      {/* Achievement toast */}
      <AchievementToast />
    </AnimatedPage>
  );
}
