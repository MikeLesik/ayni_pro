import { useState, useMemo } from 'react';
import {
  ShoppingBag,
  ArrowUpCircle,
  Banknote,
  Gift,
  Percent,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n';
import type { CardTransaction } from '@/stores/cardStore';

type TxFilter = 'all' | 'purchase' | 'topup' | 'cashback';

interface TransactionListProps {
  transactions: CardTransaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<TxFilter>('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'purchase') return transactions.filter((t) => t.type === 'purchase' || t.type === 'atm');
    if (filter === 'topup') return transactions.filter((t) => t.type === 'topup');
    if (filter === 'cashback') return transactions.filter((t) => t.type === 'cashback');
    return transactions;
  }, [transactions, filter]);

  const visible = showAll ? filtered : filtered.slice(0, 8);
  const grouped = groupByDate(visible);

  const filters: { key: TxFilter; label: string }[] = [
    { key: 'all', label: t('card.tx.all') },
    { key: 'purchase', label: t('card.tx.purchases') },
    { key: 'topup', label: t('card.tx.topups') },
    { key: 'cashback', label: t('card.tx.cashback') },
  ];

  return (
    <div>
      <h3 className="font-display text-lg text-text-primary mb-3">
        {t('card.dashboard.recentActivity')}
      </h3>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setShowAll(false); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-primary text-white'
                : 'bg-surface-secondary text-text-muted hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card variant="stat" className="text-center py-8">
          <p className="text-text-muted text-sm">{t('card.tx.empty')}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ label, items }) => (
            <div key={label}>
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider px-1">
                {t(dateGroupKeys[label] ?? 'card.tx.earlier')}
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
      )}

      {filtered.length > 8 && !showAll && (
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" onClick={() => setShowAll(true)}>
            {t('card.tx.showAll')}
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Transaction Row ────────────────────────────────────────────────────

function TransactionRow({ tx, isLast }: { tx: CardTransaction; isLast: boolean }) {
  const { t } = useTranslation();
  const isTopUp = tx.type === 'topup';
  const isCashback = tx.type === 'cashback';
  const isDeclined = tx.status === 'declined';
  const isPositive = isTopUp || isCashback;

  const { icon, iconBg, iconColor } = getTransactionVisuals(tx);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 hover:bg-surface-secondary/50 transition-colors ${
        !isLast ? 'border-b border-border-light' : ''
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {tx.merchant}
        </p>
        <p className="text-xs text-text-muted">
          {tx.category}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <span
          className={`text-sm font-semibold tabular-nums ${
            isDeclined
              ? 'text-error line-through'
              : isPositive
                ? 'text-success'
                : 'text-text-primary'
          }`}
        >
          {isPositive ? '+' : '−'}€{Math.abs(tx.amount).toFixed(2)}
        </span>
        {isDeclined ? (
          <p className="text-[10px] text-error" title={tx.declineReason}>
            {t('card.tx.declined')}
          </p>
        ) : (
          <p className="text-[10px] text-text-muted">
            {tx.status === 'pending' ? t('card.tx.pending') : t('card.tx.completed')}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────

function getTransactionVisuals(tx: CardTransaction) {
  if (tx.status === 'declined') {
    return {
      icon: <XCircle size={18} />,
      iconBg: 'bg-error/10',
      iconColor: 'text-error',
    };
  }

  switch (tx.type) {
    case 'topup':
      return {
        icon: <ArrowUpCircle size={18} />,
        iconBg: 'bg-success-light',
        iconColor: 'text-success',
      };
    case 'atm':
      return {
        icon: <Banknote size={18} />,
        iconBg: 'bg-primary-light',
        iconColor: 'text-primary',
      };
    case 'cashback':
      return {
        icon: <Gift size={18} />,
        iconBg: 'bg-gold-light',
        iconColor: 'text-gold-dark',
      };
    case 'fee':
      return {
        icon: <Percent size={18} />,
        iconBg: 'bg-surface-secondary',
        iconColor: 'text-text-muted',
      };
    case 'purchase':
    default:
      return {
        icon: <ShoppingBag size={18} />,
        iconBg: 'bg-surface-secondary',
        iconColor: 'text-text-muted',
      };
  }
}

function groupByDate(txs: CardTransaction[]) {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];

  const groups = new Map<string, CardTransaction[]>();

  for (const tx of txs) {
    const dateStr = tx.date.split('T')[0];
    let label: string;
    if (dateStr === today) label = 'today';
    else if (dateStr === yesterday) label = 'yesterday';
    else if (dateStr! >= weekAgo!) label = 'thisWeek';
    else label = 'earlier';

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(tx);
  }

  const order = ['today', 'yesterday', 'thisWeek', 'earlier'];
  return order
    .filter((l) => groups.has(l))
    .map((label) => ({ label, items: groups.get(label)! }));
}

const dateGroupKeys: Record<string, 'card.tx.today' | 'card.tx.yesterday' | 'card.tx.thisWeek' | 'card.tx.earlier'> = {
  today: 'card.tx.today',
  yesterday: 'card.tx.yesterday',
  thisWeek: 'card.tx.thisWeek',
  earlier: 'card.tx.earlier',
};
