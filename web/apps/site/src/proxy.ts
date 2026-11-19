/**
 * Proxy (Next.js 16's middleware). Rejects unknown product and industry slugs
 * before rendering, so they answer with a real 404 status on the first request
 * (US-3). With Cache Components, `dynamicParams = false` is not available and
 * `notFound()` inside a streamed page cannot change a status already sent.
 * Security headers (V1-21) and the CSP (V1-30) are set here for every
 * response.
 */

import { NextResponse, type NextRequest } from "next/server";
import catalog from "../../../../catalog/products.json";

const productSlugs = new Set(catalog.products.map((product) => product.slug));
const industrySlugs = new Set(catalog.industries.map((industry) => industry.slug));

// V1-21 + V1-30 (docs/05-quality/security.md "XSS, clickjacking, MIME sniffing").
// HSTS joins in V1.1 with the production domain.
//
// CSP: nonce-based CSP requires dynamic rendering — Next.js docs state PPR
// is incompatible with nonces ("static shell scripts won't have access to
// the nonce"), and NFR-1 requires static generation. The static-compatible
// policy keeps every directive strict except script-src/style-src
// 'unsafe-inline' (documented in security.md); no third-party origins are
// allowed anywhere.
function contentSecurityPolicy(): string {
  const isDev = process.env.NODE_ENV === "development";
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("content-security-policy", contentSecurityPolicy());
  const statics: Record<string, string> = {
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "cross-origin-opener-policy": "same-origin",
  };
  for (const [name, value] of Object.entries(statics)) {
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
