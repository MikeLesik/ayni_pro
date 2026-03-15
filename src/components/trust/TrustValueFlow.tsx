import { motion } from 'framer-motion';
import {
  DollarSign,
  Coins,
  Pickaxe,
  Scale,
  RefreshCw,
  Wallet,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const STEPS: { icon: typeof DollarSign; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  {
    icon: DollarSign,
    titleKey: 'trust.valueFlow.step1Title',
    descKey: 'trust.valueFlow.step1Desc',
  },
  { icon: Coins, titleKey: 'trust.valueFlow.step2Title', descKey: 'trust.valueFlow.step2Desc' },
  { icon: Pickaxe, titleKey: 'trust.valueFlow.step3Title', descKey: 'trust.valueFlow.step3Desc' },
  { icon: Scale, titleKey: 'trust.valueFlow.step4Title', descKey: 'trust.valueFlow.step4Desc' },
  { icon: RefreshCw, titleKey: 'trust.valueFlow.step5Title', descKey: 'trust.valueFlow.step5Desc' },
  { icon: Wallet, titleKey: 'trust.valueFlow.step6Title', descKey: 'trust.valueFlow.step6Desc' },
];

export function TrustValueFlow() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.valueFlow.title')}
      </h2>

      {/* Desktop: horizontal */}
      <div className="hidden lg:flex items-start gap-0">
        {STEPS.map((step, i) => (
          <div key={step.titleKey} className="flex items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card variant="stat" padding="p-4" className="w-[150px] text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light mx-auto mb-2">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-bold text-text-primary mb-1">{t(step.titleKey)}</p>
                <p className="text-xs text-text-secondary leading-snug">{t(step.descKey)}</p>
              </Card>
            </motion.div>
            {i < STEPS.length - 1 && (
              <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-8 mx-0.5" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile/tablet: vertical */}
      <div className="flex lg:hidden flex-col items-center gap-0">
        {STEPS.map((step, i) => (
          <div key={step.titleKey} className="flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="w-full"
            >
              <Card variant="stat" padding="p-4" className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light shrink-0">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{t(step.titleKey)}</p>
                  <p className="text-xs text-text-secondary leading-snug mt-0.5">
                    {t(step.descKey)}
                  </p>
                </div>
              </Card>
            </motion.div>
            {i < STEPS.length - 1 && <ArrowDown className="h-4 w-4 text-primary my-1" />}
          </div>
        ))}
      </div>
    </section>
  );
}
