import { SITE } from '@/lib/content/site'

/**
 * The published plans, verbatim from the live homepage pricing table.
 *
 * This module is the SINGLE source for two consumers:
 *   1. `components/Pricing.tsx` — the four cards.
 *   2. `components/JsonLd.tsx` — the `offers` array on the
 *      `SoftwareApplication` block.
 *
 * Because both read the same objects, a price can never drift between the
 * visible page and the structured data a crawler or an AI answer engine reads.
 *
 * Hard rules carried by the data itself:
 *   - Monthly only. No annual toggle and no annual discount is published.
 *   - `1 named user` appears on BOTH Pro and Business on the live site. That is
 *     reproduced as-is and must not be "corrected".
 *   - Pro and Business point at the live plans page rather than a `?plan=`
 *     deep link, because no plan code is verified. The plans endpoint is
 *     publicly readable before signup, so a guest lands on a working page.
 */

export type PlanCode = 'free' | 'pro' | 'business' | 'enterprise'

export type Plan = {
  code: PlanCode
  name: string
  /** Rendered as a `.badge` next to the plan name. `null` on plans without one. */
  badge: string | null
  /** Exactly one plan is highlighted, with `ring-2 ring-brand`. */
  highlighted: boolean
  tagline: string
  /** Display price, currency symbol included, or the word `Custom`. */
  price: string
  interval: string
  tokens: string
  storage: string
  featuresHeading: string
  features: readonly string[]
  ctaLabel: string
  ctaHref: string
  ctaVariant: 'btn-primary' | 'btn-outline'
  /**
   * Enterprise pricing is quoted, not published. `schema.org/Offer` requires a
   * `price` plus a `priceCurrency`, so a custom-priced plan cannot be expressed
   * as an Offer and inventing a number would be both false and invalid.
   */
  priceIsCustom: boolean
  /** Bare numeric string for JSON-LD (`"0"`, `"149"`). `null` when custom. */
  priceNumeric: string | null
  /**
   * Prose description for the JSON-LD Offer. Held here rather than in
   * `JsonLd.tsx` so the numbers it contains come from the same record as the
   * card's. It is a sentence, not a join of `features`, because the structured
   * data reads as prose to an answer engine. `null` when custom.
   */
  jsonLdDescription: string | null
}

export const PLANS: readonly Plan[] = [
  {
    code: 'free',
    name: 'Free',
    badge: null,
    highlighted: false,
    tagline: 'Explore GoPilot and run your first analyses.',
    price: '€0',
    interval: 'per month',
    tokens: '50,000',
    storage: '1 GB',
    featuresHeading: 'Includes',
    features: [
      'Basic datasets',
      'Basic AI models',
      'Export raster and vector results',
      'Session history management',
    ],
    ctaLabel: SITE.ctaPrimaryLabel,
    ctaHref: SITE.ctaPrimaryHref,
    ctaVariant: 'btn-primary',
    priceIsCustom: false,
    priceNumeric: '0',
    jsonLdDescription:
      'Explore GoPilot and run your first analyses. 50,000 tokens per month, basic datasets and AI models, raster and vector export, session history management, 1 GB storage.',
  },
  {
    code: 'pro',
    name: 'Pro',
    badge: 'Most popular',
    highlighted: true,
    tagline: 'For analysts running recurring geospatial work.',
    price: '€149',
    interval: 'per month',
    tokens: '500,000',
    storage: '100 GB',
    featuresHeading: 'Everything in Free, plus',
    features: [
      'Pro datasets',
      'Pro AI models',
      'Dashboard',
      'GoBox',
      'QGIS Plugin',
      'Personal license',
      '1 named user',
    ],
    ctaLabel: 'Start Pro →',
    ctaHref: SITE.plansHref,
    ctaVariant: 'btn-primary',
    priceIsCustom: false,
    priceNumeric: '149',
    jsonLdDescription:
      'For analysts running recurring geospatial work. 500,000 tokens per month, Pro datasets and AI models, Dashboard, GoBox, QGIS Plugin, 100 GB storage, personal license, 1 named user.',
  },
  {
    code: 'business',
    name: 'Business',
    badge: null,
    highlighted: false,
    tagline: 'For organizations scaling geospatial intelligence.',
    price: '€499',
    interval: 'per month',
    tokens: '2,500,000',
    storage: '1 TB',
    featuresHeading: 'Everything in Pro, plus',
    features: [
      'Premium datasets',
      'Premium AI models',
      'ArcGIS Pro Add-in',
      'Priority email support',
      'Commercial license',
      '1 named user',
    ],
    ctaLabel: 'Start Business →',
    ctaHref: SITE.plansHref,
    ctaVariant: 'btn-outline',
    priceIsCustom: false,
    priceNumeric: '499',
    jsonLdDescription:
      'For organizations scaling geospatial intelligence. 2,500,000 tokens per month, premium datasets and AI models, ArcGIS Pro Add-in, 1 TB storage, priority email support, commercial license, 1 named user.',
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    badge: null,
    highlighted: false,
    tagline: 'For organizations with custom deployment needs.',
    price: 'Custom',
    interval: 'tailored to your deployment',
    tokens: 'Custom',
    storage: 'Custom',
    featuresHeading: 'Everything in Business, plus',
    features: [
      'MCP connector for AI agents',
      'Custom on-prem installation',
      'Custom Cloud installation',
      'Dedicated account manager',
    ],
    ctaLabel: 'Talk to sales →',
    ctaHref: SITE.ctaSalesHref,
    ctaVariant: 'btn-outline',
    priceIsCustom: true,
    priceNumeric: null,
    jsonLdDescription: null,
  },
] as const

