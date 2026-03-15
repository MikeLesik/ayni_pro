import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TierBadge } from './TierBadge';

// The component uses useTranslation which reads from zustand uiStore.
// The default language is 'en', and the setup.ts provides localStorage shim,
// so translations resolve to English keys by default.

describe('TierBadge', () => {
  it('renders the tier label text', () => {
    render(<TierBadge tier="explorer" />);
    // en.ts: 'tiers.explorer' → 'Explorer'
    expect(screen.getByText('Explorer')).toBeInTheDocument();
  });

  it('renders correct icon for each tier', () => {
    const { container: explorerContainer } = render(<TierBadge tier="explorer" />);
    // Lucide icons render as <svg> elements; Compass icon for explorer
    const explorerSvg = explorerContainer.querySelector('svg');
    expect(explorerSvg).toBeTruthy();

    const { container: principalContainer } = render(<TierBadge tier="principal" />);
    // Crown icon for principal
    const principalSvg = principalContainer.querySelector('svg');
    expect(principalSvg).toBeTruthy();
  });

  it('applies different styling for size="md" vs default "sm"', () => {
    const { container: smContainer } = render(<TierBadge tier="contributor" size="sm" />);
    const smBadge = smContainer.firstChild as HTMLElement;
    expect(smBadge.className).toContain('text-[11px]');
    expect(smBadge.style.padding).toBe('2px 8px');

    const { container: mdContainer } = render(<TierBadge tier="contributor" size="md" />);
    const mdBadge = mdContainer.firstChild as HTMLElement;
    expect(mdBadge.className).toContain('text-sm');
    expect(mdBadge.style.padding).toBe('5px 12px');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<TierBadge tier="operator" onClick={handleClick} />);
    const badge = screen.getByRole('button');
    fireEvent.click(badge);
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
