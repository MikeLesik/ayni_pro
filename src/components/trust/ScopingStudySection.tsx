import { FileText, ExternalLink } from 'lucide-react';

import { useTranslation } from '@/i18n';
import { trustData } from '@/services/mock/data/trust';

export function ScopingStudySection() {
  const { t } = useTranslation();
  const { scopingStudy } = trustData;

  const facts = [
    { label: t('trust.scopingStudy.area'), value: scopingStudy.area },
    { label: t('trust.scopingStudy.depth'), value: scopingStudy.depth },
    { label: t('trust.scopingStudy.grade'), value: scopingStudy.averageGrade },
    { label: t('trust.scopingStudy.potential'), value: scopingStudy.potentialGold },
    { label: t('trust.scopingStudy.recovery'), value: scopingStudy.recoveryRate },
  ];

  return (
    <section id="scoping-study" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.scopingStudy.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cover placeholder */}
        <div className="bg-surface-secondary rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-3">
          <FileText size={48} className="text-text-muted/30" />
          <div className="text-center">
            <p className="text-sm font-semibold text-text-secondary">{scopingStudy.title}</p>
            <p className="text-xs text-text-muted mt-0.5">{scopingStudy.author}</p>
            <p className="text-xs text-text-muted">{scopingStudy.date}</p>
          </div>
        </div>

        {/* Key facts */}
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {t('trust.scopingStudy.phase1')}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {t('trust.scopingStudy.author')} &middot; {t('trust.scopingStudy.date')}
          </p>

          <div className="mt-4 space-y-2">
            {facts.map((f) => (
              <div key={f.label} className="flex gap-2 text-sm">
                <span className="text-text-muted">&bull;</span>
                <span className="text-text-muted">{f.label}:</span>
                <span className="text-text-primary font-medium">{f.value}</span>
              </div>
            ))}
          </div>

          {/* Verifiers */}
          <div className="mt-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
              {t('trust.scopingStudy.verifiedBy')}
            </p>
            {scopingStudy.verifiers.map((v) => (
              <div key={v.name} className="mb-2">
                <p className="text-sm font-medium text-text-primary">{v.name}</p>
                <p className="text-xs text-text-secondary">{v.company}</p>
                <p className="text-xs text-text-muted">{v.qualification}</p>
              </div>
            ))}
          </div>

          <a
            href={scopingStudy.reportUrl}
            className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-3 hover:underline"
          >
            {t('trust.scopingStudy.readReport')}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-muted italic mt-4 leading-relaxed max-w-prose">
        {t('trust.scopingStudy.disclaimer')}
      </p>
    </section>
  );
}
