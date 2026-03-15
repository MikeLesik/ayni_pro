import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No data" description="Nothing here yet" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders CTA button when ctaLabel and onCtaClick are provided', () => {
    const onCta = vi.fn();
    render(<EmptyState title="Empty" ctaLabel="Get started" onCtaClick={onCta} />);
    const btn = screen.getByRole('button', { name: 'Get started' });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onCta).toHaveBeenCalledOnce();
  });

  it('does not render CTA when props are omitted', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders socialProof text', () => {
    render(<EmptyState title="Join" socialProof="47 participants" />);
    expect(screen.getByText('47 participants')).toBeInTheDocument();
  });
});
