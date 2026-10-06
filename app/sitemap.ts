import type { MetadataRoute } from 'next'

/* `output: 'export'` has no server, so Next refuses to build a metadata route
   unless it is explicitly declared static. Without this line the build fails
   with "export const dynamic = \"force-static\" not configured on route
   /sitemap.xml" and no sitemap.xml is ever emitted. */
export const dynamic = 'force-static'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

// One shared build timestamp: distinct per-URL times on a single static deploy
// are fiction, and inconsistent lastmod values get the whole file discounted.
const BUILD_TIME = new Date()

type Route = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

/* Hash anchors are deliberately absent. The fragment is stripped before crawl,
   so listing `#pricing` and friends just submits the homepage six times. */
const routes: Route[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },

  // Uncomment each line ONLY once the corresponding app/<route>/page.tsx exists
  // and returns 200 in the exported `out/` directory.
  // { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  // { path: '/terms',   changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // `next.config.ts` sets trailingSlash: true, so every URL here must end in a
  // slash or the sitemap points at a 308 instead of the canonical page.
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`,
    lastModified: BUILD_TIME,
    changeFrequency,
    priority,
  }))
}
