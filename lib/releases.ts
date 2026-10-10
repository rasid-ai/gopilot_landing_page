/**
 * Release notes, read from a build-time snapshot.
 *
 * `scripts/fetch-releases.mjs` (wired into `prebuild`) pulls the published
 * releases from the PRODUCTION API once per build and writes
 * `lib/content/releases.generated.json`. This module is the only reader, so
 * every consumer, the index page, the detail pages and the sitemap, sees the
 * same list and cannot disagree about what shipped.
 *
 * Why a snapshot instead of fetching in the pages: `output: 'export'` rejects
 * an uncacheable fetch, and Next's cacheable default would let Netlify's
 * restored `.next/cache` regenerate the changelog from a stale copy of the API.
 * The script has no framework caching at all. See its header for the full
 * reasoning.
 *
 * The consequence worth remembering: **a newly published release does not
 * appear until this site rebuilds.** Publishing and deploying are two separate
 * acts. See docs/BUILD_SPEC.md section 31.
 */
import snapshot from '@/lib/content/releases.generated.json'

export type ReleaseType = 'major' | 'minor' | 'patch' | (string & {})

export type Release = {
  id: number
  version: string
  title: string
  summary: string
  content: string
  release_type: ReleaseType
  is_featured: boolean
  release_date: string
  featured_image: string | null
  created_at: string
  updated_at: string
}

const RELEASES = snapshot as Release[]

/** Every published release, newest first. */
export async function getAllReleases(): Promise<Release[]> {
  return RELEASES
}

/**
 * One release, by the id the product portal links to.
 *
 * Throws rather than returning null: every id reaching this function came from
 * `generateStaticParams`, so a miss means the snapshot and the route table
 * disagree, and that should fail the build loudly instead of exporting a page
 * with holes in it.
 */
export async function getRelease(id: string | number): Promise<Release> {
  const numeric = Number(id)
  const release = RELEASES.find((r) => r.id === numeric)
  if (!release) {
    throw new Error(
      `No release with id ${id} in the build snapshot. ` +
        'Run `node scripts/fetch-releases.mjs` to refresh it.'
    )
  }
  return release
}

/** "25 September 2026", stable regardless of where the build machine sits. */
export function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Tone for the release-type chip. Only the types the API actually emits are
 * mapped; anything else takes the neutral tone rather than rendering an
 * undefined class string.
 */
export function releaseTypeTone(type: ReleaseType): string {
  switch (type) {
    case 'major':
      return 'bg-brand text-white'
    case 'minor':
      return 'bg-brand-light text-brand-dark'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}
