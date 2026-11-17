"use client";

/**
 * ChipGroup (V1-1): toggleable filter chips with aria-pressed
 * (design-system §7 filter bar). Uncontrolled with an optional onChange.
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
  defaultPressed?: readonly string[];
  onChange?: (pressed: string[]) => void;
};

export function ChipGroup({
  "aria-label": ariaLabel,
  chips,
  defaultPressed = [],
  onChange,
}: ChipGroupProps) {
  const [pressed, setPressed] = useState<readonly string[]>(defaultPressed);

  const toggle = (value: string) => {
    const next = pressed.includes(value)
      ? pressed.filter((item) => item !== value)
      : [...pressed, value];
    setPressed(next);
    onChange?.(next);
  };

  return (
    <div className={styles.group} role="group" aria-label={ariaLabel}>
      {chips.map((chip) => {
        const isPressed = pressed.includes(chip.value);
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
