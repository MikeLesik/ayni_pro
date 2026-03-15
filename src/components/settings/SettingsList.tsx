import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { useUiStore } from '@/stores/uiStore';
import { useSimulationStore } from '@/stores/simulation';
import { useCardStore } from '@/stores/cardStore';
import { useTranslation } from '@/i18n';
import {
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
} from '@/services/browserNotificationService';
import type { ThemeMode } from '@/types/theme';
import type { DisplayCurrency, Language } from '@/stores/uiStore';

const languageNativeLabels: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'ru', label: 'Русский' },
];

export function SettingsList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const advancedView = useUiStore((s) => s.advancedView);
  const toggleAdvancedView = useUiStore((s) => s.toggleAdvancedView);
  const displayCurrency = useUiStore((s) => s.displayCurrency);
  const setDisplayCurrency = useUiStore((s) => s.setDisplayCurrency);
  const language = useUiStore((s) => s.language);
  const setLanguage = useUiStore((s) => s.setLanguage);
  const browserNotificationsEnabled = useUiStore((s) => s.browserNotificationsEnabled);
  const setBrowserNotificationsEnabled = useUiStore((s) => s.setBrowserNotificationsEnabled);
  const notifyDailyEarnings = useUiStore((s) => s.notifyDailyEarnings);
  const setNotifyDailyEarnings = useUiStore((s) => s.setNotifyDailyEarnings);
  const notifyStreaks = useUiStore((s) => s.notifyStreaks);
  const setNotifyStreaks = useUiStore((s) => s.setNotifyStreaks);
  const notifyPriceAlerts = useUiStore((s) => s.notifyPriceAlerts);
  const setNotifyPriceAlerts = useUiStore((s) => s.setNotifyPriceAlerts);
  const autoReinvestEnabled = useSimulationStore((s) => s.autoReinvestEnabled);
  const setAutoReinvest = useSimulationStore((s) => s.setAutoReinvest);
  const autoReinvestTermMonths = useSimulationStore((s) => s.autoReinvestTermMonths);
  const setAutoReinvestTerm = useSimulationStore((s) => s.setAutoReinvestTerm);

  const cardDemoMode = useCardStore((s) => s.demoMode);
  const cardLifecycle = useCardStore((s) => s.lifecycle);
  const cardBalance = useCardStore((s) => s.cardBalance);

  const supported = isNotificationSupported();
  const permissionStatus = getNotificationPermission();

  const handleNotificationToggle = useCallback(async () => {
    if (!browserNotificationsEnabled) {
      const result = await requestNotificationPermission();
      if (result === 'granted') {
        setBrowserNotificationsEnabled(true);
      }
    } else {
      setBrowserNotificationsEnabled(false);
    }
  }, [browserNotificationsEnabled, setBrowserNotificationsEnabled]);

  const themeOptions = [
    { value: 'light', label: t('settings.theme.light') },
    { value: 'dark', label: t('settings.theme.dark') },
    { value: 'system', label: t('settings.theme.system') },
  ];

  const displayCurrencyOptions = [
    { value: 'usd', label: t('settings.display.usd') },
    { value: 'ayni', label: t('settings.display.ayniPaxg') },
    { value: 'both', label: t('settings.display.both') },
  ];

  return (
    <>
      {/* ── Section: Account ── */}
      <SectionHeader label={t('settings.group.account')} />
      <Card variant="stat" className="!p-0 rounded-lg overflow-hidden">
        <SettingsRow
          label={t('settings.section.security')}
          control="navigate"
          onClick={() => navigate('/settings/security')}
        />
        <SettingsRow
          label={t('settings.section.connectedWallets')}
          control="navigate"
          onClick={() => navigate('/settings/wallets')}
        />
        <SettingsRow
          label={t('settings.section.paymentCards')}
          control="navigate"
          onClick={() => navigate('/settings/cards')}
        />
        <SettingsRow
          label={t('settings.section.referral')}
          control="navigate"
          onClick={() => navigate('/referral')}
          isLast
        />
      </Card>

      {/* ── Section: App ── */}
      <SectionHeader label={t('settings.group.app')} />
      <Card variant="stat" className="!p-0 rounded-lg overflow-hidden">
        <SettingsRow
          label={t('settings.section.appearance')}
          control="select"
          value={theme}
          options={themeOptions}
          onChange={(v) => setTheme(v as ThemeMode)}
        />
        <SettingsRow
          label={t('settings.section.language')}
          control="select"
          value={language}
          options={languageNativeLabels}
          onChange={(v) => setLanguage(v as Language)}
        />
        <SettingsRow
          label={t('settings.notifications.enable')}
          helperText={
            !supported
              ? t('settings.notifications.notSupported')
              : permissionStatus === 'denied'
                ? t('settings.notifications.blocked')
                : t('settings.notifications.enableHelper')
          }
          control="toggle"
          value={browserNotificationsEnabled && permissionStatus === 'granted'}
          onChange={handleNotificationToggle}
          disabled={!supported || permissionStatus === 'denied'}
        />
        <SettingsRow
          label={t('settings.notifications.permissionStatus')}
          control="badge"
          badgeText={
            !supported
              ? t('settings.notifications.statusNotSupported')
              : t(`settings.notifications.status.${permissionStatus}` as const)
          }
        />
        <SettingsRow
          label={t('settings.section.paymentMethods')}
          control="navigate"
          onClick={() => navigate('/settings/cards')}
          isLast
        />
      </Card>

      {/* ── Section: Notification Preferences ── */}
      <SectionHeader label={t('settings.group.notificationPreferences')} />
      <Card variant="stat" className="!p-0 rounded-lg overflow-hidden">
        <SettingsRow
          label={t('settings.notifications.dailyEarnings')}
          helperText={t('settings.notifications.dailyEarningsHelper')}
          control="toggle"
          value={notifyDailyEarnings}
          onChange={setNotifyDailyEarnings}
          disabled={!browserNotificationsEnabled}
        />
        <SettingsRow
          label={t('settings.notifications.streaks')}
          helperText={t('settings.notifications.streaksHelper')}
          control="toggle"
          value={notifyStreaks}
          onChange={setNotifyStreaks}
          disabled={!browserNotificationsEnabled}
        />
        <SettingsRow
          label={t('settings.notifications.priceAlerts')}
          helperText={t('settings.notifications.priceAlertsHelper')}
          control="toggle"
          value={notifyPriceAlerts}
          onChange={setNotifyPriceAlerts}
          isLast
        />
      </Card>

      {/* ── Section: Auto-Reinvest ── */}
      <SectionHeader label={t('settings.group.autoReinvest')} />
      <Card variant="stat" className="!p-0 rounded-lg overflow-hidden">
        <SettingsRow
          label={t('autoReinvest.enable')}
          helperText={t('autoReinvest.enableHelper')}
          control="toggle"
          value={autoReinvestEnabled}
          onChange={setAutoReinvest}
        />
        {autoReinvestEnabled && (
          <SettingsRow
            label={t('autoReinvest.term')}
            control="select"
            value={String(autoReinvestTermMonths)}
            options={[
              { value: '12', label: '12 months' },
              { value: '24', label: '24 months' },
              { value: '36', label: '36 months' },
              { value: '48', label: '48 months' },
            ]}
            onChange={(v) => setAutoReinvestTerm(Number(v))}
          />
        )}
        <SettingsRow
          label={t('autoReinvest.feeNote')}
          control="badge"
          badgeText="1.5%"
          isLast
        />
      </Card>

      {/* ── Section: Display ── */}
      <SectionHeader label={t('settings.group.display')} />
      <Card variant="stat" className="!p-0 rounded-lg overflow-hidden">
        <SettingsRow
          label={t('settings.section.advancedView')}
          helperText={t('settings.advancedView.helper')}
          control="toggle"
          value={advancedView}
          onChange={toggleAdvancedView}
        />
        <SettingsRow
          label={t('settings.display.units')}
          helperText={t('settings.display.unitsHelper')}
          control="select"
          value={displayCurrency}
          options={displayCurrencyOptions}
          onChange={(v) => setDisplayCurrency(v as DisplayCurrency)}
        />
        <SettingsRow
          label="Card demo mode"
          helperText="Show card demo panel for testing"
          control="toggle"
          value={cardDemoMode}
          onChange={() => useCardStore.setState({ demoMode: !cardDemoMode })}
          isLast
        />
      </Card>
    </>
  );
}

/* ─── Section header ─── */

function SectionHeader({ label }: { label: string }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mt-6 mb-2 px-1">
      {label}
    </h3>
  );
}
