/**
 * AvailabilityExplainer (V1-3, PRD §1.3): the three availability states, how
 * many products carry each (from the catalog), and what each lets you do.
 * Equal-height cards; actions pinned to the bottom.
 */

import { CheckCircle2, Sparkles, Wrench } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { availabilityStates } from "@/content/home";
import type { ProductAvailability } from "@/lib/catalog";
import styles from "./AvailabilityExplainer.module.css";
import { stagger } from "@/lib/motion";

const meta: Record<ProductAvailability, { icon: typeof CheckCircle2; tone: string }> = {
  available: { icon: CheckCircle2, tone: styles.available },
  custom: { icon: Wrench, tone: styles.custom },
  upcoming: { icon: Sparkles, tone: styles.upcoming },
};

export function AvailabilityExplainer({
  counts,
}: {
  readonly counts: Readonly<Record<ProductAvailability, number>>;
}) {
  return (
    <ul className={styles.grid}>
      {availabilityStates.map((state, index) => {
        const { icon: Icon, tone } = meta[state.availability];
        const count = counts[state.availability];
        return (
          <li
            key={state.availability}
            className={`${styles.card} ${tone} revealItem`}
            style={stagger(index)}
          >
            <div className={styles.head}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className={styles.count}>
                {count} {count === 1 ? "product" : "products"}
              </span>
            </div>
            <h3 className={styles.title}>{state.label}</h3>
            <p className={styles.text}>{state.meaning}</p>
            <div className={styles.actions}>
              <ButtonLink href={state.primaryAction.href} arrow>
                {state.primaryAction.label}
              </ButtonLink>
              {state.secondaryAction ? (
                <ButtonLink href={state.secondaryAction.href} variant="ghost">
                  {state.secondaryAction.label}
                </ButtonLink>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
