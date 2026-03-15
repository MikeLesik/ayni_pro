import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}: AccordionProps) {
  if (allowMultiple) {
    return (
      <AccordionPrimitive.Root
        type="multiple"
        defaultValue={defaultOpenId ? [defaultOpenId] : undefined}
        className={cn('space-y-1', className)}
      >
        {items.map((item) => (
          <AccordionItemComponent key={item.id} item={item} />
        ))}
      </AccordionPrimitive.Root>
    );
  }

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultOpenId}
      className={cn('space-y-1', className)}
    >
      {items.map((item) => (
        <AccordionItemComponent key={item.id} item={item} />
      ))}
    </AccordionPrimitive.Root>
  );
}

function AccordionItemComponent({ item }: { item: AccordionItem }) {
  return (
    <AccordionPrimitive.Item
      value={item.id}
      className="bg-surface-card rounded-lg border border-border-light overflow-hidden"
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            'flex flex-1 items-center justify-between py-3 px-4 text-left',
            'text-sm text-text-primary font-semibold',
            'transition-colors duration-200',
            'hover:bg-surface-secondary/50',
            'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]',
            '[&[data-state=open]>svg]:rotate-180',
          )}
        >
          {item.title}
          <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-accordion-down',
          'data-[state=closed]:animate-accordion-up',
        )}
      >
        <div className="px-4 pb-3 pt-0 text-sm text-text-secondary">{item.content}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
