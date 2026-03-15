import { useState, useEffect, useMemo, useId } from 'react';
import { useReducedMotion } from 'framer-motion';
import { formatCurrency } from '@/lib/formatters';
import { useTranslation } from '@/i18n';

interface MineLevelProgressProps {
  currentName: string;
  nextName: string | null;
  progress: number;
  amountNeeded: number | null;
  isMaxLevel: boolean;
}

const SVG_W = 300;
const SVG_H = 24;
const RX = 12;
const WAVE_AMP = 3;
const WAVE_LEN = 30;

/** Generate sine-wave path that sits on top of the liquid fill */
function generateWavePath(fillW: number): string {
  const baseY = 10;
  let d = `M-${WAVE_LEN},${baseY}`;
  for (let x = -WAVE_LEN; x <= fillW + WAVE_LEN; x += WAVE_LEN / 2) {
    const dir = Math.round(x / (WAVE_LEN / 2)) % 2 === 0;
    const cy = dir ? baseY - WAVE_AMP : baseY + WAVE_AMP;
    d += ` Q${x + WAVE_LEN / 4},${cy} ${x + WAVE_LEN / 2},${baseY}`;
  }
  d += ` L${fillW + WAVE_LEN},${SVG_H} L-${WAVE_LEN},${SVG_H} Z`;
  return d;
}

const BUBBLES = [
  { delay: 0, dur: 2.2, cx: 0.3, r: 1.8 },
  { delay: 0.6, dur: 2.8, cx: 0.5, r: 1.2 },
  { delay: 1.2, dur: 2.5, cx: 0.7, r: 1.5 },
  { delay: 0.3, dur: 3.0, cx: 0.15, r: 1.0 },
  { delay: 1.5, dur: 2.0, cx: 0.85, r: 1.3 },
];

export function MineLevelProgress({
  currentName,
  nextName,
  progress,
  amountNeeded,
  isMaxLevel,
}: MineLevelProgressProps) {
  const { t } = useTranslation();
  const baseId = useId();
  const clipId = `lp-clip-${baseId}`;
  const gradId = `lp-gold-${baseId}`;
  const reducedMotion = useReducedMotion();
  const anim = !reducedMotion;

  if (isMaxLevel) {
    return (
      <div className="text-center py-2">
        <p className="text-body-sm text-primary font-semibold">{t('mine.progress.maxLevel')}</p>
      </div>
    );
  }

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  // Animated fill width
  const [animatedPct, setAnimatedPct] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(clampedProgress), 500);
    return () => clearTimeout(timer);
  }, [clampedProgress]);

  const fillW = (animatedPct / 100) * SVG_W;
  const wavePath = useMemo(() => generateWavePath(fillW), [fillW]);

  return (
    <div>
      {/* Labels */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-text-primary">{currentName}</span>
        <span className="text-xs text-text-muted">
          {nextName ?? t('mine.progress.maxLevelLabel')}
        </span>
      </div>

      {/* SVG Liquid-Fill Progress Bar */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-6"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('mine.progress.ariaLabel', {
          percent: clampedProgress,
          name: nextName ?? t('mine.progress.maxLevelLabel'),
        })}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={SVG_W} height={SVG_H} rx={RX} />
          </clipPath>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-gold)" />
            <stop offset="50%" stopColor="var(--color-gold-mid, #E8D48B)" />
            <stop offset="100%" stopColor="var(--color-gold)" />
          </linearGradient>
        </defs>

        {/* Background container */}
        <rect
          x="0"
          y="0"
          width={SVG_W}
          height={SVG_H}
          rx={RX}
          fill="var(--color-bg-secondary, #E5E7EB)"
          clipPath={`url(#${clipId})`}
        />

        <g clipPath={`url(#${clipId})`}>
          {/* Gold fill */}
          <rect
            x="0"
            y="0"
            width={fillW}
            height={SVG_H}
            fill={`url(#${gradId})`}
            style={{ transition: 'width 1500ms ease-out' }}
          />

          {/* Wave overlay on fill edge */}
          {anim && fillW > 10 && (
            <g opacity={0.3}>
              <path d={wavePath} fill="var(--color-gold-dark, #A68B3C)">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0,0;-${WAVE_LEN},0;0,0`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}

          {/* Bubbles */}
          {anim &&
            fillW > 30 &&
            BUBBLES.map((b, i) => {
              const bx = fillW * b.cx;
              if (bx < 5) return null;
              return (
                <circle
                  key={i}
                  cx={bx}
                  cy={SVG_H - 4}
                  r={b.r}
                  fill="var(--color-gold-light, #F5EFD7)"
                  opacity={0}
                >
                  <animate
                    attributeName="cy"
                    values={`${SVG_H - 4};4;${SVG_H - 4}`}
                    dur={`${b.dur}s`}
                    begin={`${b.delay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.5;0"
                    dur={`${b.dur}s`}
                    begin={`${b.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              );
            })}

          {/* Inner highlight (subtle top reflection) */}
          {fillW > 20 && (
            <rect x="0" y="1" width={fillW} height={6} rx={RX} fill="white" opacity={0.12} />
          )}
        </g>

        {/* Percentage text */}
        {animatedPct >= 12 && (
          <text
            x={fillW / 2}
            y={SVG_H / 2 + 4}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            {clampedProgress}%
          </text>
        )}
      </svg>

      {/* Bottom label */}
      {amountNeeded != null && nextName && (
        <p className="text-xs text-text-secondary mt-1">
          {t('mine.progress.investPrompt', {
            amount: formatCurrency(amountNeeded),
            name: nextName,
          })}
        </p>
      )}
    </div>
  );
}
