import { GY, C, type SceneProps } from './shared';
import {
  Stagger,
  Tree,
  River,
  BoundaryFence,
  ConcessionSign,
  Smoke,
  GoldPanner,
  Digger,
  Wheelbarrow,
  ClaimBurst,
} from './elements';

/** Level 1 -- Explorer (small concession, manual) */
export function ExplorerScene({ anim, isDark, claimActive }: SceneProps) {
  return (
    <g>
      {/* Trees along the edges */}
      <Stagger i={0} anim={anim}>
        <Tree x={60} h={55} />
        <Tree x={120} h={40} />
        <Tree x={680} h={48} />
        <Tree x={740} h={34} />
      </Stagger>

      {/* River */}
      <Stagger i={1} anim={anim}>
        <River startX={480} anim={anim} />
      </Stagger>

      {/* Concession boundary (small) */}
      <Stagger i={2} anim={anim}>
        <BoundaryFence x1={180} x2={460} />
        <ConcessionSign x={200} text="CLAIM" />
      </Stagger>

      {/* Tent */}
      <Stagger i={3} anim={anim}>
        <g>
          <ellipse cx={240} cy={GY - 2} rx={32} ry={4} fill="#000" opacity={0.06} />
          <polygon points={`210,${GY - 5} 240,${GY - 52} 270,${GY - 5}`} fill={C.canvas} />
          <polygon
            points={`210,${GY - 5} 240,${GY - 52} 240,${GY - 5}`}
            fill={C.wood}
            opacity={0.25}
          />
          <line x1={240} y1={GY - 52} x2={240} y2={GY - 5} stroke={C.woodD} strokeWidth={2} />
          <polygon
            points={`232,${GY - 5} 240,${GY - 30} 248,${GY - 5}`}
            fill={C.earth3}
            opacity={0.45}
          />
        </g>
      </Stagger>

      {/* Shovel & pickaxe leaning */}
      <Stagger i={4} anim={anim}>
        <g>
          <line x1={290} y1={GY - 8} x2={302} y2={GY - 28} stroke={C.woodD} strokeWidth={2.5} />
          <path d={`M300,${GY - 28} L310,${GY - 32} L306,${GY - 22} Z`} fill={C.stone} />
        </g>
      </Stagger>

      {/* Campfire */}
      <Stagger i={5} anim={anim}>
        <g>
          <rect
            x={365}
            y={GY - 8}
            width={22}
            height={4}
            rx={2}
            fill={C.woodD}
            transform={`rotate(-12, 376, ${GY - 6})`}
          />
          <rect
            x={368}
            y={GY - 10}
            width={20}
            height={4}
            rx={2}
            fill={C.wood}
            transform={`rotate(12, 378, ${GY - 8})`}
          />
          <circle
            cx={378}
            cy={GY - 8}
            r={isDark ? 30 : 18}
            fill={C.fire}
            opacity={isDark ? 0.2 : 0.07}
          />
          {isDark && <circle cx={378} cy={GY - 8} r={45} fill={C.fireY} opacity={0.06} />}
          <ellipse cx={378} cy={GY - 12} rx={7} ry={5} fill={C.fire} opacity={0.8}>
            {anim && (
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="0.8s"
                repeatCount="indefinite"
              />
            )}
          </ellipse>
          <ellipse cx={378} cy={GY - 16} rx={4} ry={4} fill={C.fireY} opacity={0.9}>
            {anim && (
              <animate attributeName="ry" values="4;6;4" dur="0.6s" repeatCount="indefinite" />
            )}
          </ellipse>
          <Smoke x={378} y={GY - 25} anim={anim} />
        </g>
      </Stagger>

      {/* Gold panner at river */}
      <Stagger i={6} anim={anim}>
        <GoldPanner x={500} anim={anim} />
      </Stagger>

      {/* Digger with pickaxe inside concession */}
      <Stagger i={7} anim={anim}>
        <Digger x={340} anim={anim} claimActive={claimActive} />
      </Stagger>

      {/* Wheelbarrow */}
      <Stagger i={8} anim={anim}>
        <Wheelbarrow x={400} />
      </Stagger>

      {/* Claim burst */}
      <ClaimBurst active={claimActive} cx={350} cy={GY - 30} />
    </g>
  );
}
