/**
 * ButtonLink (V1-1): the Button look on a real link (design-system §7).
 * Links have no loading state; the trailing arrow is available.
 */

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import styles from "./ButtonLink.module.css";

export type ButtonLinkVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "onDarkGhost"
  | "onDarkOutline";

export type ButtonLinkSize = "md" | "lg";

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  arrow?: boolean;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = [styles.button, styles[variant], styles[size], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <a href={href} className={classes} {...rest}>
      <span className={styles.label}>
        {children}
        {arrow ? (
          <ArrowRight aria-hidden="true" size={16} className={styles.arrow} />
        ) : null}
      </span>
    </a>
  );
}
