import { useGreeting } from '@/hooks/useGreeting';
import { cn } from '@/lib/cn';

interface GreetingSectionProps {
  className?: string;
}

export function GreetingSection({ className }: GreetingSectionProps) {
  return (
    <div className={cn('mb-3', className)}>
      <h2 className="text-base font-medium text-text-secondary">{useGreeting()}</h2>
    </div>
  );
}
