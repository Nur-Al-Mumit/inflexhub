/**
 * Breadcrumbs (V1-1): nav with aria-label="Breadcrumb"; the current page
 * carries aria-current (design-system §7).
 */

import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export type Crumb = {
  href: string;
  label: string;
};

export type BreadcrumbsProps = {
  /** Every crumb except the current page; the current page comes from `current`. */
  items: readonly Crumb[];
  current: string;
  /** Use on navy surfaces (PageHero). */
  tone?: "default" | "onDark";
};

export function Breadcrumbs({ items, current, tone = "default" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={tone === "onDark" ? `${styles.nav} ${styles.onDark}` : styles.nav}
    >
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className={styles.item}>
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          </li>
        ))}
        <li className={styles.item}>
          <span className={styles.current} aria-current="page">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
