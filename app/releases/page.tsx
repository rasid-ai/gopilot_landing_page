import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import {
  getAllReleases,
  formatReleaseDate,
  releaseTypeTone,
  type Release,
} from '@/lib/releases'

/* Same resolution as app/layout.tsx, app/sitemap.ts, app/robots.ts and
   components/JsonLd.tsx, so canonical, sitemap and @id all agree on one origin
   on every deploy target. */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

const TITLE = 'Release notes'
const DESCRIPTION =
  'Every GoPilot release, newest first: what shipped, when, and what changed for the people using it.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  /* trailingSlash: true, so the canonical must carry the slash or it points at
     a 308 instead of the page. */
  alternates: { canonical: '/releases/' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/releases/`,
    title: `${TITLE} | GoPilot`,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | GoPilot`,
    description: DESCRIPTION,
  },
}

/** Escaping `<` for the same reason components/JsonLd.tsx does it. */
function serialize(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * A CollectionPage carrying an ItemList of the releases.
 *
 * Not a Blog: these are versioned product release notes, not posts, and the
 * ItemList is what lets an answer engine read the set in order without
 * executing anything. Each entry points at the same URL the card links to.
 */
function collectionJsonLd(releases: Release[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/releases/#collection`,
    url: `${SITE_URL}/releases/`,
    name: `GoPilot ${TITLE}`,
    description: DESCRIPTION,
    isPartOf: { '@id': `${SITE_URL}/#gopilot` },
    publisher: { '@id': 'https://rasid.ai/#organization' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: releases.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: releases.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/releases/${r.id}/`,
        name: `${r.version} ${r.title}`,
      })),
    },
  }
}

export default async function ReleasesIndex() {
  const releases = await getAllReleases()
  const [latest, ...rest] = releases

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(collectionJsonLd(releases)) }}
      />
      <Nav />
      <main id="main">
        {/* Header */}
        <section className="border-b border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-dark">
              Product · Changelog
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {TITLE}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              {DESCRIPTION}
            </p>
          </div>
        </section>

        {/* The list. Newest release gets the wide treatment, the rest a grid. */}
        <section className="bg-slate-50">
          <div className="container mx-auto px-4 py-16 md:py-20">
            {releases.length === 0 ? (
              <p className="text-slate-500">No releases have been published yet.</p>
            ) : (
              <>
                <Link
                  href={`/releases/${latest.id}/`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="grid md:grid-cols-5">
                    {latest.featured_image && (
                      <div className="md:col-span-2">
                        {/* Plain <img>: next.config.ts sets images.unoptimized
                            (no server under output: 'export'), so next/image
                            would add weight for nothing here. */}
                        <img
                          src={latest.featured_image}
                          alt=""
                          className="h-48 w-full object-cover md:h-full"
                          loading="eager"
                        />
                      </div>
                    )}
                    <div className={latest.featured_image ? 'p-6 md:col-span-3 md:p-8' : 'p-6 md:col-span-5 md:p-8'}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
                          <Sparkles className="h-3.5 w-3.5" /> Latest
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${releaseTypeTone(latest.release_type)}`}>
                          {latest.version}
                        </span>
                        <time
                          dateTime={latest.release_date}
                          className="text-xs text-slate-500"
                        >
                          {formatReleaseDate(latest.release_date)}
                        </time>
                      </div>
                      <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 md:text-3xl">
                        {latest.title}
                      </h2>
                      <p className="mt-3 leading-relaxed text-slate-600">{latest.summary}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:text-brand-dark">
                        Read the release
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>

                {rest.length > 0 && (
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((release) => (
                      <li key={release.id}>
                        <Link
                          href={`/releases/${release.id}/`}
                          className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${releaseTypeTone(release.release_type)}`}>
                              {release.version}
                            </span>
                            <time dateTime={release.release_date} className="text-xs text-slate-500">
                              {formatReleaseDate(release.release_date)}
                            </time>
                          </div>
                          <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
                            {release.title}
                          </h2>
                          <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-600">
                            {release.summary}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:text-brand-dark">
                            Read the release
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
