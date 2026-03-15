import { useNavigate } from 'react-router-dom';
import { useEarnStore } from '@/stores/earnStore';
import { useUiStore } from '@/stores/uiStore';
import { useSimulationStore } from '@/stores/simulation';
import { useTranslation } from '@/i18n';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { AmountInput } from '@/components/ui/AmountInput';
import { Slider } from '@/components/ui/Slider';
import { formatCurrency, formatNumber, formatPrice } from '@/lib/formatters';
import { ValueFlowTooltip } from '@/components/ui/ValueFlowTooltip';
import { Tooltip } from '@/components/ui/Tooltip';
import { Info } from 'lucide-react';
import { trustData } from '@/services/mock/data/trust';

// TODO: make dynamic — fetch from API instead of trustData
const PARTICIPANT_COUNT = trustData.miningStatus.totalParticipants;

interface EarningCalculatorProps {
  className?: string;
  dailyEarningsUsd?: number;
  annualYieldPercent?: number;
}

export function EarningCalculator({ className, dailyEarningsUsd, annualYieldPercent }: EarningCalculatorProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const { amount, termMonths, autoActivate, setAmount, setTermMonths, setAutoActivate } =
    useEarnStore();
  const showAdvanced = useUiStore((s) => s.advancedView);
  const ayniPriceUsd = useSimulationStore((s) => s.prices.ayniUsd);

  return (
    <Card variant="stat" padding="p-5" className={className}>
      {/* Amount section */}
      <h3 className="text-base font-semibold text-text-primary text-center sm:text-left">
        {t('earn.calculator.title')}
      </h3>
      <div className="mt-2">
        <AmountInput value={amount} onChange={setAmount} compact />
      </div>

      {/* AYNI conversion line — advanced view only */}
      {showAdvanced && amount >= 100 && (
        <div className="mt-1.5 flex items-center gap-1 text-body-sm text-text-secondary">
          <span>
            ≈ {formatNumber(amount / ayniPriceUsd)} AYNI at {formatPrice(ayniPriceUsd)}/token
          </span>
          <ValueFlowTooltip />
        </div>
      )}

      {/* Term section */}
      <div className="flex items-baseline justify-between mt-5">
        <h4 className="text-base font-semibold text-text-primary">
          {t('earn.calculator.termLabel')}
        </h4>
        <span className="text-sm font-semibold text-primary tabular-nums">
          {termMonths} {t('common.months')}
        </span>
      </div>
      <div className="mt-2">
        <Slider value={termMonths} onChange={setTermMonths} compact />
      </div>

      {/* Auto-activate checkbox */}
      <div className="mt-4 flex items-start gap-1">
        <Checkbox
          checked={autoActivate}
          onChange={setAutoActivate}
          label={t('earn.calculator.autoActivateLabel')}
          description={t('earn.calculator.autoActivateDescription')}
        />
        <Tooltip content={t('earn.calculator.autoActivateTooltip')}>
          <button
            type="button"
            className="mt-0.5 text-text-muted hover:text-text-secondary transition-colors"
          >
            <Info size={14} />
          </button>
        </Tooltip>
      </div>

      {/* Daily earnings highlight */}
      {dailyEarningsUsd != null && dailyEarningsUsd > 0 && (
        <div className="mt-4 rounded-lg bg-primary-light p-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t('earn.calculator.youEarnDaily')}
          </p>
          <p className="mt-0.5 font-display text-2xl text-primary">
            ~{formatCurrency(dailyEarningsUsd)}
            <span className="font-sans text-sm text-text-secondary">{t('common.perDay')}</span>
          </p>
          {annualYieldPercent != null && (
            <p className="mt-1 text-xs text-text-muted">
              ~{annualYieldPercent.toFixed(1)}% {t('earn.calculator.estimatedApy')}
            </p>
          )}
        </div>
      )}

      {/* CTA button */}
      <Button
        variant="gold-cta"
        size="lg"
        fullWidth
        disabled={amount < 100}
        className="mt-4"
        onClick={() => {
          track('cta_click', { cta: 'earn', amount });
          navigate('/earn/checkout');
        }}
      >
        {t('earn.calculator.ctaBenefit', {
          amount: formatCurrency(amount),
        })}
      </Button>

      {/* Social proof */}
      <p className="text-[13px] text-text-secondary text-center mt-2">
        {t('socialProof.joinParticipants', { count: PARTICIPANT_COUNT })}
      </p>

      {/* Terms note */}
      <p className="text-xs text-text-muted text-center mt-1.5">{t('earn.calculator.termsNote')}</p>
    </Card>
  );
}
