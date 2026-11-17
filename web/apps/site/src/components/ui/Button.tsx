/**
 * Button (V1-1, design-system §7): primary (orange, navy text), secondary
 * (navy), outline, ghost, and on-dark ghost variants; md/lg sizes; optional
 * trailing arrow that moves forward on hover; loading keeps the width and
 * announces via aria-busy.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "onDarkGhost";

export type ButtonSize = "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing arrow on forward actions only (design-system §9). */
  arrow?: boolean;
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  loading = false,
  disabled = false,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    loading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className={styles.label}>
        {children}
        {arrow ? (
          <ArrowRight aria-hidden="true" size={16} className={styles.arrow} />
        ) : null}
      </span>
      <span className={styles.spinner} aria-hidden="true" />
    </button>
  );
}
