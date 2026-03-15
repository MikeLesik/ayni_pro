export const queryKeys = {
  tier: {
    all: ['tier'] as const,
    data: () => [...queryKeys.tier.all, 'data'] as const,
  },
  platform: {
    all: ['platform'] as const,
    stats: () => [...queryKeys.platform.all, 'stats'] as const,
  },
};
