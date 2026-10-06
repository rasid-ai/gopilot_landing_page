import NavMobile from '@/components/NavMobile'
import { NAV_LINKS } from '@/lib/content/nav'
import { SITE } from '@/lib/content/site'

/**
 * Sticky header. A server component by design: the only interactive piece is
 * the mobile sheet, which is isolated in the `NavMobile` client leaf so the
 * header itself costs zero hydration.
 *
 * `h-16` matches `--nav-h` in globals.css, which drives `scroll-padding-top`.
 * If one changes, change the other or in-page anchors land under the header.
 */
export default function Nav() {
  // Derived, never retyped: the 320px-safe short label must stay a prefix of
  // the canonical CTA string in lib/content/site.ts. Split on the middot
  // alone: the space before it is U+00A0, so a ' · ' separator with ordinary
  // spaces silently matches nothing and returns the whole label.
  const ctaShort = SITE.ctaPrimaryLabel.split('·')[0].trim()

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-page items-center gap-6 px-4 sm:px-6 lg:px-8"
      >
        <a href="#hero" className="flex shrink-0 items-center gap-2.5">
          {/* GoPilot's own mark, not RASID's: this page sells the product, and
              the parent brand is carried by the "by RASID" lockup beside it.
              The mark only — the full lockup bakes in two tagline lines that are
              illegible at 32px, so it is reserved for the footer and the OG card.
              alt="" because the adjacent text already names the product; a
              screen reader announcing "GoPilot GoPilot by RASID" is noise. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- static export,
              images.unoptimized: next/image would add a wrapper for no gain. */}
          <img src="/brand/gopilot-mark.svg" alt="" width="32" height="32" className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-tight text-brand">GoPilot</span>
          <span className="hidden text-[11px] font-medium text-slate-500 sm:inline">by RASID</span>
        </a>

        <ul className="ml-auto hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-dark"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          {/* One call to action only. A "Sign in" link beside it competes for the
              same click from a visitor who has no account yet, which is almost
              everyone arriving here. Returning users reach the app through the
              footer's Sign in link, or straight from their bookmark. */}

          {/* Two spans so the button never wraps on a 320px screen. */}
          <a href={SITE.ctaPrimaryHref} className="btn btn-primary">
            <span className="sm:hidden">{ctaShort}</span>
            <span className="hidden whitespace-nowrap sm:inline">{SITE.ctaPrimaryLabel}</span>
            <span aria-hidden="true">&rarr;</span>
          </a>

          <NavMobile />
        </div>
      </nav>
    </header>
  )
}
