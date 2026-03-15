import { useAuthStore } from '@/stores/authStore';
import { useSimulationStore } from '@/stores/simulation';
import type { AuthResponse } from '@/types/auth';

function generateMockResponse(email: string, firstName = 'Yuriy'): AuthResponse {
  return {
    accessToken: `mock-token-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
    user: {
      id: '1',
      email,
      firstName,
      lastName: null,
      avatarUrl: null,
      tier: 'explorer',
      kycStatus: 'none',
      createdAt: new Date().toISOString(),
    },
  };
}

export async function login(email: string, _password: string): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 500));

  const sim = useSimulationStore.getState();
  const firstName = sim.user?.firstName ?? 'Yuriy';

  const response = generateMockResponse(email, firstName);
  useAuthStore.getState().setAuth(response.user, response.accessToken, response.refreshToken);

  // Initialize simulation if not already
  if (!sim._initialized) {
    sim.initWithDemoData();
  }
  if (sim.user) {
    sim.login(email);
  }

  return response;
}

export async function register(email: string, _password: string): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 500));
  const response = generateMockResponse(email);
  useAuthStore.getState().setAuth(response.user, response.accessToken, response.refreshToken);

  // Initialize simulation with demo data
  const sim = useSimulationStore.getState();
  sim.initWithDemoData();

  return response;
}

export function logout(): void {
  useAuthStore.getState().logout();
  useSimulationStore.getState().resetSimulation();
}
