/**
 * The four nav destinations, shared by the desktop row in `components/Nav.tsx`
 * (a server component) and the mobile sheet in `components/NavMobile.tsx`
 * (a client component). One list, so the two can never drift.
 *
 * §1.19 cut the `Docs` item: no public documentation URL is verified, so a
 * fifth item would be a dead link. Four items, no mega-menu, no dropdowns.
 *
 * This file exists because the list must be readable from both sides of the
 * server/client boundary. Holding it in NavMobile.tsx would not work: a server
 * component that imports a plain value from a `"use client"` module receives a
 * client-reference proxy, and `.map()` on that proxy throws at render time.
 */
export type NavLink = { label: string; href: string }

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'How it works', href: '#shows-its-work' },
  { label: 'Datasets & models', href: '#datasets' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
]
