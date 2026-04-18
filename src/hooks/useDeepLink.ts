import { useEffect } from 'react';
import { timeline } from '../data/timeline';
import { useUIStore } from '../state/ui';
import { useScrollRef } from '../state/scroll';
import { LABEL_WIDTH, yearToX } from '../components/Timeline';

function scrollToNode(nodeId: string, container: HTMLDivElement) {
  const node = timeline.nodes.find((n) => n.id === nodeId);
  if (!node) return;
  const nodeX = LABEL_WIDTH + yearToX(node.year);
  const targetScrollLeft = nodeX - container.clientWidth / 2;
  container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
}

export function useDeepLink() {
  const { setFlashingNode } = useUIStore();
  const scrollRefCtx = useScrollRef();

  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const container = scrollRefCtx?.current;
      if (!container) return;

      // Give the timeline a tick to fully render before scrolling.
      requestAnimationFrame(() => {
        scrollToNode(hash, container);
        setFlashingNode(hash);
        setTimeout(() => setFlashingNode(null), 1400);
      });
    }

    // Check on mount.
    handleHash();

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRefCtx]);
}
