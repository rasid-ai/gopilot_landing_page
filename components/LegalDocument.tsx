import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { SITE } from '@/lib/content/site'
import {
  formatEffectiveDate,
  getAllLegalDocs,
  type LegalDoc,
  type LegalDocKey,
} from '@/lib/legal'

/**
 * The shared body of /terms/ and /privacy-policy/.
 *
 * One component rather than two near-identical pages: the chrome, the version
 * line and the cross-link are the parts most likely to drift, and a legal page
 * whose version line disagrees with its sibling is exactly the kind of detail
 * that gets noticed in a security review. Each route keeps its own `metadata`
 * and its own JSON-LD, which genuinely differ.
 *
 * The text itself comes from the RASID admin via the build-time snapshot (see
 * lib/legal.ts), so the same words are served here and in the app.
 */
export default function LegalDocument({
  docKey,
  doc,
  intro,
}: {
  docKey: LegalDocKey
  doc: LegalDoc
  /** One sentence under the h1, written per document. */
  intro: string
}) {
  const sibling = getAllLegalDocs().find((d) => d.key !== docKey)

  return (
    <>
      <Nav />
      <main id="main">
        <article>
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-page px-4 py-12 sm:px-6 md:py-16 lg:px-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" /> Back to GoPilot
              </Link>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-brand-dark">
                Legal
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {doc.label}
              </h1>
              <p className="mt-4 max-w-measure text-lg leading-relaxed text-slate-600">
                {intro}
              </p>

              {/* Version and effective date come from the document itself, not
                  from a hand-typed constant, so they cannot fall behind the
                  text they describe. `dateTime` carries the raw ISO value for
                  machines; the visible string is the readable form. */}
              <p className="mt-6 text-sm text-slate-500">
                Version {doc.version}
                <span aria-hidden="true"> &middot; </span>
                <span>
                  Effective{' '}
                  <time dateTime={doc.effective_date}>
                    {formatEffectiveDate(doc.effective_date)}
                  </time>
                </span>
              </p>
            </div>
          </header>

          {/* The document. `html` is converted at build time from Markdown
              authored in the RASID admin — our own content in a static file,
              the same trust model as the release notes, and nothing a visitor
              can influence.
              max-w-measure (68ch) rather than the page width: 31,000 characters
              of legal prose at 1200px is unreadable. */}
          <div className="mx-auto max-w-page px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div
              className="prose prose-slate max-w-measure prose-headings:font-display prose-a:break-words"
              dangerouslySetInnerHTML={{ __html: doc.html }}
            />
          </div>
        </article>

        {/* Where to go next. A visitor who opened one of these is usually
            checking both, and someone who read to the bottom with a question
            needs an address, not another CTA. */}
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-measure">
              {sibling && (
                <p className="text-sm text-slate-600">
                  See also our{' '}
                  <Link
                    href={sibling.path}
                    className="font-semibold text-brand transition-colors hover:text-brand-dark"
                  >
                    {sibling.label}
                  </Link>
                  .
                </p>
              )}
              <p className="mt-2 text-sm text-slate-600">
                Questions about this document?{' '}
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
