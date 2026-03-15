import { GY, C, type SceneProps } from './shared';
import {
  Stagger,
  Tree,
  River,
  BoundaryFence,
  ConcessionSign,
  Smoke,
  SluiceBox,
  Wheelbarrow,
  Digger,
  Worker,
  GoldPanner,
  GoldStacks,
  ClaimBurst,
} from './elements';

/** Level 2 -- Prospector (larger concession, sluice, more workers) */
export function ProspectorScene({ anim, isDark, claimActive }: SceneProps) {
  return (
    <g>
      {/* Trees */}
      <Stagger i={0} anim={anim}>
        <Tree x={45} h={50} />
        <Tree x={720} h={38} />
      </Stagger>

      {/* River */}
      <Stagger i={1} anim={anim}>
        <River startX={480} anim={anim} />
      </Stagger>

      {/* Concession boundary (wider) */}
      <Stagger i={2} anim={anim}>
        <BoundaryFence x1={100} x2={460} />
        <ConcessionSign x={120} text="CONCESSION" />
      </Stagger>

      {/* Cabin */}
      <Stagger i={3} anim={anim}>
        <g>
          <ellipse cx={160} cy={GY - 1} rx={45} ry={4} fill="#000" opacity={0.06} />
          <rect x={120} y={GY - 42} width={80} height={42} fill={C.wood} rx={2} />
          <rect x={120} y={GY - 42} width={80} height={42} fill="#000" opacity={0.08} />
          <line
            x1={120}
            y1={GY - 30}
            x2={200}
            y2={GY - 30}
            stroke={C.woodD}
            strokeWidth={0.5}
            opacity={0.4}
          />
          <line
            x1={120}
            y1={GY - 18}
            x2={200}
            y2={GY - 18}
            stroke={C.woodD}
            strokeWidth={0.5}
            opacity={0.4}
          />
          <polygon points={`115,${GY - 42} 160,${GY - 65} 205,${GY - 42}`} fill={C.roof} />
          <polygon
            points={`115,${GY - 42} 160,${GY - 65} 160,${GY - 42}`}
            fill="#000"
            opacity={0.1}
          />
          <rect x={148} y={GY - 22} width={14} height={22} fill={C.woodD} rx={1} />
          <circle cx={159} cy={GY - 11} r={1.5} fill={C.gold} />
          <rect x={130} y={GY - 36} width={10} height={8} fill={C.glass} rx={1} />
          <line x1={135} y1={GY - 36} x2={135} y2={GY - 28} stroke={C.woodD} strokeWidth={0.8} />
          <rect x={180} y={GY - 70} width={8} height={28} fill={C.stone} />
          <Smoke x={184} y={GY - 72} anim={anim} count={3} />
        </g>
      </Stagger>

      {/* Sluice box */}
      <Stagger i={4} anim={anim}>
        <SluiceBox x={420} anim={anim} />
      </Stagger>

      {/* Wheelbarrow */}
      <Stagger i={5} anim={anim}>
        <Wheelbarrow x={300} />
      </Stagger>

      {/* Workers */}
      <Stagger i={6} anim={anim}>
        <Digger x={260} anim={anim} claimActive={claimActive} />
        <Digger x={370} facingRight={false} anim={anim} claimActive={claimActive} />
        <Worker x={520} color={C.shirt2} />
      </Stagger>

      {/* Gold panner */}
      <Stagger i={7} anim={anim}>
        <GoldPanner x={560} anim={anim} />
      </Stagger>

      {/* Small gold pile near cabin */}
      <Stagger i={8} anim={anim}>
        <GoldStacks x={220} y={GY - 2} size="sm" isDark={isDark} />
      </Stagger>

      {/* Claim burst */}
      <ClaimBurst active={claimActive} cx={300} cy={GY - 30} />
    </g>
  );
}
