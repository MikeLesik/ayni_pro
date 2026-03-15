import { ProfileSection } from '@/components/settings/ProfileSection';
import { SettingsList } from '@/components/settings/SettingsList';
import { DangerZone } from '@/components/settings/DangerZone';
import { useTranslation } from '@/i18n';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="pt-8 pb-12 space-y-1 max-w-[720px] mx-auto">
      <h1 className="font-display text-2xl text-text-primary mb-6 text-center sm:text-left">
        {t('settings.page.title')}
      </h1>
      <ProfileSection />
      <SettingsList />
      <DangerZone />
    </div>
  );
}
