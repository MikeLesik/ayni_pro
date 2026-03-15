import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from '@/i18n';
import { formatCurrency, formatDate, formatGrams, formatNumber } from '@/lib/formatters';
import { Calendar, Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { QuarterlyProjectionItem } from '@/services/earnService';

export interface ProjectionCardProps {
  estimatedDistributions: number;
  monthlyDistributions: number;
  dailyDistributions: number;
  totalGoldGrams: number;
  monthlyGoldGrams: number;
  dailyGoldGrams: number;
  firstPayoutDate: string;
  termMonths: number;
  ayniTokenAmount?: number;
  quarterlyProjections?: QuarterlyProjectionItem[];
  totalPayouts?: number;
  loading?: boolean;
  className?: string;
}

export function ProjectionCard({
  estimatedDistributions,
  monthlyDistributions,
  dailyDistributions,
  totalGoldGrams,
  monthlyGoldGrams,
  dailyGoldGrams,
  firstPayoutDate,
  termMonths,
  ayniTokenAmount,
  quarterlyProjections,
  loading = false,
  className,
}: ProjectionCardProps) {
  const { t } = useTranslation();

  const rows: {
    label: string;
    value: string;
    sub?: string;
    tooltip?: string;
  }[] = [
    {
      label: t('earn.projection.monthly'),
      value: `~${formatGrams(monthlyGoldGrams)}`,
      sub: `≈ ${formatCurrency(monthlyDistributions)}`,
    },
    {
      label: t('earn.projection.daily'),
      value: `~${formatGrams(dailyGoldGrams)}`,
      sub: `≈ ${formatCurrency(dailyDistributions)}`,
    },
    {
      label: t('earn.projection.firstPayout'),
      value: formatDate(firstPayoutDate),
      tooltip: t('earn.projection.firstPayoutTooltip'),
    },
    {
      label: t('earn.projection.quarterlyPayouts'),
      value: t('earn.projection.quarterly'),
      tooltip: t('earn.projection.quarterlyTooltip'),
    },
    { label: t('earn.projection.paidIn'), value: t('earn.projection.paxgToken') },
    ...(ayniTokenAmount
      ? [
          { label: t('earn.projection.willHold'), value: `${formatNumber(ayniTokenAmount)} AYNI` },
          {
            label: t('earn.projection.afterTermEnds'),
            value: t('earn.projection.afterTermOptions'),
          },
        ]
      : []),
  ];

  return (
    <div
      className={cn(
        'relative bg-primary-light rounded-xl p-5 border border-primary/15 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow',
        className,
      )}
    >
      {/* Loading skeleton overlay */}
      {loading && (
        <div className="absolute inset-0 bg-primary-light/80 flex items-center justify-center z-10">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-xs text-primary uppercase tracking-wider font-medium">
        {t('earn.projection.header', { termMonths })}
      </div>

      {/* Gold output label */}
      <div className="text-xs text-text-secondary mt-2 uppercase tracking-wide font-medium">
        {t('earn.projection.goldOutputLabel')}
      </div>

      {/* Primary metric: gold grams (range) */}
      <div className="font-display text-[32px] leading-none text-text-primary mt-1">
        ~{(totalGoldGrams * 0.73).toFixed(1)}–{(totalGoldGrams * 1.25).toFixed(1)}g{' '}
        {t('earn.projection.goldOutputSuffix')}
      </div>

      {/* USD equivalent (range) */}
      <div className="text-sm text-text-secondary mt-1">
        ≈ ${Math.round(estimatedDistributions * 0.73)}–${Math.round(estimatedDistributions * 1.25)}{' '}
        ({t('earn.projection.goldRangeNote')})
      </div>

      {/* Breakdown rows */}
      <div className="mt-3 space-y-0">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between py-2 border-t border-primary/10">
            <span className="text-sm text-text-secondary flex items-center gap-1">
              {row.label}
              {row.tooltip && (
                <Tooltip content={row.tooltip}>
                  <button
                    type="button"
                    className="text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <Info size={12} />
                  </button>
                </Tooltip>
              )}
            </span>
            <div className="text-right">
              <span className="text-sm text-text-primary font-medium">{row.value}</span>
              {row.sub && <p className="text-xs text-text-muted mt-0.5">{row.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Quarterly Timeline */}
      {quarterlyProjections && quarterlyProjections.length > 0 && (
        <div className="mt-4 pt-3 border-t border-primary/15">
          <div className="flex items-center gap-1.5 mb-3">
            <Calendar size={14} className="text-primary" />
            <span className="text-xs text-primary uppercase tracking-wider font-medium">
              {t('earn.projection.payoutsPerYear')}
            </span>
            <span className="text-xs text-text-muted ml-auto tabular-nums">
              {quarterlyProjections.length} {quarterlyProjections.length === 1 ? 'Q' : 'Q'}
            </span>
          </div>

          {/* Desktop: scrollable horizontal timeline */}
          <div className="hidden sm:block overflow-x-auto pb-1">
            <div
              className="relative"
              style={{ minWidth: `${Math.max(100, quarterlyProjections.length * 80)}px` }}
            >
              {/* Line */}
              <div className="absolute top-2 left-3 right-3 h-px bg-primary/30" />

              {/* Points */}
              <div className="flex justify-between">
                {quarterlyProjections.map((q) => (
                  <div key={q.quarterNumber} className="flex flex-col items-center relative px-1">
                    <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-xs font-medium text-text-primary mt-1.5">
                      Q{q.quarterNumber}
                    </span>
                    <span className="text-xs text-text-primary font-medium whitespace-nowrap">
                      ${Math.round(q.estimatedUsd * 0.73)}–${Math.round(q.estimatedUsd * 1.25)}
                    </span>
                    <span className="text-xs text-text-muted">{q.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="sm:hidden space-y-2">
            {quarterlyProjections.map((q) => (
              <div key={q.quarterNumber} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary flex-shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Q{q.quarterNumber} &middot; {q.label}
                  </span>
                  <span className="text-xs text-text-primary font-medium">
                    ${Math.round(q.estimatedUsd * 0.73)}–${Math.round(q.estimatedUsd * 1.25)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Range disclaimer */}
          <p className="text-xs text-text-muted italic mt-2">
            {t('earn.projection.rangeDisclaimer')}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-text-muted italic mt-3">{t('earn.projection.disclaimer')}</p>
    </div>
  );
}
