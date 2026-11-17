"use client";

/**
 * Header (V1-2): sticky, transparent over the hero and solid once scrolled
 * (design-system §7). The Products mega menu is grouped by catalog category
 * (data from src/lib/catalog.ts via the root layout), plus "All products" and
 * "Coming soon". Opens on click, Escape closes, focus returns to the trigger,
 * and clicking outside closes it. Below 900 px the navigation moves into the
 * MobileNav drawer.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MobileNav } from "./MobileNav";
import styles from "./Header.module.css";

export type HeaderCategoryGroup = {
  readonly slug: string;
  readonly name: string;
  readonly products: readonly { readonly slug: string; readonly name: string }[];
};

const navigation = [
  { href: "/industries", label: "Industries" },
  { href: "/custom-software", label: "Custom Software" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header({
  categoryGroups,
}: {
  readonly categoryGroups: readonly HeaderCategoryGroup[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const productsTriggerRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    productsTriggerRef.current?.focus();
  };

  return (
    <header
      ref={headerRef}
      className={[styles.header, scrolled || menuOpen ? styles.solid : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.inner}>
        <Link href="/" aria-label="InflexHub home" className={styles.homeLink}>
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className={styles.nav}>
          <div
            className={styles.productsWrap}
            onKeyDown={(event) => {
              // Escape closes the menu wherever focus is inside the wrapper,
              // including on the trigger right after opening it.
              if (event.key === "Escape" && menuOpen) {
                closeMenu();
              }
            }}
          >
            <button
              ref={productsTriggerRef}
              type="button"
              className={[styles.navLink, styles.productsTrigger]
                .filter(Boolean)
                .join(" ")}
              aria-expanded={menuOpen}
              aria-controls="products-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Products
              <ChevronDown
                aria-hidden="true"
                size={16}
                className={menuOpen ? styles.chevronOpen : styles.chevron}
              />
            </button>

            {menuOpen ? (
              <div id="products-menu" className={styles.menuPanel}>
                <div className={styles.menuInner}>
                  <div className={styles.menuGrid}>
                    {categoryGroups.map((group) => (
                      <section
                        key={group.slug}
                        aria-label={group.name}
                        className={styles.menuGroup}
                      >
                        <p className={styles.menuGroupTitle}>{group.name}</p>
                        <ul className={styles.menuGroupList}>
                          {group.products.map((product) => (
                            <li key={product.slug}>
                              <Link
                                href={`/products/${product.slug}`}
                                className={styles.menuProductLink}
                                onClick={() => setMenuOpen(false)}
                              >
                                {product.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                  <div className={styles.menuFooter}>
                    <Link
                      href="/products"
                      className={styles.menuFooterLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      All products
                    </Link>
                    <Link
                      href="/upcoming"
                      className={styles.menuFooterLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      Coming soon
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        <ButtonLink href="/request-demo" className={styles.cta}>
          Request a demo
        </ButtonLink>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav"
          onClick={() => setDrawerOpen(true)}
        >
          Menu
        </button>
      </div>

      {drawerOpen ? (
        <MobileNav
          categoryGroups={categoryGroups}
          returnFocusTo={menuButtonRef}
          onClose={() => setDrawerOpen(false)}
        />
      ) : null}
    </header>
  );
}
