import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export type TabsVariant = 'pill' | 'underline';

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export function Tabs({
  items,
  activeId,
  onChange,
  variant = 'pill',
  size = 'md',
  className,
}: TabsProps) {
  return (
    <TabsPrimitive.Root value={activeId} onValueChange={onChange}>
      <TabsPrimitive.List
        className={cn(
          'flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          variant === 'underline' && 'border-b border-border-light gap-0',
          className,
        )}
      >
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <TabsPrimitive.Trigger
              key={item.id}
              value={item.id}
              className={cn(
                'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-200',
                'min-h-0 shrink-0 whitespace-nowrap',
                // Pill variant
                variant === 'pill' && [
                  'rounded-full',
                  size === 'sm' ? 'px-3 py-1.5 text-[13px]' : 'px-4 py-1.5 text-body-md',
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-transparent text-text-secondary hover:bg-surface-secondary',
                ],
                // Underline variant
                variant === 'underline' && [
                  'border-b-2 -mb-px',
                  size === 'sm' ? 'px-3 pb-2 text-body-sm' : 'px-4 pb-3 text-body-md',
                  isActive
                    ? 'border-primary text-text-primary font-semibold'
                    : 'border-transparent text-text-secondary hover:text-text-primary',
                ],
              )}
            >
              {item.label}
              {item.count != null && (
                <span
                  className={cn(
                    'text-xs tabular-nums',
                    isActive
                      ? variant === 'pill'
                        ? 'text-white/70'
                        : 'text-text-secondary'
                      : 'text-text-muted',
                  )}
                >
                  {item.count}
                </span>
              )}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
