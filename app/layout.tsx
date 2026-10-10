import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

/* Fonts are SELF-HOSTED, committed as woff2 under app/fonts/.
   `next/font/google` fetches the files from fonts.gstatic.com during `next
   build`. That makes the build depend on a live network call: on a cold cache
   it intermittently dies with "Failed to fetch `Space Grotesk`", which is a
   broken CI run and a broken fresh clone for a file that never changes.
   Committing the woff2 makes the build deterministic and offline-capable.

   Both are VARIABLE fonts — one file covers the whole weight range, so the
   `weight` values below are ranges, not a list of static cuts. 70 KB for both,
   latin subset only (this page ships no other script).
   To refresh: fetch the `latin` @font-face src from
   fonts.googleapis.com/css2?family=Inter:wght@400..700 and replace the file. */
const inter = localFont({
  src: './fonts/inter-latin-var.woff2',
  weight: '400 700',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
  // Matched to Inter's metrics so the swap from the fallback does not shift
  // layout — this is what next/font/google did for us automatically.
  adjustFontFallback: 'Arial',
})

const spaceGrotesk = localFont({
  src: './fonts/space-grotesk-latin-var.woff2',
  weight: '500 700',
  style: 'normal',
  variable: '--font-space-grotesk',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

// Static export has no request context, so the origin must be baked in at
// build time. Trailing slash stripped so `new URL()` never double-slashes.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

const TITLE = 'Geospatial AI Agent for Satellite Imagery | GoPilot'
const DESCRIPTION =
  'GoPilot is an AI geospatial agent that runs GIS analysis from plain English — 10,000+ datasets, hundreds of AI models, raster and vector exports. Try it free.'

// 1200x630 PNG. Must physically exist at public/og/gopilot-og.png or every
// share card on LinkedIn/Slack/X renders blank. See the asset spec.
const OG_IMAGE = '/og/gopilot-og.png'
const OG_IMAGE_ALT =
  'GoPilot chat panel beside a map, answering a plain-language request with a generated satellite-derived vector layer'

export const metadata: Metadata = {
  // Makes every relative URL below absolute at build time. Required for
  // output: 'export' — without it OG/canonical emit as relative paths and
  // crawlers and scrapers silently drop them.
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITLE,
    // Future sub-pages (/privacy, /terms) inherit "<page> | GoPilot".
    template: '%s | GoPilot',
  },
  description: DESCRIPTION,

  applicationName: 'GoPilot',
  authors: [{ name: 'RASID', url: 'https://rasid.ai' }],
  creator: 'RASID',
  publisher: 'RASID',
  category: 'technology',

  // Low-weight signal in 2026, but cheap and mirrors rasid.ai's own convention.
  keywords: [
    'geospatial AI agent',
    'AI GIS assistant',
    'natural language GIS',
    'satellite imagery AI analysis',
    'GoPilot',
    'AI for Earth observation',
    'chat with satellite data',
    'QGIS AI plugin',
    'ArcGIS Pro AI add-in',
    'GeoAI',
    'remote sensing AI',
    'MCP server geospatial',
  ],

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    siteName: 'GoPilot by RASID',
    locale: 'en_US',
    url: '/',
    // Deliberately different from <title>: the share card leads with the
    // product, the SERP title leads with the category keyword.
    title: 'GoPilot — the geospatial AI agent that operates the map',
    description:
      'Ask in plain language. GoPilot finds the satellite data, runs the right AI models and hands back raster and vector layers on a live map.',
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT, type: 'image/png' },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    // NOTE: RASID has no X/Twitter account (LinkedIn + YouTube only, verified
    // on rasid.ai). `site`/`creator` are intentionally omitted — a wrong
    // handle attributes the card to someone else. Add when an account exists.
    title: 'GoPilot — the geospatial AI agent that operates the map',
    description:
      'Ask in plain language. GoPilot finds the satellite data, runs the right AI models and hands back raster and vector layers on a live map.',
    images: [{ url: OG_IMAGE, alt: OG_IMAGE_ALT }],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Full-length snippets + large image thumbnails in SERPs and Discover.
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  /* [ARCHITECT AMENDMENT] Only files that actually exist in public/ are listed.
     The original referenced /icon-192.png, /icon-512.png and
     /safari-pinned-tab.svg, none of which exist. public/ ships
     android-chrome-192x192.png and android-chrome-512x512.png instead, and the
     pinned-tab SVG is dropped (legacy Safari 9-13 only). */
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },

  manifest: '/site.webmanifest',

  // Stops iOS Safari turning "10,000+ datasets" and "Sentinel-2" into tel:
  // links, which breaks the layout on the stats row.
  formatDetection: { telephone: false, address: false, email: false },

  // Set NEXT_PUBLIC_GSC_VERIFICATION to the token from Search Console
  // ("HTML tag" method) when claiming gopilot.earth. DNS TXT verification
  // is preferable; this is the fallback and is a no-op when unset.
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
}

// Next 15: themeColor/colorScheme/viewport live in their own export. Keeping
// them in `metadata` triggers a build-time warning and they are dropped.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never block pinch-zoom — WCAG 1.4.4 and a Lighthouse a11y failure.
  maximumScale: 5,
  colorScheme: 'light dark',
  themeColor: [
    // Matches the in-app GoPilot surfaces: slate-50 light, brand-900 dark.
    { media: '(prefers-color-scheme: light)', color: '#F8F7F7' },
    { media: '(prefers-color-scheme: dark)', color: '#0C3F37' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-white font-sans text-slate-800 antialiased">
        <a
          /* #main, not #hero: the hero only exists on the home page, so on
             /releases/ and /releases/<id>/ this skip link used to point at
             nothing and the first thing a keyboard user tabs to did nothing.
             Every page gives its <main> this id. */
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-dark focus:shadow-lg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
