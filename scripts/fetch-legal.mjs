/**
 * Snapshot the Terms of Service and the Privacy Policy into
 * lib/content/legal.generated.json, once per build, before Next starts.
 *
 * ONE SOURCE OF TRUTH, TWO PROPERTIES. The product app (saas-ui) renders these
 * same two documents at /terms and /privacy-policy by calling
 * `/accounts/meta/tos/` and `/accounts/meta/privacy-policy/` at runtime
 * (src/features/auth/api.ts). Both endpoints are public — no session, no CSRF —
 * which is what lets this static site read them too. Legal copy is edited in the
 * RASID admin and nowhere else, so the app and this page can never disagree
 * about what a user agreed to.
 *
 * WHY A SCRIPT AND NOT `fetch` INSIDE THE PAGES
 * Identical reasoning to scripts/fetch-releases.mjs: `output: 'export'` rejects
 * an uncacheable fetch, and Next's cacheable default would let Netlify's
 * restored `.next/cache` rebuild the page from a stale copy of the API — which
 * for a legal document means publishing terms nobody approved. A plain Node
 * fetch has no framework caching at all, and the result lands in a file the
 * build log can show you.
 *
 * MARKDOWN IN, HTML OUT. The API returns Markdown (the app pipes it through
 * react-markdown). This site has no Markdown renderer in its runtime, and does
 * not need one: converting here keeps the client bundle unchanged and gives the
 * pages the same "trusted HTML from the admin" shape that the release notes
 * already use.
 *
 * PRODUCTION, ALWAYS — same default host and same override as the releases
 * snapshot, for the same reason: beta carries different document versions, and
 * publishing a beta draft of the terms on the public site would be worse than
 * a stale changelog.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { marked } from 'marked'

const API_BASE = (
  process.env.NEXT_PUBLIC_RELEASES_API ?? 'https://api.rasid.ai/api'
).replace(/\/+$/, '')

const OUT = join(process.cwd(), 'lib', 'content', 'legal.generated.json')

/* Keyed by the name lib/legal.ts exports, so the page, the sitemap and the
   snapshot cannot drift apart. `path` is the route this site serves the
   document at; it matches the app's own route for the same document, so a link
   copied between the two properties keeps working. */
const DOCUMENTS = [
  { key: 'tos', endpoint: '/accounts/meta/tos/', label: 'Terms of Service', path: '/terms/' },
  {
    key: 'privacy',
    endpoint: '/accounts/meta/privacy-policy/',
    label: 'Privacy Policy',
    path: '/privacy-policy/',
  },
]

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${url}`)
  }
  return res.json()
}

/**
 * Markdown → HTML, with `gfm` on to match the app's `remarkGfm`.
 *
 * `breaks: false` on purpose. The documents are Word exports and arrive with
 * CRLF line endings; treating every newline as a <br> would shred the
 * paragraphs into ragged lines. CommonMark paragraph rules are what the app
 * applies too, so both renderings agree.
 */
function toHtml(markdown) {
  return marked.parse(markdown, { gfm: true, breaks: false, async: false }).trim()
}

/**
 * Warn, loudly and in every deploy log, about links in the legal copy that
 * leave the RASID estate.
 *
 * NOT a build stopper, and NOT rewritten here: the text of a legal document is
 * edited in the admin, not patched by a build script, or this site and the app
 * would start serving different terms. But a stray link is worth seeing — the
 * current Terms §3.7 points the words "Privacy Policy" at meetup.com, a
 * leftover from whatever template the document was drafted from, and nobody was
 * going to notice it inside a 31,000-character Word export.
 */
function warnOnForeignLinks(label, html) {
  const allowed = /(^|\.)(rasid\.ai|gopilot\.earth)$/
  const foreign = []

  for (const [, href] of html.matchAll(/<a href="([^"]+)"/g)) {
    if (href.startsWith('mailto:') || href.startsWith('#')) continue
    try {
      const { hostname } = new URL(href)
      if (!allowed.test(hostname)) foreign.push(href)
    } catch {
      foreign.push(href)
    }
  }

  if (foreign.length) {
    console.warn(
      `  ! ${label} links to ${foreign.length} non-RASID URL(s): ${[
        ...new Set(foreign),
      ].join(', ')}\n` +
        '    Check these are intended. Fix them in the RASID admin, which also ' +
        'fixes the in-app copy.'
    )
  }
}

async function main() {
  const out = {}

  for (const doc of DOCUMENTS) {
    const payload = await getJson(`${API_BASE}${doc.endpoint}`)

    /* The three fields the app's LegalDocSchema requires (saas-ui
       src/features/auth/types.ts). A missing one means the endpoint changed
       shape, and a legal page with no version or no effective date is not a
       legal page, so stop the build rather than export it. */
    for (const field of ['version', 'content', 'effective_date']) {
      if (!payload[field]) {
        throw new Error(
          `${doc.label} response has no \`${field}\`. ` +
            `Fields present: ${Object.keys(payload).join(', ') || 'none'}.`
        )
      }
    }

    const html = toHtml(payload.content)
    warnOnForeignLinks(doc.label, html)

    out[doc.key] = {
      label: doc.label,
      path: doc.path,
      version: String(payload.version),
      effective_date: payload.effective_date,
      html,
    }
  }

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`, 'utf8')

  // Printed so a deploy log answers "which version of the terms is live on the
  // site?" without anyone having to open the artefact.
  console.log(
    `Legal snapshot: ${DOCUMENTS.map(
      (d) => `${d.label} v${out[d.key].version} (effective ${out[d.key].effective_date})`
    ).join(', ')} from ${API_BASE}`
  )
}

main().catch((err) => {
  console.error(
    '\nLegal snapshot FAILED, so the build is stopping rather than exporting ' +
      'empty or stale Terms and Privacy pages.\n' +
      `  ${err.message}\n`
  )
  process.exit(1)
})
