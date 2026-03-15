import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <label className={cn('flex gap-3', disabled && 'opacity-40 cursor-not-allowed', className)}>
      <CheckboxPrimitive.Root
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        disabled={disabled}
        className={cn(
          'mt-0.5 flex h-5 w-5 min-h-0 min-w-0 shrink-0 items-center justify-center',
          'rounded-md border-[1.5px] transition-all duration-200',
          'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
          checked ? 'border-primary bg-primary' : 'border-border bg-transparent',
          disabled && 'cursor-not-allowed',
        )}
      >
        <CheckboxPrimitive.Indicator>
          <Check size={14} className="text-white" strokeWidth={2.5} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {(label || description) && (
        <div className="flex flex-col select-none">
          {label && <span className="text-body-md text-text-primary">{label}</span>}
          {description && <span className="text-body-sm text-text-secondary">{description}</span>}
        </div>
      )}
    </label>
  );
}
