import type { ActivityFilter, ActivityPage } from '@/types/activity';
import { mockApi } from './mockApi';

export async function getActivity(
  filter: ActivityFilter,
  page: number,
  limit: number = 10,
): Promise<ActivityPage> {
  return mockApi.getActivity(filter, page, limit);
}
