import { motion, AnimatePresence } from 'framer-motion';
import { GY, C } from './shared';

// ─── Stagger Animation Wrapper ──────────────────────────────────────

export function Stagger({
  i,
  anim,
  children,
}: {
  i: number;
  anim: boolean;
  children: React.ReactNode;
}) {
  if (!anim) return <g>{children}</g>;
  return (
    <motion.g
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.g>
  );
}

// ─── Tree ────────────────────────────────────────────────────────────

export function Tree({ x, h = 50 }: { x: number; h?: number }) {
  const tw = h * 0.1;
  const cw = h * 0.5;
  const th = h * 0.3;
  const base = GY - 5;
  return (
    <g>
      <ellipse cx={x} cy={base + 2} rx={cw * 0.5} ry={3} fill="#000" opacity={0.06} />
      <rect x={x - tw / 2} y={base - th} width={tw} height={th} fill={C.trunk} />
      <polygon
        points={`${x},${base - h} ${x - cw / 2},${base - th + 5} ${x + cw / 2},${base - th + 5}`}
        fill={C.tree1}
      />
      <polygon
        points={`${x},${base - h - h * 0.18} ${x - cw * 0.35},${base - h + h * 0.15} ${x + cw * 0.35},${base - h + h * 0.15}`}
        fill={C.tree2}
      />
    </g>
  );
}

// ─── Worker ──────────────────────────────────────────────────────────

export function Worker({ x, color = C.vest }: { x: number; color?: string }) {
  const y = GY - 5;
  return (
    <g>
      <circle cx={x} cy={y - 24} r={4} fill={C.person} />
      <rect x={x - 5} y={y - 29} width={10} height={3} fill={C.helmet} rx={1} />
      <rect x={x - 3} y={y - 20} width={6} height={10} fill={color} rx={1} />
      <rect x={x - 3.5} y={y - 10} width={3} height={8} fill={C.person} rx={1} />
      <rect x={x + 0.5} y={y - 10} width={3} height={8} fill={C.person} rx={1} />
    </g>
  );
}

// ─── Digger (Worker with pickaxe) ────────────────────────────────────

