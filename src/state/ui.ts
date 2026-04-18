import { create } from 'zustand';

interface UIState {
  hoveredNodeId: string | null;
  flashingNodeId: string | null;
  hoveredPlaceId: string | null;
  minConfidence: 1 | 2 | 3;
  setHoveredNode: (id: string | null) => void;
  setFlashingNode: (id: string | null) => void;
  setHoveredPlace: (id: string | null) => void;
  setMinConfidence: (v: 1 | 2 | 3) => void;
}

export const useUIStore = create<UIState>((set) => ({
  hoveredNodeId: null,
  flashingNodeId: null,
  hoveredPlaceId: null,
  minConfidence: 1,
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  setFlashingNode: (id) => set({ flashingNodeId: id }),
  setHoveredPlace: (id) => set({ hoveredPlaceId: id }),
  setMinConfidence: (v) => set({ minConfidence: v }),
}));
