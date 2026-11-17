"use client";

/**
 * Checkbox (V1-1): real input with accent from the brand; the label is always
 * visible next to it (design-system §7). Reads the Field wrapper's context for
 * the invalid flag (and id when provided); standalone it generates its own id
 * so its label stays connected.
 */

import { useContext, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { FieldContext } from "./FieldContext";
import styles from "./Checkbox.module.css";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  invalid?: boolean;
};

export function Checkbox({
  label,
  invalid = false,
  className,
  id,
  ...rest
}: CheckboxProps) {
  const field = useContext(FieldContext);
  const generatedId = useId();
  const inputId = id ?? field?.id ?? generatedId;
  const isInvalid = invalid || (field?.invalid ?? false);

  return (
    <label className={styles.checkbox} htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        aria-invalid={isInvalid || undefined}
        className={[styles.input, isInvalid ? styles.invalid : ""]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      <span className={styles.labelText}>{label}</span>
    </label>
  );
}
