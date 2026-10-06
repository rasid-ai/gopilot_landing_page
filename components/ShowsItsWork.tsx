import { Brain, Lock, Satellite, ShieldCheck, Wrench } from 'lucide-react'

import Reveal from '@/components/Reveal'

/**
 * Section 5, trust (§8).
 *
 * The page's core argument: GoPilot can show mechanics where competitors write
 * adjectives, because the real UI already emits all four of these. The words
 * "trusted", "reliable", "enterprise-grade" and "hallucination" do not appear
 * here, and no compliance badge appears anywhere on the page.
 *
 * Surface is `.surface-canvas` with white cards, not a dark band: the page
 * allows only three dark moments and this is not one of them. The single
 * saturated element is the data callout bar at the bottom.
 *
 * There is deliberately no CTA in this section. A button in the middle of a
 * trust argument makes the argument look like a pitch.
 */

/** The five tools the hero run actually called, in call order. */
const TOOL_NAMES = [
  'sentinel2_search_goserver',
  'sentinel2_fetch_goserver',
  'ksa_delineate_fields_goserver',
  'add_area_column_goserver',
  'filter_vector_rows_numerical_goserver',
] as const

export default function ShowsItsWork() {
  return (
    <section
      id="shows-its-work"
      aria-labelledby="shows-its-work-heading"
      className="surface-canvas section"
    >
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow">Auditability</p>
          <h2
            id="shows-its-work-heading"
            className="mt-3 font-display text-display-sm font-bold text-slate-900 md:text-display-md"
          >
            It shows its work. All of it.
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-slate-600">
            You should not have to defend a geospatial result you cannot audit. GoPilot exposes the
            whole chain: what it thought, what it called, which scene it used, and what it could not
            do.
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <li className="panel flex flex-col gap-3">
              {/* Tile 1 runs the softer brand pair, because the Thinking panel in
                  the product is itself brand-soft on brand-highlight. */}
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand-highlight">
                <Brain className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-slate-900">You can watch it think.</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Every answer can open its reasoning. The Thinking panel streams the chain that
                produced the result while the run is still going, so if GoPilot is about to pick the
                wrong collection you see it before it finishes, not after you have shipped the map.
              </p>
            </li>

            <li className="panel flex flex-col gap-3">
              <span className="icon-tile">
                <Wrench className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Every tool, named, with its status.
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                GoPilot logs each tool it calls by name, marked in progress, succeeded or failed. No
                silent fallbacks and no quiet substitutions.
              </p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {TOOL_NAMES.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </li>

            <li className="panel flex flex-col gap-3">
              <span className="icon-tile">
                <Satellite className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                The provenance travels with the answer.
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                GoPilot names the scene it used, not just the result. Written into the answer, not
                buried in a log.
              </p>
              <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[11px] leading-relaxed text-slate-600">
                Sentinel-2 L2A <span className="text-brand-dark">S2A_37RFP_20260927_1_L2A</span>,
                2026-09-27, 0% cloud cover, 10 m resolution, 12 bands
              </p>
            </li>

            <li className="panel flex flex-col gap-3">
              <span className="icon-tile">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-slate-900">It tells you when it cannot.</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                When a tool it needs does not exist in its toolchain, GoPilot says so in the answer
                and works around it in the open, rather than improvising a result that looks useful.
              </p>
              {/* Verbatim agent output. If this ever needs shortening, drop whole
                  sentences; never reword. The admission is the argument. */}
              <blockquote className="mt-1 border-l-2 border-brand-highlight pl-3 text-sm italic leading-relaxed text-slate-600">
                &ldquo;No vector-to-CSV conversion tool is available in the toolchain, so I built
                the distribution directly from the delineation output using cumulative numeric
                filtering and differenced the bin edges.&rdquo;
                <footer className="mt-1.5 text-[11px] not-italic text-slate-500">
                  GoPilot, unedited, in the run playing above.
                </footer>
              </blockquote>
            </li>
          </ul>

          {/* Sentence one is verbatim from the product's composer disclaimer;
              sentence two is verified from the analytics configuration. There is
              no third sentence, because nothing else here is verified. */}
          <div className="mt-12 rounded-2xl bg-brand-900 px-6 py-7 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-5">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
              <div>
                <p className="font-display text-base font-semibold text-white">
                  Your conversations are not training data.
                </p>
                <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-white/70">
                  Conversations may be reviewed for quality and safety, but are never used to train
                  our AI models. Session replay and heatmaps are switched off across the product,
                  because the screen shows your imagery, your coordinates and your project names.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
