/**
 * The seven ecosystem and technology partners, in the live site's order.
 *
 * These are NOT GoPilot customers. The strip header is `Built with leading
 * organizations.`, verbatim from the live site. Never "Trusted by", never
 * "Our customers", never "Powering teams at".
 *
 * `name` is the wordmark string for Variant B. `alt` is the accessible name for
 * Variant A's `<img>` — spelled out, because a screen-reader user gets nothing
 * from "OGC". The word "logo" never appears in alt text; it is never useful.
 */

export type Partner = {
  name: string
  file: string
  alt: string
}

export const PARTNERS: readonly Partner[] = [
  { name: 'AWS', file: '/partners/aws.png', alt: 'AWS' },
  { name: 'World Bank', file: '/partners/world-bank.png', alt: 'World Bank' },
  { name: 'OGC', file: '/partners/ogc.svg', alt: 'Open Geospatial Consortium' },
  { name: 'UNDP', file: '/partners/undp-rbas.png', alt: 'UNDP Regional Bureau for Arab States' },
  { name: 'CGI', file: '/partners/cgi.png', alt: 'CGI' },
  { name: 'AOAD', file: '/partners/aoad.png', alt: 'Arab Organization for Agricultural Development' },
  { name: 'FRED Engineering', file: '/partners/fred.png', alt: 'FRED Engineering' },
]

/**
 * Which strip to render. Set once at build time; do not branch per partner.
 *
 * `'logos'` requires all seven files to be present in `public/partners/`.
 * `'wordmarks'` is the zero-asset fallback and is fully honest.
 *
 * Currently `'wordmarks'`: `public/partners/` is empty — the seven files are
 * not in the repo and the §24.2 download was not run. Never ship a mix, and
 * never ship a broken `img`. Flip this to `'logos'` only after all seven files
 * exist and `ls public/partners` shows no gaps.
 */
export const PARTNER_VARIANT: 'logos' | 'wordmarks' = 'wordmarks'

/** Verbatim from the live site. Not a trust claim — a participation claim. */
export const PARTNER_HEADING = 'Built with leading organizations.'

/**
 * The defensible version of the ecosystem claim — a near-verbatim lift from
 * `rasid.ai/about`, rendered as a single link below the strip in both variants.
 */
export const PARTNER_FOOTNOTE = {
  href: 'https://rasid.ai/about',
  text: 'RASID participates in the wider geospatial ecosystem through AWS, the World Bank and the OGC',
} as const
