import type { NextConfig } from "next";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The site lives at <repo>/web/apps/site and reads the shared catalog at
// <repo>/catalog/products.json (ADR 0002). Anchoring the tracing and Turbopack
// roots at the repository root keeps that relative path identical locally and
// inside the Docker image (web/apps/site/Dockerfile mirrors /repo).
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const nextConfig: NextConfig = {
  // Docker deploys the standalone server (nextjs-architecture rule 7).
  output: "standalone",
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
