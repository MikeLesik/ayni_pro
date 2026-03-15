import { cn } from '@/lib/cn';

interface LogoMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: 'text-base', gap: 'gap-1.5' },
  md: { icon: 28, text: 'text-xl', gap: 'gap-2' },
  lg: { icon: 36, text: 'text-2xl', gap: 'gap-2.5' },
} as const;

export function LogoMark({ size = 'md', className }: LogoMarkProps) {
  const s = sizes[size];

  return (
    <span className={cn('inline-flex items-center', s.gap, className)}>
      {/* Geometric mark — gold hexagon with pickaxe silhouette */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Hexagon background */}
        <path
          d="M18 2L32.5 10.5V25.5L18 34L3.5 25.5V10.5L18 2Z"
          fill="var(--color-primary)"
          opacity="0.15"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
        />
        {/* Inner gold bar */}
        <rect
          x="11"
          y="14"
          width="14"
          height="3"
          rx="1.5"
          fill="var(--color-primary)"
          opacity="0.6"
        />
        <rect x="13" y="19" width="10" height="3" rx="1.5" fill="var(--color-primary)" />
        {/* Peak accent */}
        <path d="M18 8L22 14H14L18 8Z" fill="var(--color-primary)" opacity="0.8" />
      </svg>
      <span className={cn('font-display font-bold text-primary tracking-wide', s.text)}>AYNI</span>
    </span>
  );
}
