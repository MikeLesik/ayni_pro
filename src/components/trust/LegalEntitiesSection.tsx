import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import { trustData } from '@/services/mock/data/trust';

export function LegalEntitiesSection() {
  const { t } = useTranslation();
  const { ayniTokenInc, mineralesSH } = trustData.entities;

  return (
    <section id="legal" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.legal.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* AYNI TOKEN INC */}
        <Card variant="stat" className="p-5 border-l-[3px] border-l-primary">
          <h3 className="text-base font-semibold text-text-primary">{ayniTokenInc.name}</h3>
          <p className="text-xs text-text-muted mt-1">{t('trust.legal.ayniType')}</p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-text-muted shrink-0">{t('trust.legal.ayniJurisdiction')}:</span>
              <span className="text-text-primary">{ayniTokenInc.jurisdiction}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted shrink-0">
                {t('trust.legal.ayniCompanyNumber')}:
              </span>
              <span className="text-text-primary">{ayniTokenInc.companyNumber}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted shrink-0">{t('trust.legal.ayniAddress')}:</span>
              <span className="text-text-primary text-xs">{ayniTokenInc.address}</span>
            </div>
          </div>

          <a
            href="/terms"
            className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline"
          >
            {t('trust.legal.viewTerms')}
            <ExternalLink size={14} />
          </a>
        </Card>

        {/* Minerales San Hilario */}
        <Card variant="stat" className="p-5 border-l-[3px] border-l-primary">
          <h3 className="text-base font-semibold text-text-primary">{mineralesSH.name}</h3>
          <p className="text-xs text-text-muted mt-1">{t('trust.legal.mineralesType')}</p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-text-muted shrink-0">{t('trust.legal.ruc')}:</span>
              <span className="text-text-primary">{mineralesSH.ruc}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted shrink-0">{t('trust.legal.registered')}:</span>
              <span className="text-text-primary">{mineralesSH.registered}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted shrink-0">{t('trust.legal.concession')}:</span>
              <span className="text-text-primary">{mineralesSH.concession}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted shrink-0">{t('trust.legal.authority')}:</span>
              <span className="text-text-primary">{mineralesSH.authority}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted shrink-0">{t('trust.miningPartner.location')}:</span>
              <span className="text-text-primary">{mineralesSH.location}</span>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline"
          >
            {t('trust.legal.seeRegistration')}
            <ExternalLink size={14} />
          </a>
        </Card>
      </div>
    </section>
  );
}
