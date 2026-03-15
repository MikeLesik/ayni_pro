import { GY, C, type SceneProps } from './shared';
import {
  Stagger,
  River,
  BoundaryFence,
  OpenPit,
  ConveyorBelt,
  Smoke,
  Digger,
  Worker,
  SluiceBox,
  GoldStacks,
  ClaimBurst,
} from './elements';

/** Level 3 -- Operation (excavator, conveyor, processing) */
export function OperationScene({ anim, isDark, claimActive }: SceneProps) {
  return (
    <g>
      {/* Concession boundary (wide) */}
      <Stagger i={0} anim={anim}>
        <BoundaryFence x1={40} x2={760} />
      </Stagger>

      {/* River */}
      <Stagger i={1} anim={anim}>
        <River startX={560} anim={anim} />
      </Stagger>

      {/* Open pit */}
      <Stagger i={2} anim={anim}>
        <OpenPit x={200} w={250} depth={50} />
      </Stagger>

      {/* Excavator */}
      <Stagger i={3} anim={anim}>
        <g>
          <rect x={150} y={GY - 10} width={50} height={10} rx={4} fill={C.stoneD} />
          <rect x={153} y={GY - 8} width={44} height={6} rx={3} fill={C.stone} />
          <rect x={155} y={GY - 28} width={40} height={18} rx={2} fill={C.yellow} />
          <rect x={158} y={GY - 26} width={34} height={14} rx={1} fill={C.yellowD} opacity={0.4} />
          <rect x={160} y={GY - 40} width={22} height={12} rx={2} fill={C.yellowD} />
          <rect x={163} y={GY - 38} width={12} height={8} fill={C.glass} rx={1} />
          <g>
            <line
              x1={180}
              y1={GY - 28}
              x2={218}
              y2={GY - 48}
              stroke={C.yellow}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <line
              x1={218}
              y1={GY - 48}
              x2={230}
              y2={GY - 25}
              stroke={C.yellow}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <path
              d={`M224,${GY - 25} L237,${GY - 25} L234,${GY - 16} L221,${GY - 16} Z`}
              fill={C.stoneD}
            />
            {anim && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 180 ${GY - 28};-10 180 ${GY - 28};0 180 ${GY - 28}`}
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </g>
          <rect x={165} y={GY - 44} width={4} height={4} fill={C.stoneD} />
          <Smoke x={167} y={GY - 48} anim={anim} count={2} />
        </g>
      </Stagger>

      {/* Conveyor belt */}
      <Stagger i={4} anim={anim}>
        <ConveyorBelt x1={460} y1={GY - 8} x2={555} y2={GY - 42} anim={anim} />
      </Stagger>

      {/* Processing shed */}
      <Stagger i={5} anim={anim}>
        <g>
          <rect x={60} y={GY - 50} width={70} height={50} fill={C.stone} rx={2} />
          <rect x={58} y={GY - 54} width={74} height={5} fill={C.stoneD} rx={1} />
          <rect x={68} y={GY - 44} width={10} height={8} fill={C.glass} rx={1} />
          <rect x={88} y={GY - 44} width={10} height={8} fill={C.glass} rx={1} />
          <rect x={108} y={GY - 44} width={10} height={8} fill={C.glass} rx={1} />
          <rect x={82} y={GY - 20} width={18} height={20} fill={C.stoneD} rx={1} />
          <rect x={122} y={GY - 58} width={5} height={10} fill={C.stoneD} />
          <Smoke x={124} y={GY - 60} anim={anim} count={2} />
        </g>
      </Stagger>

      {/* Workers */}
      <Stagger i={6} anim={anim}>
        <Digger x={310} anim={anim} claimActive={claimActive} />
        <Digger x={380} facingRight={false} anim={anim} claimActive={claimActive} />
        <Worker x={490} color={C.shirt1} />
        <Worker x={530} />
        <Worker x={680} color={C.shirt2} />
      </Stagger>

      {/* Sluice box near river */}
      <Stagger i={7} anim={anim}>
        <SluiceBox x={610} anim={anim} />
      </Stagger>

      {/* Gold stacks */}
      <Stagger i={8} anim={anim}>
        <GoldStacks x={100} y={GY - 2} size="md" isDark={isDark} />
      </Stagger>

      {/* Claim burst */}
      <ClaimBurst active={claimActive} cx={340} cy={GY - 30} />
    </g>
  );
}
