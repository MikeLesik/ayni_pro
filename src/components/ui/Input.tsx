import { type InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, disabled, className, id: externalId, ...props }, ref) => {
    const autoId = useId();
    const id = externalId ?? autoId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const describedBy =
      [error ? errorId : null, helperText && !error ? helperId : null].filter(Boolean).join(' ') ||
      undefined;

    return (
      <div className={cn('flex flex-col', className)}>
        {label && (
          <label htmlFor={id} className="mb-1.5 text-[13px] font-medium text-text-secondary">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              'w-full rounded-[10px] border-[1.5px] bg-surface-card px-4 py-3.5 text-[15px] text-text-primary',
              'placeholder:text-text-muted',
              'transition-all duration-200 ease-in-out',
              'focus:border-primary focus:shadow-[0_0_0_3px_var(--color-focus-ring)] focus:outline-none',
              icon && 'pl-11',
              error ? 'border-error' : 'border-border',
              disabled &&
                'bg-surface-secondary border-border-light text-text-muted cursor-not-allowed',
            )}
            {...props}
          />
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-1 text-xs text-error">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1 text-xs text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
