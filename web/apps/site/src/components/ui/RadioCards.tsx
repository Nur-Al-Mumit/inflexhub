"use client";

/**
 * RadioCards (V1-1): a fieldset of radio inputs styled as cards
 * (design-system §7 "radio cards"). Native radio semantics stay intact;
 * :has() drives the selected and focus styles. Reads the Field wrapper's
 * context for the invalid flag; in forms, pass `id`/`aria-describedby`/
 * `invalid` so the error summary can link to the fieldset (tabIndex -1 lets
 * focus land on it).
 */

import { useContext, type InputHTMLAttributes } from "react";
import { FieldContext } from "./FieldContext";
import styles from "./RadioCards.module.css";

export type RadioCard = {
  value: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

export type RadioCardsProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value"
> & {
  legend: string;
  name: string;
  cards: readonly RadioCard[];
  /** Stable id for the fieldset (error-summary links). */
  id?: string;
  /** Error text id, so screen readers announce it with the group. */
  "aria-describedby"?: string;
  invalid?: boolean;
};

export function RadioCards({
  legend,
  name,
  cards,
  id,
  "aria-describedby": ariaDescribedBy,
  invalid = false,
  className,
  ...rest
}: RadioCardsProps) {
  const field = useContext(FieldContext);
  const isInvalid = invalid || (field?.invalid ?? false);

  return (
    <fieldset
      id={id}
      aria-describedby={ariaDescribedBy}
      aria-invalid={isInvalid || undefined}
      tabIndex={-1}
      className={[
        styles.fieldset,
        isInvalid ? styles.invalid : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.grid}>
        {cards.map((card) => (
          <label key={card.value} className={styles.card}>
            <input
              type="radio"
              name={name}
              value={card.value}
              disabled={card.disabled}
              className={styles.input}
              {...rest}
            />
            <span className={styles.title}>{card.title}</span>
            {card.description ? (
              <span className={styles.description}>{card.description}</span>
            ) : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
