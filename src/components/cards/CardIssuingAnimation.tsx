import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCardStore, useCardTier } from '@/stores/cardStore';
import { getCardPrivileges } from '@/lib/cardConfig';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTranslation } from '@/i18n';

export function CardIssuingAnimation() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const lifecycle = useCardStore((s) => s.lifecycle);
  const virtualCard = useCardStore((s) => s.virtualCard);
  const tier = useCardTier();
  const privileges = getCardPrivileges(tier);

  const isReady = lifecycle === 'active' && virtualCard !== null;

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            key="issuing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Card materializing */}
            <motion.div
              className="w-full max-w-[340px] aspect-[1.586/1] mx-auto rounded-2xl overflow-hidden relative mb-8"
              style={{ background: privileges.cardGradient }}
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {/* Wireframe outline that fills in */}
              <motion.div
                className="absolute inset-0 border-2 border-white/40 rounded-2xl"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />

              {/* AYNI branding fading in */}
              <motion.div
                className="absolute top-5 left-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <span className="text-white font-display text-xl tracking-wide">AYNI</span>
                <span className="text-white/60 text-[11px] block -mt-0.5">Gold Card</span>
              </motion.div>

              {/* Visa logo */}
              <motion.div
                className="absolute bottom-5 right-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <span className="text-white/80 font-bold text-xl italic tracking-wider">VISA</span>
              </motion.div>

              {/* Chip */}
              <motion.div
                className="absolute top-[40%] left-6 w-11 h-8 rounded-md"
                style={{
                  background: 'linear-gradient(135deg, #f5efd7 0%, #c9a84c 50%, #f5efd7 100%)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles size={24} className="text-gold mx-auto mb-3 animate-pulse" />
              <h2 className="font-display text-2xl text-text-primary mb-2">
                {lifecycle === 'kyc_approved'
                  ? t('card.kyc.issuing.approved')
                  : t('card.kyc.issuing.generating')}
              </h2>
              <p className="text-text-secondary">
                {t('card.kyc.issuing.generating.desc')}
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Confetti-like sparkles */}
            <div className="relative mb-8">
              {!reducedMotion &&
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: i % 2 === 0 ? 'var(--color-gold)' : 'var(--color-success)',
                      left: `${20 + Math.random() * 60}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.5],
                      y: [0, -30 - Math.random() * 50],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: 'easeOut',
                    }}
                  />
                ))}

              {/* Card */}
              <div
                className="w-full max-w-[340px] aspect-[1.586/1] mx-auto rounded-2xl overflow-hidden relative shadow-xl"
                style={{ background: privileges.cardGradient }}
              >
                <div className="absolute top-5 left-6">
                  <span className="text-white font-display text-xl tracking-wide">AYNI</span>
                  <span className="text-white/60 text-[11px] block -mt-0.5">Gold Card</span>
                </div>
                <div
                  className="absolute top-[40%] left-6 w-11 h-8 rounded-md"
                  style={{
                    background: 'linear-gradient(135deg, #f5efd7 0%, #c9a84c 50%, #f5efd7 100%)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                />
                <div className="absolute bottom-12 left-6">
                  <span className="text-white/80 font-mono text-sm tracking-[0.2em]">
                    {virtualCard.number}
                  </span>
                </div>
                <div className="absolute bottom-5 left-6">
                  <span className="text-white/80 font-mono text-xs">
                    {virtualCard.holderName}
                  </span>
                </div>
                <div className="absolute bottom-5 right-6">
                  <span className="text-white/80 font-bold text-xl italic tracking-wider">VISA</span>
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl text-text-primary mb-2">
              {t('card.kyc.issuing.ready')}
            </h2>
            <p className="text-text-secondary mb-8">
              {t('card.kyc.issuing.readyDesc')}
            </p>

            <Button variant="gold-cta" size="lg">
              {t('card.kyc.issuing.viewCard')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
