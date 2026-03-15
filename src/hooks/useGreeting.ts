import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/i18n';

export function useGreeting(): string {
  const firstName = useAuthStore((s) => s.user?.firstName);
  const { t } = useTranslation();
  const hour = new Date().getHours();

  let timeGreeting: string;
  if (hour < 12) {
    timeGreeting = t('greeting.morning');
  } else if (hour < 18) {
    timeGreeting = t('greeting.afternoon');
  } else {
    timeGreeting = t('greeting.evening');
  }

  if (firstName) {
    return `${timeGreeting}, ${firstName}`;
  }

  return t('greeting.welcomeBack');
}
