import { ChevronDown } from 'lucide-react'

import Reveal from '@/components/Reveal'
import { FAQ_ITEMS } from '@/lib/content/faq'

/**
 * Section 10, FAQ. Native `<details>`, so every answer is in the static DOM
 * whether the item is open or closed. That is not a progressive-enhancement
 * nicety: these answers are the page's long-tail search surface, and FAQPage
 * structured data whose text is not present on the page is a spam violation.
 *
 * Strings come from `lib/content/faq.ts`, which the FAQPage JSON-LD also reads,
 * so the two can never drift character for character.
 */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="section bg-white">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow text-center">Questions</p>
          <h2
            id="faq-heading"
            className="mt-3 text-center font-display text-display-sm font-bold text-slate-900 md:text-display-md"
          >
            GoPilot, answered.
          </h2>

          <ul className="mx-auto mt-12 max-w-[68ch] divide-y divide-slate-200 border-y border-slate-200">
            {FAQ_ITEMS.map((item) => (
              <li key={item.q}>
                {/* `name="faq"` makes the group mutually exclusive where supported and
                    degrades to independent toggles elsewhere. Either is acceptable. */}
                <details className="group py-5" name="faq">
                  <summary
                    /* `list-none` plus the explicit WebKit marker rule kills the default
                       triangle in every engine; `focus-visible:ring` keeps the summary
                       keyboard-operable with a visible target, since the page-wide focus
                       outline alone is easy to lose against the divider rules. */
                    className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
                  >
                    <h3 className="text-base font-semibold text-slate-900">{item.q}</h3>
                    <ChevronDown
                      className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="mt-3 space-y-3 pr-9 text-sm leading-relaxed text-slate-600">
                    <p>{item.a}</p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
