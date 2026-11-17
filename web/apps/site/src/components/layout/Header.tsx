/**
 * Site header (M0-6 layout shell): logo, top-level navigation, and the primary
 * call to action from docs/04-frontend/pages-and-flows.md. The full header with
 * products mega menu and mobile drawer ships with V1-2.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import styles from "./Header.module.css";

const navigation = [
  { href: "/products", label: "Products" },
  { href: "/industries", label: "Industries" },
  { href: "/custom-software", label: "Custom Software" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" aria-label="InflexHub home" className={styles.homeLink}>
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className={styles.nav}>
          <ul className={styles.navList}>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/request-demo" className={styles.cta}>
          Request a demo
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </header>
  );
}
