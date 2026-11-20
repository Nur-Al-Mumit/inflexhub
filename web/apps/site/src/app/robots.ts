/**
 * Robots (V1-12): everything public is crawlable; the API route and the
 * development-only component gallery are not.
 */

import type { MetadataRoute } from "next";
// Relative import with .ts extension: runs under node --test (tests/seo.test.ts).
import { absoluteUrl } from "../lib/seo.ts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dev/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