/** Currency for every published price. ISO 4217, as `schema.org` expects. */
export const PRICE_CURRENCY = 'EUR'

export type TopUpCode = 'topup-100k' | 'topup-500k' | 'topup-2m'

export type TopUp = {
  code: TopUpCode
  /** Pack size, the tile's own heading. Formatted with thousands separators. */
  tokens: string
  /**
   * The discount the pack carries against the 100,000 pack's unit rate, as the
   * store words it. `null` on the pack that *is* the list rate — writing
   * "Save 0%" there would be noise.
   */
  saving: string | null
  /** Display price, currency symbol included. */
  price: string
  /** Bare numeric string for JSON-LD. */
  priceNumeric: string
  /** Prose description for the JSON-LD Offer, same role as `Plan`'s. */
  jsonLdDescription: string
}

/**
 * One-time token packs, bought on top of whatever plan the account is on.
 *
 * Same contract as `PLANS`: this is the single source for the tiles in
 * `components/Pricing.tsx` and for the one-time `offers` in
 * `components/JsonLd.tsx`, so a pack price cannot drift between the two.
 *
 * The per-token rate is set by the 100,000 pack (EUR 20, so EUR 0.0002 each);
 * the larger packs' savings are quoted against it and are arithmetically true
 * at these prices. Changing a price without rechecking its `saving` is how that
 * stops being the case.
 *
 * NOTE: no `ctaLabel` / `ctaHref`, unlike `Plan`. A pack is bought from inside a
 * signed-in account, so a per-pack "Buy" on a public page cannot complete and
 * would put three competing buttons under the plan grid's own CTAs. The section
 * publishes the prices and sends the reader to their account once. If a
 * checkout URL that works for a guest ever exists, that is the moment to add
 * these fields back — not before.
 *
 * Deliberately absent: any claim about when top-up tokens expire. The monthly
 * allowance expires at the period reset, a top-up is a separate purchase, and
 * no published figure covers it — so the page says nothing either way.
 */
export const TOP_UPS: readonly TopUp[] = [
  {
    code: 'topup-100k',
    tokens: '100,000 tokens',
    saving: null,
    price: '€20',
    priceNumeric: '20',
    jsonLdDescription: 'One-time top-up of 100,000 GoPilot tokens.',
  },
  {
    code: 'topup-500k',
    tokens: '500,000 tokens',
    saving: 'Save 15%',
    price: '€85',
    priceNumeric: '85',
    jsonLdDescription: 'One-time top-up of 500,000 GoPilot tokens, 15% below the 100,000 pack rate.',
  },
  {
    code: 'topup-2m',
    tokens: '2,000,000 tokens',
    saving: 'Save 25%',
    price: '€300',
    priceNumeric: '300',
    jsonLdDescription:
      'One-time top-up of 2,000,000 GoPilot tokens, 25% below the 100,000 pack rate.',
  },
] as const

export type OfferPlan = Plan & { priceNumeric: string; jsonLdDescription: string }

/**
 * The plans that can legally become a `schema.org/Offer` — i.e. everything with
 * a published price. The type guard rather than a cast means Enterprise cannot
 * be reintroduced here by accident.
 */
export const OFFER_PLANS: readonly OfferPlan[] = PLANS.filter(
  (plan): plan is OfferPlan =>
    !plan.priceIsCustom && plan.priceNumeric !== null && plan.jsonLdDescription !== null,
)
