import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

type StepType = 'base' | 'minus' | 'subtotal' | 'result';
interface ExampleStep {
  key: string;
  value: number;
  color: string;
  type: StepType;
}

const EXAMPLE_STEPS: ExampleStep[] = [
  { key: 'goldProduction', value: 0.064, color: '#C9A84C', type: 'base' },
  { key: 'costs', value: 0.0379, color: '#C53030', type: 'minus' },
  { key: 'beforeFee', value: 0.0261, color: '#1B3A4B', type: 'subtotal' },
  { key: 'successFee', value: 0.0052, color: '#9B9B9B', type: 'minus' },
  { key: 'finalDistribution', value: 0.0209, color: '#2D8A4E', type: 'result' },
];

export function ExampleSection() {
  const { t, language } = useTranslation();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const gram = language === 'ru' ? 'г' : 'g';
  const maxValue = EXAMPLE_STEPS[0]!.value;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const labels: Record<string, string> = {
    goldProduction: t('tokenomics.example.goldProduction'),
    costs: t('tokenomics.example.costs'),
    beforeFee: t('tokenomics.example.beforeFee'),
    successFee: t('tokenomics.example.successFee'),
    finalDistribution: t('tokenomics.example.finalDistribution'),
  };

  const operatorFor = (type: StepType) => {
    if (type === 'minus') return '\u2212';
    if (type === 'subtotal') return '=';
    if (type === 'result') return '=';
    return '';
  };

  return (
    <div>
      <h2 className="font-display text-[28px] text-text-primary mb-6">
        {t('tokenomics.example.title')}
      </h2>
      <div ref={ref} className="bg-surface-card rounded-2xl border border-border shadow-sm p-6">
        <div className="space-y-0">
          {EXAMPLE_STEPS.map((step, i) => {
            const isResult = step.type === 'result';
            const isSubtotal = step.type === 'subtotal';
            const isMinus = step.type === 'minus';
            const op = operatorFor(step.type);
            const barWidth = (step.value / maxValue) * 100;

            return (
              <div key={step.key}>
                {(isSubtotal || isResult) && (
                  <div className="border-t border-dashed border-border my-3" />
                )}

                <div className={cn('flex items-start gap-3 py-2', i === 0 && 'pt-0')}>
                  <span
                    className={cn(
                      'w-5 shrink-0 text-center font-mono text-lg leading-5',
                      isMinus && 'text-error',
                      (isSubtotal || isResult) && 'text-text-primary font-bold',
                    )}
                  >
                    {op}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={cn(
                          'text-sm',
                          isResult
                            ? 'font-bold text-text-primary'
                            : isSubtotal
                              ? 'font-semibold text-text-primary'
                              : 'text-text-secondary',
                        )}
                      >
                        {labels[step.key]}
                      </span>
                      <span
                        className={cn(
                          'font-mono text-sm tabular-nums ml-4 shrink-0',
                          isResult
                            ? 'font-bold text-success'
                            : isMinus
                              ? 'font-semibold text-error'
                              : 'font-semibold text-text-primary',
                        )}
                      >
                        {isMinus && '\u2212'}
                        {step.value.toFixed(4)} {gram}
                      </span>
                    </div>
                    <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: visible ? `${barWidth}%` : '0%',
                          backgroundColor: step.color,
                          transitionDelay: `${i * 120}ms`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
