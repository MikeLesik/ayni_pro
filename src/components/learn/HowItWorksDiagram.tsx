import { Coins, Pickaxe, Gem, RefreshCw, Wallet, ArrowRight, ArrowDown } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

export function HowItWorksDiagram() {
  const { t } = useTranslation();

  const steps = [
    {
      id: 'invest',
      label: t('learn.howItWorks.invest'),
      icon: Coins,
      tooltip: t('learn.howItWorks.investTooltip'),
    },
    {
      id: 'mining',
      label: t('learn.howItWorks.mining'),
      icon: Pickaxe,
      tooltip: t('learn.howItWorks.miningTooltip'),
    },
    {
      id: 'gold-extracted',
      label: t('learn.howItWorks.goldExtracted'),
      icon: Gem,
      tooltip: t('learn.howItWorks.goldExtractedTooltip'),
    },
    {
      id: 'paxg',
      label: t('learn.howItWorks.paxg'),
      icon: RefreshCw,
      tooltip: t('learn.howItWorks.paxgTooltip'),
    },
    {
      id: 'your-wallet',
      label: t('learn.howItWorks.wallet'),
      icon: Wallet,
      tooltip: t('learn.howItWorks.walletTooltip'),
    },
  ];

  return (
    <section className="max-w-[720px] mx-auto">
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        {t('learn.howItWorks.title')}
      </h2>

      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <Tooltip content={step.tooltip} side="bottom">
              <button
                type="button"
                className={cn(
                  'flex flex-col items-center gap-2 cursor-pointer group',
                  'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-lg',
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-full',
                    'bg-primary-light text-primary',
                    'transition-all duration-200',
                    'group-hover:bg-primary group-hover:text-white group-hover:shadow-md',
                  )}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-text-primary text-center">
                  {step.label}
                </span>
              </button>
            </Tooltip>
            {i < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-text-muted mx-2 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col items-center gap-0">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center">
            <Tooltip content={step.tooltip} side="right">
              <button
                type="button"
                className={cn(
                  'flex items-center gap-3 cursor-pointer group w-full max-w-[260px]',
                  'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-lg',
                  'py-2 px-3',
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-full shrink-0',
                    'bg-primary-light text-primary',
                    'transition-all duration-200',
                    'group-hover:bg-primary group-hover:text-white group-hover:shadow-md',
                  )}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-text-primary">{step.label}</span>
              </button>
            </Tooltip>
            {i < steps.length - 1 && <ArrowDown className="h-4 w-4 text-text-muted" />}
          </div>
        ))}
      </div>
    </section>
  );
}
