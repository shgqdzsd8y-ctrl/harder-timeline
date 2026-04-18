import { useMemo } from 'react';
import { timeline } from '../data/timeline';
import YearRuler from './YearRuler';
import LaneRow from './LaneRow';
import JoinsLayer from './JoinsLayer';
import { useScrollRef } from '../state/scroll';

export const PX_PER_YEAR = 44;
export const LABEL_WIDTH = 160;
export const RULER_HEIGHT = 56;
export const LANE_HEIGHT = 170;

export function yearToX(year: number): number {
  return (year - timeline.minYear) * PX_PER_YEAR;
}

export function laneYCenter(laneIndex: number): number {
  return RULER_HEIGHT + laneIndex * LANE_HEIGHT + LANE_HEIGHT / 2;
}

export default function Timeline() {
  // Reads the ref provided by App via ScrollRefContext.
  const scrollRef = useScrollRef();

  const totalWidth = useMemo(
    () => (timeline.maxYear - timeline.minYear) * PX_PER_YEAR,
    [],
  );
  const totalHeight = useMemo(
    () => RULER_HEIGHT + timeline.lanes.length * LANE_HEIGHT + 40,
    [],
  );

  return (
    <div
      ref={scrollRef ?? undefined}
      className="timeline-scroll w-full overflow-x-auto overflow-y-hidden border-y border-ink-800 bg-ink-950"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div
        className="relative"
        style={{
          width: LABEL_WIDTH + totalWidth + 40,
          height: totalHeight,
        }}
      >
        <YearRuler />
        {timeline.lanes.map((lane, i) => (
          <LaneRow key={lane.id} lane={lane} laneIndex={i} />
        ))}
        <JoinsLayer />
      </div>
    </div>
  );
}
