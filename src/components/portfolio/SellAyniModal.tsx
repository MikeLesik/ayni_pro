import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatNumber, formatCurrency, formatPrice } from '@/lib/formatters';
import { AYNI_PRICE_USD } from '@/lib/ayniPrice';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/i18n';
import type { Position } from '@/types/portfolio';

interface SellAyniModalProps {
  open: boolean;
  onClose: () => void;
  /** Pass a position (completed positions) OR ayniAmount (free balance) */
  position?: Position | null;
  ayniAmount?: number;
}

export function SellAyniModal({
  open,
  onClose,
  position,
  ayniAmount: directAmount,
}: SellAyniModalProps) {
  const { t } = useTranslation();

  const amount = directAmount ?? position?.ayniAmount ?? 0;
  if (amount <= 0 && !position) {
    return (
      <Modal open={open} onClose={onClose} title={t('portfolio.sellAyniModal.title')}>
        <div className="py-6 text-center">
          <p className="text-text-secondary text-sm">{t('portfolio.sellAyniModal.noBalance')}</p>
          <Button variant="secondary" onClick={onClose} className="mt-4">
            {t('common.close')}
          </Button>
        </div>
      </Modal>
    );
  }

  const estimatedValue = amount * AYNI_PRICE_USD;

  return (
    <Modal open={open} onClose={onClose} title={t('portfolio.sellAyniModal.title')}>
      <div className="space-y-4">
        {/* Balance summary */}
        <div className="rounded-lg bg-surface-secondary p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t('portfolio.sellAyniModal.availableAyni')}</span>
            <span className="text-text-primary font-semibold tabular-nums">
              {formatNumber(amount)} AYNI
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t('portfolio.sellAyniModal.currentPrice')}</span>
            <span className="text-text-primary font-medium tabular-nums">
              {formatPrice(AYNI_PRICE_USD)}
            </span>
          </div>
          <div className="border-t border-border-light pt-2 flex justify-between text-sm">
            <span className="text-text-muted">{t('portfolio.sellAyniModal.estimatedValue')}</span>
            <span className="text-text-primary font-semibold tabular-nums">
              {formatCurrency(estimatedValue)}
            </span>
          </div>
        </div>

        {/* How to sell steps */}
        <div>
          <p className="text-sm font-medium text-text-primary mb-2">
            {t('portfolio.sellAyniModal.howToSell')}
          </p>
          <ol className="space-y-2">
            <li className="flex items-start gap-2 text-body-sm text-text-secondary">
              <span className="flex-none w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                1
              </span>
              {t('portfolio.sellAyniModal.step1')}
            </li>
            <li className="flex items-start gap-2 text-body-sm text-text-secondary">
              <span className="flex-none w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                2
              </span>
              {t('portfolio.sellAyniModal.step2')}
            </li>
            <li className="flex items-start gap-2 text-body-sm text-text-secondary">
              <span className="flex-none w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                3
              </span>
              {t('portfolio.sellAyniModal.step3')}
            </li>
          </ol>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3">
          <AlertTriangle size={16} className="text-warning flex-none mt-0.5" />
          <p className="text-body-sm text-text-secondary">
            {t('portfolio.sellAyniModal.priceWarning')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {t('common.close')}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => window.open('https://app.uniswap.org', '_blank')}
          >
            {t('portfolio.sellAyniModal.goToExchange')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
