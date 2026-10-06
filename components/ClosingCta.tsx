import { SITE } from '@/lib/content/site'

/**
 * Section 11, closing CTA. One of the page's three sanctioned dark/saturated
 * moments, and the only place the brand's own tagline appears as a headline:
 * in the hero it would be vapor the visitor has no basis to accept, while after
 * ten sections of mechanics it reads as a conclusion they arrived at. Do not
 * move it up the page.
 *
 * No decorative texture behind the band. The product has none other than the
 * canvas dot grid, and the flat `bg-brand` slab is itself the strongest "this is
 * RASID" signal available, because it is the app's sidebar scaled up.
 *
 * The 30-minute call is the page's only tertiary CTA and appears nowhere else,
 * so it reads as the alternative to signing up rather than as a competing path.
 */
export default function ClosingCta() {
  return (
    <section id="start" aria-labelledby="start-heading" className="bg-brand">
      <div className="mx-auto max-w-page px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
        <h2
          id="start-heading"
          className="font-display text-display-sm font-bold text-white md:text-display-md"
        >
          {SITE.tagline}
        </h2>

        <p className="mx-auto mt-4 max-w-[46ch] text-lg leading-relaxed text-white/80">
          Sign up, draw an area, and ask. 500 tokens, no credit card.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={SITE.ctaPrimaryHref}
            className="btn btn-lg btn-on-brand w-full justify-center sm:w-auto"
          >
            {SITE.ctaPrimaryLabel} <span aria-hidden="true">&rarr;</span>
          </a>
          {/* Outline-on-green is hand-rolled rather than `btn-outline`: that variant's
              border and text are brand green, which disappears on this surface. */}
          <a
            href={SITE.ctaSalesHref}
            target="_blank"
            rel="noopener"
            className="btn btn-lg w-full justify-center border-white/30 text-white transition-colors hover:bg-white/10 hover:text-white sm:w-auto"
          >
            Book a 30-minute call <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}
