/**
 * WhyInflexHub (V1-3): four modest, verifiable reasons (OV-4) in a 2 × 2 grid,
 * shown in the split Section layout next to the header.
 */

import { Eye, Globe2, Layers, TrendingUp } from "lucide-react";
import { reasons, type Reason } from "@/content/home";
import styles from "./WhyInflexHub.module.css";
import { stagger } from "@/lib/motion";

const icons: Record<Reason["icon"], typeof Eye> = {
  availability: Eye,
  partner: Layers,
  standards: Globe2,
  roadmap: TrendingUp,
};

export function WhyInflexHub() {
  return (
    <ul className={styles.grid}>
      {reasons.map((reason, index) => {
        const Icon = icons[reason.icon];
        return (
          <li
            key={reason.title}
            className={`${styles.card} revealItem`}
            style={stagger(index % 2)}
          >
            <span className={styles.icon} aria-hidden="true">
              <Icon size={22} />
            </span>
            <h3 className={styles.title}>{reason.title}</h3>
            <p className={styles.text}>{reason.description}</p>
          </li>
        );
      })}
    </ul>
  );
}
