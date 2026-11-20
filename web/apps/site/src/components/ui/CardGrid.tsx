/**
 * CardGrid (ui-guidelines UI-9): a list grid whose desktop column count
 * matches the number of items (capped at 4), so rows are always full.
 * 1 column on phones, 2 from 640 px, `count` (≤ 4) from 1100 px.
 */

import type { CSSProperties, ReactNode } from "react";
import styles from "./CardGrid.module.css";

export function CardGrid({
  count,
  children,
}: {
  readonly count: number;
  readonly children: ReactNode;
}) {
  const columns = Math.max(1, Math.min(count, 4));
  return (
    <ul className={styles.grid} style={{ "--cols": columns } as CSSProperties}>
      {children}
    </ul>
  );
}
