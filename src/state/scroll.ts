import { createContext, useContext } from 'react';
import type { RefObject } from 'react';

export const ScrollRefContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useScrollRef() {
  return useContext(ScrollRefContext);
}
