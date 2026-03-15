import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { useReinvest } from '@/hooks/usePortfolio';
import { calculateProjection } from '@/lib/rewardEngine';
import { getTierDiscount } from '@/services/mock/helpers';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { SWAP_FEE_RATE } from '@/lib/constants';
import { useTranslation } from '@/i18n';

interface ReinvestModalProps {
  open: boolean;
  onClose: () => void;
  paxgBalance: number;
  prices: { paxgUsd: number; ayniUsd: number; goldPerGram: number };
}

export function ReinvestModal({ open, onClose, paxgBalance, prices }: ReinvestModalProps) {
  const [termMonths, setTermMonths] = useState(12);
  const reinvestMutation = useReinvest();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setTermMonths(12);
    }
  }, [open]);

  const grossUsd = paxgBalance * prices.paxgUsd;
  const swapFeeUsd = grossUsd * SWAP_FEE_RATE;
  const netUsd = grossUsd - swapFeeUsd;
  const ayniAmount = prices.ayniUsd > 0 ? netUsd / prices.ayniUsd : 0;
  const isBelowMinimum = netUsd < 100;

  const projection = !isBelowMinimum
    ? calculateProjection(netUsd, termMonths, prices.ayniUsd, prices.goldPerGram, prices.paxgUsd, getTierDiscount())
    : null;

  const handleReinvest = async () => {
    try {
      await reinvestMutation.mutateAsync({ amountPaxg: paxgBalance, termMonths });
      onClose();
    } catch {
      // error handled by mutation state
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t('portfolio.reinvestModal.title')}>
      <div className="space-y-4">
        {/* Conversion breakdown */}
        <div className="rounded-lg bg-surface-secondary p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('portfolio.reinvestModal.yourPaxgRewards')}
            </span>
            <span className="text-text-primary tabular-nums">{paxgBalance.toFixed(8)} PAXG</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">{t('portfolio.reinvestModal.value')}</span>
            <span className="text-text-primary tabular-nums">{formatCurrency(grossUsd)}</span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>{t('portfolio.reinvestModal.conversionFee')}</span>
            <span className="tabular-nums">-{formatCurrency(swapFeeUsd)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border-light font-medium">
            <span className="text-text-secondary">{t('portfolio.reinvestModal.youReceive')}</span>
            <span className="text-text-primary tabular-nums">
              {formatNumber(ayniAmount, 4)} AYNI (~{formatCurrency(netUsd)})
            </span>
          </div>
        </div>

        <p className="text-xs text-text-muted">{t('portfolio.reinvestModal.conversionInfo')}</p>

        {/* Minimum warning */}
        {isBelowMinimum && (
          <div className="p-3 bg-warning/10 rounded-lg text-sm text-warning flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              {t('portfolio.reinvestModal.minimumWarning', {
                amount: formatCurrency(netUsd),
                needed: formatCurrency(100 - netUsd),
              })}
            </span>
          </div>
        )}

        {/* Term selector + projection */}
        {!isBelowMinimum && (
          <>
            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t('portfolio.reinvestModal.stakingTerm')}
              </label>
              <Slider value={termMonths} onChange={setTermMonths} className="mt-2" />
            </div>

            {projection && (
              <div className="p-3 bg-primary/10 rounded-lg text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {t('portfolio.reinvestModal.estimatedDaily')}
                  </span>
                  <span className="font-medium text-text-primary tabular-nums">
                    {formatCurrency(projection.dailyRewardUsd)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {t('portfolio.reinvestModal.annualReturn')}
                  </span>
                  <span className="font-medium text-success tabular-nums">
                    ~{projection.estimatedOutputPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        <Button
          variant="primary"
          fullWidth
          onClick={handleReinvest}
          disabled={isBelowMinimum || reinvestMutation.isPending}
          className="mt-2"
        >
          {reinvestMutation.isPending
            ? t('common.processing')
            : isBelowMinimum
              ? t('portfolio.reinvestModal.minimumRequired', {
                  amount: formatCurrency(100 - netUsd),
                })
              : t('portfolio.reinvestModal.reinvestButton', {
                  paxg: paxgBalance.toFixed(6),
                  ayni: formatNumber(ayniAmount),
                })}
        </Button>
      </div>
    </Modal>
  );
}
