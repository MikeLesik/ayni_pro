import type { ChartDataPoint } from '@/types/dashboard';
import { format, parseISO, subDays, subMonths } from 'date-fns';

export type Period = '7D' | '1M' | '3M' | 'ALL' | 'CUSTOM';
export type ChartMode = 'cumulative' | 'periodic';

export interface EnrichedDataPoint extends ChartDataPoint {
  dailyAmount: number;
}

export function filterByPeriod(
  data: ChartDataPoint[],
  period: Period,
  referenceDate: Date,
  customRange?: { start: string; end: string },
): ChartDataPoint[] {
  if (period === 'CUSTOM' && customRange?.start && customRange?.end) {
    return data.filter((d) => d.date >= customRange.start && d.date <= customRange.end);
  }
  if (period === 'ALL' || period === 'CUSTOM') return data;

  let cutoff: Date;

  switch (period) {
    case '7D':
      cutoff = subDays(referenceDate, 7);
      break;
    case '1M':
      cutoff = subMonths(referenceDate, 1);
      break;
    case '3M':
      cutoff = subMonths(referenceDate, 3);
      break;
    default:
      return data;
  }

  return data.filter((d) => parseISO(d.date) >= cutoff);
}

export function enrichWithDaily(
  data: ChartDataPoint[],
  fullData: ChartDataPoint[],
): EnrichedDataPoint[] {
  return data.map((point, i) => {
    if (i > 0) {
      return {
        ...point,
        dailyAmount: Math.max(0, point.distributedCumulative - data[i - 1]!.distributedCumulative),
      };
    }
    // For the first item in a filtered slice, find the preceding day in fullData
    const fullIdx = fullData.findIndex((d) => d.date === point.date);
    const prev = fullIdx > 0 ? fullData[fullIdx - 1]!.distributedCumulative : 0;
    return { ...point, dailyAmount: Math.max(0, point.distributedCumulative - prev) };
  });
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

/** Detect spike indices -- points where daily amount is > 3x the median */
export function detectSpikes(data: EnrichedDataPoint[]): Set<number> {
  if (data.length < 3) return new Set();

  const dailyAmounts = data.map((d) => d.dailyAmount).filter((v) => v > 0);
  if (dailyAmounts.length < 3) return new Set();

  const sorted = [...dailyAmounts].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)]!;
  if (median <= 0) return new Set();

  const threshold = median * 3;
  const spikes = new Set<number>();
  data.forEach((d, i) => {
    if (d.dailyAmount > threshold) spikes.add(i);
  });
  return spikes;
}

/** Compute nice Y-axis domain and ticks from data max */
export function computeYAxis(values: number[]): { domain: [number, number]; ticks: number[] } {
  if (values.length === 0) return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10] };

  const max = Math.max(...values);
  if (max <= 0) return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10] };

  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const normalized = max / magnitude;
  let niceMax: number;
  if (normalized <= 1) niceMax = magnitude;
  else if (normalized <= 2) niceMax = 2 * magnitude;
  else if (normalized <= 5) niceMax = 5 * magnitude;
  else niceMax = 10 * magnitude;

  const step = niceMax / 5;
  const ticks = Array.from({ length: 6 }, (_, i) => Math.round(i * step * 100) / 100);

  return { domain: [0, niceMax], ticks };
}
