import Reveal from '@/components/Reveal'
import { PROMPTS } from '@/lib/content/prompts'
import { SITE } from '@/lib/content/site'

/**
 * Section 4, real prompts (§7).
 *
 * Every prompt string came live from the public
 * `GET /api/llm/prompt-suggestions/` endpoint, so this is user language rather
 * than marketing language. No run log is attached to any card: verified output
 * exists for exactly one of the six and that one is already in the hero.
 *
 * There is also no per-card "run this" link. The product has no pre-seed
 * mechanism (§1.13), so a link that claimed to load a prompt into the composer
 * would be a lie about the product. One section-level link instead.
 */
export default function RealPrompts() {
  return (
    <section id="prompts" aria-labelledby="prompts-heading" className="section bg-slate-50">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow text-center">Real prompts</p>
          <h2
            id="prompts-heading"
            className="mt-3 text-center font-display text-display-sm font-bold text-slate-900 md:text-display-md"
          >
            What people actually ask it.
          </h2>
          <p className="lead mt-4 text-center">
            These six are the starter prompts GoPilot ships to new users. Each one is a single
            sentence, and each one is a job that used to take an afternoon.
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPTS.map((prompt) => (
              <li
                key={prompt.prompt}
                className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-colors hover:border-brand/40 hover:bg-brand-soft"
              >
                <div className="flex items-center gap-2">
                  <span className="icon-tile-sm">
                    <prompt.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {prompt.domain}
                  </span>
                </div>
                {/* font-mono resolves to the OS stack, exactly as the product's
                    reasoning panel does, so the prompt reads as something typed. */}
                <p className="font-mono text-[13px] leading-relaxed text-slate-700">
                  &ldquo;{prompt.prompt}&rdquo;
                </p>
                <p className="mt-auto text-xs leading-snug text-slate-500">{prompt.mechanism}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-sm text-slate-600">
            <a href={SITE.ctaTryHref} className="link-brand">
              Send one yourself, no account needed
            </a>
            <span aria-hidden="true" className="mx-1.5 text-slate-300">
              ·
            </span>
            <span className="text-slate-500">
              text prompts on the real map. Uploads and drawing an area need an account.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
