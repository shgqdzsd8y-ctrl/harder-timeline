import { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { locations } from '../data/locations';
import { timeline } from '../data/timeline';
import { useUIStore } from '../state/ui';
import { useScrollRef } from '../state/scroll';
import { LABEL_WIDTH, yearToX } from './Timeline';

// Count how many nodes reference each place.
const nodeCounts: Record<string, number> = {};
for (const node of timeline.nodes) {
  if (node.placeId) nodeCounts[node.placeId] = (nodeCounts[node.placeId] ?? 0) + 1;
}

function scrollToPlace(placeId: string, container: HTMLDivElement) {
  const earliest = timeline.nodes
    .filter((n) => n.placeId === placeId)
    .sort((a, b) => a.year - b.year)[0];
  if (!earliest) return;
  const nodeX = LABEL_WIDTH + yearToX(earliest.year);
  container.scrollTo({ left: Math.max(0, nodeX - container.clientWidth / 2), behavior: 'smooth' });
}

export default function GeoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('geomap-collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mapError, setMapError] = useState(false);

  const { hoveredPlaceId, setHoveredPlace } = useUIStore();
  const scrollRefCtx = useScrollRef();

  const toggleCollapse = useCallback(() => {
    setCollapsed((v) => {
      const next = !v;
      try { localStorage.setItem('geomap-collapsed', String(next)); } catch { /* ok */ }
      return next;
    });
  }, []);

  // Init map.
  useEffect(() => {
    if (collapsed || !containerRef.current || mapRef.current) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: 'https://tiles.openfreemap.org/styles/dark',
        center: [-78.5, 44.5],
        zoom: 3.5,
        maxBounds: [
          [-120, 20],
          [20, 62],
        ],
        attributionControl: false,
        logoPosition: 'bottom-left',
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

      map.on('error', () => setMapError(true));

      map.on('load', () => {
        // Add markers.
        for (const loc of locations) {
          const count = nodeCounts[loc.id] ?? 0;
          const size = Math.max(10, Math.min(22, 10 + count * 3));

          const el = document.createElement('div');
          el.dataset.placeId = loc.id;
          el.style.cssText = `
            width:${size}px;height:${size}px;
            border-radius:50%;
            background:#e0b46c;
            border:2px solid rgba(255,255,255,0.3);
            box-shadow:0 0 10px #e0b46c80;
            cursor:pointer;
            transition:transform 0.15s,box-shadow 0.15s;
          `;

          el.title = loc.name;

          el.addEventListener('mouseenter', () => {
            setHoveredPlace(loc.id);
            el.style.transform = 'scale(1.4)';
            el.style.boxShadow = `0 0 18px #e0b46c`;
          });
          el.addEventListener('mouseleave', () => {
            setHoveredPlace(null);
            el.style.transform = '';
            el.style.boxShadow = `0 0 10px #e0b46c80`;
          });
          el.addEventListener('click', () => {
            const container = scrollRefCtx?.current;
            if (container) scrollToPlace(loc.id, container);
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([loc.lng, loc.lat])
            .addTo(map);

          markersRef.current[loc.id] = marker;
        }
      });

      mapRef.current = map;
    } catch {
      setMapError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  // Fly to hovered place.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !hoveredPlaceId) return;
    const loc = locations.find((l) => l.id === hoveredPlaceId);
    if (!loc) return;
    if (!map.isStyleLoaded()) return;
    map.flyTo({ center: [loc.lng, loc.lat], zoom: Math.max(map.getZoom(), 5), speed: 1.2 });

    // Pulse the marker.
    const el = markersRef.current[hoveredPlaceId]?.getElement();
    if (el) {
      el.style.transform = 'scale(1.5)';
      el.style.boxShadow = '0 0 20px #e0b46c';
    }
    return () => {
      if (el) {
        el.style.transform = '';
        el.style.boxShadow = '0 0 10px #e0b46c80';
      }
    };
  }, [hoveredPlaceId]);

  return (
    <div
      className="fixed bottom-16 right-4 z-30 rounded-xl border border-ink-700 bg-ink-900/95 shadow-2xl backdrop-blur overflow-hidden"
      style={{
        width: 320,
        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.7)',
        transition: 'height 0.25s ease',
        height: collapsed ? 42 : 240,
      }}
    >
      {/* Header */}
      <div
        className="flex h-[42px] items-center justify-between px-3"
        style={{ borderBottom: collapsed ? 'none' : '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e0b46c"
            strokeWidth="2"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-400">
            Geography
          </span>
        </div>
        <button
          type="button"
          onClick={toggleCollapse}
          className="rounded p-1 text-ink-500 transition hover:text-ink-200"
          aria-label={collapsed ? 'Expand map' : 'Collapse map'}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>

      {/* Map container */}
      {!collapsed && (
        <div className="relative" style={{ height: 198 }}>
          {mapError ? (
            <div className="flex h-full items-center justify-center text-[12px] text-ink-500">
              Map tiles unavailable offline.
            </div>
          ) : (
            <div ref={containerRef} className="h-full w-full" />
          )}
        </div>
      )}
    </div>
  );
}
