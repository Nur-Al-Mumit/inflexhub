/**
 * Site footer (V1-2): navigation columns — Products by catalog category,
 * Company, Get started, Legal — plus contact details and the legal bottom bar
 * from docs/04-frontend/pages-and-flows.md. Contact and legal details are
 * owner-validation placeholders (OV-3, OV-18) from src/content/company.ts.
 */

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/content/company";
import { getCategoryGroups } from "@/lib/catalog";
import styles from "./Footer.module.css";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/custom-software", label: "Custom software" },
  { href: "/upcoming", label: "Upcoming products" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
] as const;

const getStartedLinks = [
  { href: "/request-demo", label: "Request a demo" },
  { href: "/request-quote", label: "Request a quote" },
  { href: "/upcoming", label: "Register interest" },
] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

export function Footer() {
  const productLinks = getCategoryGroups().map((group) => ({
    href: `/products?category=${group.slug}`,
    label: group.name,
  }));

  const columns = [
    { heading: "Products", links: productLinks },
    { heading: "Company", links: companyLinks },
    { heading: "Get started", links: getStartedLinks },
    { heading: "Legal", links: legalLinks },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Link href="/" aria-label="InflexHub home" className={styles.homeLink}>
            <Logo onDark />
          </Link>
          <p className={styles.contactLine}>{company.email}</p>
          <p className={styles.contactLine}>{company.phone}</p>
          <p className={styles.contactLine}>{company.location}</p>
          <p className={styles.contactLine}>{company.officeHours}</p>
        </div>

        <div className={styles.columns}>
          {columns.map((column) => (
            <nav
              key={column.heading}
              aria-label={`${column.heading} links`}
              className={styles.column}
            >
              <h2 className={styles.columnHeading}>{column.heading}</h2>
              <ul className={styles.columnList}>
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} className={styles.columnLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p>
            © {company.copyrightYear} {company.legalName}. {company.tradeLicence}
          </p>
          <p>{company.registeredAddress}</p>
        </div>
      </div>
    </footer>
  );
}
