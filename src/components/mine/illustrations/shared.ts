// ─── Shared constants and types for mine illustrations ──────────────

/** Ground-line Y constant */
export const GY = 265;

/** Color palette */
export const C = {
  // Sky
  skyTop: '#7EC8E3',
  skyBot: '#F0E6D3',
  // Nature
  grass1: '#5A8F4F',
  grass2: '#3D6B35',
  grassL: '#7AAF6A',
  tree1: '#2D5A27',
  tree2: '#357A2E',
  trunk: '#6B4226',
  // Earth
  earth1: '#8B7355',
  earth2: '#A0522D',
  earth3: '#6B4226',
  sand: '#D4C4A0',
  sandD: '#B8A880',
  // Water
  water1: '#5B9BD5',
  water2: '#4682B4',
  waterH: '#8DC5E8',
  // Wood & building
  wood: '#A0522D',
  woodD: '#6B4226',
  roof: '#5C3A1E',
  canvas: '#C4A882',
  stone: '#909090',
  stoneD: '#707070',
  metal: '#B0B0B0',
  // Yellow / machinery
  yellow: '#E8B830',
  yellowD: '#C99A20',
  glass: '#A8D8EA',
  glassD: '#7BB8D0',
  // Gold
  gold: '#C9A84C',
  goldL: '#E8D48B',
  goldD: '#A68B3C',
  // People
  person: '#5C4033',
  shirt1: '#4A6FA5',
  shirt2: '#8B4513',
  vest: '#E8B830',
  helmet: '#E8B830',
  // Effects
  fire: '#FF6B35',
  fireY: '#FFD700',
  smoke: '#9CA3AF',
  white: '#FFFFFF',
  sun: '#FFE066',
  // Road
  road: '#8A7B6B',
  roadM: '#C9B99A',
  // Fence
  fence: '#8B7355',
  fenceD: '#6B5A42',
} as const;

/** Star positions for night sky */
export const STARS = [
  { cx: 80, cy: 30, r: 1.2 },
  { cx: 150, cy: 55, r: 0.8 },
  { cx: 230, cy: 25, r: 1.5 },
  { cx: 310, cy: 70, r: 1.0 },
  { cx: 380, cy: 20, r: 1.3 },
  { cx: 430, cy: 50, r: 0.9 },
  { cx: 520, cy: 35, r: 1.1 },
  { cx: 570, cy: 80, r: 0.7 },
  { cx: 620, cy: 15, r: 1.4 },
  { cx: 660, cy: 45, r: 1.0 },
  { cx: 180, cy: 90, r: 0.8 },
  { cx: 750, cy: 40, r: 1.1 },
];

/** Confetti positions for level-up animation */
export const CONFETTI_POS = [
  { cx: 150, cy: 100, r: 4 },
  { cx: 350, cy: 150, r: 5 },
  { cx: 500, cy: 80, r: 3 },
  { cx: 250, cy: 200, r: 6 },
  { cx: 600, cy: 120, r: 4 },
  { cx: 450, cy: 250, r: 3 },
  { cx: 700, cy: 170, r: 5 },
  { cx: 100, cy: 220, r: 4 },
];

/** Props shared by all level scene components */
export interface SceneProps {
  anim: boolean;
  isDark: boolean;
  claimActive: boolean;
}
