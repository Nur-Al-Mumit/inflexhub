"use client";

/**
 * Field (V1-1): label always visible, optional help and error text linked to
 * the control through aria-describedby (design-system §7). Publishes
 * id/describedBy/invalid through FieldContext; the control inside reads them
 * and applies them to the native element. No prop cloning.
 */

import { useId, type ReactNode } from "react";
import { mergeDescribedBy } from "@/lib/aria";
import { FieldContext } from "./FieldContext";
import styles from "./Field.module.css";

export type FieldProps = {
  /** Stable id for the control; required when an error summary links to it. */
  id?: string;
  label: string;
  /** Optional help text; replaced by the error when one is shown. */
  help?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ id: fieldId, label, help, error, children }: FieldProps) {
  const id = fieldId ?? useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const showHelp = Boolean(help) && !error;
  const describedBy = mergeDescribedBy(
    showHelp ? helpId : undefined,
    error ? errorId : undefined,
  );

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error) }}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        {children}
        {showHelp && help ? (
          <p className={styles.help} id={helpId}>
            {help}
          </p>
        ) : null}
        {error ? (
          <p className={styles.error} id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
