import { useMemo } from 'react';
import { useSimulationStore } from '@/stores/simulation';
import { useTranslation } from '@/i18n';
import { formatCurrency } from '@/lib/formatters';

export interface TickerEvent {
  id: string;
  type: 'investment' | 'earning' | 'payout';
  message: string;
  timeAgo: string;
}

const CITIES = ['Madrid', 'Dubai', 'Lima', 'Zurich', 'Singapore', 'London', 'Miami', 'Seoul'];
const AMOUNTS = [500, 1000, 2000, 3000, 5000, 7500, 10000];
const GRAMS = [0.12, 0.24, 0.38, 0.52, 0.67, 0.89, 1.15];
const PAYOUT_AMOUNTS = [42, 85, 127, 210, 340, 520, 780];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function useActivityTickerEvents(): TickerEvent[] {
  const { t } = useTranslation();
  const simulationDate = useSimulationStore((s) => s.simulationDate);

  return useMemo(() => {
    const dateSeed = simulationDate
      .split('T')[0]!
      .split('-')
      .reduce((acc, v) => acc + Number(v), 0);
    const rand = seededRandom(dateSeed * 31);

    const events: TickerEvent[] = [];

    for (let i = 0; i < 10; i++) {
      const r = rand();
      const cityIdx = Math.floor(rand() * CITIES.length);
      const city = CITIES[cityIdx]!;

      const minutesAgo = Math.floor(rand() * 55) + 2;
      const timeAgo =
        minutesAgo < 60
          ? t('ticker.timeAgo.minutes', { count: minutesAgo })
          : t('ticker.timeAgo.hours', { count: Math.floor(minutesAgo / 60) });

      if (r < 0.45) {
        const amtIdx = Math.floor(rand() * AMOUNTS.length);
        events.push({
          id: `ticker-${i}`,
          type: 'investment',
          message: t('ticker.investment', {
            city,
            amount: formatCurrency(AMOUNTS[amtIdx]!),
          }),
          timeAgo,
        });
      } else if (r < 0.75) {
        const gramIdx = Math.floor(rand() * GRAMS.length);
        events.push({
          id: `ticker-${i}`,
          type: 'earning',
          message: t('ticker.earning', { grams: GRAMS[gramIdx]!.toFixed(2) + 'g' }),
          timeAgo,
        });
      } else {
        const payIdx = Math.floor(rand() * PAYOUT_AMOUNTS.length);
        events.push({
          id: `ticker-${i}`,
          type: 'payout',
          message: t('ticker.payout', {
            city,
            amount: formatCurrency(PAYOUT_AMOUNTS[payIdx]!),
          }),
          timeAgo,
        });
      }
    }

    return events;
  }, [simulationDate, t]);
}
