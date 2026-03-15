import { GY, C, type SceneProps } from './shared';
import {
  Stagger,
  OpenPit,
  ConveyorBelt,
  Warehouse,
  LightTower,
  Truck,
  Digger,
  Worker,
  GoldStacks,
  ClaimBurst,
} from './elements';

/** Level 5 -- Gold Empire (industrial-scale concession) */
export function GoldEmpireScene({ anim, isDark, claimActive }: SceneProps) {
  return (
    <g>
      {/* Perimeter fence (full) */}
      <Stagger i={0} anim={anim}>
        <g>
          <line
            x1={15}
            y1={GY - 4}
            x2={785}
            y2={GY - 4}
            stroke={C.stoneD}
            strokeWidth={1}
            strokeDasharray="8,5"
            opacity={0.6}
          />
          {[15, 80, 145, 210, 280, 350, 420, 490, 560, 630, 700, 785].map((fx) => (
            <line
              key={fx}
              x1={fx}
              y1={GY - 4}
              x2={fx}
              y2={GY - 14}
              stroke={C.stoneD}
              strokeWidth={1.5}
            />
          ))}
        </g>
      </Stagger>

      {/* Office building (glass) */}
      <Stagger i={1} anim={anim}>
        <g>
          <rect x={30} y={GY - 100} width={72} height={100} fill={C.glass} rx={2} />
          <rect x={28} y={GY - 104} width={76} height={6} fill={C.stoneD} rx={1} />
          {[0, 1, 2, 3, 4, 5, 6].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={36 + col * 22}
                y={GY - 96 + row * 13}
                width={16}
                height={9}
                rx={1}
                fill={row % 2 === 0 ? C.glassD : C.glass}
                opacity={0.8}
              />
            )),
          )}
          <rect x={30} y={GY - 100} width={18} height={100} fill={C.white} opacity={0.1} rx={2} />
          <rect x={54} y={GY - 18} width={18} height={18} fill={C.glassD} rx={1} />
        </g>
      </Stagger>

      {/* Road */}
      <Stagger i={2} anim={anim}>
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

      {/* Helipad */}
      <Stagger i={3} anim={anim}>
        <g>
          <circle cx={155} cy={GY - 2} r={28} fill={C.stone} />
          <circle cx={155} cy={GY - 2} r={26} fill="none" stroke={C.white} strokeWidth={2} />
          <text
            x={155}
            y={GY + 3}
            textAnchor="middle"
            fill={C.white}
            fontSize="18"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            H
          </text>
        </g>
      </Stagger>

      {/* Helicopter */}
      <Stagger i={4} anim={anim}>
        <g transform={`translate(155, ${GY - 55})`}>
          {anim && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`155,${GY - 55};155,${GY - 60};155,${GY - 55}`}
              dur="2.5s"
              repeatCount="indefinite"
            />
          )}
          <ellipse cx={0} cy={0} rx={18} ry={7} fill={C.stoneD} />
          <ellipse cx={-5} cy={-1} rx={6} ry={4} fill={C.glass} />
          <rect x={16} y={-2} width={22} height={4} fill={C.stone} rx={1} />
          <rect x={36} y={-7} width={2} height={10} fill={C.stone} />
          <line x1={37} y1={-9} x2={37} y2={3} stroke={C.metal} strokeWidth={1.2} />
          <line
            x1={-28}
            y1={-9}
            x2={28}
            y2={-9}
            stroke={C.stoneD}
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            {anim && (
              <animate
                attributeName="opacity"
                values="1;0.4;1"
                dur="0.15s"
                repeatCount="indefinite"
              />
            )}
          </line>
          <circle cx={0} cy={-9} r={2} fill={C.metal} />
          <line x1={-10} y1={7} x2={10} y2={7} stroke={C.stoneD} strokeWidth={1.5} />
          <line x1={-7} y1={4.5} x2={-7} y2={7} stroke={C.stoneD} strokeWidth={1.2} />
          <line x1={7} y1={4.5} x2={7} y2={7} stroke={C.stoneD} strokeWidth={1.2} />
        </g>
      </Stagger>

      {/* Quarry pit */}
      <Stagger i={5} anim={anim}>
        <OpenPit x={230} w={260} depth={52} />
      </Stagger>

      {/* Conveyors */}
      <Stagger i={6} anim={anim}>
        <ConveyorBelt x1={195} y1={GY - 5} x2={240} y2={GY - 32} anim={anim} />
        <ConveyorBelt x1={480} y1={GY - 5} x2={545} y2={GY - 35} anim={anim} />
      </Stagger>

      {/* Warehouses */}
      <Stagger i={7} anim={anim}>
        <Warehouse x={560} w={52} />
        <Warehouse x={680} w={52} />
      </Stagger>

      {/* Gold bar stacks */}
      <Stagger i={8} anim={anim}>
        <GoldStacks x={640} y={GY - 2} size="lg" isDark={isDark} />
        <GoldStacks x={670} y={GY - 2} size="md" isDark={isDark} />
      </Stagger>

      {/* Light towers */}
      <Stagger i={9} anim={anim}>
        <LightTower x={120} isDark={isDark} />
        <LightTower x={745} isDark={isDark} />
      </Stagger>

      {/* Truck */}
      <Stagger i={10} anim={anim}>
        <Truck
          baseX={350}
          baseY={GY + 13}
          anim={anim}
          dur="11s"
          range={`120,${GY + 13};650,${GY + 13};120,${GY + 13}`}
        />
      </Stagger>

      {/* Workers (7) */}
      <Stagger i={11} anim={anim}>
        <Digger x={300} anim={anim} claimActive={claimActive} />
        <Digger x={420} facingRight={false} anim={anim} claimActive={claimActive} />
        <Worker x={200} />
        <Worker x={530} color={C.shirt1} />
        <Worker x={620} color={C.shirt2} />
        <Worker x={710} />
        <Worker x={770} color={C.shirt1} />
      </Stagger>

      {/* Claim burst */}
      <ClaimBurst active={claimActive} cx={360} cy={GY - 30} />
    </g>
  );
}
