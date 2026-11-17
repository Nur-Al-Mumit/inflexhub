"use client";

/**
 * Select (V1-1): native select with a chevron icon (design-system §7).
 * Reads the Field wrapper's context; id and ARIA attributes land on the
 * native select element, not on the chevron wrapper.
 */

import { useContext, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { mergeDescribedBy } from "@/lib/aria";
import { FieldContext } from "./FieldContext";
import styles from "./Select.module.css";

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "aria-describedby"
> & {
  invalid?: boolean;
  "aria-describedby"?: string;
  children: ReactNode;
};

export function Select({
  invalid = false,
  id,
  "aria-describedby": ariaDescribedBy,
  className,
  children,
  ...rest
}: SelectProps) {
  const field = useContext(FieldContext);
  const selectId = id ?? field?.id;
  const describedBy = mergeDescribedBy(ariaDescribedBy, field?.describedBy);
  const isInvalid = invalid || (field?.invalid ?? false);

  return (
    <span className={styles.wrap}>
      <select
        id={selectId}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        className={[styles.select, isInvalid ? styles.invalid : "", className ?? ""]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" size={16} className={styles.chevron} />
    </span>
  );
}