export function Digger({
  x,
  facingRight = true,
  anim,
  claimActive = false,
}: {
  x: number;
  facingRight?: boolean;
  anim: boolean;
  claimActive?: boolean;
}) {
  const y = GY - 5;
  const dir = facingRight ? 1 : -1;
  const pickDur = claimActive ? '0.4s' : '2s';
  const pivotX = x + dir * 6;
  const pivotY = y - 16;
  const pickValues = facingRight
    ? `0 ${pivotX} ${pivotY};-25 ${pivotX} ${pivotY};0 ${pivotX} ${pivotY}`
    : `0 ${pivotX} ${pivotY};25 ${pivotX} ${pivotY};0 ${pivotX} ${pivotY}`;

  return (
    <g>
      {/* Body */}
      <circle cx={x} cy={y - 24} r={4} fill={C.person} />
      <rect x={x - 5} y={y - 29} width={10} height={3} fill={C.helmet} rx={1} />
      <rect x={x - 3} y={y - 20} width={6} height={10} fill={C.vest} rx={1} />
      <rect x={x - 3.5} y={y - 10} width={3} height={8} fill={C.person} rx={1} />
      <rect x={x + 0.5} y={y - 10} width={3} height={8} fill={C.person} rx={1} />

      {/* Pickaxe */}
      <g>
        <line
          x1={pivotX}
          y1={pivotY}
          x2={x + dir * 20}
          y2={y - 30}
          stroke={C.woodD}
          strokeWidth={2}
        />
        <path
          d={`M${x + dir * 18},${y - 30} L${x + dir * 26},${y - 34} L${x + dir * 24},${y - 26} Z`}
          fill={C.stone}
        />
        {anim && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={pickValues}
            dur={pickDur}
            repeatCount="indefinite"
          />
        )}
      </g>

      {/* Sparks on claim */}
      {anim && claimActive && (
        <g>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={x + dir * 24 + i * 3} cy={y - 30 - i * 2} r={1.5} fill={C.goldL}>
              <animate
                attributeName="opacity"
                values="1;0"
                dur="0.3s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${y - 30 - i * 2};${y - 38 - i * 4}`}
                dur="0.3s"
                begin={`${i * 0.1}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      )}
    </g>
  );
}

// ─── River ───────────────────────────────────────────────────────────

export function River({ startX, anim }: { startX: number; anim: boolean }) {
  const sx = startX;
  return (
    <g>
      <path
        d={`M${sx},${GY - 5} C${sx + 50},${GY - 16} ${sx + 100},${GY - 8} ${sx + 150},${GY - 12}
            S${sx + 220},${GY - 5} ${Math.min(800, sx + 270)},${GY - 10}
            L${Math.min(800, sx + 270)},${GY + 22}
            C${sx + 180},${GY + 18} ${sx + 100},${GY + 24} ${sx + 50},${GY + 18}
            L${sx},${GY + 16} Z`}
        fill="url(#mg-water)"
      />
      <path
        d={`M${sx + 20},${GY - 2} Q${sx + 60},${GY - 10} ${sx + 100},${GY - 5}`}
        fill="none"
        stroke={C.waterH}
        strokeWidth="2"
        opacity={0.4}
      />
      <path
        d={`M${sx + 90},${GY + 4} Q${sx + 130},${GY - 4} ${sx + 170},${GY}`}
        fill="none"
        stroke={C.waterH}
        strokeWidth="1.5"
        opacity={0.3}
      />
      {anim && (
        <g opacity={0.35}>
          <path
            d={`M${sx + 30},${GY} Q${sx + 55},${GY - 6} ${sx + 80},${GY - 2}`}
            fill="none"
            stroke={C.white}
            strokeWidth="2"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;90,0;0,0"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d={`M${sx + 100},${GY + 5} Q${sx + 130},${GY - 2} ${sx + 160},${GY + 2}`}
            fill="none"
            stroke={C.white}
            strokeWidth="1.5"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;60,0;0,0"
              dur="4.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}
    </g>
  );
}

// ─── Smoke ───────────────────────────────────────────────────────────

export function Smoke({
  x,
  y,
  anim,
  count = 3,
}: {
  x: number;
  y: number;
  anim: boolean;
  count?: number;
}) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <circle
          key={i}
          cx={x + (i - 1) * 4}
          cy={y}
          r={3 + i}
          fill={C.smoke}
          opacity={anim ? undefined : 0.25}
        >
          {anim && (
            <>
              <animate
                attributeName="cy"
                from={String(y)}
                to={String(y - 35)}
                dur={`${2 + i * 0.5}s`}
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.45;0"
                dur={`${2 + i * 0.5}s`}
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                from={String(3 + i)}
                to={String(9 + i * 2)}
                dur={`${2 + i * 0.5}s`}
                begin={`${i * 0.6}s`}
                repeatCount="indefinite"
              />
            </>
          )}
        </circle>
      ))}
    </g>
  );
}

// ─── BoundaryFence ───────────────────────────────────────────────────

export function BoundaryFence({ x1, x2 }: { x1: number; x2: number }) {
  const postCount = Math.floor((x2 - x1) / 80) + 1;
  const postSpacing = (x2 - x1) / (postCount - 1);
  return (
    <g>
      {/* Wire */}
      <line
        x1={x1}
        y1={GY - 18}
        x2={x2}
        y2={GY - 18}
        stroke={C.fence}
        strokeWidth={1}
        strokeDasharray="6,4"
        opacity={0.6}
      />
      <line
        x1={x1}
        y1={GY - 10}
        x2={x2}
        y2={GY - 10}
        stroke={C.fence}
        strokeWidth={1}
        strokeDasharray="6,4"
        opacity={0.5}
      />
      {/* Posts */}
      {Array.from({ length: postCount }).map((_, i) => {
        const px = x1 + i * postSpacing;
        return (
          <g key={i}>
            <rect x={px - 2} y={GY - 22} width={4} height={24} fill={C.fenceD} rx={1} />
            <rect x={px - 3} y={GY - 23} width={6} height={3} fill={C.fence} rx={1} />
          </g>
        );
      })}
    </g>
  );
}

// ─── SluiceBox ───────────────────────────────────────────────────────

export function SluiceBox({ x, anim }: { x: number; anim: boolean }) {
  return (
    <g>
      {/* Trough */}
      <rect
        x={x}
        y={GY - 12}
        width={85}
        height={8}
        rx={1}
        fill={C.woodD}
        transform={`rotate(-5, ${x + 42}, ${GY - 8})`}
      />
      <rect
        x={x + 5}
        y={GY - 10}
        width={75}
        height={4}
        rx={1}
        fill={C.wood}
        transform={`rotate(-5, ${x + 42}, ${GY - 8})`}
      />
      {/* Legs */}
      <line x1={x + 15} y1={GY - 5} x2={x + 15} y2={GY + 5} stroke={C.woodD} strokeWidth={2} />
      <line x1={x + 70} y1={GY - 8} x2={x + 70} y2={GY + 5} stroke={C.woodD} strokeWidth={2} />
      {/* Water flow shimmer */}
      {anim && (
        <rect
          x={x + 8}
          y={GY - 9}
          width={70}
          height={2}
          fill={C.waterH}
          opacity={0.3}
          transform={`rotate(-5, ${x + 42}, ${GY - 8})`}
        >
          <animate
            attributeName="opacity"
            values="0.2;0.5;0.2"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </g>
  );
}

// ─── Wheelbarrow ─────────────────────────────────────────────────────

export function Wheelbarrow({ x }: { x: number }) {
  return (
    <g>
      <path
        d={`M${x},${GY - 15} L${x + 8},${GY - 8} L${x + 28},${GY - 8} L${x + 33},${GY - 18} Z`}
        fill={C.stoneD}
      />
      <path
        d={`M${x + 2},${GY - 15} L${x + 8},${GY - 10} L${x + 26},${GY - 10} L${x + 31},${GY - 18} Z`}
        fill={C.earth2}
      />
      {/* Gold flecks */}
      <circle cx={x + 14} cy={GY - 13} r={1.2} fill={C.gold} opacity={0.7} />
      <circle cx={x + 20} cy={GY - 14} r={1} fill={C.goldL} opacity={0.6} />
      <circle cx={x + 8} cy={GY - 4} r={4} fill={C.stoneD} />
      <circle cx={x + 8} cy={GY - 4} r={1.8} fill={C.stone} />
      <line x1={x + 33} y1={GY - 18} x2={x + 42} y2={GY - 22} stroke={C.woodD} strokeWidth={2} />
      <line x1={x + 33} y1={GY - 12} x2={x + 42} y2={GY - 22} stroke={C.woodD} strokeWidth={2} />
    </g>
  );
}

// ─── OpenPit ─────────────────────────────────────────────────────────

export function OpenPit({ x, w, depth = 45 }: { x: number; w: number; depth?: number }) {
  const inset = w * 0.12;
  return (
    <g>
      <path
        d={`M${x},${GY - 5} L${x + inset},${GY + depth} L${x + w - inset},${GY + depth} L${x + w},${GY - 5} Z`}
        fill="url(#mg-pit)"
      />
      <line x1={x} y1={GY - 5} x2={x + inset} y2={GY + depth} stroke={C.earth3} strokeWidth={1.5} />
      <line
        x1={x + w}
        y1={GY - 5}
        x2={x + w - inset}
        y2={GY + depth}
        stroke={C.earth3}
        strokeWidth={1.5}
      />
      {/* Terraces */}
      <line
        x1={x + inset * 0.4}
        y1={GY + depth * 0.35}
        x2={x + w - inset * 0.4}
        y2={GY + depth * 0.35}
        stroke={C.earth3}
        strokeWidth={0.8}
        opacity={0.5}
      />
      <line
        x1={x + inset * 0.7}
        y1={GY + depth * 0.65}
        x2={x + w - inset * 0.7}
        y2={GY + depth * 0.65}
        stroke={C.earth3}
        strokeWidth={0.8}
        opacity={0.4}
      />
      {/* Gold veins visible in pit walls */}
      <line
        x1={x + inset * 0.3}
        y1={GY + depth * 0.2}
        x2={x + inset * 0.5}
        y2={GY + depth * 0.4}
        stroke={C.gold}
        strokeWidth={2}
        opacity={0.4}
        strokeLinecap="round"
      />
      <circle cx={x + inset * 0.4} cy={GY + depth * 0.3} r={1.5} fill={C.goldL} opacity={0.5} />
    </g>
  );
}

// ─── ConveyorBelt ────────────────────────────────────────────────────

export function ConveyorBelt({
  x1,
  y1,
  x2,
  y2,
  anim,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  anim: boolean;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = 4;
  return (
    <g>
      <line x1={x1 + 10} y1={GY - 3} x2={x1 + 10} y2={y1} stroke={C.stone} strokeWidth={3} />
      <line x1={x2 - 10} y1={GY - 3} x2={x2 - 10} y2={y2} stroke={C.stone} strokeWidth={3} />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={C.stoneD}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <line x1={x1} y1={y1 - 1} x2={x2} y2={y2 - 1} stroke={C.stone} strokeWidth={3} />
      <g>
        {Array.from({ length: steps }).map((_, i) => {
          const t = (i + 0.5) / steps;
          return (
            <rect
              key={i}
              x={x1 + t * dx - 4}
              y={y1 + t * dy - 7}
              width={8}
              height={5}
              rx={1}
              fill={C.earth2}
            />
          );
        })}
        {anim && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0;${dx / steps},${dy / steps};0,0`}
            dur="1.8s"
            repeatCount="indefinite"
          />
        )}
      </g>
    </g>
  );
}

