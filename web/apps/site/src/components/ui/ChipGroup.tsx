"use client";

/**
 * ChipGroup (V1-1): toggleable chips with aria-pressed (design-system §7
 * filter bar, and "multi-select chips" in forms). Uncontrolled with
 * defaultPressed, or controlled via `pressed` (the products filter bar drives
 * it from the URL; inquiry forms drive it from form state). In forms, pass an
 * `id` so the error summary can link to the group (tabIndex -1 lets focus
 * land on it).
 */

import { useState } from "react";
import styles from "./ChipGroup.module.css";

export type Chip = {
  value: string;
  label: string;
};

export type ChipGroupProps = {
  "aria-label": string;
  chips: readonly Chip[];
  /** Initial pressed values (uncontrolled). */
  defaultPressed?: readonly string[];
  /** Controlled pressed values (e.g. parsed from the URL). */
  pressed?: readonly string[];
  onChange?: (pressed: string[]) => void;
  /** Stable id for the group (error-summary links). */
  id?: string;
  /** Error text id, so screen readers announce it with the group. */
  "aria-describedby"?: string;
  invalid?: boolean;
};

export function ChipGroup({
  "aria-label": ariaLabel,
  chips,
  defaultPressed = [],
  pressed,
  onChange,
  id,
  "aria-describedby": ariaDescribedBy,
  invalid = false,
}: ChipGroupProps) {
  const [internalPressed, setInternalPressed] =
    useState<readonly string[]>(defaultPressed);

  const current = pressed ?? internalPressed;

  const toggle = (value: string) => {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    if (pressed === undefined) {
      setInternalPressed(next);
    }
    onChange?.(next);
  };

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-invalid={invalid || undefined}
      tabIndex={-1}
      className={[styles.group, invalid ? styles.invalidGroup : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {chips.map((chip) => {
        const isPressed = current.includes(chip.value);
        return (
          <button
            key={chip.value}
            type="button"
            className={[styles.chip, isPressed ? styles.pressed : ""]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={isPressed}
            onClick={() => toggle(chip.value)}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
