import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { SITE } from '@/lib/content/site'
import {
  getAllReleases,
  getRelease,
  formatReleaseDate,
  releaseTypeTone,
  type Release,
} from '@/lib/releases'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

const ORG_ID = 'https://rasid.ai/#organization'

/**
 * Which release pages exist in `out/`.
 *
 * Keyed by the API's numeric id, because that is what the product portal links
 * to from Settings > Releases. The ids come from PRODUCTION (see lib/releases.ts),
 * so a portal deployment reading a different database can only link correctly
 * while its release table matches production's. That is a deliberate, recorded
 * constraint, not an accident: docs/BUILD_SPEC.md section 31.
 */
export async function generateStaticParams() {
  const releases = await getAllReleases()
  return releases.map((r) => ({ id: String(r.id) }))
}

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const release = await getRelease(id)

  // "Workspace" alone is meaningless in a tab or a search result; the version
  // is what makes the title self-describing.
  const title = `${release.title} (v${release.version})`
  const url = `${SITE_URL}/releases/${release.id}/`

  return {
    title,
    description: release.summary,
    alternates: { canonical: `/releases/${release.id}/` },
    openGraph: {
      type: 'article',
      url,
      title: `${title} | GoPilot`,
      description: release.summary,
      publishedTime: release.release_date,
      modifiedTime: release.updated_at,
      // Absolute already, served from the API host. metadataBase would only
      // rewrite a relative path, so this has to be passed through as is.
      images: release.featured_image ? [{ url: release.featured_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | GoPilot`,
      description: release.summary,
      images: release.featured_image ? [release.featured_image] : undefined,
    },
  }
}

/** Escaping `<` for the same reason components/JsonLd.tsx does it. */
function serialize(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/**
 * TechArticle, not BlogPosting: this is versioned product documentation.
 *
 * `about` points at the SoftwareApplication node the homepage already declares,
 * which is what ties a release to the product rather than leaving it as a loose
 * article, and `isPartOf` ties it back to the changelog collection.
 */
function releaseJsonLd(release: Release) {
  const url = `${SITE_URL}/releases/${release.id}/`
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    url,
    headline: `${release.title} (v${release.version})`,
    description: release.summary,
    datePublished: release.release_date,
    dateModified: release.updated_at,
    inLanguage: 'en',
    image: release.featured_image ?? undefined,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': `${SITE_URL}/releases/#collection` },
    about: { '@id': `${SITE_URL}/#gopilot` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}

function breadcrumbJsonLd(release: Release) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GoPilot', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Release notes', item: `${SITE_URL}/releases/` },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${release.version} ${release.title}`,
        item: `${SITE_URL}/releases/${release.id}/`,
      },
    ],
  }
}

export default async function ReleasePage({ params }: Params) {
  const { id } = await params
  const release = await getRelease(id)

  // Newer and older neighbours, so a crawler (and a reader) can walk the whole
  // changelog from any single page instead of each one being a dead end.
  const all = await getAllReleases()
  const index = all.findIndex((r) => r.id === release.id)
  const newer = index > 0 ? all[index - 1] : null
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(releaseJsonLd(release)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(breadcrumbJsonLd(release)) }}
      />
      <Nav />
      <main id="main">
        <article>
          {/* Header */}
          <header className="border-b border-slate-200 bg-white">
            <div className="container mx-auto px-4 py-12 md:py-16">
              <Link
                href="/releases/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" /> All releases
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${releaseTypeTone(release.release_type)}`}>
                  {release.version}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                  {release.release_type}
                </span>
                <time dateTime={release.release_date} className="text-sm text-slate-500">
                  {formatReleaseDate(release.release_date)}
                </time>
              </div>

              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {release.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
                {release.summary}
              </p>
            </div>
          </header>

          {release.featured_image && (
            <div className="container mx-auto px-4">
              <img
                src={release.featured_image}
                alt=""
                className="mt-10 w-full rounded-2xl object-cover shadow-card"
              />
            </div>
          )}

          {/* Body. `content` is HTML authored in the RASID admin, rendered at
              build time, so this is our own trusted content in a static file
              rather than anything a visitor can influence. */}
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div
              className="prose prose-slate max-w-3xl prose-headings:font-display prose-headings:text-slate-900 prose-a:text-brand hover:prose-a:text-brand-dark prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: release.content }}
            />
          </div>
        </article>

        {/* Neighbours */}
        {(newer || older) && (
          <nav className="border-t border-slate-200 bg-slate-50" aria-label="More releases">
            <div className="container mx-auto grid gap-4 px-4 py-10 sm:grid-cols-2">
              {older ? (
                <Link
                  href={`/releases/${older.id}/`}
                  className="group rounded-xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Previous release
                  </span>
                  <span className="mt-1 block font-display font-bold text-slate-900 group-hover:text-brand-dark">
                    {older.version} {older.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  href={`/releases/${newer.id}/`}
                  className="group rounded-xl bg-white p-5 text-right shadow-card transition-shadow hover:shadow-card-hover sm:col-start-2"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Next release
                  </span>
                  <span className="mt-1 block font-display font-bold text-slate-900 group-hover:text-brand-dark">
                    {newer.version} {newer.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}

        {/* One CTA. A reader who got to the bottom of a release note is the most
            qualified visitor this site gets. */}
        <section className="bg-brand">
          <div className="container mx-auto px-4 py-14 text-center">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Try it on your own area
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-mint">
              Describe the analysis in plain language and GoPilot hands back the layers.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={SITE.ctaPrimaryHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-mint hover:text-brand-dark"
              >
                {SITE.ctaPrimaryLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
              {/* Label matches Hero.tsx verbatim. There is no SITE constant for
                  it, unlike ctaPrimaryLabel, so the two copies are the risk to
                  watch if this wording ever changes. */}
              <a
                href={SITE.ctaTryHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-white"
              >
                Try it now, no account
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
