import { AppWindow, ArrowRight, KeyRound, Map } from 'lucide-react'
import type { ReactNode } from 'react'

import Reveal from '@/components/Reveal'
import { SITE } from '@/lib/content/site'

/**
 * §10 Integrations. Server component.
 *
 * Four links and no buttons, deliberately (§10.2): a technical evaluator's next
 * step is documentation, not signup, and a CTA here competes with the one in
 * the pricing section.
 *
 * The GoServers card carries the Enterprise availability caveat and no copyable
 * config block (§1.8) — no config string is verified to exist, and a snippet
 * that does not work is worse than no snippet.
 */

/** The four GoServers, verbatim from `rasid.ai/products`. */
const GOSERVERS: readonly { name: string; blurb: string }[] = [
  { name: 'GoServer-Fetch', blurb: 'Discover and retrieve from 10,000+ datasets' },
  { name: 'GoServer-Geo', blurb: 'Vector operations on GeoJSON, GeoParquet and shapefiles' },
  {
    name: 'GoServer-Analyze',
    blurb: 'Raster processing, spectral indices, change detection and time series',
  },
  { name: 'GoServer-AI', blurb: "Run RASID's geospatial AI models on imagery" },
]

type CardProps = {
  icon: ReactNode
  title: string
  body: string
  href: string
  linkLabel: string
  /** `true` only for the two downloadable/third-party destinations. */
  external?: boolean
  children?: ReactNode
}

function IntegrationCard({ icon, title, body, href, linkLabel, external, children }: CardProps) {
  return (
    <li className="panel flex flex-col gap-3">
      <span className="icon-tile">{icon}</span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{body}</p>
      {children}
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
        className="group mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark transition-colors hover:text-brand"
      >
        {linkLabel}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </li>
  )
}

export default function Integrations() {
  return (
    <section
      id="integrations"
      aria-labelledby="integrations-heading"
      className="section surface-sand"
    >
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow">Integrations</p>
          <h2
            id="integrations-heading"
            className="mt-3 font-display text-display-sm font-bold text-slate-900 md:text-display-md"
          >
            It does not ask you to leave QGIS.
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-slate-600">
            GoPilot runs where you already work. One engine, three ways to use it: the agent in your
            browser, GoServers over MCP and the API, and plugins inside the GIS tools you already
            use.
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* QGIS leads: it is the single best anti-churn signal for this buyer. */}
            <IntegrationCard
              icon={<Map className="h-5 w-5" aria-hidden="true" />}
              title="GoPilot, inside QGIS"
              body="Install it from the QGIS Plugin Manager: open Plugins, Manage and Install Plugins, and search for GoPilot. Sign in with a key, pick a solution, define or upload your area of interest, and run AI-assisted geospatial and Earth observation processes without leaving your project."
              href={SITE.qgisHref}
              linkLabel="Open the QGIS plugin page"
              external
            />

            <IntegrationCard
              icon={<AppWindow className="h-5 w-5" aria-hidden="true" />}
              title="GoPilot, docked inside ArcGIS Pro"
              body="Download the add-in, close ArcGIS Pro, double-click to install, and a RASID tab appears on the ribbon. Same solutions, same areas of interest, same results, reviewed and exported in place."
              href={SITE.arcgisHref}
              linkLabel="Download the add-in"
              external
            />

            <IntegrationCard
              /* GoServer has its own mark in the GoSuite kit, and its official
                 lockup descriptor is "MCP tool servers" — first-party branding
                 for a product the codebase has no trace of, so it is the best
                 evidence we have that this card is accurate. Preferred over a
                 generic terminal glyph. */
              icon={
                // eslint-disable-next-line @next/next/no-img-element -- static export
                <img src="/brand/goserver-mark.svg" alt="" width="20" height="20" className="h-5 w-5" />
              }
              title="GoServers: geospatial analysis as a tool call"
              body="GoPilot's geospatial capabilities are exposed over MCP through four GoServers. Fetch data, run vector operations, analyse rasters and time series, and run AI models. Orchestrated by GoPilot, or called directly from your own code."
              href="https://rasid.ai/products#mcps"
              linkLabel="Read about GoServers"
            >
              <ul className="mt-1 space-y-1.5">
                {GOSERVERS.map((server) => (
                  <li key={server.name} className="flex items-baseline gap-2 text-xs">
                    <span className="font-mono font-medium text-slate-700">{server.name}</span>
                    <span className="text-slate-400" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-slate-500">{server.blurb}</span>
                  </li>
                ))}
              </ul>
              {/* Mandatory and verbatim from the live pricing table. */}
              <p className="mt-2 text-[11px] text-slate-500">
                The MCP connector for AI agents is an Enterprise plan feature.
              </p>
            </IntegrationCard>

            {/* §1.19: no public API docs URL is verified, so this points at the
                real key-management screen instead of a dead /docs link. */}
            <IntegrationCard
              icon={<KeyRound className="h-5 w-5" aria-hidden="true" />}
              title="Your own tools, with your own key"
              body="Create a named API key in Settings, Developer, API Keys, with an optional expiry. The key is shown once and is revocable at any time, and each one carries its own usage analytics: total, successful and failed requests, average response time, and a log of every call."
              href={SITE.apiKeysHref}
              linkLabel="Create an API key"
            />
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
