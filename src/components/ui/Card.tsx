import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export type CardVariant = 'stat' | 'position' | 'action' | 'premium' | 'glass';
export type CardPadding = 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  padding?: CardPadding | string;
}

const paddingStyles: Record<CardPadding, string> = {
  sm: 'p-3',
  md: 'p-4 lg:p-6',
  lg: 'p-5 lg:p-6',
};

const variantStyles: Record<CardVariant, string> = {
  stat: [
    'bg-surface-card',
    'border border-border',
    'rounded-xl',
    'shadow-sm',
    'hover:shadow-md',
  ].join(' '),
  position: [
    'bg-surface-card',
    'border border-border',
    'rounded-xl',
    'shadow-sm',
    'hover:shadow-md',
  ].join(' '),
  action: [
    'bg-surface-card',
    'border border-border',
    'rounded-xl',
    'shadow-sm',
    'hover:shadow-md',
  ].join(' '),
  premium: ['bg-primary text-white', 'rounded-2xl', 'shadow-lg'].join(' '),
  glass: [
    'bg-white/5',
    'border border-white/[0.08]',
    'rounded-xl',
    'backdrop-blur-[20px]',
    'shadow-sm',
  ].join(' '),
};

const variantDefaultPadding: Record<CardVariant, CardPadding> = {
  stat: 'md',
  position: 'md',
  action: 'md',
  premium: 'lg',
  glass: 'md',
};

const hoverStyles: Record<CardVariant, string> = {
  stat: 'hover:shadow-md',
  position: 'hover:shadow-md',
  action: 'hover:shadow-md',
  premium: '',
  glass: '',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'stat', hoverable = false, padding, className, onClick, children, style, ...props },
    ref,
  ) => {
    const isClickable = !!onClick;

    return (
      <div
        ref={ref}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        className={cn(
          'transition-all duration-200 ease-in-out',
          variantStyles[variant],
          padding && (padding === 'sm' || padding === 'md' || padding === 'lg')
            ? paddingStyles[padding]
            : (padding ?? paddingStyles[variantDefaultPadding[variant]]),
          (hoverable || isClickable) && hoverStyles[variant],
          isClickable && 'cursor-pointer',
          className,
        )}
        style={
          variant === 'action'
            ? {
                backgroundImage: `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 5%, transparent), transparent)`,
                ...style,
              }
            : style
        }
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
