import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from './StatCard';

function TestIcon() {
  return <span data-testid="icon">icon</span>;
}

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard icon={<TestIcon />} label="Revenue" value="$1,234" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,234')).toBeInTheDocument();
  });

  it('applies success trend color', () => {
    const { container } = render(
      <StatCard icon={<TestIcon />} label="Profit" value="+5%" trend="success" />,
    );
    const valueEl = container.querySelector('.text-success');
    expect(valueEl).toBeTruthy();
    expect(valueEl?.textContent).toBe('+5%');
  });

  it('renders tooltip info button when tooltip prop is given', () => {
    render(<StatCard icon={<TestIcon />} label="Info" value="42" tooltip="More details" />);
    expect(screen.getByLabelText('More info')).toBeInTheDocument();
  });

  it('does not render tooltip button when tooltip is omitted', () => {
    render(<StatCard icon={<TestIcon />} label="Info" value="42" />);
    expect(screen.queryByLabelText('More info')).not.toBeInTheDocument();
  });
});
