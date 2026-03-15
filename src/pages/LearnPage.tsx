import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Tabs } from '@/components/ui/Tabs';
import { LearnSearch } from '@/components/learn/LearnSearch';
import { LearnProgressSection } from '@/components/learn/LearnProgressSection';
import { LearnRewardToast } from '@/components/learn/LearnRewardToast';
import { TutorialCards } from '@/components/learn/TutorialCards';
import { ContributorTiersSection } from '@/components/learn/ContributorTiersSection';
import { FaqSection } from '@/components/learn/FaqSection';
import { ValueFlowSection } from '@/components/learn/ValueFlowSection';
import { ContactSection } from '@/components/learn/ContactSection';
import {
  TrustHero,
  MiningStatusBanner,
  MineralesSection,
  ScopingStudySection,
  TrustProofOfMining,
  AuditsSection,
  LegalEntitiesSection,
  StabilityFundSection,
  RiskDisclosureSection,
  TrustFaq,
  ProofOfReserves,
} from '@/components/trust';
import { TokenomicsContent } from '@/components/tokenomics/TokenomicsContent';
import { useTranslation } from '@/i18n';

/* ── Learn tab content ── */
function LearnContent() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-4">
      <LearnProgressSection />
      <LearnSearch value={searchQuery} onChange={setSearchQuery} />

      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          {t('learn.gettingStarted')}
        </h2>
        <TutorialCards searchQuery={searchQuery} />
      </section>

      <ContributorTiersSection />

      <FaqSection />

      <div className="max-w-[800px] mx-auto space-y-4">
        <ValueFlowSection />
        <ContactSection />
      </div>
    </div>
  );
}

/* ── Trust tab content (same category tabs as /trust page) ── */
type TrustTab = 'operations' | 'documents' | 'legal' | 'risks' | 'reserves';

function TrustContent() {
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
    <div className="space-y-6 max-w-[960px] mx-auto">
      <TrustHero />

      <Tabs
        items={tabItems}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TrustTab)}
        variant="underline"
      />

      {activeTab === 'operations' && (
        <div className="space-y-10">
          <MiningStatusBanner />
          <MineralesSection />
          <TrustProofOfMining />
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-10">
          <ScopingStudySection />
          <AuditsSection />
        </div>
      )}

      {activeTab === 'legal' && (
        <div className="space-y-10">
          <LegalEntitiesSection />
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="space-y-10">
          <RiskDisclosureSection />
          <StabilityFundSection />
          <TrustFaq />
        </div>
      )}

      {activeTab === 'reserves' && (
        <div className="space-y-10">
          <ProofOfReserves />
        </div>
      )}
    </div>
  );
}

/* ── Resources page (Learn + Trust) ── */
export default function LearnPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hash } = useLocation();

  const activeTab = searchParams.get('tab') || 'learn';

  const pageTabs = [
    { id: 'learn', label: t('resources.tab.learn') },
    { id: 'trust', label: t('resources.tab.trust') },
    { id: 'tokenomics', label: t('resources.tab.tokenomics') },
  ];

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash, activeTab]);

  return (
    <div className="pt-5 space-y-3">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="font-display text-2xl text-text-primary">{t('nav.resources')}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('learn.page.subtitle')}</p>
      </div>

      {/* Page-level tabs: Learn | Trust & Transparency */}
      <Tabs
        items={pageTabs}
        activeId={activeTab}
        onChange={(id) => setSearchParams({ tab: id })}
        variant="underline"
        size="md"
      />

      {activeTab === 'learn' && <LearnContent />}
      {activeTab === 'trust' && <TrustContent />}
      {activeTab === 'tokenomics' && <TokenomicsContent />}

      <LearnRewardToast />
    </div>
  );
}
