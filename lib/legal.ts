/**
 * The Terms of Service and the Privacy Policy, read from a build-time snapshot.
 *
 * `scripts/fetch-legal.mjs` (wired into `prebuild`) reads both documents from
 * the PRODUCTION API — the same public `/accounts/meta/tos/` and
 * `/accounts/meta/privacy-policy/` endpoints the product app calls at runtime —
 * converts the Markdown to HTML and writes `lib/content/legal.generated.json`.
 * This module is the only reader, so the pages and the sitemap cannot disagree
 * about which version is published.
 *
 * Why a snapshot instead of fetching in the pages: `output: 'export'` rejects an
 * uncacheable fetch, and Next's cacheable default would let Netlify's restored
 * `.next/cache` rebuild the page from a stale copy of the API. See the script
 * header, and lib/releases.ts, which solves the same problem the same way.
 *
 * The consequence worth remembering: **a new version of the terms does not
 * appear on this site until it rebuilds.** The app picks up an edit within its
 * 5-minute query cache; this page picks it up on the next deploy. So a legal
 * change that must be live everywhere at once needs a deploy triggered with it.
 */
import snapshot from '@/lib/content/legal.generated.json'

/** The two documents, keyed as the snapshot keys them. */
export type LegalDocKey = 'tos' | 'privacy'

export type LegalDoc = {
  /** "Terms of Service" / "Privacy Policy" — the page's own h1. */
  label: string
  /** Where this site serves it, trailing slash included. */
  path: string
  /** Document version from the admin, e.g. "2.0". */
  version: string
  /** ISO date, e.g. "2026-08-25". */
  effective_date: string
  /** Rendered HTML, converted from the API's Markdown at build time. */
  html: string
}

const DOCS = snapshot as Record<LegalDocKey, LegalDoc>

/**
 * One legal document.
 *
 * Throws rather than returning null, for the same reason getRelease does: both
 * keys are compile-time constants, so a miss means the snapshot is malformed
 * and the build should stop instead of exporting a page with no terms on it.
 */
export function getLegalDoc(key: LegalDocKey): LegalDoc {
  const doc = DOCS[key]
  if (!doc) {
    throw new Error(
      `No "${key}" document in the build snapshot. ` +
        'Run `node scripts/fetch-legal.mjs` to refresh it.'
    )
  }
  return doc
}

/** Both documents, for the sitemap and for cross-linking one page to the other. */
export function getAllLegalDocs(): Array<LegalDoc & { key: LegalDocKey }> {
  return (Object.keys(DOCS) as LegalDocKey[]).map((key) => ({ key, ...DOCS[key] }))
}

/**
 * "25 August 2026" — same formatting and the same UTC pinning as
 * formatReleaseDate, so dates read identically across the site regardless of
 * where the build machine sits.
 */
export function formatEffectiveDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
