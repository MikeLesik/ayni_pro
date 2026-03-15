import { cn } from '@/lib/cn';

export type SkeletonVariant = 'text' | 'heading' | 'number' | 'card' | 'chart' | 'avatar' | 'ring';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  lines?: number;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded-md',
  heading: 'h-8 w-3/4 rounded-md',
  number: 'h-12 w-1/2 rounded-md',
  card: 'h-32 w-full rounded-xl',
  chart: 'h-[200px] w-full rounded-xl',
  avatar: 'h-9 w-9 rounded-full',
  ring: 'h-[120px] w-[120px] rounded-full',
};

export function SkeletonLoader({
  variant = 'text',
  width,
  height,
  lines,
  className,
}: SkeletonLoaderProps) {
  if (variant === 'text' && lines && lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('skeleton-shimmer', variantStyles.text, i === lines - 1 && 'w-[60%]')}
            style={{ width: i === lines - 1 ? '60%' : width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('skeleton-shimmer', variantStyles[variant], className)}
      style={{ width, height }}
    />
  );
}
