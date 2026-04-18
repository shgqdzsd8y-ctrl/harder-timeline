import { useCallback, useEffect, useRef, useState } from 'react';
import { timeline } from '../data/timeline';
import { useScrollRef } from '../state/scroll';
import { useUIStore } from '../state/ui';
import { LABEL_WIDTH, PX_PER_YEAR, yearToX } from './Timeline';

const MINIMAP_HEIGHT = 64;
const LANE_STRIP_H = 8;
const LANE_GAP = 3;
const STRIP_TOP_PAD = 12;

export default function Minimap() {
  const scrollRefCtx = useScrollRef();
  const { minConfidence } = useUIStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pxPerYear, setPxPerYear] = useState(1);
  const [viewportRect, setViewportRect] = useState({ left: 0, width: 50 });
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Compute pxPerYear from the container width.
  const updatePxPerYear = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const trackWidth = el.clientWidth - LABEL_WIDTH;
    setPxPerYear(trackWidth / (timeline.maxYear - timeline.minYear));
  }, []);

  // Sync viewport rectangle from scroll position.
  const syncViewport = useCallback(() => {
    const container = scrollRefCtx?.current;
    if (!container) return;
    const el = containerRef.current;
    if (!el) return;
    const trackWidth = el.clientWidth - LABEL_WIDTH;
    const ratio = trackWidth / (timeline.maxYear - timeline.minYear) / PX_PER_YEAR;
    const left = LABEL_WIDTH + container.scrollLeft * ratio;
    const width = Math.min(container.clientWidth * ratio, trackWidth);
    setViewportRect({ left, width: Math.max(width, 12) });
  }, [scrollRefCtx]);

  useEffect(() => {
    updatePxPerYear();
    const observer = new ResizeObserver(updatePxPerYear);
    if (containerRef.current) observer.observe(containerRef.current);

    const container = scrollRefCtx?.current;
    if (!container) return () => observer.disconnect();

    const onScroll = () => {
      requestAnimationFrame(syncViewport);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    syncViewport();

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', onScroll);
    };
  }, [scrollRefCtx, syncViewport, updatePxPerYear]);

  // Recompute whenever pxPerYear changes (resize).
  useEffect(() => {
    syncViewport();
  }, [pxPerYear, syncViewport]);

  const scrollToMinimapX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      const container = scrollRefCtx?.current;
      if (!el || !container) return;
      const rect = el.getBoundingClientRect();
      const minimapX = clientX - rect.left - LABEL_WIDTH;
      const trackWidth = el.clientWidth - LABEL_WIDTH;
      const fraction = minimapX / trackWidth;
      const targetYear =
        timeline.minYear + fraction * (timeline.maxYear - timeline.minYear);
      const targetScrollLeft =
        (targetYear - timeline.minYear) * PX_PER_YEAR -
        container.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
    },
    [scrollRefCtx],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragging.current = true;
      dragStartX.current = e.clientX;
      dragStartScroll.current = scrollRefCtx?.current?.scrollLeft ?? 0;
    },
    [scrollRefCtx],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const el = containerRef.current;
      const container = scrollRefCtx?.current;
      if (!el || !container) return;
      const trackWidth = el.clientWidth - LABEL_WIDTH;
      const dx = e.clientX - dragStartX.current;
      const scrollDx = (dx / trackWidth) * (timeline.maxYear - timeline.minYear) * PX_PER_YEAR;
      container.scrollLeft = dragStartScroll.current + scrollDx;
      syncViewport();
    },
    [scrollRefCtx, syncViewport],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      // If the click was on the viewport rect itself, skip.
      if ((e.target as HTMLElement).dataset.vpRect) return;
      scrollToMinimapX(e.clientX);
    },
    [scrollToMinimapX],
  );

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-800 bg-ink-950/90 backdrop-blur-sm"
      style={{ height: MINIMAP_HEIGHT }}
      onClick={handleTrackClick}
    >
      {/* Left label gutter */}
      <div
        className="absolute left-0 top-0 flex h-full items-center pl-3 text-[9px] uppercase tracking-[0.2em] text-ink-500"
        style={{ width: LABEL_WIDTH, pointerEvents: 'none' }}
      >
        Overview
      </div>

      {/* Lane strips + node dots */}
      <div
        className="absolute top-0"
        style={{ left: LABEL_WIDTH, right: 0, height: MINIMAP_HEIGHT, overflow: 'hidden' }}
      >
        {timeline.lanes.map((lane, laneIdx) => {
          const laneTop = STRIP_TOP_PAD + laneIdx * (LANE_STRIP_H + LANE_GAP);
          const laneNodes = timeline.nodes.filter(
            (n) => n.laneId === lane.id && (n.confidence ?? 1) >= minConfidence,
          );
          return (
            <div key={lane.id}>
              {/* Lane baseline */}
              <div
                className="absolute"
                style={{
                  left: yearToX(
                    lane.segments[0]?.fromYear ?? timeline.minYear,
                  ) * pxPerYear / PX_PER_YEAR,
                  top: laneTop + LANE_STRIP_H / 2 - 0.5,
                  width:
                    (yearToX(
                      lane.segments[lane.segments.length - 1]?.toYear ?? timeline.maxYear,
                    ) -
                      yearToX(lane.segments[0]?.fromYear ?? timeline.minYear)) *
                    pxPerYear / PX_PER_YEAR,
                  height: 1,
                  background: lane.color,
                  opacity: 0.4,
                  pointerEvents: 'none',
                }}
              />
              {/* Node dots */}
              {laneNodes.map((node) => (
                <div
                  key={node.id}
                  className="absolute rounded-full"
                  style={{
                    left: (yearToX(node.year) * pxPerYear) / PX_PER_YEAR - 2,
                    top: laneTop + LANE_STRIP_H / 2 - 2,
                    width: 4,
                    height: 4,
                    background: lane.color,
                    boxShadow: `0 0 4px ${lane.color}`,
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </div>
          );
        })}

        {/* Decade tick marks */}
        {Array.from({ length: Math.floor((timeline.maxYear - timeline.minYear) / 10) + 1 }, (_, i) => {
          const year = timeline.minYear + i * 10;
          return (
            <div
              key={year}
              className="absolute text-[8px] text-ink-500"
              style={{
                left: (yearToX(year) * pxPerYear) / PX_PER_YEAR,
                top: MINIMAP_HEIGHT - 16,
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {year}
            </div>
          );
        })}

        {/* Draggable viewport rectangle */}
        <div
          data-vp-rect="true"
          className="absolute top-0 rounded"
          style={{
            left: viewportRect.left - LABEL_WIDTH,
            width: viewportRect.width,
            height: MINIMAP_HEIGHT - 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'ew-resize',
            backdropFilter: 'invert(0.08)',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
}
