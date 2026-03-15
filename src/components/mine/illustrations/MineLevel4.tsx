import { GY, C, type SceneProps } from './shared';
import {
  Stagger,
  BoundaryFence,
  OpenPit,
  ConveyorBelt,
  Warehouse,
  LightTower,
  Truck,
  Smoke,
  Digger,
  Worker,
  GoldStacks,
  ClaimBurst,
} from './elements';

/** Level 4 -- Mining Camp (large concession, trucks, warehouses) */
export function MiningCampScene({ anim, isDark, claimActive }: SceneProps) {
  return (
    <g>
      {/* Road */}
      <Stagger i={0} anim={anim}>
        <g>
          <rect x={0} y={GY + 8} width={800} height={18} fill={C.road} />
          <line
            x1={0}
            y1={GY + 17}
            x2={800}
            y2={GY + 17}
            stroke={C.roadM}
            strokeWidth={1.2}
            strokeDasharray="22,16"
          />
        </g>
      </Stagger>

      {/* Concession boundary */}
      <Stagger i={1} anim={anim}>
        <BoundaryFence x1={20} x2={780} />
      </Stagger>

      {/* Quarry pit */}
      <Stagger i={2} anim={anim}>
        <OpenPit x={200} w={300} depth={55} />
      </Stagger>

      {/* Conveyors */}
      <Stagger i={3} anim={anim}>
        <ConveyorBelt x1={150} y1={GY - 5} x2={210} y2={GY - 38} anim={anim} />
        <ConveyorBelt x1={490} y1={GY - 5} x2={570} y2={GY - 38} anim={anim} />
      </Stagger>

      {/* Warehouses */}
      <Stagger i={4} anim={anim}>
        <Warehouse x={595} w={58} />
        <Warehouse x={668} w={58} />
      </Stagger>

      {/* Light towers */}
      <Stagger i={5} anim={anim}>
        <LightTower x={65} isDark={isDark} />
        <LightTower x={755} isDark={isDark} />
      </Stagger>

      {/* Trucks */}
      <Stagger i={6} anim={anim}>
        <Truck
          baseX={300}
          baseY={GY + 13}
          anim={anim}
          dur="10s"
          range={`100,${GY + 13};620,${GY + 13};100,${GY + 13}`}
        />
        <Truck
          baseX={500}
          baseY={GY + 13}
          anim={anim}
          dur="12s"
          range={`550,${GY + 13};120,${GY + 13};550,${GY + 13}`}
        />
      </Stagger>

      {/* Excavator near pit */}
      <Stagger i={7} anim={anim}>
        <g>
          <rect x={145} y={GY - 10} width={40} height={10} rx={3} fill={C.stoneD} />
          <rect x={148} y={GY - 24} width={34} height={14} rx={2} fill={C.yellow} />
          <rect x={150} y={GY - 34} width={18} height={10} rx={2} fill={C.yellowD} />
          <rect x={153} y={GY - 32} width={10} height={7} fill={C.glass} rx={1} />
          <g>
            <line
              x1={170}
              y1={GY - 24}
              x2={198}
              y2={GY - 42}
              stroke={C.yellow}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <line
              x1={198}
              y1={GY - 42}
              x2={208}
              y2={GY - 22}
              stroke={C.yellow}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <path
              d={`M203,${GY - 22} L214,${GY - 22} L212,${GY - 14} L200,${GY - 14} Z`}
              fill={C.stoneD}
            />
            {anim && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 170 ${GY - 24};-8 170 ${GY - 24};0 170 ${GY - 24}`}
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </g>
          <Smoke x={157} y={GY - 38} anim={anim} count={2} />
        </g>
      </Stagger>

      {/* Workers (6) */}
      <Stagger i={8} anim={anim}>
        <Digger x={270} anim={anim} claimActive={claimActive} />
        <Digger x={350} facingRight={false} anim={anim} claimActive={claimActive} />
        <Worker x={440} color={C.shirt1} />
        <Worker x={540} />
        <Worker x={590} color={C.shirt1} />
        <Worker x={750} color={C.shirt2} />
      </Stagger>

      {/* Gold stacks */}
      <Stagger i={9} anim={anim}>
        <GoldStacks x={630} y={GY - 2} size="md" isDark={isDark} />
        <GoldStacks x={700} y={GY - 2} size="sm" isDark={isDark} />
      </Stagger>

      {/* Claim burst */}
      <ClaimBurst active={claimActive} cx={310} cy={GY - 30} />
    </g>
  );
}
