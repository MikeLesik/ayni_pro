import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { useCardStore } from '@/stores/cardStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from '@/i18n';

export function KycReviewScreen() {
  const { t } = useTranslation();
  const lifecycle = useCardStore((s) => s.lifecycle);
  const reducedMotion = useReducedMotion();

  const steps = [
    {
      label: t('card.kyc.review.docsReceived'),
      done: true,
    },
    {
      label: t('card.kyc.review.verifying'),
      done: lifecycle === 'kyc_in_review' ? 'loading' : lifecycle === 'kyc_submitted' ? false : true,
    },
    {
      label: t('card.kyc.review.issuance'),
      done: false,
    },
  ];

  return (
    <div className="max-w-md mx-auto text-center py-12">
      {/* Pulsing animation */}
      <motion.div
        animate={reducedMotion ? {} : { scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--color-gold-light), var(--color-gold))' }}
      >
        <Loader2 size={36} className="text-white animate-spin" />
      </motion.div>

      <h2 className="font-display text-2xl text-text-primary mb-2">
        {t('card.kyc.review.title')}
      </h2>
      <p className="text-text-secondary mb-8">
        {t('card.kyc.review.desc')}
      </p>

      {/* Step progress */}
      <div className="text-left max-w-[280px] mx-auto space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {step.done === true ? (
              <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" />
              </div>
            ) : step.done === 'loading' ? (
              <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center shrink-0">
                <Loader2 size={14} className="text-white animate-spin" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-border shrink-0" />
            )}
            <span
              className={`text-sm ${
                step.done === true
                  ? 'text-text-primary font-medium'
                  : step.done === 'loading'
                    ? 'text-text-primary font-medium'
                    : 'text-text-muted'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
