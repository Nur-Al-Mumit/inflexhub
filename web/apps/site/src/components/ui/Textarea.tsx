"use client";

/**
 * Textarea (V1-1): multi-line control with a live character counter
 * (design-system §7 "textarea (with counter)"). The counter announces
 * politely. Reads the Field wrapper's context and MERGES the Field's
 * describedBy ids with the counter id, so help/error and counter are both
 * announced.
 */

import { useContext, useId, useState, type TextareaHTMLAttributes } from "react";
import { mergeDescribedBy } from "@/lib/aria";
import { FieldContext } from "./FieldContext";
import styles from "./Textarea.module.css";

export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "aria-describedby"
> & {
  invalid?: boolean;
  "aria-describedby"?: string;
};

export function Textarea({
  invalid = false,
  maxLength,
  id,
  "aria-describedby": ariaDescribedBy,
  className,
  ...rest
}: TextareaProps) {
  const field = useContext(FieldContext);
  const counterId = `${useId()}-counter`;
  const [length, setLength] = useState(0);

  const textareaId = id ?? field?.id;
  const isInvalid = invalid || (field?.invalid ?? false);
  const describedBy = mergeDescribedBy(
    ariaDescribedBy,
    field?.describedBy,
    maxLength ? counterId : undefined,
  );

  return (
    <div className={styles.wrap}>
      <textarea
        id={textareaId}
        maxLength={maxLength}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        className={[styles.textarea, isInvalid ? styles.invalid : "", className ?? ""]
          .filter(Boolean)
          .join(" ")}
        onChange={(event) => setLength(event.target.value.length)}
        {...rest}
      />
      {maxLength ? (
        <span className={styles.counter} id={counterId} aria-live="polite">
          {length} / {maxLength}
        </span>
      ) : null}
    </div>
  );
}
