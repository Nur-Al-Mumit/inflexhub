/**
 * Motion helpers (design-system §6 motion catalogue). The CSS in
 * styles/globals.css reads `--i` to stagger `.enter` and `.revealItem`.
 */

import type { CSSProperties } from "react";

/** Inline style that sets the stagger index for an animated item. */
export function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
