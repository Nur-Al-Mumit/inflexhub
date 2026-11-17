/**
 * Container (V1-1): the site's horizontal rhythm — max width and gutters from
 * design-system §5 (1240 px, 24 px gutters, 16 px under 400 px).
 */

import type { ReactNode } from "react";
import styles from "./Container.module.css";

export type ContainerProps = {
  as?: "div" | "section" | "footer" | "header";
  children: ReactNode;
  className?: string;
};

export function Container({
  as: Tag = "div",
  children,
  className,
}: ContainerProps) {
  return (
    <Tag className={[styles.container, className ?? ""].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
