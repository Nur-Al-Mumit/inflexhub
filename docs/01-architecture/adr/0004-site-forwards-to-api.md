# ADR 0004 — The site forwards forms to the API (backend-for-frontend)

Status: Accepted (2026-11-17)

## Context

Exposing the API directly to browsers would need CORS, a public API host, and would expose the API surface to bots. A same-origin backend-for-frontend avoids all three.

## Decision

- Browsers post to the site's route handler `POST /api/inquiries`.
- The handler forwards to `API_BASE_URL` on the private Docker network with header `X-Site-Key` (shared secret from the environment) and `X-Forwarded-For` (client IP from `CF-Connecting-IP` or the incoming `X-Forwarded-For`).
- The API rejects inquiry submissions without the correct site key (`401 site-key-invalid`) and trusts the forwarded IP only when the key is valid.
- The API port is not published outside the Docker network in production.

## Consequences

No CORS, no public API host in V1. V2's admin app uses the same pattern with cookie sessions.
