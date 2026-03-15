import { cn } from '@/lib/cn';
import { type LucideIcon } from 'lucide-react';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: string;
  className?: string;
}

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function Icon({ icon: LucideIcon, size = 'md', color, className }: IconProps) {
  return (
    <LucideIcon
      size={sizeMap[size]}
      strokeWidth={1.5}
      color={color}
      className={cn('shrink-0', className)}
    />
  );
}
