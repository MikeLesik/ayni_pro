import {
  ShoppingBag,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { CardTransaction } from '@/stores/cardStore';
import { useTranslation } from '@/i18n';

interface CardTransactionListProps {
  transactions: CardTransaction[];
}

export function CardTransactionList({ transactions }: CardTransactionListProps) {
  const { t } = useTranslation();

  if (transactions.length === 0) {
    return (
      <Card variant="stat" className="text-center py-8">
        <p className="text-text-muted text-sm">{t('card.transactions.empty')}</p>
      </Card>
    );
  }

  // Group by date
  const grouped = groupByDate(transactions);

  return (
    <div className="space-y-4">
      {grouped.map(({ label, items }) => (
        <div key={label}>
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider px-1">
            {label}
          </span>
          <Card variant="stat" className="!p-0 mt-1.5 overflow-hidden">
            {items.map((tx, idx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                isLast={idx === items.length - 1}
              />
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

function TransactionRow({
  tx,
  isLast,
}: {
  tx: CardTransaction;
  isLast: boolean;
}) {
  const isPositive = tx.amount > 0;
  const icon = getTransactionIcon(tx.type);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${!isLast ? 'border-b border-border-light' : ''}`}
    >
      {/* Icon */}
      <div
        className={`
          w-9 h-9 rounded-full flex items-center justify-center shrink-0
          ${isPositive ? 'bg-success-light text-success' : 'bg-surface-secondary text-text-muted'}
        `}
      >
        {icon}
      </div>

      {/* Merchant + date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {tx.merchant}
        </p>
        <p className="text-xs text-text-muted">
          {formatShortDate(tx.date)}
        </p>
      </div>

      {/* Amount */}
      <span
        className={`text-sm font-semibold tabular-nums ${
          isPositive ? 'text-success' : 'text-text-primary'
        }`}
      >
        {isPositive ? '+' : ''}
        {tx.currency} {Math.abs(tx.amount).toFixed(2)}
      </span>
    </div>
  );
}

function getTransactionIcon(type: CardTransaction['type']) {
  switch (type) {
    case 'topup':
      return <ArrowDownLeft size={16} />;
    case 'refund':
      return <RotateCcw size={16} />;
    case 'purchase':
    default:
      return <ShoppingBag size={16} />;
  }
}

function groupByDate(txs: CardTransaction[]) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const groups: Map<string, CardTransaction[]> = new Map();

  for (const tx of txs) {
    let label: string;
    if (tx.date === today) label = 'Today';
    else if (tx.date === yesterday) label = 'Yesterday';
    else label = 'Earlier';

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(tx);
  }

  const order = ['Today', 'Yesterday', 'Earlier'];
  return order
    .filter((l) => groups.has(l))
    .map((label) => ({ label, items: groups.get(label)! }));
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
