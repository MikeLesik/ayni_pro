import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { useSimulationStore } from '@/stores/simulation';

export function ProductionChart() {
  const { t } = useTranslation();
  const positions = useSimulationStore((s) => s.positions);

  const chartData = useMemo(() => {
    const dailyMap = new Map<string, number>();

    for (const pos of positions) {
      if (pos.status !== 'active' && pos.status !== 'completed') continue;
      for (const reward of pos.dailyRewards) {
        const dateKey = reward.date.split('T')[0]!;
        dailyMap.set(dateKey, (dailyMap.get(dateKey) ?? 0) + reward.netRewardGrams);
      }
    }

    const sorted = [...dailyMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7);

    return sorted.map(([date, grams]) => {
      const d = new Date(date);
      const dayName = d.toLocaleDateString('en', { weekday: 'short' });
      return { day: dayName, grams: Number(grams.toFixed(4)) };
    });
  }, [positions]);

  if (chartData.length === 0) {
    return (
      <Card variant="stat" className="p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          {t('mine.chart.title')}
        </h3>
        <p className="text-sm text-text-muted text-center py-6">{t('mine.chart.noData')}</p>
      </Card>
    );
  }

  return (
    <Card variant="stat" className="p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">
        {t('mine.chart.title')}
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-light)" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(4)}g`, t('mine.chart.grams')]}
            contentStyle={{
              fontSize: 12,
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 8,
            }}
          />
          <Bar dataKey="grams" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
