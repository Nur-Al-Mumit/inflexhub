/**
 * Proxy (Next.js 16's middleware). Rejects unknown product and industry slugs
 * before rendering, so they answer with a real 404 status on the first request
 * (US-3). With Cache Components, `dynamicParams = false` is not available and
 * `notFound()` inside a streamed page cannot change a status already sent.
 * Security headers (V1-21) are set here for every response; the nonce-based
 * CSP and security.txt follow with V1-30.
 */

import { NextResponse, type NextRequest } from "next/server";
import catalog from "../../../../catalog/products.json";

const productSlugs = new Set(catalog.products.map((product) => product.slug));
const industrySlugs = new Set(catalog.industries.map((industry) => industry.slug));

// V1-21 (docs/05-quality/security.md "XSS, clickjacking, MIME sniffing").
// HSTS joins in V1.1 with the production domain; CSP with a nonce is V1-30.
const securityHeaders: Record<string, string> = {
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "cross-origin-opener-policy": "same-origin",
};

function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [name, value] of Object.entries(securityHeaders)) {
    response.headers.set(name, value);
  }
  return response;
}

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
    return withSecurityHeaders(
      NextResponse.rewrite(new URL("/_unknown-route", request.url)),
    );
  }
  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
