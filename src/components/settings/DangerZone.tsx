import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { useTranslation } from '@/i18n';
import { logout as authLogout } from '@/services/authService';

export function DangerZone() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleSignOut() {
    authLogout();
    navigate('/auth');
  }

  function handleDeleteConfirm() {
    setShowDeleteModal(false);
    // Clear all app data before logout
    localStorage.removeItem('ayni-mine-game');
    localStorage.removeItem('ayni-mine-notifications');
    localStorage.removeItem('ayni-notifications');
    localStorage.removeItem('ayni-ui');
    localStorage.removeItem('ayni-simulation');
    localStorage.removeItem('ayni-onboarding');
    localStorage.removeItem('ayni-auth');
    localStorage.removeItem('ayni-earn');
    authLogout();
    navigate('/auth');
  }

  return (
    <>
      <Card variant="stat" className="!p-0 rounded-lg overflow-hidden !border-error/30 mt-8">
        <SettingsRow
          label={t('settings.dangerZone.signOut')}
          control="navigate"
          onClick={handleSignOut}
          destructive
        />
        <SettingsRow
          label={t('settings.dangerZone.deleteAccount')}
          control="navigate"
          onClick={() => setShowDeleteModal(true)}
          destructive
          isLast
        />
      </Card>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('settings.dangerZone.deleteModalTitle')}
      >
        <p className="text-body-md text-text-secondary">
          {t('settings.dangerZone.deleteModalMessage')}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDeleteConfirm}>
            {t('common.delete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
