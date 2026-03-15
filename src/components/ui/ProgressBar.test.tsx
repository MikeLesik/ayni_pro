import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders with role=progressbar', () => {
    render(<ProgressBar percent={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow to the clamped percent', () => {
    render(<ProgressBar percent={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('sets aria-valuemin=0 and aria-valuemax=100', () => {
    render(<ProgressBar percent={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps percent to 0-100 range', () => {
    const { rerender } = render(<ProgressBar percent={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<ProgressBar percent={-20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('renders label and sublabel', () => {
    render(<ProgressBar percent={60} label="Progress" sublabel="60%" />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });
});
