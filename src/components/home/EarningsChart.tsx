import { useState, useMemo, useId, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';
import { useReducedMotion } from 'framer-motion';
import type { ChartDataPoint, DailyReward } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';
import { formatInteger } from '@/lib/formatters';
import { useSimulationStore } from '@/stores/simulation';

import type { Period, ChartMode } from './EarningsChartUtils';
import {
  filterByPeriod,
  enrichWithDaily,
  formatShortDate,
  detectSpikes,
  computeYAxis,
} from './EarningsChartUtils';
import { CumulativeTooltip, PeriodicTooltip, KpiTable, PeriodSummary } from './EarningsChartParts';

/* ── Main Component ── */

interface EarningsChartProps {
  chartData: ChartDataPoint[];
  dailyRewards?: DailyReward[];
  /** When true, renders without its own Card wrapper (used inside ChartJournalBlock) */
  embedded?: boolean;
  className?: string;
}

export function EarningsChart({
  chartData,
  dailyRewards: _dailyRewards,
  embedded,
  className,
}: EarningsChartProps) {
  const gradientId = useId();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('ALL');
  const [chartMode, setChartMode] = useState<ChartMode>('cumulative');
  const reducedMotion = useReducedMotion();
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const paxgPrice = useSimulationStore((s) => s.prices.paxgUsd);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Data bounds for date picker min/max
  const dataBounds = useMemo(() => {
    if (chartData.length === 0) return { min: '', max: '' };
    return {
      min: chartData[0]!.date,
      max: chartData[chartData.length - 1]!.date,
    };
  }, [chartData]);

  // Custom date range state — initialize from data bounds
  const [customStart, setCustomStart] = useState(() => dataBounds.min);
  const [customEnd, setCustomEnd] = useState(() => dataBounds.max);

  // Re-sync when data bounds change (e.g. new data loaded)
  useEffect(() => {
    if (dataBounds.min && !customStart) setCustomStart(dataBounds.min);
    if (dataBounds.max && !customEnd) setCustomEnd(dataBounds.max);
  }, [dataBounds.min, dataBounds.max]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const periodTabs = [
    { id: '7D', label: t('home.chart.7D') },
    { id: '1M', label: t('home.chart.1M') },
    { id: '3M', label: t('home.chart.3M') },
    { id: 'ALL', label: t('home.chart.ALL') },
    { id: 'CUSTOM', label: t('home.chart.custom') },
  ];

  const modeTabs = [
    { id: 'cumulative', label: t('home.chart.cumulative') },
    { id: 'periodic', label: t('home.chart.periodic') },
  ];

  const customRange = useMemo(
    () => ({ start: customStart, end: customEnd }),
    [customStart, customEnd],
  );

  const filteredData = useMemo(
    () => filterByPeriod(chartData, period, new Date(simulationDate), customRange),
    [chartData, period, simulationDate, customRange],
  );

  const enrichedData = useMemo(
    () => enrichWithDaily(filteredData, chartData),
    [filteredData, chartData],
  );

  const spikes = useMemo(() => detectSpikes(enrichedData), [enrichedData]);

  // Spike reference lines for the chart
  const spikePoints = useMemo(
    () => enrichedData.filter((_, i) => spikes.has(i)),
    [enrichedData, spikes],
  );

  const cumulativeYAxis = useMemo(
    () => computeYAxis(filteredData.map((d) => d.distributedCumulative)),
    [filteredData],
  );

  const periodicYAxis = useMemo(
    () => computeYAxis(enrichedData.map((d) => d.dailyAmount)),
    [enrichedData],
  );

  const { domain, ticks } = chartMode === 'cumulative' ? cumulativeYAxis : periodicYAxis;

  // Show every Nth tick so labels don't overlap
  const tickInterval = Math.max(0, Math.floor(filteredData.length / 5) - 1);

  const showTable = enrichedData.length > 0 && enrichedData.length < 7;
  const subtitle =
    chartMode === 'cumulative' ? t('home.chart.subtitle') : t('home.chart.subtitlePeriodic');

  const content = (
    <>
      {/* Header row: title + chart mode toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{t('home.chart.title')}</h3>
        <Tabs
          items={modeTabs}
          activeId={chartMode}
          onChange={(id) => setChartMode(id as ChartMode)}
          variant="pill"
          size="sm"
        />
      </div>

      {/* Period tabs */}
      <div className="flex items-center justify-end mt-2">
        <Tabs
          items={periodTabs}
          activeId={period}
          onChange={(id) => setPeriod(id as Period)}
          variant="pill"
          size="sm"
        />
      </div>

      {/* Custom date range picker */}
      {period === 'CUSTOM' && (
        <div className="mt-2">
          <DateRangePicker
            startDate={customStart}
            endDate={customEnd}
            minDate={dataBounds.min}
            maxDate={dataBounds.max}
            onStartChange={setCustomStart}
            onEndChange={setCustomEnd}
          />
        </div>
      )}

      {/* Period Summary — always visible */}
      {enrichedData.length > 0 && (
        <PeriodSummary enrichedData={enrichedData} paxgPrice={paxgPrice} t={t} />
      )}

      {/* Chart or KPI Table */}
      {showTable ? (
        <KpiTable data={enrichedData} t={t} />
      ) : chartMode === 'cumulative' ? (
        /* ── Cumulative AreaChart ── */
        <div className="h-[200px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={enrichedData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                horizontal
                vertical={false}
                stroke="var(--color-border-light)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: isMobile ? 10 : 11, fill: 'var(--color-text-muted)' }}
                tickFormatter={formatShortDate}
                interval={tickInterval}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 10 : 11, fill: 'var(--color-text-muted)' }}
                tickFormatter={(v: number) => `$${formatInteger(v)}`}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 38 : 58}
                ticks={ticks}
                domain={domain}
              />
              <Tooltip content={<CumulativeTooltip t={t} />} />
              {/* Spike annotations — label only on first */}
              {spikePoints.map((sp, i) => (
                <ReferenceLine
                  key={sp.date}
                  x={sp.date}
                  stroke="var(--color-primary)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                >
                  {i === 0 && (
                    <Label
                      value={t('home.chart.quarterlyPayout')}
                      position="insideTopRight"
                      style={{ fontSize: 9, fill: 'var(--color-primary)', fontWeight: 600 }}
                    />
                  )}
                </ReferenceLine>
              ))}
              <Area
                type="monotone"
                dataKey="distributedCumulative"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive={!reducedMotion}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* ── Periodic BarChart ── */
        <div className="h-[200px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enrichedData}>
              <CartesianGrid
                horizontal
                vertical={false}
                stroke="var(--color-border-light)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: isMobile ? 10 : 11, fill: 'var(--color-text-muted)' }}
                tickFormatter={formatShortDate}
                interval={tickInterval}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 10 : 11, fill: 'var(--color-text-muted)' }}
                tickFormatter={(v: number) => `$${formatInteger(v)}`}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 38 : 58}
                ticks={ticks}
                domain={domain}
              />
              <Tooltip content={<PeriodicTooltip />} />
              {/* Spike annotations — label only on first */}
              {spikePoints.map((sp, i) => (
                <ReferenceLine
                  key={sp.date}
                  x={sp.date}
                  stroke="var(--color-primary)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                >
                  {i === 0 && (
                    <Label
                      value={t('home.chart.quarterlyPayout')}
                      position="insideTopRight"
                      style={{ fontSize: 9, fill: 'var(--color-primary)', fontWeight: 600 }}
                    />
                  )}
                </ReferenceLine>
              ))}
              <Bar
                dataKey="dailyAmount"
                fill="var(--color-primary)"
                fillOpacity={0.7}
                radius={[2, 2, 0, 0]}
                isAnimationActive={!reducedMotion}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Subtitle */}
      <p className="text-body-sm text-text-muted mt-1.5">{subtitle}</p>
    </>
  );

  if (embedded) return <div className={className}>{content}</div>;

  return (
    <Card
      variant="stat"
      className={cn('-mx-4 px-3 py-3 rounded-none sm:mx-0 sm:px-4 sm:rounded-xl', className)}
    >
      {content}
    </Card>
  );
}
