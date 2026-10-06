import { ArrowRight, Quote, Trophy } from 'lucide-react'

import Reveal from '@/components/Reveal'
import { SITE } from '@/lib/content/site'
import { TESTIMONIALS } from '@/lib/content/testimonials'

/**
 * §11 Proof. Server component.
 *
 * Three real, named, attributed people and one independently checkable award.
 * Nothing else (§11.4): GoPilot has zero published customer outcome metrics, so
 * there is no stat band, no customer count and no quantified outcome. This
 * audience would probe a fabricated number in the first sales call.
 *
 * Initials badges, not headshots (§1.16) — none exist, and initials are what the
 * parent brand renders.
 */
export default function Proof() {
  return (
    <section id="reviewed" aria-labelledby="reviewed-heading" className="section bg-white">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow text-center">Recognition</p>
          <h2
            id="reviewed-heading"
            className="mt-3 text-center font-display text-display-sm font-bold text-slate-900 md:text-display-md"
          >
            Reviewed by people who do this for a living.
          </h2>

          <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => {
              /* `emphasis` is a literal substring of `quote`, so splitting on it
                 reproduces the live site's own emphasis without storing the
                 quote twice. A non-match degrades to the plain quote rather
                 than throwing. */
              const [before, ...rest] = t.quote.split(t.emphasis)
              const after = rest.join(t.emphasis)
              const matched = rest.length > 0

              return (
                <li key={t.name} className="h-full">
                  <figure className="card flex h-full flex-col">
                    <div className="card-body flex flex-1 flex-col gap-4">
                      <Quote className="h-5 w-5 text-brand-light" aria-hidden="true" />
                      <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
                        <p>
                          {before}
                          {matched && (
                            <>
                              <strong className="font-semibold text-slate-900">{t.emphasis}</strong>
                              {after}
                            </>
                          )}
                        </p>
                      </blockquote>
                      <figcaption className="flex items-center gap-3 border-t border-slate-200 pt-4">
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light font-display text-xs font-bold text-brand-dark"
                        >
                          {t.initials}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-slate-900">
                            {t.name}
                          </span>
                          <span className="block text-xs leading-snug text-slate-500">
                            {t.title}
                          </span>
                        </span>
                      </figcaption>
                    </div>
                  </figure>
                </li>
              )
            })}
          </ul>

          {/* Gold is for accolades only. `state.warning` is a caution colour and
              must never carry a trophy. */}
          <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-gold bg-gold-light px-6 py-5 text-center sm:flex-row sm:justify-center sm:text-left">
            <Trophy className="h-6 w-6 shrink-0 text-gold" aria-hidden="true" />
            <p className="text-sm font-semibold text-gold-dark">
              {SITE.awardLabel}
              <span className="mx-1.5 font-normal text-gold-dark/60" aria-hidden="true">
                ·
              </span>
              <span className="font-normal">GoPilot launch, AWS London</span>
            </p>
            <a
              href={SITE.awardHref}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-1 text-xs font-medium text-gold-dark underline underline-offset-2 sm:ml-2"
            >
              Read about the challenge
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            <a
              href="https://rasid.ai/publications"
              className="group inline-flex items-center gap-1.5 link-brand"
            >
              Grounded in peer-reviewed research: three papers with DOIs
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
