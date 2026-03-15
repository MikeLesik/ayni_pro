import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Tooltip } from '@/components/ui/Tooltip';
import { useStakeAyni } from '@/hooks/usePortfolio';
import { calculateProjection } from '@/lib/rewardEngine';
import { getTierDiscount } from '@/services/mock/helpers';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { useTranslation } from '@/i18n';

interface StakeModalProps {
  open: boolean;
  onClose: () => void;
  ayniAvailable: number;
  prices: { ayniUsd: number; goldPerGram: number; paxgUsd: number };
}

const MIN_PARTICIPATION_USD = 100;

export function StakeModal({ open, onClose, ayniAvailable, prices }: StakeModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [termMonths, setTermMonths] = useState(12);
  const activateMutation = useStakeAyni();

  useEffect(() => {
    if (open) {
      setAmount('');
      setTermMonths(12);
    }
  }, [open]);

  const ayniAmount = Number(amount) || 0;
  const usdValue = ayniAmount * prices.ayniUsd;
  const maxUsdValue = ayniAvailable * prices.ayniUsd;
  const isBelowMinimum = usdValue < MIN_PARTICIPATION_USD;
  const isOverMax = ayniAmount > ayniAvailable;
  const neededUsd = MIN_PARTICIPATION_USD - maxUsdValue;

  const projection = useMemo(() => {
    if (isBelowMinimum || isOverMax || ayniAmount <= 0) return null;
    return calculateProjection(
      usdValue,
      termMonths,
      prices.ayniUsd,
      prices.goldPerGram,
      prices.paxgUsd,
      getTierDiscount(),
    );
  }, [usdValue, termMonths, prices, isBelowMinimum, isOverMax, ayniAmount]);

  const handleMax = () => setAmount(ayniAvailable.toFixed(4));

  const handleActivate = async () => {
    try {
      await activateMutation.mutateAsync({ ayniAmount, termMonths });
      setAmount('');
      onClose();
    } catch {
      // error handled by mutation state
    }
  };

  const handleTopUp = () => {
    const topUpAmount = Math.ceil(neededUsd);
    onClose();
    navigate(`/participate?topup=${topUpAmount}`);
  };

  const entireBalanceBelowMin = maxUsdValue < MIN_PARTICIPATION_USD;

  return (
    <Modal open={open} onClose={onClose} title={t('portfolio.activateModal.title')}>
      <div className="space-y-4">
        {/* Available balance — USD primary, AYNI secondary */}
        <div className="rounded-lg bg-surface-secondary p-4 space-y-1 text-sm">
          <div className="flex justify-between items-baseline">
            <span className="text-text-secondary">{t('portfolio.activateModal.available')}</span>
            <span className="text-text-primary tabular-nums font-semibold text-base">
              {formatCurrency(maxUsdValue)}
            </span>
          </div>
          <div className="flex justify-end">
            <span className="text-text-muted tabular-nums text-xs">
              {formatNumber(ayniAvailable, 4)} AYNI
            </span>
          </div>
        </div>

        {/* Entire balance below minimum — show top-up only */}
        {entireBalanceBelowMin && (
          <div className="p-3 bg-warning/10 rounded-lg text-sm text-warning flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              {t('portfolio.activateModal.minimumWarning', {
                amount: formatCurrency(maxUsdValue),
                needed: formatCurrency(neededUsd),
              })}
            </span>
          </div>
        )}

        {entireBalanceBelowMin ? (
          <Button variant="primary" fullWidth onClick={handleTopUp}>
            {t('portfolio.activateModal.topUpButton', { amount: formatCurrency(neededUsd) })}
          </Button>
        ) : (
          <>
            {/* Amount input */}
            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t('portfolio.activateModal.amountLabel')}
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  max={ayniAvailable}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0000"
                  className="w-full rounded-lg border border-border-default bg-surface-card px-3 py-2.5 pr-16 text-sm text-text-primary tabular-nums placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleMax}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:text-primary-hover transition-colors px-2 py-1 rounded"
                >
                  {t('common.max')}
                </button>
              </div>
              {ayniAmount > 0 && !isOverMax && (
                <p className="text-xs text-text-muted mt-1">~{formatCurrency(usdValue)}</p>
              )}
              {isOverMax && (
                <p className="text-xs text-error mt-1">
                  {t('portfolio.activateModal.exceedsBalance')}
                </p>
              )}
            </div>

            {/* Below min warning for partial amount */}
            {ayniAmount > 0 && isBelowMinimum && !isOverMax && (
              <div className="p-3 bg-warning/10 rounded-lg text-sm text-warning flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  {t('portfolio.activateModal.minimumWarning', {
                    amount: formatCurrency(usdValue),
                    needed: formatCurrency(MIN_PARTICIPATION_USD - usdValue),
                  })}
                </span>
              </div>
            )}

            {/* Term selector + projection */}
            {ayniAmount > 0 && !isBelowMinimum && !isOverMax && (
              <>
                <div>
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium text-text-secondary">
                      {t('portfolio.activateModal.termLabel')}
                    </label>
                    <Tooltip content={t('portfolio.activateModal.termTooltip')}>
                      <button
                        type="button"
                        className="text-text-muted hover:text-text-secondary transition-colors"
                      >
                        <Info size={13} />
                      </button>
                    </Tooltip>
                  </div>
                  <Slider value={termMonths} onChange={setTermMonths} className="mt-2" />
                </div>

                {projection && (
                  <div className="p-3 bg-primary/10 rounded-lg text-sm space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        {t('portfolio.activateModal.estimatedDaily')}
                      </span>
                      <span className="font-medium text-text-primary tabular-nums">
                        {formatCurrency(projection.dailyRewardUsd)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        {t('portfolio.activateModal.annualReturn')}
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
              onClick={handleActivate}
              disabled={
                ayniAmount <= 0 || isBelowMinimum || isOverMax || activateMutation.isPending
              }
              className="mt-2"
            >
              {activateMutation.isPending
                ? t('common.processing')
                : t('portfolio.activateModal.activateButton', { amount: formatNumber(ayniAmount) })}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
