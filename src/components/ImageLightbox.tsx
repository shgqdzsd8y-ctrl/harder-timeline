import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  src: string;
  alt: string;
  laneColor: string;
};

export default function ImageLightbox({ src, alt, laneColor }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative mt-4 w-full overflow-hidden rounded-lg border border-ink-700 bg-ink-950/50"
        style={{ maxHeight: 180 }}
        aria-label="View full image"
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
          style={{ maxHeight: 180 }}
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full border border-white/30 bg-black/50 p-2 backdrop-blur-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7" />
            </svg>
          </div>
        </div>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="fixed left-1/2 top-1/2 z-[70] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-ink-700 bg-ink-950 shadow-2xl"
                >
                  <Dialog.Title className="sr-only">{alt}</Dialog.Title>
                  <Dialog.Description className="sr-only">{alt}</Dialog.Description>
                  <div className="relative">
                    <img
                      src={src}
                      alt={alt}
                      className="h-auto max-h-[80vh] w-full object-contain"
                    />
                    <Dialog.Close asChild>
                      <button
                        className="absolute right-3 top-3 rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                        aria-label="Close"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </Dialog.Close>
                  </div>
                  {alt && (
                    <div
                      className="border-t border-ink-800 px-4 py-2.5 text-xs text-ink-400"
                      style={{ borderColor: `${laneColor}22` }}
                    >
                      {alt}
                    </div>
                  )}
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
}
