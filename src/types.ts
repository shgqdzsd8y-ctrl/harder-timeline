export type Source = {
  label: string;
  note?: string;
  url?: string;
};

export type TimelineNode = {
  id: string;
  laneId: string;
  title: string;
  year: number;
  yearEnd?: number;
  uncertain?: boolean;
  description?: string;
  url?: string;
  sources: Source[];
  joinsInto?: { laneId: string; atYear: number };
  /** 1 = speculative, 2 = partial, 3 = well-cited. Defaults to 1. */
  confidence?: 1 | 2 | 3;
  /** URL of a primary image (tombstone, census page, petition scan, etc.) */
  imageUrl?: string;
  imageAlt?: string;
  /** References an entry in src/data/locations.ts */
  placeId?: string;
};

export type LaneSegment = {
  fromYear: number;
  toYear: number;
  style: 'solid' | 'sub' | 'dotted';
};

export type Lane = {
  id: string;
  label: string;
  color: string;
  segments: LaneSegment[];
};

export type Timeline = {
  minYear: number;
  maxYear: number;
  lanes: Lane[];
  nodes: TimelineNode[];
};

export type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region?: string;
};
