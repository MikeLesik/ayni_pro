import { type ReactNode, useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  centerContent?: ReactNode;
  animated?: boolean;
  color?: string;
  className?: string;
}

export function ProgressRing({
  percent,
  size = 88,
  strokeWidth = 4,
  centerContent,
  animated = true,
  color,
  className,
}: ProgressRingProps) {
  const gradientId = useId();
  const reducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-gold)" />
            <stop offset="50%" stopColor="var(--color-gold-mid)" />
            <stop offset="100%" stopColor="var(--color-gold)" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={strokeWidth}
        />

        {/* Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color ?? `url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={
            animated && !reducedMotion
              ? { strokeDashoffset: circumference }
              : { strokeDashoffset: offset }
          }
          animate={{ strokeDashoffset: offset }}
          transition={
            animated && !reducedMotion ? { duration: 1.5, ease: 'easeOut' } : { duration: 0 }
          }
        />
      </svg>

      {/* Center content */}
      {centerContent && (
        <div className="absolute inset-0 flex items-center justify-center">{centerContent}</div>
      )}
    </div>
  );
}
