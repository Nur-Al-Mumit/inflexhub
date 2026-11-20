/**
 * WhatNext (V1-7 – V1-10, V1-24): the numbered "what happens next" steps in
 * the left column of a form section (Section split layout). Content comes
 * from src/content/forms.ts.
 */

import type { FormCopy } from "@/content/forms";
import styles from "./WhatNext.module.css";

export type WhatNextProps = {
  readonly copy: FormCopy;
};

export function WhatNext({ copy }: WhatNextProps) {
  return (
    <div className={styles.block}>
      <h3 className={styles.title}>{copy.whatNextTitle}</h3>
      <p className={styles.intro}>{copy.whatNextIntro}</p>
      <ol className={styles.steps}>
        {copy.whatNext.map((step, index) => (
          <li key={step} className={styles.step}>
            <span className={styles.number} aria-hidden="true">
              {index + 1}
            </span>
            <span className={styles.text}>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
