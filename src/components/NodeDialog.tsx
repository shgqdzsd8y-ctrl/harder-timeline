import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import type { TimelineNode } from '../types';
import ImageLightbox from './ImageLightbox';
import Comments from './Comments';

type Props = {
  node: TimelineNode;
  laneColor: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatYears(node: TimelineNode): string {
  const prefix = node.uncertain ? 'c. ' : '';
  if (node.yearEnd && node.yearEnd !== node.year) {
    return `${prefix}${node.year}\u2013${node.yearEnd}`;
  }
  return `${prefix}${node.year}`;
}

export default function NodeDialog({
  node,
  laneColor,
  open,
  onOpenChange,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url =
      window.location.origin +
      window.location.pathname +
      '#' +
      node.id;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-ink-700 bg-ink-900/95 shadow-2xl backdrop-blur"
                style={{
                  boxShadow: `0 30px 80px -20px ${laneColor}30, 0 0 0 1px ${laneColor}22`,
                  /* Grain texture over the dialog */
                  backgroundImage: `url('/noise.svg'), linear-gradient(to bottom, rgba(17,20,26,0.97), rgba(17,20,26,0.97))`,
                  backgroundRepeat: 'repeat, no-repeat',
                  backgroundSize: '256px 256px, 100% 100%',
                  backgroundBlendMode: 'overlay, normal',
                }}
              >
                {/* Scrollable content */}
                <div className="max-h-[85vh] overflow-y-auto p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        className="mb-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em]"
                        style={{ color: laneColor }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: laneColor,
                            boxShadow: `0 0 12px ${laneColor}`,
                          }}
                        />
                        {node.laneId}
                      </div>
                      <Dialog.Title className="font-serif text-2xl font-semibold text-ink-100">
                        {node.title}
                      </Dialog.Title>
                      <div className="mt-1 text-sm text-ink-500">
                        {formatYears(node)}
                        {node.uncertain && (
                          <span className="ml-2 rounded-full border border-ink-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-500">
                            uncertain
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex shrink-0 items-center gap-1">
                      {/* Copy link */}
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        title="Copy link to this event"
                        className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-800 hover:text-ink-100"
                        aria-label="Copy link"
                      >
                        {copied ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        )}
                      </button>

                      {/* Close */}
                      <Dialog.Close asChild>
                        <button
                          className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-800 hover:text-ink-100"
                          aria-label="Close"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>

                  {node.description && (
                    <Dialog.Description className="mt-5 text-[15px] leading-relaxed text-ink-200">
                      {node.description}
                    </Dialog.Description>
                  )}

                  {/* Image slot */}
                  {node.imageUrl && (
                    <ImageLightbox
                      src={node.imageUrl}
                      alt={node.imageAlt ?? node.title}
                      laneColor={laneColor}
                    />
                  )}

                  {/* Sources */}
                  <div className="mt-6">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-ink-500">
                      Sources
                    </div>
                    <ul className="space-y-2">
                      {node.sources.map((s, i) => (
                        <li
                          key={i}
                          className="rounded-lg border border-ink-800 bg-ink-950/60 px-3 py-2"
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <div className="text-sm text-ink-100">{s.label}</div>
                            {s.url && (
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 text-[11px] uppercase tracking-wider"
                                style={{ color: laneColor }}
                              >
                                {'View \u2197'}
                              </a>
                            )}
                          </div>
                          {s.note && (
                            <div className="mt-1 text-xs text-ink-500">{s.note}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Comments */}
                  <Comments nodeId={node.id} laneColor={laneColor} open={open} />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
