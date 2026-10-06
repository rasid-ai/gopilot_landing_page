import { ChevronRight, Cpu, Database, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import Reveal from '@/components/Reveal'
import {
  PARTNERS,
  PARTNER_FOOTNOTE,
  PARTNER_HEADING,
  PARTNER_VARIANT,
  type Partner,
} from '@/lib/content/partners'
import { SITE } from '@/lib/content/site'

/**
 * Section 3, the credibility strip (§6).
 *
 * Three stacked rows: the product's own Ask > Plan > Run > Verify breadcrumb,
 * three stat tiles, and the seven-partner ecosystem strip. The heading is
 * screen-reader only because the rows are evidence, not a topic.
 */

type StatTile = {
  icon: LucideIcon
  value: string
  label: string
  /** Set when the numeral should land in a real inventory instead of asserting itself. */
  href?: string
  /** Per-tile override of `.icon-tile-lg`; the award tile is gold, not brand. */
  iconClass: string
}

const STATS: readonly StatTile[] = [
  {
    icon: Database,
    value: '10,000+',
    label: 'Earth observation datasets',
    href: 'https://rasid.ai/products#gopilot',
    iconClass: 'icon-tile-lg',
  },
  {
    icon: Cpu,
    value: 'Hundreds',
    label: 'AI and geospatial models',
    iconClass: 'icon-tile-lg',
  },
  {
    icon: Trophy,
    value: '2026',
    label: 'AWS & thriveGEO GenAI winner',
    href: SITE.awardHref,
    iconClass: 'flex h-10 w-10 items-center justify-center rounded-xl bg-gold-light text-gold-dark',
  },
]

/**
 * One partner mark. Variant A needs all seven files in `public/partners/`;
 * Variant B is the zero-asset fallback. `partners.ts` picks the variant once at
 * build time, so a mix can never ship and a broken `img` can never ship.
 */
function PartnerMark({ partner }: { partner: Partner }) {
  if (PARTNER_VARIANT === 'logos') {
    return (
      <img
        src={partner.file}
        alt={partner.alt}
        width={96}
        height={28}
        className="h-7 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
      />
    )
  }

  return (
    <span className="font-display text-sm font-semibold tracking-tight text-slate-500">
      {partner.name}
    </span>
  )
}

export default function CredibilityStrip() {
  return (
    <section id="proof-strip" aria-labelledby="proof-strip-heading" className="section-tight bg-white">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 id="proof-strip-heading" className="sr-only">
            Credibility
          </h2>

          {/* Row 1: the product's own breadcrumb. The fourth step is Verify, not
              Done, which reframes the agent from oracle to accelerator. */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
            <span>Ask</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Plan</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Run</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span className="text-brand-dark">Verify in your own GIS</span>
          </div>

          {/* Row 2: three stat tiles, the app's own StatTile recipe. */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-tile">
                <div className="flex items-center gap-3">
                  <span className={stat.iconClass}>
                    <stat.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-3xl font-bold leading-none text-slate-900">
                      {stat.href ? (
                        <a
                          href={stat.href}
                          className="transition-colors hover:text-brand-dark"
                          target="_blank"
                          rel="noopener"
                        >
                          {stat.value}
                        </a>
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: ecosystem and technology partners. Not customers. */}
          <p className="mt-14 text-center text-[13px] text-slate-500">{PARTNER_HEADING}</p>

          {/* Static row from sm up. A marquee on a wide viewport is motion for
              its own sake; below sm the seven marks cannot fit, so the track
              scrolls instead (and stops dead under prefers-reduced-motion). */}
          <div className="mt-6 hidden flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:flex">
            {PARTNERS.map((partner) => (
              <PartnerMark key={partner.name} partner={partner} />
            ))}
          </div>

          <div className="mt-6 overflow-hidden sm:hidden">
            <div className="marquee-track items-center">
              {PARTNERS.map((partner) => (
                <PartnerMark key={partner.name} partner={partner} />
              ))}
              {/* Duplicated once so the -50% translate loops seamlessly. Hidden
                  from assistive tech so the seven names are announced once. */}
              <div className="flex items-center gap-10" aria-hidden="true">
                {PARTNERS.map((partner) => (
                  <PartnerMark key={`${partner.name}-loop`} partner={partner} />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            <a
              href={PARTNER_FOOTNOTE.href}
              target="_blank"
              rel="noopener"
              className="underline decoration-slate-300 underline-offset-2 transition-colors hover:text-brand-dark"
            >
              {PARTNER_FOOTNOTE.text}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
