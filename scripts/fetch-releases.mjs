/**
 * Snapshot the published release notes into lib/content/releases.generated.json,
 * once per build, before Next starts.
 *
 * WHY A SCRIPT AND NOT `fetch` INSIDE THE PAGES
 *
 * Two constraints collide. `output: 'export'` requires every fetch to be
 * cacheable, so `cache: 'no-store'` is rejected outright (the build fails on
 * /sitemap.xml, which is `force-static`). But the alternative, Next's default
 * `force-cache`, writes the response into `.next/cache/fetch-cache` with no
 * expiry, and Netlify restores `.next/cache` between deploys. A rebuild would
 * then regenerate the changelog from a cached copy of the API and silently ship
 * a stale one, which for a changelog is the whole bug.
 *
 * Fetching here sidesteps both: a plain Node fetch with no framework caching,
 * one network read per build, and the result committed to a file the build log
 * can show you. Pages and the sitemap then read a local module, which is both
 * deterministic and instant.
 *
 * PRODUCTION, ALWAYS. The portal also runs a beta deployment whose release
 * table is shorter and differently numbered. A public changelog built from beta
 * rows would announce features nobody can reach, so the default host below is
 * production and the override exists only for a staging build of this site.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const API_BASE = (
  process.env.NEXT_PUBLIC_RELEASES_API ?? 'https://api.rasid.ai/api'
).replace(/\/+$/, '')

const OUT = join(process.cwd(), 'lib', 'content', 'releases.generated.json')

/** Only the fields the pages render, so the snapshot cannot drift into a dump. */
const FIELDS = [
  'id',
  'version',
  'title',
  'summary',
  'content',
  'release_type',
  'is_featured',
  'release_date',
  'featured_image',
  'created_at',
  'updated_at',
]

function pick(row) {
  const out = {}
  for (const key of FIELDS) out[key] = row[key] ?? null
  return out
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${url}`)
  }
  return res.json()
}

async function main() {
  /* The list endpoint is a SUMMARY: it returns id, version, title, summary,
     release_type, is_featured, release_date and featured_image, but NOT
     `content`, `created_at` or `updated_at`. Building the snapshot from the list
     alone exports every release page with an empty body, and leaves the sitemap
     with no real lastModified. So the list supplies the set, and each release is
     then read from its own detail endpoint. */
  const ids = []
  let url = `${API_BASE}/releases/`

  // Follow `next` rather than hardcoding a page size, which would truncate
  // silently the day the default changes.
  while (url) {
    const page = await getJson(url)
    ids.push(...page.results.map((r) => r.id))
    url = page.next
  }

  const all = []
  for (const id of ids) {
    const detail = await getJson(`${API_BASE}/releases/${id}/`)
    if (!detail.content) {
      throw new Error(
        `Release ${id} (${detail.version}) has no content. A release page with an ` +
          'empty body would be indexed as thin content, so this is a build stopper.'
      )
    }
    all.push(pick(detail))
  }

  all.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, `${JSON.stringify(all, null, 2)}\n`, 'utf8')

  // Printed so a deploy log answers "which releases are on the site?" without
  // anyone having to open the artefact.
  console.log(
    `Releases snapshot: ${all.length} from ${API_BASE} ` +
      `(${all.map((r) => r.version).join(', ')})`
  )
}

main().catch((err) => {
  console.error(
    '\nRelease snapshot FAILED, so the build is stopping rather than exporting ' +
      'an empty or stale changelog.\n' +
      `  ${err.message}\n`
  )
  process.exit(1)
})
