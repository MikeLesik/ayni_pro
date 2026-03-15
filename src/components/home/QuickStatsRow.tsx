import type {
  DashboardPositions,
  DashboardNextPayout,
  DashboardDistributions,
} from '@/types/dashboard';
import { StatCard } from '@/components/ui/StatCard';
import { useTranslation } from '@/i18n';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

interface QuickStatsRowProps {
  positions: DashboardPositions;
  distributions: DashboardDistributions;
  nextPayout: DashboardNextPayout;
  className?: string;
}

export function QuickStatsRow({
  positions,
  distributions,
  nextPayout,
  className,
}: QuickStatsRowProps) {
  const { t } = useTranslation();

  return (
    <div className={cn('grid grid-cols-3 gap-2 md:gap-3 mt-3', className)}>
      <StatCard
        icon={<DollarSign size={18} />}
        iconColor="text-text-primary"
        label={t('home.quickStats.invested')}
        value={formatCurrency(positions.totalParticipated)}
      />
      <StatCard
        icon={<TrendingUp size={18} />}
        iconColor="text-primary"
        label={t('home.quickStats.dailyEarnings')}
        value={`${formatCurrency(distributions.dailyRate)}${t('common.perDay')}`}
        trend="success"
      />
      <StatCard
        icon={<Clock size={18} />}
        iconColor="text-text-muted"
        label={t('home.quickStats.nextPayout')}
        value={formatDate(nextPayout.date)}
      />
    </div>
  );
}
