import { useAuthStore } from '@/stores/authStore';

export interface UserSettingsResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  language: string;
  notificationsEnabled: boolean;
  displayCurrency: 'usd' | 'ayni' | 'both';
}

export async function getSettings(): Promise<UserSettingsResponse> {
  await new Promise((r) => setTimeout(r, 300));
  const user = useAuthStore.getState().user;
  return {
    id: user?.id ?? '1',
    email: user?.email ?? 'user@ayni.gold',
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    avatarUrl: user?.avatarUrl ?? null,
    language: 'en',
    notificationsEnabled: true,
    displayCurrency: 'usd',
  };
}

export async function updateSettings(
  data: Partial<Omit<UserSettingsResponse, 'id' | 'email'>>,
): Promise<UserSettingsResponse> {
  await new Promise((r) => setTimeout(r, 300));
  const current = await getSettings();
  return { ...current, ...data };
}
