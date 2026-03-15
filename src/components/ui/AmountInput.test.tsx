import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AmountInput } from './AmountInput';

describe('AmountInput', () => {
  it('renders with currency symbol "$" and input', () => {
    render(<AmountInput value={0} onChange={vi.fn()} />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByLabelText('Participation amount')).toBeInTheDocument();
  });

  it('quick amount buttons render with correct labels ($100, $500, $1,000, $5,000)', () => {
    render(<AmountInput value={0} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '$100' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$500' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$1,000' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '$5,000' })).toBeInTheDocument();
  });

  it('clicking a quick amount button calls onChange with that amount', () => {
    const onChange = vi.fn();
    render(<AmountInput value={0} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '$500' }));
    expect(onChange).toHaveBeenCalledWith(500);
  });

  it('custom button renders with "Custom" text', () => {
    render(<AmountInput value={0} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument();
  });

  it('shows default helper text "Minimum amount: $100"', () => {
    render(<AmountInput value={0} onChange={vi.fn()} />);
    expect(screen.getByText('Minimum amount: $100')).toBeInTheDocument();
  });

  it('shows error text when error prop provided', () => {
    render(<AmountInput value={0} onChange={vi.fn()} error="Amount too low" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Amount too low');
  });

  it('does not call onChange when typing above max', () => {
    const onChange = vi.fn();
    render(<AmountInput value={500} onChange={onChange} max={1000} />);
    const input = screen.getByLabelText('Participation amount');
    fireEvent.change(input, { target: { value: '2000' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('input has aria-describedby attribute', () => {
    render(<AmountInput value={0} onChange={vi.fn()} />);
    const input = screen.getByLabelText('Participation amount');
    expect(input).toHaveAttribute('aria-describedby');
  });
});
