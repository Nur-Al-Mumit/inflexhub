"use client";

/**
 * MobileNav (V1-2): the below-900px navigation drawer. Order: the primary
 * CTA, then Products as a native details/summary group (All products, the
 * catalog category groups, Coming soon), then the remaining sections. While
 * open, focus is trapped inside, Escape and the close button close it, body
 * scroll is locked, and focus returns to the header menu button.
 */

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { HeaderCategoryGroup } from "./Header";
import styles from "./MobileNav.module.css";

function focusableIn(root: HTMLElement | null): HTMLElement[] {
  if (!root) {
    return [];
  }
  return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), summary")];
}

export function MobileNav({
  categoryGroups,
  onClose,
  returnFocusTo,
}: {
  readonly categoryGroups: readonly HeaderCategoryGroup[];
  readonly onClose: () => void;
  readonly returnFocusTo: RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    focusableIn(panelRef.current)[0]?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusTo.current?.focus();
    };
  }, [returnFocusTo]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={panelRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={styles.panel}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onClose();
            return;
          }
          if (event.key !== "Tab") {
            return;
          }
          const focusables = focusableIn(panelRef.current);
          if (focusables.length === 0) {
            return;
          }
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement;
          if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className={styles.head}>
          <ButtonLink href="/request-demo" onClick={onClose} className={styles.cta}>
            Request a demo
          </ButtonLink>
          <button
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={onClose}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className={styles.nav}>
          <details className={styles.products}>
            <summary className={styles.productsSummary}>
              Products
              <ChevronDown aria-hidden="true" size={18} className={styles.chevron} />
            </summary>
            <div className={styles.productsContent}>
              <Link href="/products" className={styles.groupLink} onClick={onClose}>
                All products
              </Link>
              {categoryGroups.map((group) => (
                <section key={group.slug} className={styles.group}>
                  <p className={styles.groupTitle}>{group.name}</p>
                  {group.products.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className={styles.groupLink}
                      onClick={onClose}
                    >
                      {product.name}
                    </Link>
                  ))}
                </section>
              ))}
              <Link href="/upcoming" className={styles.groupLink} onClick={onClose}>
                Coming soon
              </Link>
            </div>
          </details>
          <Link href="/industries" className={styles.link} onClick={onClose}>
            Industries
          </Link>
          <Link href="/custom-software" className={styles.link} onClick={onClose}>
            Custom Software
          </Link>
          <Link href="/about" className={styles.link} onClick={onClose}>
            About
          </Link>
          <Link href="/contact" className={styles.link} onClick={onClose}>
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
