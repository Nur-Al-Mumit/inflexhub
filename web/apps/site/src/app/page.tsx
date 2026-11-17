/**
 * Home page (M0-6 walking skeleton): a factual hero only. The full home page
 * (catalog stats, products by category, process, FAQ, ...) is V1-3.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>InflexHub</p>
      <h1 className={styles.title}>Software that moves business forward.</h1>
      <p className={styles.intro}>
        InflexHub builds and delivers business software for companies,
        educational institutions, and healthcare organisations — ready to use,
        built on request, or coming soon.
      </p>
      <div className={styles.actions}>
        <Link href="/products" className={styles.primaryAction}>
          Explore products
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
        <Link href="/contact" className={styles.secondaryAction}>
          Contact us
        </Link>
      </div>
    </section>
  );
}
