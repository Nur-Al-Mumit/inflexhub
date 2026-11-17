/**
 * StatsStrip (V1-3): elevated card overlapping the hero's lower edge.
 * Every value is computed from catalog/products.json at build time — never
 * invented client, project, or experience numbers (OV-4).
 */

import { Boxes, CheckCircle2, Factory, LayoutGrid } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { statsIntro, statsLabels } from "@/content/home";
import type { CatalogStats } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./StatsStrip.module.css";

export function StatsStrip({ stats }: { readonly stats: CatalogStats }) {
  const items = [
    { value: stats.products, label: statsLabels.products, icon: Boxes },
    { value: stats.categories, label: statsLabels.categories, icon: LayoutGrid },
    { value: stats.industries, label: statsLabels.industries, icon: Factory },
    { value: stats.available, label: statsLabels.available, icon: CheckCircle2 },
  ];

  return (
    <section className={styles.strip} aria-labelledby="stats-title">
      <Container>
        <div className={`${styles.card} enter`} style={stagger(5)}>
          <h2 id="stats-title" className={styles.title}>
            {statsIntro.title}
          </h2>
          <dl className={styles.list}>
            {items.map(({ value, label, icon: Icon }) => (
              <div key={label} className={styles.item}>
                <dt className={styles.label}>
                  <Icon aria-hidden="true" size={18} />
                  {label}
                </dt>
                <dd className={styles.value}>
                  <CountUp value={value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
