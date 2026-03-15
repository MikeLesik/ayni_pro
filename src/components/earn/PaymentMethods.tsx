import { useState } from 'react';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

type PaymentMethodId =
  | 'apple-pay'
  | 'google-pay'
  | 'card-sepa'
  | 'binance-pay'
  | 'usdt'
  | 'usdc'
  | 'eth';

interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  icon: React.ReactNode;
}

const cardMethods: PaymentOption[] = [
  { id: 'apple-pay', label: 'Apple Pay', icon: <Smartphone size={20} /> },
  { id: 'google-pay', label: 'Google Pay', icon: <Smartphone size={20} /> },
  { id: 'card-sepa', label: 'Card / SEPA', icon: <CreditCard size={20} /> },
];

const cryptoMethods: PaymentOption[] = [
  { id: 'binance-pay', label: 'Binance Pay', icon: <Wallet size={20} /> },
  { id: 'usdt', label: 'USDT', icon: <Wallet size={20} /> },
  { id: 'usdc', label: 'USDC', icon: <Wallet size={20} /> },
  { id: 'eth', label: 'ETH', icon: <Wallet size={20} /> },
];

const currencies = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
];

const exchangeRates: Record<string, number> = {
  EUR: 1.075,
  USD: 1,
  GBP: 1.27,
};

export interface PaymentMethodsProps {
  selected: string;
  onSelect: (id: string) => void;
  amount: number;
  className?: string;
}

function MethodCard({
  option,
  isSelected,
  onSelect,
}: {
  option: PaymentOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 rounded-lg border-[1.5px] p-4 text-left transition-all duration-200 w-full',
        isSelected
          ? 'border-primary shadow-sm bg-primary-light'
          : 'border-border hover:border-primary/50',
      )}
    >
      <span className="text-text-secondary">{option.icon}</span>
      <span className="text-body-md text-text-primary">{option.label}</span>
    </button>
  );
}

export function PaymentMethods({ selected, onSelect, amount, className }: PaymentMethodsProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState('card');
  const [currency, setCurrency] = useState('EUR');
  const methods = tab === 'card' ? cardMethods : cryptoMethods;
  const rate = exchangeRates[currency] ?? 1;
  const convertedAmount = currency === 'USD' ? amount : amount / rate;
  const fee = convertedAmount * 0.005;

  const tabItems = [
    { id: 'card', label: t('earn.paymentMethods.tabCard') },
    { id: 'crypto', label: t('earn.paymentMethods.tabCrypto') },
  ];

  return (
    <Card variant="stat" className={cn('p-6', className)}>
      <h3 className="text-heading-3 text-text-primary mb-4">{t('earn.paymentMethods.title')}</h3>

      <Tabs items={tabItems} activeId={tab} onChange={setTab} variant="pill" />

      <div className="grid gap-3 mt-4">
        {methods.map((m) => (
          <MethodCard
            key={m.id}
            option={m}
            isSelected={selected === m.id}
            onSelect={() => onSelect(m.id)}
          />
        ))}
      </div>

      {tab === 'card' && (
        <div className="mt-4 space-y-2">
          <Select
            options={currencies}
            value={currency}
            onChange={setCurrency}
            label={t('earn.paymentMethods.currencyLabel')}
          />
          <p className="text-body-sm text-text-secondary">
            {t('earn.paymentMethods.youllPay')}{' '}
            {currency !== 'USD'
              ? `${currency === 'EUR' ? '€' : '£'}${convertedAmount.toFixed(2)} (rate: 1 ${currency} = $${rate.toFixed(3)})`
              : `$${amount.toFixed(2)}`}
          </p>
          {currency !== 'USD' && (
            <p className="text-body-sm text-text-muted">
              {t('earn.paymentMethods.cardFee')} {currency === 'EUR' ? '€' : '£'}
              {fee.toFixed(2)} {t('earn.paymentMethods.includedAbove')}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
