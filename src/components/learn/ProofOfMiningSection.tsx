import { Activity, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/i18n';

const MOCK_REPORT = {
  weekDate: 'Feb 24, 2026',
  goldExtractedG: 42.5,
  operationalHours: 156,
  equipmentUtilization: 94,
};

export function ProofOfMiningSection() {
  const { t } = useTranslation();

  return (
    <section id="proof-of-mining">
      <h2 className="text-lg font-semibold text-text-primary mb-3">
        {t('learn.proofOfMining.sectionTitle')}
      </h2>

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
            'bg-success-light text-success border border-success/20',
          )}
        >
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          {t('learn.proofOfMining.statusActive')}
        </span>
        <span className="text-xs text-text-muted">{t('learn.proofOfMining.location')}</span>
      </div>

      {/* Latest report card */}
      <Card variant="stat" className="p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">
            {t('learn.proofOfMining.latestReport')}
          </h3>
        </div>
        <p className="text-xs text-text-muted mb-3">
          {t('learn.proofOfMining.weekOf', { date: MOCK_REPORT.weekDate })}
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-text-muted">{t('learn.proofOfMining.goldExtracted')}</p>
            <p className="text-sm font-semibold text-text-primary">{MOCK_REPORT.goldExtractedG}g</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">{t('learn.proofOfMining.operationalHours')}</p>
            <p className="text-sm font-semibold text-text-primary">
              {MOCK_REPORT.operationalHours}h
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">
              {t('learn.proofOfMining.equipmentUtilization')}
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {MOCK_REPORT.equipmentUtilization}%
            </p>
          </div>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-3 hover:underline"
        >
          {t('learn.proofOfMining.viewFullReport')}
          <ExternalLink size={12} />
        </a>
      </Card>
    </section>
  );
}
