import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTierData } from '@/hooks/useTierData';
import { CARD_PRIVILEGES } from '@/lib/cardConfig';
import { useTranslation } from '@/i18n';

export function CardPromoSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const { tierData } = useTierData();
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const lockedAyni = tierData?.lockedAYNI ?? 0;
  const requiredAyni = 5000;
  const progress = Math.min(100, (lockedAyni / requiredAyni) * 100);

  const tierPreviews = [
    {
      tier: 'contributor' as const,
      label: 'Contributor',
      desc: 'Virtual card, spend anywhere',
      gradient: CARD_PRIVILEGES.contributor.cardGradient,
    },
    {
      tier: 'operator' as const,
      label: 'Operator',
      desc: 'Physical metal + 0.5% cashback',
      gradient: CARD_PRIVILEGES.operator.cardGradient,
    },
    {
      tier: 'principal' as const,
      label: 'Principal',
      desc: 'Gold-plated + 1% cashback + mine visit',
      gradient: CARD_PRIVILEGES.principal.cardGradient,
    },
  ];

  const howItWorksSteps = [
    t('card.promo.step1'),
    t('card.promo.step2'),
    t('card.promo.step3'),
    t('card.promo.step4'),
    t('card.promo.step5'),
  ];

  return (
    <div className="space-y-6">
      {/* Hero card mockup */}
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          animate={reducedMotion ? {} : { y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full max-w-[320px] mx-auto"
          style={{ perspective: '1000px' }}
        >
          <div
            className="w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-xl relative"
            style={{
              background: 'linear-gradient(145deg, #c9a84c 0%, #e8d48b 35%, #c9a84c 60%, #8a7230 100%)',
              transform: 'rotateY(-5deg) rotateX(3deg)',
            }}
          >
            {/* Shimmer */}
            <div
              className="absolute inset-0 animate-gold-shimmer pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div className="absolute top-4 left-5">
              <span className="text-white/90 font-display text-lg tracking-wide">AYNI</span>
              <span className="text-white/60 text-[10px] block -mt-0.5">Gold Card</span>
            </div>
            {/* Blurred number */}
            <div className="absolute bottom-12 left-5">
              <span className="text-white/40 font-mono text-sm tracking-[0.2em] blur-[3px]">
                4157 8900 XXXX XXXX
              </span>
            </div>
            <div className="absolute bottom-4 right-5">
              <span className="text-white/80 font-bold text-base italic tracking-wider">VISA</span>
            </div>
            <div
              className="absolute top-[42%] left-5 w-9 h-7 rounded"
              style={{
                background: 'linear-gradient(135deg, #f5efd7 0%, #c9a84c 50%, #f5efd7 100%)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Heading */}
      <div className="text-center">
        <h1 className="font-display text-3xl text-text-primary mb-2">
          {t('card.promo.title')}
        </h1>
        <p className="text-text-secondary">
          {t('card.promo.subtitle')}
        </p>
      </div>

      {/* Eligibility progress */}
      <div className="bg-surface-card border border-border rounded-xl p-5">
        <h4 className="font-display text-base text-text-primary mb-3">
          {t('card.promo.eligibility')}
        </h4>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-secondary">{t('card.promo.ayniLocked')}</span>
            <span className="text-text-primary font-medium tabular-nums">
              {lockedAyni.toLocaleString()} / {requiredAyni.toLocaleString()}
            </span>
          </div>
          <ProgressBar percent={progress} height={8} />
        </div>
        <p className="text-xs text-text-muted">
          {t('card.promo.alsoRequires')}
        </p>
      </div>

      {/* Tier preview cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {tierPreviews.map((tp) => (
          <div key={tp.tier} className="min-w-[200px] flex-shrink-0">
            <div
              className="h-[100px] rounded-xl mb-2 relative overflow-hidden shadow-md"
              style={{ background: tp.gradient }}
            >
              <div className="absolute top-3 left-4">
                <span className="text-white/90 font-display text-sm">AYNI</span>
              </div>
              <div className="absolute bottom-3 right-4">
                <span className="text-white/70 font-bold text-xs italic">VISA</span>
              </div>
            </div>
            <p className="text-sm font-medium text-text-primary">{tp.label}</p>
            <p className="text-xs text-text-muted">{tp.desc}</p>
          </div>
        ))}
      </div>

      {/* How it works accordion */}
      <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setHowItWorksOpen(!howItWorksOpen)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="text-sm font-medium text-text-primary">{t('card.promo.howItWorks')}</span>
          {howItWorksOpen ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </button>
        {howItWorksOpen && (
          <div className="px-4 pb-4 space-y-3">
            {howItWorksSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-gold-light text-gold-dark text-xs font-semibold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm text-text-secondary">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <Button
        variant="gold-cta"
        fullWidth
        size="lg"
        rightIcon={<ArrowRight size={16} />}
        onClick={() => navigate('/participate')}
      >
        {t('card.promo.cta')}
      </Button>
    </div>
  );
}
