import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText('Hello Card')).toBeInTheDocument();
  });

  it('sets role=button and tabIndex=0 when onClick is provided', () => {
    render(<Card onClick={() => {}}>Clickable</Card>);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('does not set role=button without onClick', () => {
    render(<Card>Static</Card>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('fires onClick on click', () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Press</Card>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('fires onClick on Enter key', () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Press</Card>);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('fires onClick on Space key', () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Press</Card>);
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(onClick).toHaveBeenCalledOnce();
  });
});
