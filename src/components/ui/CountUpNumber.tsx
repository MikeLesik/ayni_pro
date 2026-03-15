import { useCountUp, type EasingPreset } from '@/hooks/useCountUp';
import { formatNumber } from '@/lib/formatters';
import { cn } from '@/lib/cn';

export interface CountUpNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  easing?: EasingPreset | ((t: number) => number);
  className?: string;
  'aria-label'?: string;
}

export function CountUpNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  duration = 1200,
  easing,
  className,
  'aria-label': ariaLabel,
}: CountUpNumberProps) {
  const displayValue = useCountUp({ end: value, decimals, duration, easing });

  return (
    <>
      <span aria-hidden="true" className={cn(className)}>
        {prefix}
        {displayValue}
        {suffix}
      </span>
      <span className="sr-only" aria-live="polite">
        {ariaLabel || `${prefix}${formatNumber(value, decimals)}${suffix}`}
      </span>
    </>
  );
}
