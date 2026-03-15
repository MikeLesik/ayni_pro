import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Accordion } from './Accordion';
import type { AccordionItem } from './Accordion';

const items: AccordionItem[] = [
  { id: 'a', title: 'Section A', content: 'Content for A' },
  { id: 'b', title: 'Section B', content: 'Content for B' },
  { id: 'c', title: 'Section C', content: 'Content for C' },
];

describe('Accordion', () => {
  it('renders all item titles', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
    expect(screen.getByText('Section C')).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(<Accordion items={items} />);
    // Radix Accordion removes closed content from the DOM
    expect(screen.queryByText('Content for A')).not.toBeInTheDocument();
    expect(screen.queryByText('Content for B')).not.toBeInTheDocument();
    expect(screen.queryByText('Content for C')).not.toBeInTheDocument();
  });

  it('shows content when defaultOpenId matches an item', () => {
    render(<Accordion items={items} defaultOpenId="b" />);
    expect(screen.getByText('Content for B')).toBeVisible();
    // Other items should remain closed (not in DOM)
    expect(screen.queryByText('Content for A')).not.toBeInTheDocument();
  });

  it('toggles content visibility when clicking a title', () => {
    render(<Accordion items={items} />);

    const triggerA = screen.getByText('Section A');
    // Initially not in the DOM
    expect(screen.queryByText('Content for A')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(triggerA);
    expect(screen.getByText('Content for A')).toBeVisible();

    // Click again to close (collapsible is enabled)
    fireEvent.click(triggerA);
    expect(screen.queryByText('Content for A')).not.toBeInTheDocument();
  });
});
