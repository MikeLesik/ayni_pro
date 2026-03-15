import type {
  DashboardPositions,
  DashboardDistributions,
  DashboardNextPayout,
  DashboardQuarterlyInfo,
} from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from '@/i18n';
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters';
import { DollarSign, TrendingUp, Clock, CalendarDays, Info } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StatsSandwichProps {
  positions: DashboardPositions;
  distributions: DashboardDistributions;
  nextPayout: DashboardNextPayout;
  quarterly?: DashboardQuarterlyInfo;
  className?: string;
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  valueColor?: string;
  showBorder?: boolean;
  tooltip?: string;
}

function StatRow({
  icon,
  label,
  value,
  subValue,
  valueColor,
  showBorder = true,
  tooltip,
}: StatRowProps) {
  return (
    <div className={cn('py-2 px-3', showBorder && 'border-b border-border-light')}>
      <div className="flex items-center gap-1.5">
        <span className="text-text-muted">{icon}</span>
        <span className="text-xs font-medium uppercase text-text-muted tracking-wider">
          {label}
        </span>
        {tooltip && (
          <Tooltip content={tooltip}>
            <button
              type="button"
              className="text-text-muted hover:text-text-secondary transition-colors"
              aria-label={tooltip}
            >
              <Info size={11} />
            </button>
          </Tooltip>
        )}
      </div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <div className={cn('text-2xl font-sans font-semibold', valueColor || 'text-text-primary')}>
          {value}
        </div>
        {subValue && <span className="text-xs text-text-muted">{subValue}</span>}
      </div>
    </div>
  );
}

export function StatsSandwich({
  positions,
  distributions,
  nextPayout,
  quarterly,
  className,
}: StatsSandwichProps) {
  const { t } = useTranslation();

  return (
    <Card variant="stat" className={cn('!p-0 overflow-hidden h-full', className)}>
      <StatRow
        icon={<DollarSign size={14} />}
        label={t('home.statsSandwich.invested')}
        value={formatCurrency(positions.totalParticipated)}
        tooltip={t('home.statsSandwich.investedTooltip', {
          totalAyni: formatNumber(positions.totalParticipatedAyni),
          ayniPrice: positions.ayniPrice.toFixed(4),
        })}
      />
      <StatRow
        icon={<TrendingUp size={14} />}
        label={t('home.statsSandwich.dailyEarnings')}
        value={`${formatCurrency(distributions.dailyRate)}${t('common.perDay')}`}
        valueColor="text-success"
      />
      {quarterly && quarterly.accruedThisQuarter > 0 ? (
        <StatRow
          icon={<CalendarDays size={14} />}
          label={t('home.statsSandwich.thisQuarter')}
          value={formatCurrency(quarterly.accruedThisQuarter)}
          subValue={t('home.statsSandwich.accruing')}
          valueColor="text-gold-dark"
          showBorder={true}
          tooltip={t('home.statsSandwich.thisQuarterTooltip')}
        />
      ) : null}
      <StatRow
        icon={<Clock size={14} />}
        label={t('home.statsSandwich.nextPayout')}
        value={formatDate(nextPayout.date)}
        subValue={
          nextPayout.daysRemaining > 0
            ? t('home.statsSandwich.inDays', { days: nextPayout.daysRemaining })
            : undefined
        }
        showBorder={false}
      />
    </Card>
  );
}
