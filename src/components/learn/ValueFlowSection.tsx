import { motion } from 'framer-motion';
import { DollarSign, Coins, Pickaxe, Scale, Wallet, ArrowRight, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';

const STEPS = [
  {
    icon: DollarSign,
    titleKey: 'valueFlow.section.step1Title',
    descKey: 'valueFlow.section.step1Desc',
  },
  { icon: Coins, titleKey: 'valueFlow.section.step2Title', descKey: 'valueFlow.section.step2Desc' },
  {
    icon: Pickaxe,
    titleKey: 'valueFlow.section.step3Title',
    descKey: 'valueFlow.section.step3Desc',
  },
  { icon: Scale, titleKey: 'valueFlow.section.step4Title', descKey: 'valueFlow.section.step4Desc' },
  {
    icon: Wallet,
    titleKey: 'valueFlow.section.step5Title',
    descKey: 'valueFlow.section.step5Desc',
  },
] as const;

export function ValueFlowSection() {
  const { t } = useTranslation();

  return (
    <section id="how-value-flows">
      <h2 className="text-heading-2 md:text-heading-2 text-text-primary mb-4">
        {t('valueFlow.section.title')}
      </h2>

      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start justify-center gap-0">
        {STEPS.map((step, i) => (
          <div key={step.titleKey} className="flex items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card variant="stat" padding="p-5" className="w-[160px] text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light mx-auto mb-2">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-body-md font-bold text-text-primary mb-1">{t(step.titleKey)}</p>
                <p className="text-body-sm text-text-secondary leading-snug">{t(step.descKey)}</p>
              </Card>
            </motion.div>
            {i < STEPS.length - 1 && (
              <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-10 mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col items-center gap-0">
        {STEPS.map((step, i) => (
          <div key={step.titleKey} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="w-full"
            >
              <Card variant="stat" padding="p-4" className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light shrink-0">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-body-md font-bold text-text-primary">{t(step.titleKey)}</p>
                  <p className="text-body-sm text-text-secondary leading-snug mt-0.5">
                    {t(step.descKey)}
                  </p>
                </div>
              </Card>
            </motion.div>
            {i < STEPS.length - 1 && <ArrowDown className="h-5 w-5 text-primary my-1" />}
          </div>
        ))}
      </div>

      {/* Example block */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-4 rounded-lg bg-surface-secondary border border-border-light p-4"
      >
        <p className="text-sm font-semibold text-text-primary mb-1">
          {t('valueFlow.section.exampleTitle')}
        </p>
        <p className="text-sm text-text-primary font-medium tabular-nums">
          {t('valueFlow.section.exampleText')}
        </p>
        <p className="text-xs text-text-muted mt-1.5 italic">{t('valueFlow.section.disclaimer')}</p>
      </motion.div>
    </section>
  );
}
