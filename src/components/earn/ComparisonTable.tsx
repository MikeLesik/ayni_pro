import { useTranslation } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import { Check } from 'lucide-react';

interface ComparisonTableProps {
  ayniDailyUsd: number;
  ayniAnnualYield: number;
  investmentAmount: number;
  termMonths: number;
  className?: string;
}

interface Column {
  name: string;
  highlight?: boolean;
  yield: string;
  earnings: string;
  backing: string;
  payout: string;
  hasYield: boolean;
}

export function ComparisonTable({
  ayniDailyUsd,
  ayniAnnualYield,
  investmentAmount,
  termMonths,
  className,
}: ComparisonTableProps) {
  const { t } = useTranslation();

  const termYears = termMonths / 12;
  const ayniTotal = ayniDailyUsd * termMonths * 30;
  const bankTotal = investmentAmount * 0.04 * termYears;
  const sp500Total = investmentAmount * 0.1 * termYears;
  const defiTotal = investmentAmount * 0.08 * termYears;

  const columns: Column[] = [
    {
      name: 'AYNI Gold',
      highlight: true,
      yield: `~${ayniAnnualYield.toFixed(1)}%`,
      earnings: formatCurrency(ayniTotal),
      backing: t('comparison.backing.mining'),
      payout: t('comparison.payout.quarterly'),
      hasYield: true,
    },
    {
      name: t('comparison.bank.name'),
      yield: '~4%',
      earnings: formatCurrency(bankTotal),
      backing: t('comparison.backing.fdic'),
      payout: t('comparison.payout.monthly'),
      hasYield: true,
    },
    {
      name: t('comparison.paxg.name'),
      yield: '0%',
      earnings: t('comparison.payout.na'),
      backing: t('comparison.backing.goldPrice'),
      payout: t('comparison.payout.na'),
      hasYield: false,
    },
    {
      name: t('comparison.sp500.name'),
      yield: '~10%',
      earnings: formatCurrency(sp500Total),
      backing: t('comparison.backing.stocks'),
      payout: t('comparison.payout.dividends'),
      hasYield: true,
    },
    {
      name: t('comparison.defi.name'),
      yield: '~8%',
      earnings: formatCurrency(defiTotal),
      backing: t('comparison.backing.smartContract'),
      payout: t('comparison.payout.variable'),
      hasYield: true,
    },
  ];

  const rows = [
    { key: 'yield', label: t('comparison.col.yield') },
    { key: 'earnings', label: t('comparison.col.earnings', { months: termMonths }) },
    { key: 'backing', label: t('comparison.col.backing') },
    { key: 'payout', label: t('comparison.col.payout') },
  ] as const;

  return (
    <div className={className}>
      <h3 className="mb-1 text-base font-semibold text-text-primary">{t('comparison.title')}</h3>
      <p className="mb-3 text-sm text-text-secondary">
        {t('comparison.subtitle', { amount: formatCurrency(investmentAmount) })}
      </p>

      <Card variant="stat" padding="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border-light">
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-text-muted" />
                {columns.map((col) => (
                  <th
                    key={col.name}
                    className={cn(
                      'px-3 py-2.5 text-center text-xs font-semibold',
                      col.highlight
                        ? 'bg-primary-light text-primary'
                        : 'text-text-primary',
                    )}
                  >
                    <span className="flex items-center justify-center gap-1">
                      {col.highlight && <Check size={12} className="text-primary" />}
                      {col.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={row.key}
                  className={cn(ri < rows.length - 1 && 'border-b border-border-light')}
                >
                  <td className="px-3 py-2.5 text-xs font-medium text-text-muted whitespace-nowrap">
                    {row.label}
                  </td>
                  {columns.map((col) => {
                    const value = col[row.key];
                    return (
                      <td
                        key={col.name}
                        className={cn(
                          'px-3 py-2.5 text-center text-sm tabular-nums',
                          col.highlight
                            ? 'bg-primary-light font-semibold text-text-primary'
                            : 'text-text-secondary',
                        )}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-2 text-center text-xs italic text-text-muted">
        {t('comparison.disclaimer')}
      </p>
    </div>
  );
}
