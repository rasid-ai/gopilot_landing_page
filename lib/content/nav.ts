/**
 * The nav destinations, shared by the desktop row in `components/Nav.tsx`
 * (a server component) and the mobile sheet in `components/NavMobile.tsx`
 * (a client component). One list, so the two can never drift.
 *
 * §1.19 cut the `Docs` item: no public documentation URL is verified, so an
 * item for it would be a dead link. `Releases` was added by §31.11 and is a
 * real route, not an anchor. No mega-menu, no dropdowns.
 *
 * ROOT-RELATIVE FRAGMENTS, NOT BARE ONES. Every section target is written
 * `/#id` rather than `#id` because this nav now renders on pages that are not
 * the home page (`/releases/`, `/releases/<id>/`). A bare `#pricing` there
 * points at an element that does not exist on that page, so the link silently
 * does nothing. With the leading slash it navigates home and scrolls, and on
 * the home page itself the browser still treats it as a same-document
 * fragment, so nothing is lost there.
 *
 * This file exists because the list must be readable from both sides of the
 * server/client boundary. Holding it in NavMobile.tsx would not work: a server
 * component that imports a plain value from a `"use client"` module receives a
 * client-reference proxy, and `.map()` on that proxy throws at render time.
 */
export type NavLink = { label: string; href: string }

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'How it works', href: '/#shows-its-work' },
  { label: 'Datasets & models', href: '/#datasets' },
  { label: 'Integrations', href: '/#integrations' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Releases', href: '/releases/' },
]
