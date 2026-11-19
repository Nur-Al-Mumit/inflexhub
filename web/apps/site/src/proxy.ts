/**
 * Proxy (Next.js 16's middleware). Rejects unknown product and industry slugs
 * before rendering, so they answer with a real 404 status on the first request
 * (US-3). With Cache Components, `dynamicParams = false` is not available and
 * `notFound()` inside a streamed page cannot change a status already sent.
 * Security headers (V1-30) will also live here.
 */

import { NextResponse, type NextRequest } from "next/server";
import catalog from "../../../../catalog/products.json";

const productSlugs = new Set(catalog.products.map((product) => product.slug));
const industrySlugs = new Set(catalog.industries.map((industry) => industry.slug));

export function proxy(request: NextRequest) {
  const [, section, slug, extra] = request.nextUrl.pathname.split("/");
  const known =
    section === "products"
      ? productSlugs
      : section === "industries"
        ? industrySlugs
        : null;

  if (known && slug && (extra !== undefined || !known.has(slug))) {
    // Rewrite to a path no route matches: Next serves the prerendered
    // not-found page with status 404.
    return NextResponse.rewrite(new URL("/_unknown-route", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:slug*", "/industries/:slug*"],
};
