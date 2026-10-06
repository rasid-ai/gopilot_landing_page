import { ArrowRight } from 'lucide-react'

import GoPilotDemo from '@/components/demo/GoPilotDemo'
import { SITE } from '@/lib/content/site'

/**
 * Section 2, the hero (§5). A server component: the only client island above
 * the fold is <GoPilotDemo />.
 *
 * This is the page's only <h1>, and it is also the LCP element, so it is text
 * and nothing above it fetches a third-party asset.
 *
 * No <Reveal> here. The fold must never fade in: the LCP element has to be
 * painted and opaque on the first frame.
 *
 * LAYOUT: centred copy, demo contained below it.
 * This replaces a 48/52 split whose left column faked container alignment with
 * `pl-[max(2rem,calc(50vw-600px+2rem))]` while the grid itself spanned the full
 * viewport. Those scale at different rates — padding at 0.5vw, the column at
 * 0.48vw — so the usable text width SHRANK as the screen grew (502px at 1280,
 * 490px at 1894, 477px at 2560) while the demo widened and bled off the right
 * edge. The composition drifted further off-centre the bigger the monitor.
 * One centred container cannot develop that class of bug: there is no second
 * axis to disagree with.
 */

/* The CTA label is owned by `SITE.ctaPrimaryLabel`, and §4 requires it to be
   byte-identical in the nav, the hero, the pricing Free card and the closing
   band. The non-breaking space the spec writes as `&nbsp;` lives in site.ts
   itself, so this renders the canonical string with no local fixup. */
const CTA_LABEL = SITE.ctaPrimaryLabel

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="surface-canvas">
      <div className="mx-auto max-w-page px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
        {/* Copy column. Centred, and capped at ~52rem so the subhead keeps a
            readable measure instead of stretching to the full 1200px. */}
        <div className="mx-auto max-w-[52rem] text-center">
          <p className="eyebrow">
            Geospatial AI agent <span aria-hidden="true">·</span> by RASID
          </p>

          <h1
            id="hero-heading"
            className="mt-4 font-display text-display-sm font-bold text-slate-900 sm:text-display-md lg:text-[3.25rem] lg:leading-[1.05]"
          >
            Ask Earth a question.
            <span className="block text-brand">Get the layer back.</span>
          </h1>

          {/* Narrower than the h1 on purpose: a centred paragraph at the same
              width as a display heading is hard to track line-to-line. */}
          <p className="mx-auto mt-5 max-w-[44rem] text-lg leading-relaxed text-slate-600">
            GoPilot is RASID&rsquo;s AI geospatial agent. Describe the analysis in plain language. It
            finds the satellite data, runs the models, and hands back GeoTIFF and GeoJSON layers you
            can open in QGIS.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
            <a
              href={SITE.ctaPrimaryHref}
              className="btn btn-lg btn-primary w-full justify-center sm:w-auto"
            >
              {CTA_LABEL} <span aria-hidden="true">&rarr;</span>
            </a>
            {/* A text link, not a second button: two stacked full-width buttons
                on mobile halve the primary's click share. */}
            <a
              href={SITE.ctaTryHref}
              className="group inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-brand-dark hover:decoration-brand"
            >
              Try it now, no account
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* §1.14: the anonymous trial's real limits. It takes text prompts on
              the real map; uploads and drawing an AOI need an account. */}
          <p className="mx-auto mt-3 max-w-[46rem] text-[13px] leading-snug text-slate-500">
            No credit card. Runs in your browser. The no-account trial takes text prompts on the real
            map; uploads and drawing an area need an account.
          </p>
        </div>

        {/* The demo, inside the same container so both edges line up with the
            nav and every section below. Nothing bleeds off the viewport. */}
        <div className="mt-12 lg:mt-14">
          <GoPilotDemo />
        </div>
      </div>
    </section>
  )
}
