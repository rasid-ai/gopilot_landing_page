import type { Metadata } from 'next'
import LegalDocument from '@/components/LegalDocument'
import { getLegalDoc } from '@/lib/legal'
import { OG_SHARED, ogImages, twitterImages } from '@/lib/seo'

/* Same resolution as app/layout.tsx, app/sitemap.ts, app/robots.ts and
   components/JsonLd.tsx, so canonical, sitemap and @id all agree on one origin
   on every deploy target. */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

const ORG_ID = 'https://rasid.ai/#organization'

const doc = getLegalDoc('tos')

const TITLE = 'Terms of Service'
const DESCRIPTION =
  'The SaaS Agreement governing use of GoPilot and the RASID platform: accounts, fees, data, licences and liability.'
const INTRO =
  'The SaaS Agreement between you and RASID, covering your account, the Services, fees, your data and the limits of our liability. These are the same terms you accept in the app.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  /* trailingSlash: true, so the canonical must carry the slash or it points at
     a 308 instead of the page. */
  alternates: { canonical: '/terms/' },
  openGraph: {
    /* `OG_SHARED` and `ogImages()` are not optional decoration: Next replaces
       the layout's `openGraph` wholesale here rather than merging into it, so
       without them this page ships no share image, no og:site_name and no
       og:locale. See lib/seo.ts. */
    ...OG_SHARED,
    /* `website`, not `article`. A contract is not editorial content — the same
       call the JSON-LD below makes — and `article` would also invite
       article:* tags that say nothing true about a legal document. The
       effective date is published in the JSON-LD and on the page itself. */
    type: 'website',
    url: `${SITE_URL}/terms/`,
    title: `${TITLE} | GoPilot`,
    description: DESCRIPTION,
    images: ogImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | GoPilot`,
    description: DESCRIPTION,
    // A summary_large_image card with no image renders as a blank slab.
    images: twitterImages(),
  },
}

/** Escaping `<` for the same reason components/JsonLd.tsx does it. */
function serialize(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * A plain WebPage, not an Article: this is a contract, not editorial content,
 * and claiming otherwise invites a rich result it should never get. `version`
 * and `dateModified` are the parts worth stating in machine-readable form, and
 * `publisher` ties the document to the RASID entity the rest of the site
 * declares.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/terms/#webpage`,
  url: `${SITE_URL}/terms/`,
  name: `GoPilot ${TITLE}`,
  description: DESCRIPTION,
  inLanguage: 'en',
  version: doc.version,
  dateModified: doc.effective_date,
  /* The SoftwareApplication node the homepage declares (components/JsonLd.tsx).
     No `isPartOf`: there is no WebSite node on this site to point at, and an
     @id that resolves to nothing is worse than an omission. */
  about: { '@id': `${SITE_URL}/#gopilot` },
  publisher: { '@id': ORG_ID },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GoPilot', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: TITLE, item: `${SITE_URL}/terms/` },
    ],
  },
}

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
      <LegalDocument docKey="tos" doc={doc} intro={INTRO} />
    </>
  )
}
