import { useMemo } from 'react';
import type { TooltipProps } from 'recharts';
import { useTranslation } from '@/i18n';
import { formatCurrency } from '@/lib/formatters';
import { formatShortDate } from './EarningsChartUtils';
import type { EnrichedDataPoint } from './EarningsChartUtils';

/* ── Tooltip ── */

export function CumulativeTooltip({
  active,
  payload,
  label,
  t,
}: TooltipProps<number, string> & { t: ReturnType<typeof useTranslation>['t'] }) {
  if (!active || !payload?.length) return null;

  const cumulative = (payload[0]?.value ?? 0) as number;
  const daily = (payload[0]?.payload as EnrichedDataPoint)?.dailyAmount ?? 0;

  return (
    <div className="bg-tooltip-bg text-tooltip-text rounded-lg p-2 text-xs shadow-lg min-w-[120px]">
      <p className="text-tooltip-muted mb-1">{formatShortDate(label as string)}</p>
      <div className="flex justify-between gap-3">
        <span className="text-tooltip-muted">{t('home.chart.tooltipDaily')}</span>
        <span className="font-medium">{formatCurrency(daily)}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-tooltip-muted">{t('home.chart.tooltipCumulative')}</span>
        <span className="font-medium">{formatCurrency(cumulative)}</span>
      </div>
    </div>
  );
}

export function PeriodicTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  const amount = (payload[0]?.value ?? 0) as number;

  return (
    <div className="bg-tooltip-bg text-tooltip-text rounded-lg p-2 text-xs shadow-lg min-w-[100px]">
      <p className="font-medium">
        {formatShortDate(label as string)}: {formatCurrency(amount)}
      </p>
    </div>
  );
}

/* ── KPI Table (fallback for < 7 points) ── */

export function KpiTable({
  data,
  t,
}: {
  data: EnrichedDataPoint[];
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const total = data.reduce((sum, d) => sum + d.dailyAmount, 0);

  return (
    <div className="mt-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-light">
            <th className="text-left py-1.5 text-text-muted font-medium text-xs">
              {t('home.chart.kpiDate')}
            </th>
            <th className="text-right py-1.5 text-text-muted font-medium text-xs">
              {t('home.chart.kpiReceived')}
            </th>
          </tr>
        </thead>
        <tbody>
          {[...data].reverse().map((row) => (
            <tr key={row.date} className="border-b border-border-light/50">
              <td className="py-1.5 text-text-secondary text-xs">{formatShortDate(row.date)}</td>
              <td className="py-1.5 text-right text-text-primary font-medium text-xs tabular-nums">
                {formatCurrency(row.dailyAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs font-semibold text-text-primary mt-2 text-right tabular-nums">
        {t('home.chart.kpiTotal', { amount: formatCurrency(total) })}
      </p>
    </div>
  );
}

/* ── Period Summary ── */

export function PeriodSummary({
  enrichedData,
  paxgPrice,
  t,
}: {
  enrichedData: EnrichedDataPoint[];
  paxgPrice: number;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const summary = useMemo(() => {
    const totalUsd = enrichedData.reduce((sum, d) => sum + d.dailyAmount, 0);
    const days = enrichedData.length;
    const avgDaily = days > 0 ? totalUsd / days : 0;
    const totalPaxg = paxgPrice > 0 ? totalUsd / paxgPrice : 0;
    return { totalPaxg, totalUsd, days, avgDaily };
  }, [enrichedData, paxgPrice]);

  if (summary.days === 0) return null;

  return (
    <div className="mt-3 rounded-xl bg-surface-secondary border border-border-light p-3">
      <p className="text-xs font-semibold text-text-primary mb-2">
        {t('home.chart.periodSummary')}
        <span className="ml-1.5 font-normal text-text-muted">
          {t('home.chart.days', { count: summary.days })}
        </span>
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] text-text-muted">{t('home.chart.totalPaxg')}</p>
          <p className="text-sm font-semibold text-gold tabular-nums mt-0.5">
            {summary.totalPaxg.toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-text-muted">{t('home.chart.totalUsd')}</p>
          <p className="text-sm font-semibold text-text-primary tabular-nums mt-0.5">
            {formatCurrency(summary.totalUsd)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-text-muted">{t('home.chart.avgDaily')}</p>
          <p className="text-sm font-semibold text-text-primary tabular-nums mt-0.5">
            {formatCurrency(summary.avgDaily)}
          </p>
        </div>
      </div>
    </div>
  );
}
