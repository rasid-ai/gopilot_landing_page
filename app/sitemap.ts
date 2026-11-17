import type { MetadataRoute } from 'next'
import { getAllLegalDocs } from '@/lib/legal'
import { getAllReleases } from '@/lib/releases'

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

  /* The changelog index. Its per-release children are appended below from the
     API rather than listed here, because the set changes with every release and
     a hand-maintained list would go stale silently. */
  { path: '/releases', changeFrequency: 'weekly', priority: 0.7 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // `next.config.ts` sets trailingSlash: true, so every URL here must end in a
  // slash or the sitemap points at a 308 instead of the canonical page.
  const staticEntries: MetadataRoute.Sitemap = routes.map(
    ({ path, changeFrequency, priority }) => ({
      url: path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`,
      lastModified: BUILD_TIME,
      changeFrequency,
      priority,
    })
  )

  /* One entry per release page that `app/releases/[id]` actually exported, from
     the same source, so the sitemap cannot list a URL that is not in `out/`.
     `lastModified` is each release's own updated_at here, unlike the shared
     BUILD_TIME above: for these the real modification date is known, and it is
     the signal that tells a crawler which release notes changed. */
  const releases = await getAllReleases()
  const releaseEntries: MetadataRoute.Sitemap = releases.map((release) => ({
    url: `${SITE_URL}/releases/${release.id}/`,
    lastModified: new Date(release.updated_at),
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  /* Terms and Privacy, from the same snapshot the pages render, so the sitemap
     cannot list a legal URL that is not in `out/`. `lastModified` is the
     document's effective date, not BUILD_TIME: a rebuild that did not change
     the terms must not claim the terms changed. Low priority — these pages
     exist for visitors and for compliance, not to rank. */
  const legalEntries: MetadataRoute.Sitemap = getAllLegalDocs().map((doc) => ({
    url: `${SITE_URL}${doc.path}`,
    lastModified: new Date(doc.effective_date),
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...staticEntries, ...legalEntries, ...releaseEntries]
}
