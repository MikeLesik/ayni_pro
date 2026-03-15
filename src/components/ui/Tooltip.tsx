import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delayMs?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delayMs = 300,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayMs}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-50 max-w-[280px] rounded-lg bg-tooltip-bg px-3 py-2 text-xs text-tooltip-text',
              'shadow-lg',
              'animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
              'data-[side=top]:slide-in-from-bottom-1',
              'data-[side=bottom]:slide-in-from-top-1',
              'data-[side=left]:slide-in-from-right-1',
              'data-[side=right]:slide-in-from-left-1',
              className,
            )}
            style={{
              animationDuration: '0.15s',
            }}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-tooltip-bg" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