// ─── Warehouse ───────────────────────────────────────────────────────

export function Warehouse({ x, w = 60 }: { x: number; w?: number }) {
  return (
    <g>
      <rect x={x} y={GY - 38} width={w} height={38} fill={C.stone} rx={2} />
      <rect x={x - 2} y={GY - 42} width={w + 4} height={6} fill={C.stoneD} rx={1} />
      <rect x={x + w / 2 - 8} y={GY - 18} width={16} height={18} fill={C.stoneD} rx={1} />
      <line x1={x + w / 2} y1={GY - 18} x2={x + w / 2} y2={GY} stroke={C.stone} strokeWidth={1} />
    </g>
  );
}

// ─── LightTower ──────────────────────────────────────────────────────

export function LightTower({ x, isDark = false }: { x: number; isDark?: boolean }) {
  return (
    <g>
      <line x1={x} y1={GY - 5} x2={x} y2={GY - 60} stroke={C.stone} strokeWidth={2} />
      <line x1={x - 8} y1={GY - 5} x2={x} y2={GY - 20} stroke={C.stone} strokeWidth={1.5} />
      <line x1={x + 8} y1={GY - 5} x2={x} y2={GY - 20} stroke={C.stone} strokeWidth={1.5} />
      <circle cx={x} cy={GY - 62} r={5} fill={C.sun} opacity={isDark ? 1 : 0.8} />
      <circle
        cx={x}
        cy={GY - 62}
        r={isDark ? 20 : 12}
        fill={C.sun}
        opacity={isDark ? 0.25 : 0.12}
      />
      {isDark && <circle cx={x} cy={GY - 62} r={35} fill={C.sun} opacity={0.06} />}
    </g>
  );
}

