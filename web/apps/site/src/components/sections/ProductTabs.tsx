"use client";

/**
 * ProductTabs (V1-3): accessible tabs (APG pattern) — role=tablist/tab/tabpanel,
 * arrow keys move selection and focus (roving tabindex), Home/End supported.
 * Data comes from the server as plain props.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { ProductAvailability } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./ProductTabs.module.css";

export type TabProduct = {
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly availability: ProductAvailability;
};

export type TabCategory = {
  readonly slug: string;
  readonly name: string;
  readonly products: readonly TabProduct[];
};

export function ProductTabs({ categories }: { readonly categories: readonly TabCategory[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (next: number) => {
    const index = (next + categories.length) % categories.length;
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        move(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        move(active - 1);
        break;
      case "Home":
        event.preventDefault();
        move(0);
        break;
      case "End":
        event.preventDefault();
        move(categories.length - 1);
        break;
    }
  };

  return (
    <div className={styles.tabs}>
      <div
        role="tablist"
        aria-label="Products by category"
        className={styles.tablist}
      >
        {categories.map((category, index) => {
          const selected = index === active;
          return (
            <button
              key={category.slug}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`product-tab-${category.slug}`}
              aria-selected={selected}
              aria-controls={`product-panel-${category.slug}`}
              tabIndex={selected ? 0 : -1}
              className={[styles.tab, selected ? styles.tabActive : ""]
                .filter(Boolean)
                .join(" ")}
              onKeyDown={onKeyDown}
              onClick={() => setActive(index)}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {categories.map((category, index) => {
        const selected = index === active;
        return (
          <div
            key={category.slug}
            role="tabpanel"
            id={`product-panel-${category.slug}`}
            aria-labelledby={`product-tab-${category.slug}`}
            hidden={!selected}
            className={styles.panel}
          >
            {selected ? (
              <ul className={`${styles.grid} reveal`}>
                {category.products.map((product, productIndex) => (
                  <li key={product.slug} style={stagger(productIndex)}>
                    <ProductCard {...product} />
                  </li>
                ))}
                <li style={stagger(category.products.length)}>
                  <article className={styles.customTile}>
                    <span className={styles.customIcon} aria-hidden="true">
                      <Code2 size={22} />
                    </span>
                    <h3 className={styles.customTitle}>
                      <Link href="/custom-software" className={styles.customLink}>
                        Need something else?
                      </Link>
                    </h3>
                    <p className={styles.customText}>
                      InflexHub builds custom software around the way your
                      organisation works.
                    </p>
                    <span className={styles.customMore} aria-hidden="true">
                      Custom software
                      <ArrowRight size={16} />
                    </span>
                  </article>
                </li>
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
