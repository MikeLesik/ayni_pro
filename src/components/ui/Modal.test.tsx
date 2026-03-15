import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('does not render children when open=false', () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        <p>Hidden content</p>
      </Modal>,
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders children when open=true', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <p>Visible content</p>
      </Modal>,
    );
    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="My Dialog">
        <p>Body</p>
      </Modal>,
    );
    expect(screen.getByText('My Dialog')).toBeInTheDocument();
  });

  it('close button calls onClose when clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    const closeBtn = screen.getByLabelText('Close');
    closeBtn.click();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('close button has aria-label="Close"', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });
});
