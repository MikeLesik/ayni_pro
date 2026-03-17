import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEarnStore } from '@/stores/earnStore';
import { useEarnProjection } from '@/hooks/useEarnProjection';
import { useTranslation } from '@/i18n';
import { EarningCalculator } from '@/components/earn/EarningCalculator';
import { OtcFlow } from '@/components/earn/OtcFlow';
import { ProjectionCard } from '@/components/earn/ProjectionCard';
import { HowItWorks } from '@/components/earn/HowItWorks';
import { TrustBadges } from '@/components/earn/TrustBadges';
import { PaymentMethodsStrip } from '@/components/earn/PaymentMethodsStrip';
import { ComparisonTable } from '@/components/earn/ComparisonTable';
import { ActivityTicker } from '@/components/shared/ActivityTicker';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/formatters';

export default function EarnPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { amount, termMonths, setAmount, setAutoActivate } = useEarnStore();

  // Pre-fill amount from ?topup=X and optionally disable auto-activate
  useEffect(() => {
    const topup = searchParams.get('topup');
    if (topup) {
      const val = Number(topup);
      if (val > 0) setAmount(Math.max(100, val));
    }
    if (searchParams.get('activate') === '0') {
      setAutoActivate(false);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: projection, isFetching, isStale } = useEarnProjection(amount, termMonths);
  const isOtc = amount >= 5000;
  const otcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOtc && otcRef.current) {
      otcRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isOtc]);

  return (
    <div className="pt-4 pb-[calc(6.5rem+env(safe-area-inset-bottom,0.75rem))] md:pt-6 lg:pb-24">
      {/* Header */}
      <div className="mb-3 text-center sm:text-left">
        <h1 className="font-display text-heading-1 text-text-primary">{t('earn.page.title')}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{t('earn.page.subtitle')}</p>
      </div>

      {/* Live activity ticker */}
      <ActivityTicker className="mb-3" />

      {/* 2-column layout on desktop */}
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-5 lg:items-stretch">
        {/* Left column: Calculator + OTC form below */}
        <div>
          <EarningCalculator
            dailyEarningsUsd={projection?.dailyDistributions}
            annualYieldPercent={projection?.annualYieldPercent}
          />
          {isOtc && (
            <div ref={otcRef}>
              <OtcFlow className="mt-4" />
            </div>
          )}
        </div>

        {/* Right column: ProjectionCard (desktop sidebar) */}
        {projection && (
          <div className="hidden lg:block sticky top-24 h-full">
            <ProjectionCard
              estimatedDistributions={projection.estimatedDistributions}
              monthlyDistributions={projection.monthlyDistributions}
              dailyDistributions={projection.dailyDistributions}
              totalGoldGrams={projection.totalGoldGrams}
              monthlyGoldGrams={projection.monthlyGoldGrams}
              dailyGoldGrams={projection.dailyGoldGrams}
              firstPayoutDate={projection.firstPayoutDate}
              termMonths={termMonths}
              ayniTokenAmount={projection.tokensReceived}
              quarterlyProjections={projection.quarterlyProjections}
              totalPayouts={projection.totalPayouts}
              loading={isFetching || isStale}
            />
          </div>
        )}

        {/* Mobile: ProjectionCard inline after calculator */}
        {projection && (
          <div className="lg:hidden mt-4">
            <ProjectionCard
              estimatedDistributions={projection.estimatedDistributions}
              monthlyDistributions={projection.monthlyDistributions}
              dailyDistributions={projection.dailyDistributions}
              totalGoldGrams={projection.totalGoldGrams}
              monthlyGoldGrams={projection.monthlyGoldGrams}
              dailyGoldGrams={projection.dailyGoldGrams}
              firstPayoutDate={projection.firstPayoutDate}
              termMonths={termMonths}
              ayniTokenAmount={projection.tokensReceived}
              quarterlyProjections={projection.quarterlyProjections}
              totalPayouts={projection.totalPayouts}
              loading={isFetching || isStale}
            />
          </div>
        )}
      </div>

      {/* Payment methods info strip */}
      <PaymentMethodsStrip className="mt-4" />

      {/* How it works */}
      <HowItWorks className="mt-6" />

      {/* Investment comparison table */}
      {projection && (
        <ComparisonTable
          ayniDailyUsd={projection.dailyDistributions}
          ayniAnnualYield={projection.annualYieldPercent}
          investmentAmount={amount}
          termMonths={termMonths}
          className="mt-6"
        />
      )}

      {/* Mobile inline CTA — after How It Works */}
      <div className="lg:hidden mt-5">
        <Button
          variant="gold-cta"
          fullWidth
          disabled={amount < 100}
          className="h-12 text-base"
          onClick={() => navigate('/earn/checkout')}
        >
          {t('earn.calculator.ctaBenefit', {
            amount: formatCurrency(amount),
          })}
        </Button>
      </div>

      {/* Trust badges */}
      <TrustBadges className="mt-4" />

      {/* Legal disclaimer */}
      <p className="text-xs text-text-muted text-center mt-6 max-w-[560px] mx-auto leading-relaxed pb-4">
        {t('earn.disclaimer.footer')}
      </p>
    </div>
  );
}
