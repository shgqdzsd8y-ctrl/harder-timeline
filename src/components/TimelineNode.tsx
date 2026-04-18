import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { TimelineNode as TimelineNodeT } from '../types';
import { PX_PER_YEAR, yearToX } from './Timeline';
import NodeDialog from './NodeDialog';
import ConfidenceDots from './ConfidenceDots';
import { useUIStore } from '../state/ui';

type Props = {
  node: TimelineNodeT;
  laneColor: string;
  laneCenterY: number;
};

function formatYears(node: TimelineNodeT): string {
  if (node.yearEnd && node.yearEnd !== node.year) {
    return `${node.uncertain ? 'c. ' : ''}${node.year}\u2013${node.yearEnd}`;
  }
  return `${node.uncertain ? 'c. ' : ''}${node.year}`;
}

export default function TimelineNode({ node, laneColor, laneCenterY }: Props) {
  const [hovered, setHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    flashingNodeId,
    minConfidence,
    hoveredPlaceId,
    setHoveredNode,
    setHoveredPlace,
  } = useUIStore();

  const x = yearToX(node.year);
  const isRange = !!node.yearEnd && node.yearEnd !== node.year;
  const rangeWidth = isRange
    ? Math.max((node.yearEnd! - node.year) * PX_PER_YEAR, 8)
    : 0;

  const confidence = node.confidence ?? 1;
  const filtered = confidence < minConfidence;

  // Highlight when another component hovers this node's place.
  const placeHighlight = !!node.placeId && node.placeId === hoveredPlaceId;

  const handleClick = (e: React.MouseEvent) => {
    if (filtered) return;
    if (node.url) return;
    e.preventDefault();
    history.replaceState(null, '', `#${node.id}`);
    setDialogOpen(true);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    setHoveredNode(node.id);
    if (node.placeId) setHoveredPlace(node.placeId);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setHoveredNode(null);
    if (node.placeId) setHoveredPlace(null);
  };

  const isFlashing = flashingNodeId === node.id;

  const InnerPoint = (
    <motion.div
      className="relative cursor-pointer"
      style={{ width: 16, height: 16 }}
      whileHover={filtered ? {} : { scale: 1.25 }}
      whileTap={filtered ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
    >
      {/* Deep-link flash ring */}
      {isFlashing && (
        <div
          className="node-flash-ring"
          style={{ background: laneColor }}
        />
      )}
      {/* Pulsing halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: laneColor }}
        animate={
          hovered && !filtered
            ? { scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }
            : { scale: 1, opacity: 0 }
        }
        transition={{
          duration: 1.4,
          repeat: hovered && !filtered ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      {/* Place-hover glow ring */}
      {placeHighlight && !hovered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: laneColor }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: laneColor, opacity: 0.25 }}
      />
      {/* Solid core */}
      <div
        className="absolute rounded-full"
        style={{
          left: 3,
          top: 3,
          width: 10,
          height: 10,
          background: laneColor,
          boxShadow:
            hovered || placeHighlight
              ? `0 0 24px ${laneColor}, 0 0 8px ${laneColor}`
              : `0 0 10px ${laneColor}80`,
        }}
      />
    </motion.div>
  );

  const triggerProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave,
    onClick: handleClick,
    className:
      'absolute flex -translate-y-1/2 items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 rounded-full',
    style: {
      left: x - 8,
      top: laneCenterY,
      opacity: filtered ? 0.15 : 1,
      transition: 'opacity 0.2s',
      pointerEvents: filtered ? ('none' as const) : ('auto' as const),
    } as React.CSSProperties,
  };

  return (
    <>
      {/* Uncertainty / range band */}
      {isRange && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: x,
            top: laneCenterY - 14,
            width: rangeWidth,
            height: 28,
            background: `linear-gradient(90deg, ${laneColor}30, ${laneColor}15 50%, ${laneColor}30)`,
            borderRadius: 999,
            outline: node.uncertain ? `1px dashed ${laneColor}80` : 'none',
            opacity: filtered ? 0.15 : 1,
            transition: 'opacity 0.2s',
          }}
        />
      )}

      {/* Confidence dots below the node */}
      {!filtered && (
        <div
          className="absolute pointer-events-none flex justify-center"
          style={{
            left: x - 8,
            top: laneCenterY + 12,
            width: 16,
          }}
        >
          <ConfidenceDots value={confidence} color={laneColor} />
        </div>
      )}

      <Tooltip.Provider delayDuration={120}>
        <Tooltip.Root open={hovered && !filtered} onOpenChange={() => {}}>
          <Tooltip.Trigger asChild>
            {node.url ? (
              <a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                {...triggerProps}
              >
                {InnerPoint}
              </a>
            ) : (
              <button type="button" {...triggerProps}>
                {InnerPoint}
              </button>
            )}
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              sideOffset={12}
              className="z-50 max-w-[280px] rounded-lg border border-ink-700 bg-ink-900/95 px-3 py-2 text-sm shadow-xl backdrop-blur"
            >
              <div className="font-medium text-ink-100">{node.title}</div>
              <div className="mt-0.5 text-xs text-ink-500">
                {formatYears(node)}
              </div>
              {node.url && (
                <div className="mt-1 text-[11px] uppercase tracking-wider text-ink-500">
                  {'Opens in new tab \u2197'}
                </div>
              )}
              <Tooltip.Arrow className="fill-ink-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      <NodeDialog
        node={node}
        laneColor={laneColor}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
