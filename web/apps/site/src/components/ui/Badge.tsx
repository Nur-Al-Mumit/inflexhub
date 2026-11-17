/**
 * Badge (V1-1): small neutral label for meta information.
 */

import type { ReactNode } from "react";
import styles from "./Badge.module.css";

export type BadgeProps = {
  children: ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return <span className={styles.badge}>{children}</span>;
}
