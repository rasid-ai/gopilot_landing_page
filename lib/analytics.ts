/**
 * The ONE metric this page measures: signup conversion rate.
 *
 *     conversion rate = unique visitors who fired `signup_cta_clicked`
 *                     ÷ unique visitors who fired `$pageview`
 *
 * Two events, and deliberately no third. `$pageview` is the denominator and
 * PostHog captures it on its own; `signup_cta_clicked` is the numerator and is
 * captured by `components/Analytics.tsx`. Autocapture, heatmaps, session
 * recording, pageleave and exception capture are all switched off there, so
 * this file plus that one are the complete, auditable list of what leaves a
 * visitor's browser. Adding an event means editing this comment too.
 *
 * Mirrors the setup on the rasid.ai landing page (`lib/analytics.ts` there),
 * with two deliberate differences, both forced by this repo's constraints:
 *
 *   1. No `@posthog/react` provider. Nothing here consumes React context, and
 *      a provider around the tree would be a fourth client component for no
 *      signal. `posthog-js` alone is enough.
 *   2. No `onClick` on the CTAs. Every CTA on this page lives in a SERVER
 *      component (nav, hero, pricing, footer, closing band), and attaching
 *      handlers would convert five of them to client components — against the
 *      three-component budget in the README, and it would put the hero's
 *      hydration on the critical path where the LCP element is. One delegated
 *      listener on `document` gets the same data and keeps all of them static.
 */

/* TYPE-ONLY import, and it must stay that way. `posthog-js` is 101 KB gzipped —
   a static import here puts it in the home page's first-load JS, roughly
   doubling the page's script payload for a two-event metric. The type is erased
   at compile time, so this line costs nothing; `components/Analytics.tsx`
   imports the library itself dynamically, after hydration. */
import type { PostHog } from 'posthog-js'

/** The only custom event this site sends. */
export const SIGNUP_CTA_EVENT = 'signup_cta_clicked'

/**
 * Marks an anchor as a signup-CTA candidate and names its placement.
 *
 * An attribute rather than DOM derivation, because ancestor-sniffing is wrong
 * for exactly the placements that matter: the mobile sheet is portalled to
 * `<body>` so it has no `<header>` ancestor, and the release pages' CTA band is
 * a `<section>` with no `id`. Both would silently report "unknown", and mobile
 * is where most of the traffic is.
 */
export const CTA_ATTR = 'data-cta'

/** Values `data-cta` is allowed to take. One per CTA placement on the site. */
export type CtaLocation =
  | 'nav'
  | 'nav_mobile'
  | 'hero'
  | 'pricing_free'
  | 'pricing_pro'
  | 'pricing_business'
  | 'pricing_enterprise'
  | 'closing'
  | 'footer'
  | 'release'

/**
 * Fires the conversion event.
 *
 * `location` is a breakdown property on one event rather than one event per
 * placement — the same call the rasid.ai site makes, and for the same reason:
 * the funnel stays a single step, and "which placement converts?" is still a
 * dropdown in PostHog rather than a schema change.
 *
 * Takes the client as an argument instead of importing the singleton, which is
 * what lets this module stay free of a runtime `posthog-js` import.
 */
export function trackSignupCtaClick(ph: PostHog, location: CtaLocation, href: string) {
  ph.capture(SIGNUP_CTA_EVENT, { location, href })
}
