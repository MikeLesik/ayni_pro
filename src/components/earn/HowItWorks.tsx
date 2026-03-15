import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

export function HowItWorks({ className }: { className?: string }) {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      title: t('earn.howItWorks.step1Title'),
      description: t('earn.howItWorks.step1Description'),
    },
    {
      number: 2,
      title: t('earn.howItWorks.step2Title'),
      description: t('earn.howItWorks.step2Description'),
    },
    {
      number: 3,
      title: t('earn.howItWorks.step3Title'),
      description: t('earn.howItWorks.step3Description'),
    },
  ];

  return (
    <section className={cn(className)}>
      <h2 className="text-lg font-semibold text-text-primary text-center">
        {t('earn.howItWorks.title')}
      </h2>

      {/* Mobile: vertical list */}
      <div className="flex flex-col gap-3 mt-4 md:hidden">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-semibold shrink-0">
              {step.number}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{step.title}</p>
              <p className="text-body-sm text-text-muted mt-0.5 leading-tight">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: horizontal with connectors */}
      <div className="hidden md:flex items-start justify-center gap-0 py-4 mt-3">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-semibold">
                {step.number}
              </div>
              <span className="text-sm font-medium text-text-primary">{step.title}</span>
              <span className="text-body-sm text-text-muted text-center max-w-[140px] leading-tight">
                {step.description}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-10 lg:w-14 h-px bg-border self-center mb-8 mx-2" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
