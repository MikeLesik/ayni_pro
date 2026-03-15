import { Link } from 'react-router-dom';
import { DollarSign, Coins, Pickaxe, Scale, Wallet, ArrowRight, Info } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/cn';

const STEPS = [
  { icon: DollarSign, key: 'valueFlow.step1Label' },
  { icon: Coins, key: 'valueFlow.step2Label' },
  { icon: Pickaxe, key: 'valueFlow.step3Label' },
  { icon: Scale, key: 'valueFlow.step4Label' },
  { icon: Wallet, key: 'valueFlow.step5Label' },
] as const;

export function ValueFlowTooltip({ className }: { className?: string }) {
  const { t } = useTranslation();

  const content = (
    <div className="space-y-2 py-1">
      <div className="flex items-center justify-center gap-1">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-light">
                <step.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs font-medium leading-none">{t(step.key)}</span>
            </div>
            {i < STEPS.length - 1 && (
              <ArrowRight className="h-3 w-3 text-primary shrink-0 mx-0.5" />
            )}
          </div>
        ))}
      </div>
      <Link
        to="/learn#how-value-flows"
        className="text-xs text-primary hover:underline block text-center"
      >
        {t('valueFlow.learnMore')} &rarr;
      </Link>
    </div>
  );

  return (
    <Tooltip content={content} side="bottom" className="max-w-[480px]">
      <button
        type="button"
        className={cn('text-text-muted hover:text-text-secondary transition-colors', className)}
        aria-label={t('valueFlow.ariaLabel')}
      >
        <Info size={14} />
      </button>
    </Tooltip>
  );
}
