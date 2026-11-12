/**
 * The Open Graph and Twitter fields every page must carry, in one place.
 *
 * THE TRAP THIS MODULE EXISTS TO CLOSE. Next merges `metadata` SHALLOWLY. A page
 * that declares its own `openGraph` REPLACES the layout's object outright — it
 * does not inherit `images`, `siteName` or `locale` from it. So every sub-page
 * added since the single-page build silently shipped without a share-card
 * image: `/releases/` had none at all, and a release page only had one because
 * the API happened to supply `featured_image`. A `twitter:card` of
 * `summary_large_image` with no image attached is worse than no card markup at
 * all — LinkedIn and Slack render a blank slab with the URL in it.
 *
 * Spread `OG_SHARED` into every page-level `openGraph`, and pass the page's
 * image through `ogImages()` / `twitterImages()`, and the gap cannot reopen.
 *
 * Paths stay relative: `metadataBase` in app/layout.tsx makes them absolute at
 * build time, which is also what keeps a preview origin correct.
 */

/** 1200x630 PNG. Must physically exist at public/og/gopilot-og.png — the asset
 *  gate (scripts/check-assets.mjs) fails the build if it does not. */
export const OG_IMAGE = '/og/gopilot-og.png'

export const OG_IMAGE_ALT =
  'GoPilot chat panel beside a map, answering a plain-language request with a generated satellite-derived vector layer'

/** Lost on every sub-page before this module existed. */
export const OG_SHARED = {
  siteName: 'GoPilot by RASID',
  locale: 'en_US',
} as const

/**
 * `openGraph.images` for a page, falling back to the site card.
 *
 * `src` is the page's own image if it has one — a release's `featured_image`,
 * already absolute on the API host, which is why no dimensions are declared for
 * it: stating 1200x630 for an image we have not measured would be a lie that
 * crops someone's card.
 */
export function ogImages(src?: string | null) {
  if (src) return [{ url: src }]
  return [
    {
      url: OG_IMAGE,
      width: 1200,
      height: 630,
      alt: OG_IMAGE_ALT,
      type: 'image/png',
    },
  ]
}

/** `twitter.images`, same fallback. */
export function twitterImages(src?: string | null) {
  if (src) return [{ url: src }]
  return [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }]
}
