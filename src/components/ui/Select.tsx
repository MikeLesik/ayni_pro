import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  className,
}: SelectProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('ui.select.placeholder');
  return (
    <div className={cn('flex flex-col', className)}>
      {label && <span className="mb-1.5 text-[13px] font-medium text-text-secondary">{label}</span>}

      <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className={cn(
            'inline-flex min-h-0 w-full items-center justify-between',
            'rounded-[10px] border-[1.5px] border-border bg-surface-card',
            'px-4 py-3.5 text-[15px] text-text-primary',
            'transition-all duration-200',
            'focus:border-primary focus:shadow-[0_0_0_3px_var(--color-focus-ring)] focus:outline-none',
            'data-[placeholder]:text-text-muted',
            disabled &&
              'bg-surface-secondary border-border-light text-text-muted cursor-not-allowed',
          )}
        >
          <SelectPrimitive.Value placeholder={resolvedPlaceholder} />
          <SelectPrimitive.Icon>
            <ChevronDown size={18} className="text-text-muted" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              'z-[300] max-h-[280px] min-w-[var(--radix-select-trigger-width)] overflow-hidden',
              'rounded-lg border border-border-light bg-surface-card p-1 shadow-md',
              'data-[state=open]:animate-scale-in',
            )}
          >
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'flex min-h-0 select-none items-center justify-between',
                    'rounded-md px-3 py-2 text-body-md outline-none',
                    option.disabled
                      ? 'cursor-not-allowed text-text-muted opacity-50'
                      : 'cursor-pointer text-text-primary data-[highlighted]:bg-surface-secondary',
                    'data-[state=checked]:bg-primary-light data-[state=checked]:text-primary',
                  )}
                  title={option.disabled ? option.description : undefined}
                >
                  <SelectPrimitive.ItemText>
                    <span>{option.label}</span>
                    {option.disabled && option.description && (
                      <span className="block text-xs text-text-muted mt-0.5">
                        {option.description}
                      </span>
                    )}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check size={16} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
