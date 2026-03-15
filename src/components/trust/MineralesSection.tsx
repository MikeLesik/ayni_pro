import { Camera, Truck, Container, Settings2, Filter, Home, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/i18n';
import type { TranslationKey } from '@/i18n';

import { trustData } from '@/services/mock/data/trust';

const EQUIPMENT_ICONS = [Truck, Container, Truck, Settings2, Filter, Home];

const equipNameKeys: Record<string, TranslationKey> = {
  Excavators: 'trust.data.excavators',
  Loaders: 'trust.data.loaders',
  'Dump trucks': 'trust.data.dumpTrucks',
  'Scrubber-trommel units': 'trust.data.scrubberTrommels',
  'Gold separation equipment': 'trust.data.goldSeparation',
  'Residential facilities': 'trust.data.residentialFacilities',
};

const equipDescKeys: Record<string, TranslationKey> = {
  'Gravity-based, full set': 'trust.data.goldSeparationDesc',
  'On-site for operational teams': 'trust.data.residentialFacilitiesDesc',
};

export function MineralesSection() {
  const { t } = useTranslation();
  const { entities, equipment } = trustData;
  const company = entities.mineralesSH;

  return (
    <section id="mining-partner" className="scroll-mt-24">
      <h2 className="font-display text-xl md:text-2xl text-text-primary mb-4">
        {t('trust.miningPartner.title')}
      </h2>

      {/* Two column: photo + info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Photo placeholder */}
        <div className="bg-surface-secondary rounded-xl aspect-[4/3] flex items-center justify-center">
          <Camera size={48} className="text-text-muted/30" />
        </div>

        {/* Info block */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t('trust.miningPartner.companyName')}
          </h3>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            {t('trust.miningPartner.description')}
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-text-muted w-24 shrink-0">
                {t('trust.miningPartner.location')}:
              </span>
              <span className="text-text-primary">{company.location}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted w-24 shrink-0">
                {t('trust.miningPartner.area')}:
              </span>
              <span className="text-text-primary">{t('trust.miningPartner.areaValue')}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-text-muted w-24 shrink-0">
                {t('trust.miningPartner.coordinates')}:
              </span>
              <span className="text-text-primary font-mono text-xs">{company.coordinates}</span>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 hover:underline"
          >
            {t('trust.miningPartner.seeRegistration')}
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Equipment grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {equipment.map((item, i) => {
          const Icon = EQUIPMENT_ICONS[i] ?? Settings2;
          return (
            <Card key={i} variant="stat" className="p-4 text-center">
              <Icon size={24} className="text-primary mx-auto mb-2" />
              <p className="text-lg font-semibold text-text-primary">{item.count}</p>
              <p className="text-xs text-text-secondary mt-0.5">
                {equipNameKeys[item.name] ? t(equipNameKeys[item.name]!) : item.name}
              </p>
              {item.description && (
                <p className="text-xs text-text-muted mt-0.5">
                  {equipDescKeys[item.description]
                    ? t(equipDescKeys[item.description]!)
                    : item.description}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
