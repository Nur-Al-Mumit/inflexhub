/**
 * Accordion (V1-1): native details/summary — keyboard and semantics for free
 * (design-system §7).
 */

import { ChevronDown } from "lucide-react";
import styles from "./Accordion.module.css";

export type AccordionItem = {
  summary: string;
  content: string;
};

export type AccordionProps = {
  items: readonly AccordionItem[];
};

export function Accordion({ items }: AccordionProps) {
  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <details key={item.summary} className={styles.item}>
          <summary className={styles.summary}>
            {item.summary}
            <ChevronDown aria-hidden="true" size={18} className={styles.chevron} />
          </summary>
          <p className={styles.content}>{item.content}</p>
        </details>
      ))}
    </div>
  );
}
