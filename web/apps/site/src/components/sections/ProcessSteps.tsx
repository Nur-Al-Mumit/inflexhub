/**
 * ProcessSteps (V1-3): four numbered steps as an ordered list — a horizontal
 * timeline on wide screens, a vertical one on phones. Used in a dark Section.
 */

import { processSteps } from "@/content/home";
import styles from "./ProcessSteps.module.css";
import { stagger } from "@/lib/motion";

export function ProcessSteps() {
  return (
    <ol className={styles.steps}>
      {processSteps.map((step, index) => (
        <li
          key={step.title}
          className={`${styles.step} revealItem`}
          style={stagger(index)}
        >
          <span className={styles.marker} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className={styles.body}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.text}>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
