/**
 * Thin facade that re-exports from the split mock modules.
 * All existing named exports remain available from this path
 * so that consumers do not need changes.
 */

import { getUserTier, getPlatformStats } from './mock/tierMock';
import { getDashboard } from './mock/dashboardMock';
import { getProjection, participate } from './mock/earnMock';
import {
  getPortfolio,
  getPositionDetail,
  cancelPosition,
  reinvest,
  stakeAyni,
  withdrawPaxg,
  withdrawAyni,
} from './mock/portfolioMock';
import { getActivity } from './mock/activityMock';

// Re-export the standalone helper
export { setMockTierScenario } from './mock/tierMock';

// ── Mock API object (preserves existing consumer interface) ──

export const mockApi = {
  getUserTier,
  getPlatformStats,
  getDashboard,
  getProjection,
  participate,
  getPortfolio,
  getPositionDetail,
  cancelPosition,
  reinvest,
  stakeAyni,
  withdrawPaxg,
  withdrawAyni,
  getActivity,
};
