/**
 * EngagementModels (V1-3): three ways to work with InflexHub, each with an
 * icon and a next step. Equal-height cards; links pinned to the bottom.
 */

import Link from "next/link";
import { ArrowRight, Code2, Package, Settings2 } from "lucide-react";
import { engagementModels, type EngagementModel } from "@/content/home";
import styles from "./EngagementModels.module.css";
import { stagger } from "@/lib/motion";

const icons: Record<EngagementModel["icon"], typeof Package> = {
  ready: Package,
  tailor: Settings2,
  custom: Code2,
};

export function EngagementModels() {
  return (
    <ul className={styles.grid}>
      {engagementModels.map((model, index) => {
        const Icon = icons[model.icon];
        return (
          <li
            key={model.title}
            className={`${styles.card} revealItem`}
            style={stagger(index)}
          >
            <div className={styles.head}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className={styles.title}>{model.title}</h3>
            <p className={styles.text}>{model.description}</p>
            <Link href={model.action.href} className={styles.link}>
              {model.action.label}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
