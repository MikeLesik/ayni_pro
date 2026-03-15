import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { formatCurrency, formatDate, formatNumber, formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/cn';

export interface OrderSummaryProps {
  amount: number;
  termMonths: number;
  firstPayoutDate: string;
  ayniAmount?: number;
  ayniPrice?: number;
  className?: string;
}

export function OrderSummary({
  amount,
  termMonths,
  firstPayoutDate,
  ayniAmount,
  ayniPrice,
  className,
}: OrderSummaryProps) {
  const { t } = useTranslation();
  const fee = amount * 0.005;
  const total = amount + fee;

  const rows = [
    { label: t('checkout.orderSummary.investmentAmount'), value: formatCurrency(amount) },
    ...(ayniAmount
      ? [
          {
            label: t('checkout.orderSummary.youReceive'),
            value: `~${formatNumber(ayniAmount)} AYNI`,
          },
        ]
      : []),
    ...(ayniPrice
      ? [{ label: t('checkout.orderSummary.currentPrice'), value: formatPrice(ayniPrice) }]
      : []),
    { label: t('checkout.orderSummary.term'), value: `${termMonths} ${t('common.months')}` },
    { label: t('checkout.orderSummary.firstPayout'), value: formatDate(firstPayoutDate) },
  ];

  return (
    <Card variant="stat" className={cn('p-6', className)}>
      <h3 className="text-heading-3 text-text-primary">{t('checkout.orderSummary.title')}</h3>

      <div className="mt-4">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between py-2">
            <span className="text-body-md text-text-secondary">{row.label}</span>
            <span className="text-body-md text-text-primary">{row.value}</span>
          </div>
        ))}

        {/* Divider */}
        <div className="border-t border-border-light my-1" />

        <div className="flex justify-between py-2">
          <span className="text-body-md text-text-secondary">
            {t('checkout.orderSummary.processingFee')}
          </span>
          <span className="text-body-md text-text-primary">{formatCurrency(fee)} (0.5%)</span>
        </div>

        {/* Divider */}
        <div className="border-t border-border-light my-1" />

        <div className="flex justify-between py-2">
          <span className="text-heading-3 text-text-primary font-bold">
            {t('checkout.orderSummary.total')}
          </span>
          <span className="text-heading-3 text-primary font-bold">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-muted mt-4 leading-relaxed">
        {t('checkout.disclaimer.medium')}
      </p>
    </Card>
  );
}
