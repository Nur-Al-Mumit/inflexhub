# Security and privacy

Status: Draft
PRD links: 4 (NFR-5, NFR-6)

Baseline: **OWASP Top 10** and **OWASP ASVS level 1** for V1; privacy at GDPR-level practice on top of Bangladesh law ([ADR 0005](../01-architecture/adr/0005-bangladesh-first-international-standards.md)).

| Threat | Control | Version |
|---|---|---|
| Form spam / bots | Honeypot (BR-5), per-IP rate limit (BR-4), Cloudflare Turnstile | V1, V1.1 |
| Direct API abuse | API on private network; `X-Site-Key` required for submissions; constant-time comparison | V1 |
| Injection | EF Core parameterised queries only; no raw SQL string building; React escapes output; no `dangerouslySetInnerHTML` except JSON-LD built with `JSON.stringify` | V1 |
| Oversized payloads | Request body limit 32 KB on the inquiry endpoint; field length limits (BR-8) | V1 |
| Personal data leaks | No personal data in logs; IP stored only as salted SHA-256; no inquiry data returned by public endpoints | V1 |
| XSS, clickjacking, MIME sniffing | Content-Security-Policy: `default-src 'self'; script-src 'self' 'unsafe-inline'` (decision 2026-11-20, V1-30: Next.js nonce CSP requires dynamic rendering — its docs mark PPR incompatible with nonces, and NFR-1 requires static generation; a nonce policy would break every prerendered page's scripts. The static-compatible policy keeps every other directive strict, no third-party origins, `'unsafe-eval'` only in dev) ; `style-src 'self' 'unsafe-inline'` (CSS Modules runtime) ; `img-src 'self' data: blob:`; `font-src 'self'`; `connect-src 'self'`; `object-src 'none'`; `frame-ancestors 'none'`; `base-uri 'self'`; `form-action 'self'`; `upgrade-insecure-requests`; plus `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Cross-Origin-Opener-Policy: same-origin` | V1 |
| Downgrade attacks | HSTS `max-age=63072000; includeSubDomains; preload` | V1.1 (production domain) |
| Vulnerable dependencies | CI fails on high/critical advisories (`npm audit --audit-level=high`, `dotnet list package --vulnerable --include-transitive`); Dependabot weekly update PRs | V1 |
| Leaked secrets | Secret scanning on the repository (GitHub secret scanning / push protection); `.env` git-ignored | V1 |
| Responsible disclosure | `/.well-known/security.txt` (RFC 9116): `Contact`, `Expires`, `Preferred-Languages: en, bn` | V1 |
| Email spoofing | SPF, DKIM, DMARC (`p=quarantine`, then `p=reject`) on the sending domain | V1.1 |
| CSV injection (export) | Prefix cells starting with `= + - @` with `'` (BR-12) | V1 |
| Export abuse | Export needs `X-Admin-Key` (constant-time compare), returns 404 when unconfigured, API not public | V1 |
| Email header injection | Visitor values never used in headers except Reply-To, which must be a validated email; CR/LF stripped from the subject | V1 |
| Admin account takeover | Cookie sessions, 2FA, lockout | V2 |
| Secrets | Only in environment variables; `.env` git-ignored; `.env.example` with placeholders | V1 |

Data rights: the privacy policy states what is collected and why, the retention period (OV-14, proposal 3 years then anonymised), and how to ask for access or deletion (contact email; handled manually in V1, admin action in V2).
