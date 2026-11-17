"use client";

/**
 * TextInput (V1-1): single-line control (design-system §7 form fields).
 * Reads the Field wrapper's context so id, aria-describedby and aria-invalid
 * land on the native input; the explicit invalid prop is also honoured.
 */

import { useContext, type InputHTMLAttributes } from "react";
import { mergeDescribedBy } from "@/lib/aria";
import { FieldContext } from "./FieldContext";
import styles from "./TextInput.module.css";

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "aria-describedby"
> & {
  invalid?: boolean;
  "aria-describedby"?: string;
};

export function TextInput({
  invalid = false,
  id,
  "aria-describedby": ariaDescribedBy,
  className,
  ...rest
}: TextInputProps) {
  const field = useContext(FieldContext);
  const inputId = id ?? field?.id;
  const describedBy = mergeDescribedBy(ariaDescribedBy, field?.describedBy);
  const isInvalid = invalid || (field?.invalid ?? false);

  return (
    <input
      id={inputId}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      className={[styles.input, isInvalid ? styles.invalid : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
}
