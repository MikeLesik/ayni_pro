import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ProgressBarProps {
  percent: number;
  label?: string;
  sublabel?: string;
  animated?: boolean;
  height?: number;
  className?: string;
}

export function ProgressBar({
  percent,
  label,
  sublabel,
  animated = true,
  height = 6,
  className,
}: ProgressBarProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animated && !reducedMotion;
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div
      className={cn('w-full', className)}
      role="progressbar"
      aria-valuenow={clampedPercent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Track */}
      <div className="w-full rounded-full bg-surface-secondary" style={{ height: `${height}px` }}>
        {/* Fill */}
        {shouldAnimate ? (
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'var(--color-primary-gradient)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${clampedPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ) : (
          <div
            className="h-full rounded-full"
            style={{
              width: `${clampedPercent}%`,
              background: 'var(--color-primary-gradient)',
            }}
          />
        )}
      </div>

      {/* Labels */}
      {(label || sublabel) && (
        <div className="mt-1.5 flex items-center justify-between">
          {label && <span className="text-body-sm text-text-secondary">{label}</span>}
          {sublabel && <span className="text-body-sm text-text-muted">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
