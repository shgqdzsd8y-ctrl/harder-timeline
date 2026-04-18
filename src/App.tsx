import { useRef } from 'react';
import Timeline from './components/Timeline';
import FilterBar from './components/FilterBar';
import Minimap from './components/Minimap';
import GeoMap from './components/GeoMap';
import { ScrollRefContext } from './state/scroll';
import { useDeepLink } from './hooks/useDeepLink';

const DOT = '\u00b7';

function AppInner() {
  // Wire up deep-link (reads hash on mount, flashes + scrolls to node).
  useDeepLink();

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      <header className="mx-auto max-w-6xl px-6 pt-10 pb-4">
        <div className="mb-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-ink-500">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-200/80" />
          A working document
        </div>
        <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
          <span style={{ color: '#e0b46c' }}>Harder</span>
          <span className="mx-3 text-ink-500">{DOT}</span>
          <span style={{ color: '#8fb3ff' }}>Rowe</span>
          <span className="mx-3 text-ink-500">{DOT}</span>
          <span style={{ color: '#9c88ff' }}>Graves</span>
          <span className="ml-3 text-ink-200">migrations</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
          Hover a node to pulse it. Click for sources and notes. Confidence
          dots (●●●) mark how well-cited each event is. The minimap at the
          bottom scrubs to any year. The geography panel (bottom-right) pins
          every location.
        </p>
      </header>

      <FilterBar />

      {/* Extra bottom padding so Minimap doesn't cover the footer */}
      <div className="pb-20">
        <Timeline />
      </div>

      <footer className="mx-auto max-w-6xl px-6 py-6 pb-24 text-xs text-ink-500">
        v0.2 {DOT} Add lanes, nodes, and sources by editing{' '}
        <code className="rounded bg-ink-800 px-1.5 py-0.5 text-ink-200">
          src/data/timeline.ts
        </code>
        . Share any event by clicking its link icon, or visit{' '}
        <code className="rounded bg-ink-800 px-1.5 py-0.5 text-ink-200">
          /#node-id
        </code>
        .
      </footer>

      {/* Fixed overlays */}
      <Minimap />
      <GeoMap />
    </div>
  );
}

export default function App() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <ScrollRefContext.Provider value={scrollRef}>
      <AppInner />
    </ScrollRefContext.Provider>
  );
}
