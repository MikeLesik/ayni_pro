import { ShieldCheck, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { trustData } from '@/services/mock/data/trust';
import { useTranslation } from '@/i18n';
import { getLocale } from '@/lib/formatters';

export function ReservesAuditTimeline() {
  const { t } = useTranslation();
  const audits = trustData.audits;
  const nextAudit = trustData.reservesSnapshot.nextAuditDate;
  const locale = getLocale();

  return (
    <Card variant="stat" className="p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">{t('trust.reserves.auditTimeline')}</h3>

      <div className="space-y-3">
        {audits.map((audit) => (
          <div
            key={audit.name}
            className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/10"
          >
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{audit.name}</p>
              <p className="text-xs text-text-secondary">{t('trust.reserves.smartContractAudit')}</p>
            </div>
            <Badge status="completed" label={t('trust.reserves.passed')} />
          </div>
        ))}

        {/* Next audit */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-secondary border border-border-light">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Clock size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary">{t('trust.reserves.nextReserveAudit')}</p>
            <p className="text-xs text-text-secondary">
              {t('trust.reserves.scheduledDate', {
                date: new Date(nextAudit).toLocaleDateString(locale, { year: 'numeric', month: 'long' }),
              })}
            </p>
          </div>
          <Badge status="pending" label={t('trust.reserves.scheduled')} />
        </div>
      </div>
    </Card>
  );
}