// ─── Truck ───────────────────────────────────────────────────────────

export function Truck({
  baseX,
  baseY,
  anim,
  dur = '8s',
  range = '150,0;500,0;150,0',
}: {
  baseX: number;
  baseY: number;
  anim: boolean;
  dur?: string;
  range?: string;
}) {
  return (
    <g transform={`translate(${baseX}, ${baseY})`}>
      {anim && (
        <animateTransform
          attributeName="transform"
          type="translate"
          values={range}
          dur={dur}
          repeatCount="indefinite"
        />
      )}
      <ellipse cx={0} cy={3} rx={22} ry={3} fill="#000" opacity={0.08} />
      <rect x={-20} y={-14} width={28} height={14} fill={C.yellow} rx={1} />
      <rect x={8} y={-17} width={12} height={17} fill={C.yellowD} rx={2} />
      <rect x={11} y={-15} width={6} height={7} fill={C.glass} rx={1} />
      <circle cx={-10} cy={0} r={3.5} fill={C.stoneD} />
      <circle cx={-10} cy={0} r={1.5} fill={C.stone} />
      <circle cx={6} cy={0} r={3.5} fill={C.stoneD} />
      <circle cx={6} cy={0} r={1.5} fill={C.stone} />
      <circle cx={16} cy={0} r={3.5} fill={C.stoneD} />
      <circle cx={16} cy={0} r={1.5} fill={C.stone} />
    </g>
  );
}

