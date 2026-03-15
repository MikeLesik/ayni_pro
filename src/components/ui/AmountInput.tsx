import { useRef, useCallback, useState, useId } from 'react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';
import { formatInteger } from '@/lib/formatters';

const DEFAULT_QUICK_AMOUNTS = [100, 500, 1000, 5000];

export interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  min?: number;
  max?: number;
  quickAmounts?: number[];
  error?: string;
  helperText?: string;
  compact?: boolean;
  className?: string;
}

function formatQuickAmount(n: number, short = false): string {
  if (short && n >= 1000) {
    return `$${n / 1000}k`;
  }
  return `$${formatInteger(n)}`;
}

export function AmountInput({
  value,
  onChange,
  currency = '$',
  min = 100,
  max,
  quickAmounts = DEFAULT_QUICK_AMOUNTS,
  error,
  helperText,
  compact = false,
  className,
}: AmountInputProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  const messageId = useId();
  const activeError = error || internalError;
  const isCustom = !quickAmounts.includes(value);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const num = raw === '' ? 0 : parseInt(raw, 10);
      if (max && num > max) return;
      setInternalError(null);
      onChange(num);
    },
    [onChange, max],
  );

  const handleQuickAmount = useCallback(
    (amount: number) => {
      onChange(amount);
    },
    [onChange],
  );

  const handleBlur = useCallback(() => {
    if (value > 0 && value < min) {
      setInternalError(t('ui.amountInput.minimumError', { amount: formatInteger(min) }));
    } else {
      setInternalError(null);
    }
  }, [value, min, t]);

  const handleCustomClick = useCallback(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Main input */}
      <div className="relative w-full max-w-[320px]">
        <span
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-text-muted leading-none',
            compact ? 'text-[28px]' : 'text-[36px]',
          )}
        >
          {currency}
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={value === 0 ? '' : formatInteger(value)}
          onChange={handleInputChange}
          onBlur={handleBlur}
          aria-label={t('ui.amountInput.ariaLabel')}
          aria-invalid={!!activeError || undefined}
          aria-describedby={messageId}
          className={cn(
            'w-full text-center font-display leading-none',
            'border-[1.5px] rounded-lg bg-surface-card text-text-primary',
            'pl-12 pr-4',
            'transition-all duration-200',
            'focus:border-primary focus:shadow-[0_0_0_3px_var(--color-focus-ring)] focus:outline-none',
            activeError ? 'border-error' : 'border-border',
            compact ? 'h-12 text-[28px]' : 'h-14 text-[36px]',
          )}
        />
      </div>

      {/* Quick amount buttons */}
      <div className={cn('flex justify-center mt-3', compact ? 'gap-1.5' : 'gap-2 flex-wrap')}>
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handleQuickAmount(amount)}
            className={cn(
              'rounded-lg font-medium transition-all duration-200',
              compact ? 'text-xs px-2.5 py-1.5' : 'px-4 py-2 text-body-md',
              value === amount
                ? 'bg-primary text-white'
                : 'bg-surface-secondary text-text-secondary hover:bg-border',
            )}
          >
            {formatQuickAmount(amount, compact)}
          </button>
        ))}
        <button
          type="button"
          onClick={handleCustomClick}
          className={cn(
            'rounded-lg font-medium transition-all duration-200',
            compact ? 'text-xs px-2.5 py-1.5' : 'px-4 py-2 text-body-md',
            isCustom && value > 0
              ? 'bg-primary text-white'
              : 'bg-surface-secondary text-text-secondary hover:bg-border',
          )}
        >
          {t('ui.amountInput.custom')}
        </button>
      </div>

      {/* Helper / error text */}
      {activeError && (
        <p
          id={messageId}
          role="alert"
          className={cn('text-error text-center', compact ? 'text-xs mt-1.5' : 'text-body-sm mt-2')}
        >
          {activeError}
        </p>
      )}
      {!activeError && helperText && (
        <p
          id={messageId}
          className={cn(
            'text-text-muted text-center',
            compact ? 'text-xs mt-1.5' : 'text-body-sm mt-2',
          )}
        >
          {helperText}
        </p>
      )}
      {!activeError && !helperText && (
        <p
          id={messageId}
          className={cn(
            'text-text-muted text-center',
            compact ? 'text-xs mt-1.5' : 'text-body-sm mt-2',
          )}
        >
          {t('ui.amountInput.minimum', { amount: formatInteger(min) })}
        </p>
      )}
    </div>
  );
}
