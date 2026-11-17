# InflexHub site image (M0-7). Build context: repository root.
# The image mirrors the repository layout under /repo (web/ workspace and
# catalog/), so the relative path from the site to catalog/products.json
# (../../../catalog/products.json, ADR 0002) is identical locally and here.
# next.config.ts anchors outputFileTracingRoot/turbopack.root at /repo, so the
# standalone output also mirrors: web/apps/site/server.js.

# ---------- build ----------
FROM node:26.13.1-alpine3.24 AS build
WORKDIR /repo

# Install with a warm dependency cache layer first.
COPY web/package.json web/package-lock.json ./web/
COPY web/apps/site/package.json ./web/apps/site/
RUN cd web && npm ci

# NEXT_PUBLIC_ values are inlined at build time.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY web/apps/site ./web/apps/site
COPY catalog ./catalog
RUN cd web && npm run build --workspace apps/site

# ---------- runtime ----------
FROM node:26.13.1-alpine3.24 AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Standalone mirrors the repo: web/apps/site/server.js and web/node_modules.
COPY --from=build /repo/web/apps/site/.next/standalone ./
COPY --from=build /repo/web/apps/site/.next/static ./web/apps/site/.next/static
COPY --from=build /repo/web/apps/site/public ./web/apps/site/public
COPY --from=build /repo/catalog ./catalog

# Non-root on Alpine.
USER node

CMD ["node", "web/apps/site/server.js"]
