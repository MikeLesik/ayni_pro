import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { useWithdrawPaxg, useWithdrawAyni } from '@/hooks/usePortfolio';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { useTranslation } from '@/i18n';

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  ayniAvailable: number;
  paxgBalance: number;
  prices: { paxgUsd: number; ayniUsd: number };
  defaultTab?: 'paxg' | 'ayni';
  walletAddress?: string;
}

export function WithdrawModal({
  open,
  onClose,
  ayniAvailable,
  paxgBalance,
  prices,
  defaultTab = 'paxg',
  walletAddress,
}: WithdrawModalProps) {
  const [tab, setTab] = useState(defaultTab);
  const [amount, setAmount] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setAmount('');
    }
  }, [open, defaultTab]);

  const withdrawPaxgMutation = useWithdrawPaxg();
  const withdrawAyniMutation = useWithdrawAyni();

  const isPending = withdrawPaxgMutation.isPending || withdrawAyniMutation.isPending;

  const parsedAmount = parseFloat(amount) || 0;
  const maxAmount = tab === 'ayni' ? ayniAvailable : paxgBalance;
  const isOverMax = parsedAmount > maxAmount;
  const isValid = parsedAmount > 0 && !isOverMax;

  const usdValue = tab === 'ayni' ? parsedAmount * prices.ayniUsd : parsedAmount * prices.paxgUsd;

  const handleWithdraw = async () => {
    try {
      if (tab === 'ayni') {
        await withdrawAyniMutation.mutateAsync(parsedAmount);
      } else {
        await withdrawPaxgMutation.mutateAsync(parsedAmount);
      }
      setAmount('');
      onClose();
    } catch {
      // error handled by mutation state
    }
  };

  const handleMax = () => {
    setAmount(maxAmount.toString());
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab as 'ayni' | 'paxg');
    setAmount('');
  };

  const tabItems = [
    { id: 'paxg', label: `PAXG (${paxgBalance.toFixed(6)})` },
    { id: 'ayni', label: `AYNI (${formatNumber(ayniAvailable)})` },
  ];

  return (
    <Modal open={open} onClose={onClose} title={t('portfolio.withdrawModal.title')}>
      <div className="space-y-4">
        <Tabs items={tabItems} activeId={tab} onChange={handleTabChange} variant="pill" size="sm" />

        <div>
          <Input
            label={t('portfolio.withdrawModal.amountLabel', { token: tab.toUpperCase() })}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            error={isOverMax ? t('portfolio.withdrawModal.exceedsBalance') : undefined}
            helperText={
              tab === 'ayni'
                ? t('portfolio.withdrawModal.ayniHelper', {
                    amount: formatNumber(ayniAvailable, 4),
                    usdValue: formatCurrency(ayniAvailable * prices.ayniUsd),
                  })
                : t('portfolio.withdrawModal.paxgHelper', {
                    amount: paxgBalance.toFixed(8),
                    usdValue: formatCurrency(paxgBalance * prices.paxgUsd),
                  })
            }
          />
          <Button variant="text" onClick={handleMax} className="text-xs font-medium mt-1">
            {t('common.max')}
          </Button>
        </div>

        {parsedAmount > 0 && !isOverMax && (
          <div className="rounded-lg bg-surface-secondary p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">{t('portfolio.withdrawModal.youWithdraw')}</span>
              <span className="text-text-primary font-medium tabular-nums">
                {tab === 'ayni' ? formatNumber(parsedAmount, 4) : parsedAmount.toFixed(8)}{' '}
                {tab.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-text-muted">{t('portfolio.withdrawModal.estimatedValue')}</span>
              <span className="text-text-primary tabular-nums">{formatCurrency(usdValue)}</span>
            </div>
          </div>
        )}

        <div className="p-3 bg-surface-secondary rounded-lg text-xs text-text-muted space-y-1">
          <p>{t('portfolio.withdrawModal.walletInfo')}</p>
          {walletAddress ? (
            <p className="font-mono text-text-primary break-all">{walletAddress}</p>
          ) : (
            <p className="text-warning">{t('portfolio.withdrawModal.noWalletWarning')}</p>
          )}
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleWithdraw}
          disabled={!isValid || isPending}
        >
          {isPending
            ? t('common.processing')
            : t('portfolio.withdrawModal.withdrawButton', {
                amount: amount || '0',
                token: tab.toUpperCase(),
              })}
        </Button>
      </div>
    </Modal>
  );
}
