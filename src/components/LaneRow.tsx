import type { Lane } from '../types';
import { timeline } from '../data/timeline';
import TimelineNode from './TimelineNode';
import {
  LABEL_WIDTH,
  LANE_HEIGHT,
  RULER_HEIGHT,
  yearToX,
} from './Timeline';

type Props = {
  lane: Lane;
  laneIndex: number;
};

export default function LaneRow({ lane, laneIndex }: Props) {
  const top = RULER_HEIGHT + laneIndex * LANE_HEIGHT;
  const laneNodes = timeline.nodes.filter((n) => n.laneId === lane.id);

  return (
    <>
      {/* Sticky left label */}
      <div
        className="z-20 flex items-center pl-5 pr-3"
        style={{
          position: 'sticky',
          left: 0,
          top,
          width: LABEL_WIDTH,
          height: LANE_HEIGHT,
          background:
            'linear-gradient(to right, rgba(11,13,16,1) 75%, rgba(11,13,16,0))',
          pointerEvents: 'none',
        }}
      >
        <div className="flex flex-col gap-1">
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: lane.color, boxShadow: `0 0 18px ${lane.color}80` }}
          />
          <div
            className="font-serif text-xl font-semibold"
            style={{ color: lane.color }}
          >
            {lane.label}
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Line
          </div>
        </div>
      </div>

      {/* Lane baseline segments */}
      <div
        className="absolute"
        style={{
          left: LABEL_WIDTH,
          top,
          height: LANE_HEIGHT,
          width: yearToX(timeline.maxYear) + 40,
        }}
      >
        {lane.segments.map((seg, idx) => {
          const startX = yearToX(seg.fromYear);
          const endX = yearToX(seg.toYear);
          const width = Math.max(endX - startX, 1);
          const common: React.CSSProperties = {
            position: 'absolute',
            left: startX,
            top: LANE_HEIGHT / 2 - 1,
            width,
            height: 2,
          };
          if (seg.style === 'solid') {
            return (
              <div
                key={idx}
                style={{
                  ...common,
                  background: lane.color,
                  boxShadow: `0 0 12px ${lane.color}55`,
                  opacity: 0.85,
                }}
              />
            );
          }
          if (seg.style === 'sub') {
            return (
              <div
                key={idx}
                style={{
                  ...common,
                  height: 1,
                  background: lane.color,
                  opacity: 0.45,
                }}
              />
            );
          }
          // dotted
          return (
            <div
              key={idx}
              style={{
                ...common,
                height: 0,
                borderTop: `1.5px dotted ${lane.color}`,
                opacity: 0.5,
                background: 'transparent',
              }}
            />
          );
        })}

        {/* Nodes */}
        {laneNodes.map((node) => (
          <TimelineNode
            key={node.id}
            node={node}
            laneColor={lane.color}
            laneCenterY={LANE_HEIGHT / 2}
          />
        ))}
      </div>
    </>
  );
}
