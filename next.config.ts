import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const nextConfig: NextConfig = {
  /* Dev and build get SEPARATE output directories.
     Both commands write `<distDir>/trace` and hold an exclusive handle on it.
     On Windows that is not a shared read — so if a dev server is running and
     you start a build (or the reverse), the second process dies with
     `EPERM: operation not permitted, open '.next\trace'`. On Linux/macOS the
     same collision is silently tolerated, which is why this is easy to ship
     without noticing.
     Giving each its own directory means `npm run dev` and `npm run build` can
     run at the same time, in any order, without either needing to be stopped. */
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',

  /* There is an unrelated package-lock.json in the user's home directory, so
     Next guesses that as the workspace root and warns on every build. Pinning
     the root silences it. Functionally inert under `output: 'export'` — there
     is no server bundle to trace — but the warning is misleading noise. */
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),

  /* Static export: `next build` emits a fully pre-rendered `out/` directory that
     can be served by any static host (S3, Cloudflare Pages, Netlify, nginx) with
     no Node runtime. Every section of this page is static marketing content, so
     there is nothing a server would add — and pre-rendered HTML is exactly what
     the SEO crawlers need to see. */
  output: 'export',

  /* `output: 'export'` has no server to run the Image Optimization API, so
     next/image must be told not to try. Images are committed at their final
     dimensions instead. */
  images: {
    unoptimized: true,
  },

  /* Emit `about/index.html` rather than `about.html`, so static hosts resolve
     clean URLs (`/about`) without per-host rewrite rules. */
  trailingSlash: true,

  reactStrictMode: true,

  /* Strip the `X-Powered-By: Next.js` response header — it advertises the stack
     and version to anyone scanning, and buys us nothing. */
  poweredByHeader: false,
}

export default nextConfig
