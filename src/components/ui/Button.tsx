import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'gold-cta'
  | 'text'
  | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-primary text-white rounded-[12px]',
    'shadow-[var(--shadow-primary-sm)]',
    'hover:bg-primary-hover hover:shadow-[var(--shadow-primary-md)] hover:-translate-y-px',
  ].join(' '),
  secondary: [
    'bg-transparent text-primary rounded-[12px]',
    'border-[1.5px] border-border',
    'hover:bg-primary-light hover:border-primary',
  ].join(' '),
  ghost: [
    'bg-transparent text-text-secondary rounded-[8px]',
    'hover:bg-surface-secondary hover:text-text-primary',
  ].join(' '),
  danger: [
    'bg-transparent text-error rounded-[12px]',
    'border-[1.5px] border-error/30',
    'hover:bg-error-light',
  ].join(' '),
  'gold-cta': [
    'bg-primary text-white rounded-[12px]',
    'shadow-[var(--shadow-primary-cta)]',
    'hover:shadow-gold',
    'relative overflow-hidden',
  ].join(' '),
  text: [
    'bg-transparent text-primary p-0 h-auto rounded-none',
    'hover:underline underline-offset-4',
  ].join(' '),
  inverse: ['bg-white text-primary rounded-lg', 'hover:opacity-90'].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-[15px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium',
          'transition-all duration-100 ease-in-out',
          'active:scale-[0.98]',
          'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
          variantStyles[variant],
          variant !== 'text' && sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {/* Gold CTA bottom gradient border */}
        {variant === 'gold-cta' && (
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background: 'var(--color-gold-gradient)',
            }}
          />
        )}

        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
