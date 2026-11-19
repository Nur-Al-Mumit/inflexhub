/**
 * Sitemap (V1-12, US-11): every static page, every product, and every
 * industry. /dev/ui is a development-only review aid and is never listed
 * (pages-and-flows).
 */

import type { MetadataRoute } from "next";
// Relative imports with .ts extensions: this module runs under node --test
// (tests/seo.test.ts), which resolves neither the "@/…" alias nor
// extension-less relative imports.
import { getCatalog } from "../lib/catalog.ts";
import { absoluteUrl } from "../lib/seo.ts";

export default function sitemap(): MetadataRoute.Sitemap {
  const { products, industries } = getCatalog();
  const staticPaths = [
    "/",
    "/products",
    "/industries",
    "/custom-software",
    "/request-demo",
    "/request-quote",
    "/upcoming",
    "/partners",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...industries.map((industry) => ({
      url: absoluteUrl(`/industries/${industry.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
