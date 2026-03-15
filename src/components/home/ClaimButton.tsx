import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { StreakBadge } from '@/components/mine/StreakBadge';
import { useTranslation } from '@/i18n';
import { useMineStore } from '@/stores/mineStore';
import { useSimulationStore } from '@/stores/simulation';
import { formatCurrency, formatGrams } from '@/lib/formatters';
import { Gem, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ── Types ─────────────────────────────────────────────────── */

interface ClaimButtonProps {
  dailyGoldGrams: number;
  dailyUsdValue: number;
  className?: string;
}

type ClaimPhase = 'idle' | 'pulse' | 'burst' | 'particles' | 'reveal' | 'done';

/* ── Particle system ───────────────────────────────────────── */

const PARTICLE_COUNT = 10;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * 360 + (Math.random() * 30 - 15);
    const rad = (angle * Math.PI) / 180;
    const distance = 50 + Math.random() * 40;
    return {
      id: i,
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      delay: i * 0.04,
      duration: 0.6 + Math.random() * 0.4,
    };
  });
}

/* ── Component ─────────────────────────────────────────────── */

export function ClaimButton({ dailyGoldGrams, dailyUsdValue, className }: ClaimButtonProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const claimToday = useMineStore((s) => s.claimToday);
  const claimDates = useMineStore((s) => s.claimDates);
  const simulationDate = useSimulationStore((s) => s.simulationDate);
  const isClaimed = claimDates.includes(simulationDate.split('T')[0]!);

  const streak = useMemo(() => {
    const today = simulationDate.split('T')[0]!;
    const dates = new Set(claimDates);
    let count = 0;
    const d = new Date(today + 'T00:00:00Z');
    while (dates.has(d.toISOString().split('T')[0]!)) {
      count++;
      d.setUTCDate(d.getUTCDate() - 1);
    }
    return count;
  }, [claimDates, simulationDate]);

  const [phase, setPhase] = useState<ClaimPhase>(isClaimed ? 'done' : 'idle');
  const [showReward, setShowReward] = useState(isClaimed);
  const particlesRef = useRef(generateParticles());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Sync phase/showReward with isClaimed (Bug 31)
  useEffect(() => {
    if (isClaimed) {
      setPhase('done');
      setShowReward(true);
    } else {
      setPhase('idle');
      setShowReward(false);
    }
  }, [isClaimed]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  };

  const handleClaim = () => {
    if (isClaimed || phase !== 'idle') return;
    claimToday();

    if (reducedMotion) {
      setPhase('done');
      setShowReward(true);
      return;
    }

    // Phase 1: Pulse (0-200ms)
    setPhase('pulse');

    // Phase 2: Burst ring (200ms)
    schedule(() => setPhase('burst'), 200);

    // Phase 3: Particles scatter (300ms)
    schedule(() => setPhase('particles'), 300);

    // Phase 4: Card flip to reveal (500ms)
    schedule(() => {
      setPhase('reveal');
      setShowReward(true);
    }, 500);

    // Final: Done (1200ms)
    schedule(() => setPhase('done'), 1200);
  };

  const isAnimating = phase !== 'idle' && phase !== 'done';

  return (
    <motion.div
      animate={phase === 'pulse' ? { scale: 1.05 } : { scale: 1 }}
      transition={
        phase === 'pulse'
          ? { type: 'spring', stiffness: 400, damping: 10 }
          : { type: 'spring', stiffness: 300, damping: 20 }
      }
    >
      <Card
        variant="stat"
        className={cn(
          'relative overflow-hidden p-3 transition-all duration-300',
          !showReward && !isClaimed && 'ring-1 ring-gold/40',
          className,
        )}
        aria-label={
          showReward || isClaimed
            ? t('home.claim.ariaClaimed', { grams: formatGrams(dailyGoldGrams) })
            : t('home.claim.ariaClaimable')
        }
      >
        {/* ── 3D Flip container ────────────────────────────── */}
        <div className="relative" style={{ perspective: 600 }}>
          {/* ── FRONT FACE: Claim UI ───────────────────────── */}
          <motion.div
            animate={{
              rotateY: showReward ? 180 : 0,
              opacity: showReward ? 0 : 1,
            }}
            transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div
                className={cn(
                  'relative flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center',
                  'bg-gold-light',
                )}
              >
                <Gem className="h-5 w-5 text-gold-dark" />
                {!reducedMotion && phase === 'idle' && (
                  <span className="absolute inset-0 rounded-full bg-gold/20 animate-pulse" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{t('home.claim.title')}</p>
                <p className="text-xs text-text-secondary">
                  {formatGrams(dailyGoldGrams)} gold ({formatCurrency(dailyUsdValue)})
                </p>
              </div>

              {/* Claim button */}
              <button
                type="button"
                onClick={handleClaim}
                disabled={isAnimating}
                className={cn(
                  'flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-white',
                  'bg-gradient-to-r from-gold to-gold-dark',
                  'hover:brightness-110 active:scale-95 transition-all',
                  'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
                  !reducedMotion &&
                    'animate-[gold-shimmer_2s_linear_infinite] bg-[length:200%_auto]',
                  isAnimating && 'opacity-60 pointer-events-none',
                )}
              >
                {t('home.claim.button')}
              </button>
            </div>
          </motion.div>

          {/* ── BACK FACE: Reward reveal ───────────────────── */}
          <AnimatePresence>
            {showReward && (
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  backfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
                className="absolute inset-0 flex items-center gap-3"
              >
                {/* Success icon */}
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success-light flex items-center justify-center">
                  <Check className="h-5 w-5 text-success" />
                </div>

                {/* Reward amount */}
                <div className="flex-1 min-w-0" aria-live="polite">
                  <p className="text-xs text-text-secondary font-medium">
                    {t('home.claim.claimed')}
                  </p>
                  <p className="text-lg font-display text-gold-dark tabular-nums leading-tight">
                    <CountUpNumber
                      value={dailyGoldGrams}
                      suffix=" g"
                      decimals={4}
                      duration={1000}
                    />
                  </p>
                  <p className="text-xs text-text-muted">{formatCurrency(dailyUsdValue)}</p>
                </div>

                {/* Streak badge inline */}
                {streak >= 2 && <StreakBadge streak={streak} size="sm" />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Burst ring ───────────────────────────────────── */}
        <AnimatePresence>
          {(phase === 'burst' || phase === 'particles') && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-full border-2 border-gold/60"
                style={{
                  width: 40,
                  height: 40,
                  boxShadow: '0 0 20px rgba(201, 168, 76, 0.4)',
                }}
                initial={{ scale: 0.3, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Radial particle scatter ──────────────────────── */}
        <AnimatePresence>
          {(phase === 'particles' || phase === 'reveal') &&
            particlesRef.current.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: p.size,
                  height: p.size,
                  left: '50%',
                  top: '50%',
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                  background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                  boxShadow: '0 0 4px rgba(201, 168, 76, 0.5)',
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: 0.2,
                  opacity: 0,
                  rotate: p.rotation,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            ))}
        </AnimatePresence>

        {/* ── Gold shimmer overlay on reward face ──────────── */}
        {showReward && !reducedMotion && (
          <div
            className="absolute inset-0 rounded-xl opacity-[0.06] pointer-events-none animate-[gold-shimmer_2s_linear_infinite] bg-[length:200%_auto]"
            style={{
              backgroundImage:
                'linear-gradient(135deg, transparent 30%, var(--color-gold) 50%, transparent 70%)',
            }}
          />
        )}
      </Card>
    </motion.div>
  );
}
