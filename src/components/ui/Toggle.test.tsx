import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders label text', () => {
    render(<Toggle checked={false} onChange={vi.fn()} label="Dark mode" />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('clicking calls onChange', () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} label="Notifications" />);
    const switchEl = screen.getByRole('switch');
    fireEvent.click(switchEl);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('when disabled, has disabled attribute', () => {
    render(<Toggle checked={false} onChange={vi.fn()} label="Locked" disabled />);
    const switchEl = screen.getByRole('switch');
    expect(switchEl).toBeDisabled();
  });

  it('renders description when provided via label', () => {
    render(
      <Toggle checked={true} onChange={vi.fn()} label="Auto-save" />,
    );
    expect(screen.getByText('Auto-save')).toBeInTheDocument();
  });
});
