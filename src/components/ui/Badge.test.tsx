import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders the translated status label by default', () => {
    render(<Badge status="active" />);
    // en.ts maps 'status.active' → 'Active'
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders custom label when provided', () => {
    render(<Badge status="active" label="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.queryByText('Active')).not.toBeInTheDocument();
  });

  it('applies status-specific CSS classes', () => {
    const { container } = render(<Badge status="completed" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-primary-light');
    expect(badge.className).toContain('text-primary');
  });
});
