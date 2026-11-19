/**
 * CustomSoftwareTile (ui-guidelines Part B "dark feature tile"): closes a row
 * of product cards with a path to custom software, so grids end on a full row.
 */

import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import styles from "./CustomSoftwareTile.module.css";

export function CustomSoftwareTile() {
  return (
    <article className={styles.tile}>
      <span className={styles.icon} aria-hidden="true">
        <Code2 size={22} />
      </span>
      <h3 className={styles.title}>
        <Link href="/custom-software" className={styles.link}>
          Need something else?
        </Link>
      </h3>
      <p className={styles.text}>
        InflexHub builds custom software around the way your organisation works.
      </p>
      <span className={styles.more} aria-hidden="true">
        Custom software
        <ArrowRight size={16} />
      </span>
    </article>
  );
}
