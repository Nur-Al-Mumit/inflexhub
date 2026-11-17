/**
 * ProductCard (design-system §7): icon tile, availability badge, name as the
 * single (stretched) link, tagline, and a "View product" cue.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import type { ProductAvailability } from "@/lib/catalog";
import { productIcon } from "./productIcons";
import styles from "./ProductCard.module.css";

export type ProductCardProps = {
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly availability: ProductAvailability;
  /** Shown above the name when the surrounding context has no category. */
  readonly category?: string;
};

export function ProductCard({
  slug,
  name,
  tagline,
  availability,
  category,
}: ProductCardProps) {
  const Icon = productIcon(slug);
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className={styles.icon} aria-hidden="true">
          <Icon size={22} />
        </span>
        <AvailabilityBadge availability={availability} />
      </div>
      {category ? <p className={styles.category}>{category}</p> : null}
      <h3 className={styles.name}>
        <Link href={`/products/${slug}`} className={styles.link}>
          {name}
        </Link>
      </h3>
      <p className={styles.tagline}>{tagline}</p>
      <span className={styles.more} aria-hidden="true">
        View product
        <ArrowRight size={16} />
      </span>
    </article>
  );
}
