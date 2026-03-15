import { useState } from 'react';
import { Search, Mail, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Toggle } from '@/components/ui/Toggle';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-heading-2 text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export default function DevPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');
  const [tabVariant, setTabVariant] = useState('pill1');
  const [toggleChecked, setToggleChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-surface-bg px-4 py-8 md:px-12">
      <div className="mx-auto max-w-[1000px]">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-display text-heading-1 text-text-primary">
              AYNI Component Library
            </h1>
            <p className="mt-2 text-body-lg text-text-secondary">
              All UI components for development reference
            </p>
          </div>
          <Toggle checked={darkMode} onChange={toggleTheme} label="Dark" />
        </div>

        {/* ── Buttons ──────────────────────────────────────────── */}
        <Section title="Button">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="gold-cta">Gold CTA</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button leftIcon={<Mail size={18} />}>With Icon</Button>
              <Button variant="primary" rightIcon={<ArrowRight size={18} />}>
                Continue
              </Button>
              <Button fullWidth variant="gold-cta" size="lg">
                Full Width Gold CTA
              </Button>
            </div>
          </div>
        </Section>

        {/* ── Cards ────────────────────────────────────────────── */}
        <Section title="Card">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="stat" hoverable>
              <p className="text-label-sm uppercase text-text-muted">Stat Card</p>
              <p className="mt-2 text-number-lg text-text-primary">$8.63</p>
              <p className="mt-1 text-body-sm text-text-secondary">Total received</p>
            </Card>
            <Card variant="position" hoverable>
              <p className="text-heading-4 text-text-primary">Position Card</p>
              <p className="mt-1 text-body-sm text-text-muted">12 months remaining</p>
            </Card>
            <Card variant="action">
              <div className="p-5">
                <p className="text-heading-4 text-text-primary">Action Card</p>
                <p className="mt-1 text-body-sm text-text-secondary">Gold gradient overlay</p>
              </div>
            </Card>
            <Card variant="premium">
              <p className="text-heading-4">Premium Card</p>
              <p className="mt-1 text-body-sm opacity-80">Dark bg, white text</p>
            </Card>
            <Card variant="glass">
              <div className="p-5">
                <p className="text-heading-4 text-text-primary">Glass Card</p>
                <p className="mt-1 text-body-sm text-text-secondary">Best viewed in dark mode</p>
              </div>
            </Card>
          </div>
        </Section>

        {/* ── Badge ────────────────────────────────────────────── */}
        <Section title="Badge">
          <div className="flex flex-wrap gap-3">
            <Badge status="active" />
            <Badge status="pending" />
            <Badge status="completed" />
            <Badge status="claimed" />
            <Badge status="locked" />
            <Badge status="active" label="Custom Label" />
          </div>
        </Section>

        {/* ── Input ────────────────────────────────────────────── */}
        <Section title="Input">
          <div className="max-w-[400px] space-y-4">
            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
              icon={<Mail size={18} />}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="We'll never share your email."
            />
            <Input
              label="With Error"
              placeholder="Enter something..."
              error="This field is required"
            />
            <Input label="Disabled" placeholder="Can't type here" disabled />
            <Input label="Search" placeholder="Search..." icon={<Search size={18} />} />
          </div>
        </Section>

        {/* ── Tooltip ──────────────────────────────────────────── */}
        <Section title="Tooltip">
          <div className="flex flex-wrap gap-4">
            <Tooltip content="Top tooltip" side="top">
              <Button variant="secondary" size="sm">
                Hover (top)
              </Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip with longer text for wrapping" side="bottom">
              <Button variant="secondary" size="sm">
                Hover (bottom)
              </Button>
            </Tooltip>
            <Tooltip content="Left side" side="left">
              <Button variant="secondary" size="sm">
                Hover (left)
              </Button>
            </Tooltip>
            <Tooltip content="Right side" side="right">
              <Button variant="secondary" size="sm">
                Hover (right)
              </Button>
            </Tooltip>
          </div>
        </Section>

        {/* ── Modal ────────────────────────────────────────────── */}
        <Section title="Modal">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Action">
            <p className="text-body-lg text-text-secondary">
              Are you sure you want to proceed? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Modal>
        </Section>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <Section title="Tabs">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-body-sm text-text-muted">Pill variant</p>
              <Tabs
                variant="pill"
                items={[
                  { id: 'pill1', label: '7D' },
                  { id: 'pill2', label: '1M' },
                  { id: 'pill3', label: '3M' },
                  { id: 'pill4', label: 'ALL' },
                ]}
                activeId={tabVariant}
                onChange={setTabVariant}
                size="sm"
              />
            </div>
            <div>
              <p className="mb-3 text-body-sm text-text-muted">Underline variant</p>
              <Tabs
                variant="underline"
                items={[
                  { id: 'tab1', label: 'Active', count: 3 },
                  { id: 'tab2', label: 'Completed', count: 1 },
                ]}
                activeId={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </div>
        </Section>

        {/* ── Toggle ───────────────────────────────────────────── */}
        <Section title="Toggle (Switch)">
          <div className="space-y-4">
            <Toggle
              checked={toggleChecked}
              onChange={setToggleChecked}
              label="Enable notifications"
            />
            <Toggle checked={true} onChange={() => {}} label="Always on" />
            <Toggle checked={false} onChange={() => {}} label="Disabled" disabled />
          </div>
        </Section>

        {/* ── Checkbox ─────────────────────────────────────────── */}
        <Section title="Checkbox">
          <div className="space-y-4">
            <Checkbox
              checked={checkboxChecked}
              onChange={setCheckboxChecked}
              label="Auto-start accruing"
              description="Your distributions begin accruing immediately after purchase."
            />
            <Checkbox checked={true} onChange={() => {}} label="Terms accepted" />
            <Checkbox checked={false} onChange={() => {}} label="Disabled option" disabled />
          </div>
        </Section>

        {/* ── Select ───────────────────────────────────────────── */}
        <Section title="Select">
          <div className="max-w-[300px] space-y-4">
            <Select
              label="Currency"
              placeholder="Choose currency..."
              options={[
                { value: 'usd', label: 'USD — US Dollar' },
                { value: 'eur', label: 'EUR — Euro' },
                { value: 'gbp', label: 'GBP — British Pound' },
                { value: 'chf', label: 'CHF — Swiss Franc' },
              ]}
              value={selectValue}
              onChange={setSelectValue}
            />
            <Select
              label="Disabled"
              placeholder="Can't select"
              options={[{ value: 'x', label: 'Option' }]}
              onChange={() => {}}
              disabled
            />
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-16 border-t border-border-light pb-8 pt-6 text-center">
          <p className="text-body-sm text-text-muted">
            AYNI Gold Design System — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
