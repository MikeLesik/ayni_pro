import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { MineLevel } from '@/types/mine';
import { cn } from '@/lib/cn';
import { useIsDark } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';

import { GY, C, STARS, CONFETTI_POS } from './illustrations/shared';
import { ExplorerScene } from './illustrations/MineLevel1';
import { ProspectorScene } from './illustrations/MineLevel2';
import { OperationScene } from './illustrations/MineLevel3';
import { MiningCampScene } from './illustrations/MineLevel4';
import { GoldEmpireScene } from './illustrations/MineLevel5';

// ─── Public Interface ────────────────────────────────────────────────
interface MineIllustrationProps {
  level: MineLevel;
  animated?: boolean;
  className?: string;
  claimActive?: boolean;
}

// ─── Main Component ──────────────────────────────────────────────────
export function MineIllustration({
  level,
  animated = true,
  className,
  claimActive = false,
}: MineIllustrationProps) {
  const reducedMotion = useReducedMotion();
  const anim = animated && !reducedMotion;
  const isDark = useIsDark();
  const { t } = useTranslation();
  const levelName = t(`mine.levels.${level}` as const);

  // Click zoom pulse
  const [zoomed, setZoomed] = useState(false);
  const handleClick = () => {
    if (reducedMotion) return;
    setZoomed(true);
    setTimeout(() => setZoomed(false), 300);
  };

  // Level-up flash
  const prevRef = useRef(level);
  const flashKey = useRef(0);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (level > prevRef.current && anim) {
      flashKey.current += 1;
      setShowFlash(true);
      const t = setTimeout(() => setShowFlash(false), 700);
      prevRef.current = level;
      return () => clearTimeout(t);
    }
    prevRef.current = level;
  }, [level, anim]);

  const scenes: Record<MineLevel, React.ReactNode> = {
    1: <ExplorerScene anim={anim} isDark={isDark} claimActive={claimActive} />,
    2: <ProspectorScene anim={anim} isDark={isDark} claimActive={claimActive} />,
    3: <OperationScene anim={anim} isDark={isDark} claimActive={claimActive} />,
    4: <MiningCampScene anim={anim} isDark={isDark} claimActive={claimActive} />,
    5: <GoldEmpireScene anim={anim} isDark={isDark} claimActive={claimActive} />,
  };

  return (
    <div
      className={cn(
        'w-full h-[180px] md:h-[200px] rounded-lg overflow-hidden select-none cursor-pointer',
        'transition-transform duration-300 ease-out',
        zoomed && 'scale-[1.02]',
        className,
      )}
      onClick={handleClick}
    >
      <svg
        viewBox="0 0 800 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-label={t('mine.illustration.ariaLabel', { level, name: levelName })}
        role="img"
      >
        <Defs isDark={isDark} />
        <Background isDark={isDark} anim={anim} />

        <AnimatePresence mode="wait">
          <motion.g
            key={level}
            initial={anim ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={anim ? { opacity: 0 } : undefined}
            transition={{ duration: 0.4 }}
          >
            {scenes[level]}
          </motion.g>
        </AnimatePresence>

        {/* Gold particles */}
        <GoldParticles level={level} anim={anim} claimActive={claimActive} />

        {/* Mining indicator */}
        <MiningIndicator anim={anim} label={t('mine.illustration.miningInProgress')} />

        {/* Level-up flash */}
        {showFlash && (
          <g key={flashKey.current}>
            <motion.rect
              x="0"
              y="0"
              width="800"
              height="400"
              fill={C.gold}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.6 }}
            />
            {CONFETTI_POS.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill={i % 2 === 0 ? C.goldL : C.gold}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 2.5, y: 40 }}
                transition={{ duration: 0.8, delay: i * 0.04 }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

// ─── SVG Defs ────────────────────────────────────────────────────────
function Defs({ isDark }: { isDark: boolean }) {
  return (
    <defs>
      <linearGradient id="mg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={isDark ? '#0a1628' : C.skyTop} />
        <stop offset="100%" stopColor={isDark ? '#1a2740' : C.skyBot} />
      </linearGradient>
      <linearGradient id="mg-grass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={isDark ? '#3D6B35' : C.grass1} />
        <stop offset="100%" stopColor={isDark ? '#2B4D24' : C.grass2} />
      </linearGradient>
      <linearGradient id="mg-earth" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={isDark ? '#6B5A42' : C.earth1} />
        <stop offset="40%" stopColor={isDark ? '#7A3D1E' : C.earth2} />
        <stop offset="100%" stopColor={isDark ? '#4A2E18' : C.earth3} />
      </linearGradient>
      <linearGradient id="mg-water" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={isDark ? '#2A4A6B' : C.water2} stopOpacity={0.7} />
        <stop offset="50%" stopColor={isDark ? '#3A6B95' : C.water1} />
        <stop offset="100%" stopColor={isDark ? '#2A4A6B' : C.water2} stopOpacity={0.7} />
      </linearGradient>
      <linearGradient id="mg-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={C.gold} />
        <stop offset="50%" stopColor={C.goldL} />
        <stop offset="100%" stopColor={C.gold} />
      </linearGradient>
      <linearGradient id="mg-pit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.earth2} />
        <stop offset="100%" stopColor={isDark ? '#2A1A0A' : C.earth3} />
      </linearGradient>
      <radialGradient id="mg-sun" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={C.sun} stopOpacity={0.9} />
        <stop offset="100%" stopColor={C.sun} stopOpacity={0} />
      </radialGradient>
    </defs>
  );
}

// ─── Background ─────────────────────────────────────────────────────
function Background({ isDark, anim }: { isDark: boolean; anim: boolean }) {
  return (
    <g>
      {/* Sky */}
      <rect x="0" y="0" width="800" height={GY} fill="url(#mg-sky)" />

      {isDark ? (
        <>
          <circle cx="700" cy="65" r="20" fill="#E8E8F0" opacity={0.85} />
          <circle cx="710" cy="58" r="16" fill="#0a1628" />
          {STARS.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={C.white} opacity={0.6}>
              {anim && (
                <animate
                  attributeName="opacity"
                  values="0.3;0.8;0.3"
                  dur={`${2 + (i % 4) * 0.7}s`}
                  begin={`${(i % 5) * 0.4}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          ))}
        </>
      ) : (
        <>
          <circle cx="700" cy="65" r="45" fill="url(#mg-sun)" />
          <circle cx="700" cy="65" r="22" fill={C.sun} opacity={0.7} />
        </>
      )}

      {/* Clouds */}
      <g opacity={isDark ? 0.08 : 0.5}>
        <ellipse cx="150" cy="70" rx="45" ry="14" fill={C.white} />
        <ellipse cx="185" cy="65" rx="30" ry="11" fill={C.white} />
        <ellipse cx="125" cy="67" rx="25" ry="10" fill={C.white} />
      </g>
      <g opacity={isDark ? 0.05 : 0.35}>
        <ellipse cx="480" cy="90" rx="35" ry="12" fill={C.white} />
        <ellipse cx="510" cy="85" rx="28" ry="10" fill={C.white} />
      </g>

      {/* Distant hills */}
      <ellipse cx="200" cy={GY} rx="180" ry="35" fill={C.grass2} opacity={isDark ? 0.15 : 0.3} />
      <ellipse cx="600" cy={GY} rx="220" ry="28" fill={C.grass2} opacity={isDark ? 0.1 : 0.2} />

      {/* Ground */}
      <rect x="0" y={GY - 8} width="800" height="16" fill="url(#mg-grass)" />
      <rect x="0" y={GY + 8} width="800" height={400 - GY - 8} fill="url(#mg-earth)" />
    </g>
  );
}

// ─── Gold Particles ─────────────────────────────────────────────────

function GoldParticles({
  level,
  anim,
  claimActive,
}: {
  level: MineLevel;
  anim: boolean;
  claimActive: boolean;
}) {
  if (!anim) return null;
  const baseCount = level * 2 + 1;
  const count = claimActive ? baseCount + 6 : baseCount;

  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const cx = 80 + (i * 640) / count + Math.sin(i * 1.7) * 30;
        const startY = GY - 25 - (i % 3) * 12;
        const r = 1.2 + (i % 3) * 0.6;
        const dur = claimActive ? 1.5 + (i % 3) * 0.3 : 2.5 + (i % 4) * 0.5;
        const begin = (i % 6) * 0.4;
        return (
          <circle key={i} cx={cx} cy={startY} r={r} fill="url(#mg-gold)" opacity={0}>
            <animate
              attributeName="cy"
              values={`${startY};${startY - 25};${startY}`}
              dur={`${dur}s`}
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values={`0;${claimActive ? 0.9 : 0.7};0`}
              dur={`${dur}s`}
              begin={`${begin}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </g>
  );
}

// ─── Mining Indicator ───────────────────────────────────────────────

function MiningIndicator({ anim, label }: { anim: boolean; label: string }) {
  if (!anim) return null;
  return (
    <g>
      <circle cx={22} cy={GY + 38} r={4} fill="#22C55E">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text
        x={32}
        y={GY + 42}
        fontSize="11"
        fill="#22C55E"
        fontFamily="sans-serif"
        fontWeight="500"
      >
        {label}
      </text>
    </g>
  );
}
