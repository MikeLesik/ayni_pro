import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface SuccessPulseProps {
  /** Flip to `true` to trigger pulse. Reset to `false` to allow re-trigger. */
  trigger: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps children with a gold pulse animation (scale 1→1.05→1 + glow).
 * Uses the Tailwind `animate-success-pulse` keyframe (0.6s).
 */
export function SuccessPulse({ trigger, children, className }: SuccessPulseProps) {
  const reducedMotion = useReducedMotion();
  const [pulsing, setPulsing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (trigger && !reducedMotion) {
      setPulsing(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setPulsing(false), 600);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [trigger, reducedMotion]);

  return <div className={cn(pulsing && 'animate-success-pulse', className)}>{children}</div>;
}
