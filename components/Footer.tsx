import { SITE } from '@/lib/content/site'

type FooterLink = { label: string; href: string }
type FooterColumn = { title: string; links: readonly FooterLink[] }

/**
 * §15.1, verbatim. Every `rasid.ai` link here is deliberate: they are the
 * entity-consolidation signal that keeps Google treating gopilot.earth as
 * part of RASID rather than an orphan subdomain. They are not decoration, and
 * they are never `rel="nofollow"`.
 *
 * `API Documentation` is omitted: no public URL is verified (§1.19).
 * Terms and Privacy are added relative to the live rasid.ai footer, which
 * omits them; a self-serve product that takes card payments must link both.
 *
 * Note the ArcGIS row points at the products page, not SITE.arcgisHref — the
 * footer links the overview, not the binary download.
 */
const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'GoPilot', href: '#hero' },
      { label: 'GoServers / MCP', href: 'https://rasid.ai/products#mcps' },
      { label: 'QGIS plugin', href: SITE.qgisHref },
      { label: 'ArcGIS Pro add-in', href: 'https://rasid.ai/products#plugins' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Try with no account', href: SITE.ctaTryHref },
      // The only Sign in on the page. The header and the mobile sheet carry a
      // single sign-up CTA, so this is the route back in for someone who
      // already has an account and landed here instead of on the app.
      { label: 'Sign in', href: SITE.ctaSignInHref },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Urban', href: 'https://rasid.ai/services#urban' },
      { label: 'Agriculture', href: 'https://rasid.ai/services#agriculture' },
      { label: 'Environmental', href: 'https://rasid.ai/services#environmental' },
      { label: 'Transportation', href: 'https://rasid.ai/services#transportation' },
      { label: 'Defense', href: 'https://rasid.ai/services#defense' },
      { label: 'All services', href: 'https://rasid.ai/services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'RASID, AI & geospatial consultancy', href: 'https://rasid.ai/' },
      { label: 'What we do', href: 'https://rasid.ai/about' },
      {
        label: 'GoPilot case study',
        href: 'https://rasid.ai/case-studies/gopilot-ai-geospatial-agent',
      },
      { label: 'Case studies', href: 'https://rasid.ai/case-studies' },
      { label: 'Publications', href: 'https://rasid.ai/publications' },
      { label: 'Contact', href: 'https://rasid.ai/#contact' },
    ],
  },
  {
    title: 'Legal & social',
    links: [
      { label: 'Terms of Service', href: SITE.termsHref },
      { label: 'Privacy Policy', href: SITE.privacyHref },
      { label: 'LinkedIn', href: SITE.linkedin },
      { label: 'YouTube', href: SITE.youtube },
    ],
  },
]

/**
 * Same-brand links open in place; everything else gets target="_blank".
 * Matching on the hostname rather than on a substring of the whole URL is what
 * keeps `linkedin.com/company/rasid-ai` and `youtube.com/@RASIDAI` out of the
 * same-brand bucket.
 */
function isSameBrand(href: string): boolean {
  if (href.startsWith('#') || href.startsWith('mailto:')) return true
  try {
    const { hostname } = new URL(href)
    return hostname === 'rasid.ai' || hostname.endsWith('.rasid.ai')
  } catch {
    return false
  }
}

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      {/* §3.0: footer labels are <p>, not headings. One sr-only h2 keeps the
          footer in the outline without diluting the on-page topic. */}
      <h2 className="sr-only">Footer</h2>
      <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-2.5">
              {/* Reversed variant: white strokes, so it holds up on brand-900.
                  Its small knockout fills are #006B55 (the variant is generated
                  against that green), which on #0C3F37 read as deliberate depth
                  rather than as holes. alt="" — "GoPilot" follows in text. */}
              <img
                src="/brand/gopilot-mark-reversed.svg"
                alt=""
                width="32"
                height="32"
                className="h-8 w-8"
              />
              <span className="font-display text-lg font-bold tracking-tight text-white">
                GoPilot
              </span>
            </div>
            <p className="mt-4 max-w-[30ch] font-display text-sm font-semibold text-white">
              {SITE.tagline}
            </p>
            <a
              href={SITE.ctaPrimaryHref}
              className="btn btn-on-brand mt-5 w-full justify-center sm:w-auto"
            >
              <span className="whitespace-nowrap">{SITE.ctaPrimaryLabel}</span>{' '}
              <span aria-hidden="true">&rarr;</span>
            </a>
            <p className="mt-5 text-xs text-white/50">
              Paris, France <span aria-hidden="true">&middot;</span> Beirut, Lebanon
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-1 block text-xs text-white/75 transition-colors hover:text-white"
            >
              {SITE.email}
            </a>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => {
                  const external = !isSameBrand(link.href)
                  return (
                    <li key={link.href}>
                      <a
                        className="text-sm text-white/75 transition-colors hover:text-white"
                        href={link.href}
                        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* §3.2 disclosure 4. The live site's "procedurally generated for
            demonstration" line is deliberately NOT reproduced (§1.18): this
            page ships real imagery and real model output, so that line would
            be false here. */}
        <div className="mt-12 space-y-2 border-t border-brand-800 pt-6">
          <p className="text-xs text-white/50">&copy; 2026 RASID. All rights reserved.</p>
          <p className="text-xs text-white/50">
            Satellite basemap &copy; Mapbox &copy; Maxar &copy; OpenStreetMap. Field boundaries
            shown are real GoPilot model output.
          </p>
        </div>
      </div>
    </footer>
  )
}
