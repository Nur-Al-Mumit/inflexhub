/**
 * Not found (V1-11, PRD P-12, US-3): the 404 for unknown routes and unknown
 * product/industry slugs (src/proxy.ts rewrites those here). Helpful links
 * instead of a dead end.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Search, SquareArrowOutUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getCatalogStats } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  // Factual counts only — no invented numbers (OV-4).
  const stats = getCatalogStats();

  const paths = [
    {
      icon: Search,
      title: "Looking for a specific system?",
      text: "Browse all products with filters, or see what is coming soon.",
      links: [
        { href: "/products", label: "All products" },
        { href: "/upcoming", label: "Coming soon" },
      ],
    },
    {
      icon: SquareArrowOutUpRight,
      title: "Know what you need?",
      text: "Ask for a walkthrough, a price, or describe custom software.",
      links: [
        { href: "/request-demo", label: "Request a demo" },
        { href: "/request-quote", label: "Request a quote" },
        { href: "/custom-software", label: "Custom software" },
      ],
    },
    {
      icon: MessageSquare,
      title: "Something else?",
      text: "Write to InflexHub and a person replies.",
      links: [{ href: "/contact", label: "Contact" }],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="404"
        title="This page does not exist"
        intro={`The link may be old, or the page may have moved. The catalog is still here: ${stats.products} products across ${stats.categories} categories, availability stated up front.`}
        actions={
          <>
            <ButtonLink href="/products" size="lg" arrow>
              Browse all products
            </ButtonLink>
            <ButtonLink href="/" size="lg" variant="onDarkOutline">
              Go to the home page
            </ButtonLink>
          </>
        }
      />
      <Section id="not-found-help" eyebrow="Lost?" title="Where to go next">
        <ul className={styles.paths}>
          {paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <li key={path.title} className={`${styles.path} revealItem`} style={stagger(index)}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon size={22} />
                </span>
                <div>
                  <p className={styles.title}>{path.title}</p>
                  <p className={styles.text}>{path.text}</p>
                  <ul className={styles.links}>
                    {path.links.map((link) => (
                      <li key={link.href}>
                        <Link className={styles.link} href={link.href}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
