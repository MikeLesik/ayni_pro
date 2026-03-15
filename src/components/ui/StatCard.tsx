import { type ReactNode } from 'react';
import { Card } from './Card';
import { Tooltip } from './Tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface StatCardProps {
  icon: ReactNode;
  iconColor?: string;
  label: string;
  value: string;
  trend?: 'success' | 'warning' | 'error';
  tooltip?: string;
  className?: string;
}

export function StatCard({
  icon,
  iconColor,
  label,
  value,
  trend,
  tooltip,
  className,
}: StatCardProps) {
  return (
    <Card variant="stat" padding="p-2.5 md:p-4 lg:p-6" className={className}>
      <div className="flex items-center gap-1">
        <div className={cn('w-4 h-4 md:w-[18px] md:h-[18px]', iconColor)}>{icon}</div>
        {tooltip && (
          <Tooltip content={tooltip}>
            <button
              type="button"
              className="text-text-muted hover:text-text-secondary transition-colors"
              aria-label="More info"
            >
              <Info size={12} />
            </button>
          </Tooltip>
        )}
      </div>
      <div className="text-[10px] md:text-label-sm font-medium text-text-muted uppercase tracking-wide mt-1.5 md:mt-2">
        {label}
      </div>
      <div
        className={cn(
          'text-[15px] md:text-number-lg font-semibold mt-0.5',
          trend === 'success' ? 'text-success' : 'text-text-primary',
        )}
      >
        {value}
      </div>
    </Card>
  );
}
