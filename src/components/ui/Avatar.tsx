import { cn } from '@/lib/cn';
import { Camera } from 'lucide-react';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  showEditOverlay?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-body-sm',
  md: 'h-9 w-9 text-body-md',
  lg: 'h-16 w-16 text-body-lg',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Avatar({
  src,
  name,
  size = 'md',
  showEditOverlay = false,
  onClick,
  className,
}: AvatarProps) {
  const isClickable = !!onClick;

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        'relative inline-flex items-center justify-center rounded-full shrink-0 overflow-hidden',
        sizeStyles[size],
        !src && 'bg-primary-light text-primary font-semibold',
        isClickable && 'cursor-pointer',
        showEditOverlay && 'group',
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="h-full w-full object-cover rounded-full" />
      ) : (
        <span>{name ? getInitials(name) : '?'}</span>
      )}

      {showEditOverlay && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
}
