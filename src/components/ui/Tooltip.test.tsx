import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders trigger children', () => {
    render(
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('does not show tooltip content initially', () => {
    render(
      <Tooltip content="Secret info">
        <button>Trigger</button>
      </Tooltip>,
    );
    // Radix Tooltip uses a Portal, content should not be in the DOM until triggered
    expect(screen.queryByText('Secret info')).not.toBeInTheDocument();
  });

  it('renders without crashing with all optional props', () => {
    const { container } = render(
      <Tooltip content="Tip" side="bottom" delayMs={100} className="custom-class">
        <span>Info</span>
      </Tooltip>,
    );
    expect(container).toBeTruthy();
    expect(screen.getByText('Info')).toBeInTheDocument();
  });
});
