import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from '@/components/ui/Tabs';
import { useTranslation } from '@/i18n';
import { useAnalytics } from '@/hooks/useAnalytics';
import EarnPage from './EarnPage';
import MarketplacePage from './MarketplacePage';

export default function ParticipatePage() {
  const { t } = useTranslation();
  const { track } = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    track('page_view', { page: 'participate' });
  }, [track]);

  const activeTab = location.pathname.startsWith('/participate/marketplace')
    ? 'marketplace'
    : 'participate';

  const pageTabs = [
    { id: 'participate', label: t('participate.tab.participate') },
    { id: 'marketplace', label: t('participate.tab.marketplace') },
  ];

  const handleTabChange = (id: string) => {
    navigate(id === 'marketplace' ? '/participate/marketplace' : '/participate');
  };

  return (
    <>
      <Tabs
        items={pageTabs}
        activeId={activeTab}
        onChange={handleTabChange}
        variant="underline"
        size="md"
      />
      {activeTab === 'participate' && <EarnPage />}
      {activeTab === 'marketplace' && <MarketplacePage />}
    </>
  );
}
