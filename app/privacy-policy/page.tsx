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

const doc = getLegalDoc('privacy')

const TITLE = 'Privacy Policy'
const DESCRIPTION =
  'How RASID collects, uses, shares and protects personal information when you use GoPilot and the RASID platform, including your data protection rights.'
const INTRO =
  'What personal information RASID collects when you use GoPilot, how we use and share it, how long we keep it, and the rights you have over it. This is the same policy you accept in the app.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  /* trailingSlash: true, so the canonical must carry the slash or it points at
     a 308 instead of the page. */
  alternates: { canonical: '/privacy-policy/' },
  openGraph: {
    // Same reasoning as /terms/, including why this is `website` and not
    // `article`. See lib/seo.ts for what the spread is protecting against.
    ...OG_SHARED,
    type: 'website',
    url: `${SITE_URL}/privacy-policy/`,
    title: `${TITLE} | GoPilot`,
    description: DESCRIPTION,
    images: ogImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | GoPilot`,
    description: DESCRIPTION,
    images: twitterImages(),
  },
}

/** Escaping `<` for the same reason components/JsonLd.tsx does it. */
function serialize(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * A plain WebPage, for the same reason as /terms/: a policy is not editorial
 * content. `version` and `dateModified` are the machine-readable parts that
 * matter, and `publisher` ties it to the RASID entity.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/privacy-policy/#webpage`,
  url: `${SITE_URL}/privacy-policy/`,
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
      {
        '@type': 'ListItem',
        position: 2,
        name: TITLE,
        item: `${SITE_URL}/privacy-policy/`,
      },
    ],
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
      <LegalDocument docKey="privacy" doc={doc} intro={INTRO} />
    </>
  )
}
