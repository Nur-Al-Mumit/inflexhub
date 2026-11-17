"use client";

/**
 * RadioCards (V1-1): a fieldset of radio inputs styled as cards
 * (design-system §7 "radio cards"). Native radio semantics stay intact;
 * :has() drives the selected and focus styles. Reads the Field wrapper's
 * context for the invalid flag.
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
};

export function RadioCards({ legend, name, cards, className, ...rest }: RadioCardsProps) {
  const field = useContext(FieldContext);
  const isInvalid = field?.invalid ?? false;

  return (
    <fieldset
      aria-invalid={isInvalid || undefined}
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
