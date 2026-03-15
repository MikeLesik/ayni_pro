import { useState } from 'react';
import { useTranslation } from '@/i18n';
import { Tabs } from '@/components/ui/Tabs';
import {
  TrustHero,
  MiningStatusBanner,
  MineralesSection,
  TrustProofOfMining,
  ScopingStudySection,
  AuditsSection,
  LegalEntitiesSection,
  RiskDisclosureSection,
  StabilityFundSection,
  TrustFaq,
  ProofOfReserves,
} from '@/components/trust';

type TrustTab = 'operations' | 'documents' | 'legal' | 'risks' | 'reserves';

export default function TrustPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TrustTab>('operations');

  const tabItems = [
    { id: 'operations', label: t('trust.tab.operations') },
    { id: 'documents', label: t('trust.tab.documents') },
    { id: 'legal', label: t('trust.tab.legal') },
    { id: 'risks', label: t('trust.tab.risks') },
    { id: 'reserves', label: t('trust.tab.reserves') },
  ];

  return (
    <div className="pt-8 space-y-6 max-w-[960px] mx-auto">
      {/* Hero — always visible: title + 3 key stats */}
      <TrustHero />

      {/* Tab Navigation */}
      <Tabs
        items={tabItems}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TrustTab)}
        variant="underline"
      />

      {/* Tab 1: Операции */}
      {activeTab === 'operations' && (
        <div className="space-y-10">
          <MiningStatusBanner />
          <MineralesSection />
          <TrustProofOfMining />
        </div>
      )}

      {/* Tab 2: Документы */}
      {activeTab === 'documents' && (
        <div className="space-y-10">
          <ScopingStudySection />
          <AuditsSection />
        </div>
      )}

      {/* Tab 3: Юридика */}
      {activeTab === 'legal' && (
        <div className="space-y-10">
          <LegalEntitiesSection />
        </div>
      )}

      {/* Tab 4: Риски */}
      {activeTab === 'risks' && (
        <div className="space-y-10">
          <RiskDisclosureSection />
          <StabilityFundSection />
          <TrustFaq />
        </div>
      )}

      {/* Tab 5: Reserves */}
      {activeTab === 'reserves' && (
        <div className="space-y-10">
          <ProofOfReserves />
        </div>
      )}
    </div>
  );
}
