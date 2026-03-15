import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { getLocale } from '@/lib/formatters';

type EasingFunction = (t: number) => number;
export type EasingPreset = 'easeOutExpo' | 'easeOutQuad' | 'easeOutSpring' | 'linear';

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  enabled?: boolean;
  easing?: EasingPreset | EasingFunction;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function easeOutSpring(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function linear(t: number): number {
  return t;
}

const easingPresets: Record<EasingPreset, EasingFunction> = {
  easeOutExpo,
  easeOutQuad,
  easeOutSpring,
  linear,
};

function formatWithSeparators(value: number, decimals: number): string {
  return new Intl.NumberFormat(getLocale(), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);
}

export function useCountUp({
  end,
  start = 0,
  duration = 1200,
  decimals = 2,
  enabled = true,
  easing = 'easeOutExpo',
}: UseCountUpOptions): string {
  const easingFn = typeof easing === 'function' ? easing : (easingPresets[easing] ?? easeOutExpo);
  const reducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(
    reducedMotion || !enabled
      ? formatWithSeparators(end, decimals)
      : formatWithSeparators(start, decimals),
  );
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(formatWithSeparators(end, decimals));
      return;
    }

    if (reducedMotion) {
      setDisplayValue(formatWithSeparators(end, decimals));
      return;
    }

    const range = end - start;
    if (range === 0) {
      setDisplayValue(formatWithSeparators(end, decimals));
      return;
    }

    startTimeRef.current = 0;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const currentValue = start + range * easedProgress;

      setDisplayValue(formatWithSeparators(currentValue, decimals));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, start, duration, decimals, enabled, reducedMotion, easingFn]);

  return displayValue;
}
