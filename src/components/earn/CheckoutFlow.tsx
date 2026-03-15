import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useEarnStore } from '@/stores/earnStore';
import { useSimulationStore } from '@/stores/simulation';
import { useNotificationStore } from '@/stores/notificationStore';
import { useTranslation } from '@/i18n';
import { createParticipation } from '@/services/earnService';
import { formatInteger } from '@/lib/formatters';
import { calculateProjection } from '@/lib/rewardEngine';
import { getTierDiscount } from '@/services/mock/helpers';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { OrderSummary } from './OrderSummary';
import { PaymentMethods } from './PaymentMethods';
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters';
import type { CreateParticipationResponse } from '@/services/earnService';

export function CheckoutFlow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { amount, termMonths, autoActivate, reset } = useEarnStore();
  const prices = useSimulationStore((s) => s.prices);
  const [paymentMethod, setPaymentMethod] = useState('apple-pay');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateParticipationResponse | null>(null);

  // Redirect if store is empty / invalid
  useEffect(() => {
    if (amount < 100) {
      navigate('/participate', { replace: true });
    }
  }, [amount, navigate]);

  const projection = useMemo(() => {
    if (amount < 100) return null;
    return calculateProjection(
      amount,
      termMonths,
      prices.ayniUsd,
      prices.goldPerGram,
      prices.paxgUsd,
      getTierDiscount(),
    );
  }, [amount, termMonths, prices]);

  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const firstPayoutDate = useMemo(() => {
    const d = new Date(simulationDate);
    d.setMonth(d.getMonth() + 3);
    return d.toISOString();
  }, [simulationDate]);

  const total = amount + amount * 0.005;
  const tokensReceived = projection?.ayniTokenAmount ?? amount / prices.ayniUsd;

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await createParticipation({
        amount,
        termMonths,
        autoActivate,
        paymentMethod,
        currency: 'USD',
      });
      setResult(res);
      useNotificationStore.getState().addNotification({
        type: 'participation_created',
        message: '',
        params: { amount: formatInteger(tokensReceived), term: termMonths },
      });
      // Invalidate all queries so dashboard/portfolio refresh
      queryClient.invalidateQueries();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToPortfolio = () => {
    reset();
    setResult(null);
    navigate('/positions');
  };

  const handleInvestMore = () => {
    reset();
    setResult(null);
    navigate('/participate');
  };

  if (amount < 100) return null;

  return (
    <div className="max-w-[560px] mx-auto">
      <OrderSummary
        amount={amount}
        termMonths={termMonths}
        firstPayoutDate={firstPayoutDate}
        ayniAmount={tokensReceived}
        ayniPrice={prices.ayniUsd}
      />

      <PaymentMethods
        selected={paymentMethod}
        onSelect={setPaymentMethod}
        amount={total}
        className="mt-6"
      />

      <Button
        variant="primary"
        fullWidth
        loading={submitting}
        disabled={submitting}
        className="h-14 mt-6 text-base"
        onClick={handleSubmit}
      >
        {t('checkout.payButton', { amount: formatCurrency(total) })}
      </Button>

      {error && <p className="text-sm text-error text-center">{error}</p>}

      <button
        type="button"
        className="text-body-sm text-primary text-center mt-4 cursor-pointer hover:underline w-full"
      >
        {t('earn.page.otcLink')}
      </button>

      {/* Success modal */}
      <Modal
        open={result !== null}
        onClose={handleGoToPortfolio}
        title={t('checkout.successTitle')}
      >
        {result && (
          <div className="flex flex-col items-center text-center">
            <div className="text-[48px] leading-none mb-4" aria-hidden="true">
              🎉
            </div>

            <div className="w-full space-y-2 mt-2">
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">{t('checkout.amountLabel')}</span>
                <span className="text-text-primary font-medium">
                  {formatCurrency(result.amount)}
                </span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">{t('checkout.tokensLabel')}</span>
                <span className="text-text-primary font-medium">
                  {formatNumber(tokensReceived)} AYNI
                </span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">{t('checkout.termLabel')}</span>
                <span className="text-text-primary font-medium">
                  {result.termMonths} {t('common.months')}
                </span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">{t('checkout.estimatedDaily')}</span>
                <span className="text-text-primary font-medium">
                  {formatCurrency(projection?.dailyRewardUsd ?? 0)}
                </span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">{t('checkout.estimatedEarnings')}</span>
                <span className="text-text-primary font-medium">
                  {formatCurrency(result.estimatedDistributions)}
                </span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-text-secondary">{t('checkout.firstPayout')}</span>
                <span className="text-text-primary font-medium">
                  {formatDate(result.firstPayoutDate)}
                </span>
              </div>
            </div>

            {!autoActivate && (
              <p className="text-sm text-text-secondary mt-4 bg-surface-secondary rounded-lg p-3">
                {t('checkout.successFreeBalance')}
              </p>
            )}

            <div className="flex gap-3 w-full mt-6">
              <Button variant="primary" fullWidth className="h-14" onClick={handleGoToPortfolio}>
                {autoActivate ? t('checkout.viewPortfolio') : t('checkout.viewBalance')}
              </Button>
              <Button variant="secondary" fullWidth className="h-14" onClick={handleInvestMore}>
                {t('checkout.investMore')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
