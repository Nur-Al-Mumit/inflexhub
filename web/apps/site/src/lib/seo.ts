/**
 * SEO helpers (V1-12, US-11, NFR-3): the public site URL (OV-11: the domain
 * is not confirmed; NEXT_PUBLIC_SITE_URL wins, inflexhub.com is the
 * fallback), absolute URLs, and the JSON-LD builders (Organization,
 * SoftwareApplication per product, FAQPage, BreadcrumbList). Pure — covered
 * by tests/seo.test.ts; sitemap.ts and robots.ts build on them.
 */

// Relative imports with .ts extensions (not the "@/…" alias): this module
// runs under node --test, which resolves neither path aliases nor
// extension-less relative imports (tsconfig allows the .ts extension).
import { company } from "../content/company.ts";
import type { CatalogProduct } from "./catalog.ts";

/** The public origin. Inlined at build time (NEXT_PUBLIC_SITE_URL); the
 * fallback domain stays an OV-11 placeholder until the owner confirms. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inflexhub.com";

/** Absolute URL for a site path ("/products" → "https://…/products"). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    legalName: company.legalName,
    url: absoluteUrl("/"),
    email: company.email,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
  };
}

export function softwareApplicationJsonLd(product: CatalogProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.tagline,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl(`/products/${product.slug}`),
  };
}

export function faqJsonLd(items: readonly { readonly summary: string; readonly content: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.summary,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.content,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  trail: readonly { readonly name: string; readonly path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
