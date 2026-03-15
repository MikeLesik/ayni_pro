import type { DashboardResponse } from '@/types/dashboard';
import { mockApi } from './mockApi';

export async function getDashboard(): Promise<DashboardResponse> {
  return mockApi.getDashboard();
}