// ─── GoldPanner ──────────────────────────────────────────────────────

export function GoldPanner({ x, anim }: { x: number; anim: boolean }) {
  const y = GY - 2;
  return (
    <g>
      {/* Kneeling person */}
      <circle cx={x} cy={y - 16} r={3.5} fill={C.person} />
      <rect x={x - 3} y={y - 12} width={6} height={7} fill={C.shirt2} rx={1} />
      <rect x={x - 4} y={y - 5} width={8} height={5} fill={C.person} rx={1} />
      {/* Gold pan */}
      <ellipse cx={x + 10} cy={y - 4} rx={8} ry={3} fill={C.stoneD} />
      <ellipse cx={x + 10} cy={y - 5} rx={6} ry={2} fill={C.stone} />
      {/* Gold specks in pan */}
      <circle cx={x + 9} cy={y - 5} r={0.8} fill={C.gold} opacity={0.8} />
      <circle cx={x + 12} cy={y - 5} r={0.6} fill={C.goldL} opacity={0.7} />
      {/* Pan sloshing animation */}
      {anim && (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;2,-1;0,0;-2,-1;0,0"
          dur="2.5s"
          repeatCount="indefinite"
        />
      )}
    </g>
  );
}

// ─── GoldStacks ──────────────────────────────────────────────────────

export function GoldStacks({
  x,
  y,
  size = 'sm',
  isDark,
}: {
  x: number;
  y: number;
  size?: 'sm' | 'md' | 'lg';
  isDark: boolean;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-10} y={-6} width={8} height={6} fill={C.gold} rx={1} />
      <rect x={0} y={-6} width={8} height={6} fill={C.goldD} rx={1} />
      {size !== 'sm' && <rect x={10} y={-6} width={8} height={6} fill={C.gold} rx={1} />}
      <rect x={-5} y={-11} width={8} height={6} fill={C.goldL} rx={1} />
      {size !== 'sm' && <rect x={5} y={-11} width={8} height={6} fill={C.gold} rx={1} />}
      {size === 'lg' && <rect x={0} y={-16} width={8} height={6} fill={C.goldL} rx={1} />}
      <rect x={-5} y={-11} width={2.5} height={6} fill={C.white} opacity={0.18} rx={1} />
      {isDark && <circle cx={0} cy={-8} r={18} fill={C.goldL} opacity={0.07} />}
    </g>
  );
}

// ─── ClaimBurst ──────────────────────────────────────────────────────

export function ClaimBurst({ active, cx, cy }: { active: boolean; cx: number; cy: number }) {
  if (!active) return null;
  const particles = Array.from({ length: 14 }).map((_, i) => {
    const angle = (i / 14) * Math.PI * 2 + i * 0.37;
    const dist = 25 + (i % 5) * 8;
    return {
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - 18,
      r: 1.5 + (i % 3) * 1,
      delay: i * 0.03,
    };
  });
  return (
    <AnimatePresence>
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={p.r}
          fill={i % 3 === 0 ? C.goldL : C.gold}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.tx, y: p.ty, scale: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </AnimatePresence>
  );
}

// ─── ConcessionSign ──────────────────────────────────────────────────

export function ConcessionSign({ x, text }: { x: number; text: string }) {
  return (
    <g>
      <rect x={x - 1} y={GY - 38} width={3} height={40} fill={C.woodD} rx={1} />
      <rect x={x - 22} y={GY - 42} width={45} height={14} fill={C.wood} rx={2} />
      <rect x={x - 22} y={GY - 42} width={45} height={14} fill="#000" opacity={0.08} rx={2} />
      <text
        x={x}
        y={GY - 33}
        textAnchor="middle"
        fill={C.white}
        fontSize="7"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        {text}
      </text>
    </g>
  );
}
