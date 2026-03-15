import { useState } from 'react';
import type { ChartDataPoint, DailyReward } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { EarningsChart } from './EarningsChart';
import { DailyBreakdown } from './DailyBreakdown';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';

type TabId = 'chart' | 'journal';

interface ChartJournalBlockProps {
  chartData: ChartDataPoint[];
  dailyRewards: DailyReward[];
  totalParticipatedAyni?: number;
  ayniPrice?: number;
  goldRewardsPaxg?: number;
  className?: string;
}

export function ChartJournalBlock({
  chartData,
  dailyRewards,
  totalParticipatedAyni,
  ayniPrice,
  goldRewardsPaxg,
  className,
}: ChartJournalBlockProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('chart');

  const tabs = [
    { id: 'chart' as const, label: t('home.chartJournal.tabChart') },
    { id: 'journal' as const, label: t('home.chartJournal.tabJournal') },
  ];

  return (
    <Card
      variant="stat"
      className={cn('-mx-4 px-3 py-3 rounded-none sm:mx-0 sm:px-4 sm:rounded-xl', className)}
    >
      <Tabs
        items={tabs}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        variant="pill"
        size="sm"
      />

      <div className="mt-3">
        {activeTab === 'chart' ? (
          <EarningsChart chartData={chartData} dailyRewards={dailyRewards} embedded />
        ) : (
          <DailyBreakdown
            dailyRewards={dailyRewards}
            totalParticipatedAyni={totalParticipatedAyni}
            ayniPrice={ayniPrice}
            goldRewardsPaxg={goldRewardsPaxg}
            embedded
          />
        )}
      </div>
    </Card>
  );
}
