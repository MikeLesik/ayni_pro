import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCardStore, useCardTier } from '@/stores/cardStore';
import { getCardPrivileges } from '@/lib/cardConfig';
import { CardDashboard } from '@/components/cards/CardDashboard';
import { CardPromoSection } from '@/components/cards/CardPromoSection';
import { KycFlow } from '@/components/cards/KycFlow';
import { KycReviewScreen } from '@/components/cards/KycReviewScreen';
import { CardIssuingAnimation } from '@/components/cards/CardIssuingAnimation';
import { CardBlockedScreen } from '@/components/cards/CardBlockedScreen';
import { CardDemoPanel } from '@/components/cards/CardDemoPanel';

export default function CardSettingsPage() {
  const navigate = useNavigate();
  const lifecycle = useCardStore((s) => s.lifecycle);
  const tier = useCardTier();
  const privileges = getCardPrivileges(tier);

  function renderContent() {
    // If tier doesn't allow card and lifecycle is not_eligible
    if (!privileges.canApplyForCard && lifecycle === 'not_eligible') {
      return <CardPromoSection />;
    }

    switch (lifecycle) {
      case 'not_eligible':
        return <CardPromoSection />;
      case 'eligible':
      case 'kyc_step_1':
      case 'kyc_step_2':
      case 'kyc_step_3':
      case 'kyc_step_4':
        return <KycFlow />;
      case 'kyc_submitted':
      case 'kyc_in_review':
        return <KycReviewScreen />;
      case 'kyc_approved':
      case 'card_issuing':
        return <CardIssuingAnimation />;
      case 'active':
      case 'frozen':
        return <CardDashboard />;
      case 'blocked':
        return <CardBlockedScreen />;
      default:
        return <CardPromoSection />;
    }
  }

  return (
    <div className="pt-4 pb-24 md:pt-6 max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/settings')}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Settings
      </button>

      <h1 className="font-display text-heading-1 text-text-primary mb-6">
        AYNI Gold Card
      </h1>

      {renderContent()}

      {/* Demo panel for testing */}
      <CardDemoPanel />
    </div>
  );
}
