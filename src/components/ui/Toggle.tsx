import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  'aria-label': ariaLabel,
  className,
}: ToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3',
        disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
    >
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        className={cn(
          'relative inline-flex h-6 w-11 min-h-0 min-w-0 shrink-0 cursor-pointer items-center rounded-full',
          'transition-colors duration-200',
          'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
          checked ? 'bg-primary' : 'bg-border',
          disabled && 'cursor-not-allowed',
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'block h-5 w-5 rounded-full bg-white shadow-xs',
            'transition-transform duration-200',
            checked ? 'translate-x-[22px]' : 'translate-x-[2px]',
          )}
        />
      </SwitchPrimitive.Root>

      {label && <span className="text-body-md text-text-primary select-none">{label}</span>}
    </label>
  );
}
