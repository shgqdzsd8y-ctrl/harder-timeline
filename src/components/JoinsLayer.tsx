import { timeline } from '../data/timeline';
import {
  LABEL_WIDTH,
  LANE_HEIGHT,
  RULER_HEIGHT,
  yearToX,
} from './Timeline';

type JoinPath = {
  id: string;
  d: string;
  fromColor: string;
  toColor: string;
};

export default function JoinsLayer() {
  const laneIndex: Record<string, number> = {};
  timeline.lanes.forEach((l, i) => {
    laneIndex[l.id] = i;
  });

  const paths: JoinPath[] = [];

  for (const node of timeline.nodes) {
    if (!node.joinsInto) continue;
    const fromLane = timeline.lanes.find((l) => l.id === node.laneId);
    const toLane = timeline.lanes.find((l) => l.id === node.joinsInto!.laneId);
    if (!fromLane || !toLane) continue;

    const x1 = yearToX(node.year);
    const y1 = RULER_HEIGHT + laneIndex[node.laneId] * LANE_HEIGHT + LANE_HEIGHT / 2;
    const x2 = yearToX(node.joinsInto.atYear);
    const y2 =
      RULER_HEIGHT +
      laneIndex[node.joinsInto.laneId] * LANE_HEIGHT +
      LANE_HEIGHT / 2;

    // Cubic bezier with horizontal tangents for a graceful merge.
    const dx = Math.max(Math.abs(x2 - x1), 60);
    const c1x = x1 + dx * 0.5;
    const c1y = y1;
    const c2x = x2 - dx * 0.5;
    const c2y = y2;

    paths.push({
      id: node.id,
      d: `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`,
      fromColor: fromLane.color,
      toColor: toLane.color,
    });
  }

  if (paths.length === 0) return null;

  const totalWidth = yearToX(timeline.maxYear) + 40;
  const totalHeight = RULER_HEIGHT + timeline.lanes.length * LANE_HEIGHT + 40;

  return (
    <svg
      className="pointer-events-none absolute top-0"
      style={{ left: LABEL_WIDTH, width: totalWidth, height: totalHeight }}
      width={totalWidth}
      height={totalHeight}
    >
      <defs>
        {paths.map((p) => (
          <linearGradient
            key={p.id}
            id={`join-${p.id}`}
            gradientUnits="userSpaceOnUse"
            x1="0%"
            x2="100%"
          >
            <stop offset="0%" stopColor={p.fromColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={p.toColor} stopOpacity="0.85" />
          </linearGradient>
        ))}
      </defs>
      {paths.map((p) => (
        <g key={p.id}>
          <path
            d={p.d}
            fill="none"
            stroke={`url(#join-${p.id})`}
            strokeWidth={2}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${p.fromColor}55)` }}
          />
        </g>
      ))}
    </svg>
  );
}
