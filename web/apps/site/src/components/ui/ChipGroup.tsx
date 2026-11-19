"use client";

/**
 * ChipGroup (V1-1): toggleable chips with aria-pressed (design-system §7
 * filter bar). Uncontrolled with defaultPressed, or controlled via `pressed`
 * (the products filter bar drives it from the URL).
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
};

export function ChipGroup({
  "aria-label": ariaLabel,
  chips,
  defaultPressed = [],
  pressed,
  onChange,
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
    <div className={styles.group} role="group" aria-label={ariaLabel}>
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
