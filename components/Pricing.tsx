import { Check } from 'lucide-react'

import Reveal from '@/components/Reveal'
import { PLANS, TOP_UPS } from '@/lib/content/pricing'
import { SITE } from '@/lib/content/site'

/**
 * Section 9, pricing. Every price, label, feature row and CTA comes from
 * `lib/content/pricing.ts`, which also feeds the JSON-LD `offers`. Nothing here
 * is retyped: publishing prices on this page is only safe because one module
 * drives both consumers, so the visible card and the structured data a crawler
 * reads cannot diverge.
 *
 * Deliberately absent: an annual toggle (only monthly is published), any
 * per-analysis token estimate (no such figure exists) and any `?plan=` deep
 * link (no plan code is verified).
 */
export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="section bg-slate-50">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow text-center">Pricing</p>
          <h2
            id="pricing-heading"
            className="mt-3 text-center font-display text-display-sm font-bold text-slate-900 md:text-display-md"
          >
            Start free. Scale when you need to.
          </h2>
          <p className="lead mt-4 text-center">
            Every plan includes the full map workspace. What changes is how much GoPilot you get, how
            much you can store, and which datasets and exports are unlocked.
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => (
              <li
                key={plan.code}
                /* Highlighting is a ring and nothing else: no gradient border, no scale
                   transform, no coloured fill. That is the product's own treatment. */
                className={`card flex flex-col${plan.highlighted ? ' ring-2 ring-brand' : ''}`}
              >
                <div className="card-body flex flex-1 flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    {plan.badge && (
                      <span className="badge bg-brand-light text-brand-dark">{plan.badge}</span>
                    )}
                  </div>
                  <p className="-mt-2 text-sm text-slate-500">{plan.tagline}</p>

                  <div>
                    <span className="text-3xl font-bold text-slate-800">{plan.price}</span>
                    <span className="ml-1 text-xs text-slate-500">{plan.interval}</span>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 rounded-lg bg-brand-soft p-3 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Tokens</dt>
                      <dd className="font-semibold text-slate-800">{plan.tokens}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Storage</dt>
                      <dd className="font-semibold text-slate-800">{plan.storage}</dd>
                    </div>
                  </dl>

                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {plan.featuresHeading}
                  </p>
                  <ul className="space-y-1.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-state-success"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.ctaHref}
                    /* All four are tagged, but only Free's href is the signup
                       URL, so only Free counts toward the conversion metric —
                       the listener checks the href, not just the attribute.
                       If a paid card is ever pointed at signup, it starts
                       counting with no change here. See `lib/analytics.ts`. */
                    data-cta={`pricing_${plan.code}`}
                    className={`btn ${plan.ctaVariant} mt-auto w-full justify-center`}
                  >
                    {plan.ctaLabel}
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {/* Top-ups, from `TOP_UPS`. A sub-section inside §9 rather than a section of
              its own: it is the same decision, priced the same way, and a buyer only
              asks "what if I run out?" after reading the plan above it.

              These are tiles, not a fourth row of plan cards: a top-up has one number
              to compare, not a feature list, and reusing the tall card would read as a
              choice between tiers rather than a quantity.

              No per-pack "Buy" button, by decision rather than omission. A pack is
              bought from inside a signed-in account, so three buttons here would each
              land a guest on a sign-up wall, and they would compete with the plan
              grid's own CTAs — including the one primary action of the whole page,
              directly above. The prices answer "what if I run out?" on their own; one
              quiet link closes the block. */}
          <div className="card mt-14 p-6 sm:p-8">
            <div className="text-center">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Need more mid-period? Top up.
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                One-time token packs on top of your plan. The bigger the pack, the lower the
                per-token price.
              </p>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TOP_UPS.map((topUp) => (
                <li
                  key={topUp.code}
                  className="rounded-lg bg-brand-soft p-4 text-center sm:text-left"
                >
                  <p className="font-semibold text-slate-900">{topUp.tokens}</p>
                  {/* Holds its line even when empty, so the three prices sit on one
                      baseline across the row instead of stepping. */}
                  <p className="mt-0.5 text-xs text-slate-500">
                    {topUp.saving ?? <span aria-hidden="true">&nbsp;</span>}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">{topUp.price}</p>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-center text-sm">
              <a href={SITE.plansHref} className="link-brand">
                Top up any time from your account <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>

          {/* Footnote 1 is verbatim from the live site and must not be expanded. The app
              bills geospatial processing in euros against a separate account balance, so
              glossing what tokens cover, or implying one pool, would be false. */}
          <div className="mt-8 space-y-2 text-center">
            <p className="text-xs text-slate-500">
              Tokens are used across GoPilot, GoBox, and RASID&rsquo;s MCP / API services.
            </p>
            <p className="text-xs text-slate-500">
              A turn costs what it costs. A long analysis over large rasters uses more than a
              one-line question, and unused tokens expire when the period resets rather than rolling
              over.
            </p>
            <p className="text-xs text-slate-500">
              <a href={SITE.plansHref} className="link-brand">
                See the live plan page
              </a>{' '}
              for the current list.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
