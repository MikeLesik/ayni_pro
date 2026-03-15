import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './Tabs';

const sampleTabs = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'closed', label: 'Closed' },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs items={sampleTabs} activeId="all" onChange={vi.fn()} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('active tab has bg-primary class (pill variant)', () => {
    render(<Tabs items={sampleTabs} activeId="active" onChange={vi.fn()} variant="pill" />);
    const activeTab = screen.getByText('Active').closest('button');
    expect(activeTab?.className).toContain('bg-primary');
  });

  it('clicking an inactive tab calls onChange with the tab id', () => {
    const onChange = vi.fn();
    render(<Tabs items={sampleTabs} activeId="all" onChange={onChange} />);
    const closedTab = screen.getByRole('tab', { name: 'Closed' });
    // Radix Tabs in automatic mode activates on focus
    fireEvent.focus(closedTab);
    expect(onChange).toHaveBeenCalledWith('closed');
  });

  it('count badge renders when count is provided', () => {
    const tabsWithCount = [
      { id: 'all', label: 'All', count: 42 },
      { id: 'active', label: 'Active' },
    ];
    render(<Tabs items={tabsWithCount} activeId="all" onChange={vi.fn()} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('underline variant renders with border-b-2 class', () => {
    render(<Tabs items={sampleTabs} activeId="all" onChange={vi.fn()} variant="underline" />);
    const activeTab = screen.getByText('All').closest('button');
    expect(activeTab?.className).toContain('border-b-2');
  });
});
