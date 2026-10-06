import { OFFER_PLANS, PRICE_CURRENCY } from '@/lib/content/pricing'
import { FAQ_ITEMS } from '@/lib/content/faq'

/**
 * Structured data for the landing page: three `application/ld+json` blocks.
 *
 * A server component with no interactivity, so the JSON is in the static HTML
 * that `output: 'export'` emits. Crawlers that do not execute JavaScript still
 * see it — which is the entire point, and the reason this is not injected from
 * a client effect.
 *
 * The prices come from `lib/content/pricing.ts` and the FAQ pairs from
 * `lib/content/faq.ts`, the same modules `Pricing.tsx` and `Faq.tsx` read.
 * Nothing here is retyped by hand, so the markup physically cannot contradict
 * the rendered page. FAQPage markup whose text is not visible on the page is a
 * structured-data spam violation, so that guarantee is not a nicety.
 */

// Same resolution as `app/layout.tsx`, so `@id` fragments, canonical and the
// sitemap all agree on one origin on every deploy target.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

/**
 * The RASID entity lives on the main domain, not this subdomain. Pointing both
 * hosts at the same node is what consolidates the E-E-A-T signals instead of
 * letting Google treat `gopilot.earth` as an unknown orphan — so this is a
 * literal, not derived from SITE_URL.
 */
const ORG_ID = 'https://rasid.ai/#organization'

const softwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/#gopilot`,
  name: 'GoPilot',
  alternateName: ['GoPilot by RASID', 'RASID GoPilot'],
  url: `${SITE_URL}/`,
  description:
    'GoPilot is a geospatial AI agent. Describe the analysis you want in plain language and GoPilot picks the datasets, runs the right AI models, and returns raster and vector layers on an interactive map.',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Geographic Information System (GIS)',
  operatingSystem:
    'Web browser (Chrome, Edge, Safari, Firefox); QGIS 3.x plugin; ArcGIS Pro add-in',
  browserRequirements: 'Requires JavaScript and a WebGL-capable browser',
  inLanguage: 'en',
  isAccessibleForFree: true,
  image: `${SITE_URL}/og/gopilot-og.png`,
  screenshot: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/demo/sakaka-aoi@2x.jpg`,
    width: 1280,
    height: 800,
    caption:
      "Satellite view of irrigated farmland near Sakaka, Al Jawf Province, Saudi Arabia, with GoPilot's delineated field boundaries drawn over it",
  },
  featureList: [
    'Natural-language geospatial analysis over 10,000+ datasets',
    'Hundreds of AI and Earth observation models selected automatically',
    'Raster and vector export in formats such as GeoTIFF and GeoJSON',
    'Visible reasoning and a named tool-call log for every run',
    'Draw or upload an area of interest and send it with the prompt',
    'QGIS plugin and ArcGIS Pro add-in',
    'GoServers over MCP and a key-authenticated REST API',
    'GoBox packaged geospatial solutions',
  ],
  publisher: { '@id': ORG_ID },
  author: { '@id': ORG_ID },

  /* Enterprise is absent on purpose. Its price is "Custom", `schema.org/Offer`
     requires `price` plus `priceCurrency`, and inventing a number would be both
     false and invalid — `OFFER_PLANS` excludes it via a type guard so it cannot
     reappear by accident.

     There is deliberately no `aggregateRating`: no reviews have been collected
     and fabricating one is a manual-action risk. */
  offers: OFFER_PLANS.map((plan) => ({
    '@type': 'Offer',
    name: plan.name,
    description: plan.jsonLdDescription,
    price: plan.priceNumeric,
    priceCurrency: PRICE_CURRENCY,
    url: `${SITE_URL}/#pricing`,
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: plan.priceNumeric,
      priceCurrency: PRICE_CURRENCY,
      // Monthly, billed one period at a time. No annual plan is published.
      billingDuration: 1,
      billingIncrement: 1,
      unitCode: 'MON',
    },
  })),
}

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'RASID',
  url: 'https://rasid.ai',
  description:
    'RASID combines deep-tech AI, geospatial, data and software engineering to turn complex data into actionable intelligence.',
  slogan: 'Seeing Earth, Smarter.',
  email: 'info@rasid.ai',
  logo: {
    '@type': 'ImageObject',
    url: 'https://rasid.ai/logo/manifest-512.png',
    width: 512,
    height: 512,
  },
  award: 'Winner, AWS and thriveGEO GenAI for Geospatial Challenge 2026',
  knowsAbout: [
    'Geospatial AI',
    'Earth observation',
    'Remote sensing',
    'Satellite imagery analysis',
    'Geographic information systems',
    'Change detection',
  ],
  // Only accounts that exist. There is no X/Twitter and no verified GitHub
  // organisation page; listing a dead profile is a trust signal pointed at
  // nothing.
  sameAs: [
    'https://www.linkedin.com/company/rasid-ai/',
    'https://www.youtube.com/@RASIDAI',
  ],
  brand: {
    '@type': 'Brand',
    name: 'GoPilot',
    url: `${SITE_URL}/`,
  },
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: '47 rue Vivienne',
      postalCode: '75002',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Badaro Building 4961, 3rd Floor, Badaro Street, Al Mathaf',
      postalCode: '1100',
      addressLocality: 'Beirut',
      addressCountry: 'LB',
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'info@rasid.ai',
      availableLanguage: ['en', 'fr', 'ar'],
    },
  ],
}

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

/**
 * Escaping `<` is mandatory, not defensive. Without it a stray `</script>`
 * inside any string — a future FAQ answer, a feature line — terminates the
 * block early and Google sees nothing at all. `<` is valid JSON and
 * parses back to `<`, so the data is unchanged.
 */
function serialize(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(faqPage) }}
      />
    </>
  )
}

/** Named alias, so either import style compiles in `app/page.tsx`. */
export { JsonLd }
