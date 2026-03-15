import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Button } from './Button';

export interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  socialProof?: string;
  className?: string;
}

export function EmptyState({
  illustration,
  title,
  description,
  ctaLabel,
  onCtaClick,
  socialProof,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center text-center py-16 px-8 bg-dots', className)}>
      {illustration && <div className="mb-6">{illustration}</div>}

      <h2 className="text-heading-2 md:text-heading-2 text-heading-2-mobile text-text-primary">
        {title}
      </h2>

      <p className="text-body-lg md:text-body-lg text-body-lg-mobile text-text-secondary mt-2 max-w-[420px]">
        {description}
      </p>

      {ctaLabel && onCtaClick && (
        <Button variant="gold-cta" onClick={onCtaClick} className="mt-6">
          {ctaLabel}
        </Button>
      )}

      {socialProof && <p className="text-body-sm text-text-muted mt-4">{socialProof}</p>}
    </div>
  );
}
