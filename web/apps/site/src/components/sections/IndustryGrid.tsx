/**
 * IndustryGrid (V1-3): every catalog industry with its product count, as a
 * 3 × 3 grid of linked cards (industry pages arrive in V1-6).
 */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industryIcon } from "@/components/products/productIcons";
import type { IndustrySummary } from "@/lib/catalog";
import styles from "./IndustryGrid.module.css";
import { stagger } from "@/lib/motion";

export function IndustryGrid({
  industries,
}: {
  readonly industries: readonly IndustrySummary[];
}) {
  return (
    <ul className={styles.grid}>
      {industries.map((industry, index) => {
        const Icon = industryIcon(industry.slug);
        return (
          <li key={industry.slug} className="revealItem" style={stagger(index % 3)}>
            <Link href={`/industries/${industry.slug}`} className={styles.card}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className={styles.text}>
                <span className={styles.name}>{industry.name}</span>
                <span className={styles.count}>
                  {industry.productCount}{" "}
                  {industry.productCount === 1 ? "product" : "products"}
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" size={20} className={styles.arrow} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
