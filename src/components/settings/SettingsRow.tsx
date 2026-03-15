import { ChevronRight } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/cn';

interface SettingsRowProps {
  label: string;
  helperText?: string;
  control: 'navigate' | 'toggle' | 'select' | 'badge';
  value?: string | boolean;
  options?: { value: string; label: string }[];
  badgeText?: string;
  onChange?: (value: any) => void;
  onClick?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  isLast?: boolean;
}

export function SettingsRow({
  label,
  helperText,
  control,
  value,
  options,
  badgeText,
  onChange,
  onClick,
  destructive = false,
  disabled = false,
  isLast = false,
}: SettingsRowProps) {
  const isClickable = control === 'navigate' && !!onClick;

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
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
        'flex items-center gap-3 px-4 min-h-[48px] py-3',
        !isLast && 'border-b border-border-light',
        isClickable && 'cursor-pointer transition-colors duration-150 hover:bg-surface-secondary',
      )}
    >
      {/* Label + helper */}
      <div className="flex-1 min-w-0">
        <span className={cn('text-sm', destructive ? 'text-error' : 'text-text-primary')}>
          {label}
        </span>
        {helperText && <p className="text-xs text-text-muted mt-0.5 leading-snug">{helperText}</p>}
      </div>

      {/* Control */}
      {control === 'navigate' && <ChevronRight size={18} className="shrink-0 text-text-muted" />}

      {control === 'toggle' && (
        <Toggle
          checked={!!value}
          onChange={(v) => onChange?.(v)}
          disabled={disabled}
          aria-label={label}
        />
      )}

      {control === 'select' && options && (
        <select
          value={value as string}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            'appearance-none text-sm',
            'bg-surface-card text-text-primary',
            'rounded-lg px-3 py-1.5 pr-7',
            'border border-border',
            'cursor-pointer outline-none',
            'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
            'bg-no-repeat bg-[right_8px_center]',
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239B9B9B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-card text-text-primary">
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {control === 'badge' && badgeText && (
        <span className="text-xs font-medium text-text-muted bg-surface-secondary rounded-full px-2.5 py-0.5">
          {badgeText}
        </span>
      )}
    </div>
  );
}
