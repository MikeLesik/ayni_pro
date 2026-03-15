import { useEffect, useRef, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useMineStore } from '@/stores/mineStore';
import { ACHIEVEMENT_DEFS } from '@/lib/achievementDefs';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

/* ── Confetti burst ────────────────────────────────────────── */

const CONFETTI_COLORS = ['var(--color-gold)', 'var(--color-primary)', 'var(--color-success)'];

const CONFETTI_COUNT = 14;

function ConfettiBurst() {
  const pieces = useRef(
    Array.from({ length: CONFETTI_COUNT }, () => {
      const angle = Math.random() * 360;
      const distance = 40 + Math.random() * 60;
      const rad = (angle * Math.PI) / 180;
      return {
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance - 20,
        yGravity: 30 + Math.random() * 40,
        rotation: Math.random() * 360,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 4,
        isCircle: Math.random() > 0.5,
        delay: Math.random() * 0.15,
        duration: 1.0 + Math.random() * 0.5,
      };
    }),
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className={p.isCircle ? 'rounded-full' : 'rounded-sm'}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.isCircle ? p.size : p.size * 0.6,
            backgroundColor: p.color,
            top: '50%',
            left: '20%',
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: p.y + p.yGravity,
            rotate: p.rotation,
            scale: 0.4,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}

/* ── AchievementToast ──────────────────────────────────────── */

export function AchievementToast() {
  const queue = useMineStore((s) => s.achievementToastQueue);
  const dismiss = useMineStore((s) => s.dismissAchievementToast);
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [visible, setVisible] = useState(false);

  const currentId = queue[0];
  const def = currentId ? ACHIEVEMENT_DEFS.find((d) => d.id === currentId) : null;
  const title = def ? t(def.titleKey as TranslationKey) : '';

  useEffect(() => {
    if (currentId && !visible) {
      const showTimer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(showTimer);
    }
  }, [currentId, visible]);

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setTimeout(() => dismiss(), 300);
      }, 5000);
      return () => clearTimeout(timerRef.current);
    }
  }, [visible, dismiss]);

  const handleDismiss = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(() => dismiss(), 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 18, stiffness: 280 }}
          className={cn(
            'fixed top-4 left-1/2 -translate-x-1/2 z-[200]',
            'w-[calc(100%-2rem)] max-w-md',
            'flex items-center gap-3 p-4',
            'bg-surface-card rounded-lg',
            'border-2 border-primary/40',
            'cursor-pointer',
            'relative overflow-visible',
          )}
          style={{
            boxShadow:
              '0 0 0 1px rgba(27,58,75,0.1), 0 4px 24px rgba(27,58,75,0.15), 0 2px 8px rgba(0,0,0,0.08)',
            animation: 'success-border-pulse 1.5s ease-in-out 2',
          }}
          onClick={handleDismiss}
        >
          {/* Confetti burst */}
          {!reducedMotion && <ConfettiBurst />}

          {/* Trophy icon */}
          <div className="shrink-0 w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center animate-success-pulse relative z-10">
            <Trophy size={20} className="text-primary" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 relative z-10">
            <p className="text-body-sm font-semibold text-text-primary">
              {t('mine.achievements.toastTitle')}
            </p>
            <p className="text-body-sm text-primary font-medium">{title}</p>
          </div>

          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="shrink-0 text-text-muted hover:text-text-secondary p-1 relative z-10"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
