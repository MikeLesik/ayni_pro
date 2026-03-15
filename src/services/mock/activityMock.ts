import type { ActivityPage, ActivityFilter } from '@/types/activity';
import { delay, getState, mapActivityToEvent } from './helpers';

// ── GET /api/activity ────────────────────────────────────────

export async function getActivity(
  filter: ActivityFilter,
  page: number,
  limit = 10,
): Promise<ActivityPage> {
  await delay(200);
  const state = getState();

  const allEvents = state.activities.map(mapActivityToEvent);

  const filtered =
    filter === 'all'
      ? allEvents
      : allEvents.filter((e) => {
          switch (filter) {
            case 'distributions':
              return e.type === 'reward_credited';
            case 'payments':
              return e.type === 'participation_confirmed';
            case 'payouts':
              return e.type === 'payout_completed' || e.type === 'quarterly_payout';
            case 'system':
              return e.type === 'system_announcement';
            default:
              return true;
          }
        });

  const start = page * limit;
  const end = start + limit;
  const events = filtered.slice(start, end);

  return {
    events,
    hasMore: end < filtered.length,
    nextPage: end < filtered.length ? page + 1 : null,
  };
}
