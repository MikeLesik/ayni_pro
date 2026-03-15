import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslation } from '@/i18n';
import { useReferralStore, REFERRAL_BONUS_AYNI } from '@/stores/referralStore';
import { formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { UserPlus } from 'lucide-react';

export function ReferralHistory() {
  const { t } = useTranslation();
  const events = useReferralStore((s) => s.referralEvents);
  const simulateReferral = useReferralStore((s) => s.simulateReferral);

  const demoEmails = [
    'alice@example.com',
    'carlos@example.com',
    'yuki@example.com',
    'fatima@example.com',
    'liam@example.com',
  ];

  const handleSimulate = () => {
    const email = demoEmails[events.length % demoEmails.length]!;
    simulateReferral(email);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">{t('referral.history.title')}</h3>
        <Button variant="text" size="sm" onClick={handleSimulate}>
          <UserPlus size={14} className="mr-1" />
          {t('referral.simulate')}
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title={t('referral.history.empty')}
          description={t('referral.history.emptyHint', { bonus: String(REFERRAL_BONUS_AYNI) })}
        />
      ) : (
        <Card variant="stat" className="!p-0 divide-y divide-border-light overflow-hidden rounded-lg">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                  {event.refereeEmail[0]!.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-text-primary truncate">{event.refereeEmail}</p>
                  <p className="text-xs text-text-muted">{formatDate(event.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  status={event.status === 'completed' ? 'completed' : 'pending'}
                  label={event.status === 'completed'
                    ? t('referral.history.completed')
                    : t('referral.history.pending')}
                />
                {event.status === 'completed' && (
                  <span className="text-xs font-medium text-success">
                    {t('referral.bonus', { amount: String(event.bonusAyni) })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
