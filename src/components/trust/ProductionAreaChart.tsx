import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';
import { formatInteger } from '@/lib/formatters';
import { trustData } from '@/services/mock/data/trust';
import { useTranslation } from '@/i18n';

export function ProductionAreaChart() {
  const { t } = useTranslation();

  const data = trustData.miningOperations.monthly.map((m) => ({
    month: m.label,
    extracted: m.extracted,
    sold: m.sold,
  }));

  return (
    <Card variant="stat" className="p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-1">{t('trust.reserves.monthlyProduction')}</h3>
      <p className="text-xs text-text-muted mb-4">
        {trustData.miningOperations.period} — {t('trust.reserves.gExtracted', { amount: formatInteger(trustData.miningOperations.totalExtracted) })}
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-muted)" />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 8,
            }}
            formatter={(value: number) => [`${formatInteger(value)}g`]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area
            type="monotone"
            dataKey="extracted"
            name={t('trust.reserves.extracted')}
            fill="var(--color-primary)"
            fillOpacity={0.15}
            stroke="var(--color-primary)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="sold"
            name={t('trust.reserves.sold')}
            fill="var(--color-success)"
            fillOpacity={0.1}
            stroke="var(--color-success)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
