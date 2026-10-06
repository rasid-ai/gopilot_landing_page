# GoPilot landing page

Marketing site for **GoPilot**, the geospatial AI agent by [RASID](https://rasid.ai).
Ships as a single static page at `https://gopilot.earth`.

## Read this first

**[`docs/BUILD_SPEC.md`](docs/BUILD_SPEC.md) is the only source of truth.**

It is a ~3,850-line specification that fixes the copy, the Tailwind class
strings, the hex values, the section order and the accessibility floor. It is
not background reading, it is the contract. Before you change anything on this
page, find the section that owns it.

Two parts of the spec bind every file:

- **§26 Claims guardrails.** A table of phrases that must never appear on this
  page, each with the reason it was rejected. GoPilot has zero published
  customer metrics, no compliance certifications, no sharing or scheduling
  features, and no MCP server outside Enterprise. The copy survived an
  adversarial pass that cut roughly twenty invented claims; rewriting a
  headline "to make it punchier" is how they come back.
- **§3 Global page architecture.** Section order, the surface sequence, exactly
  one `<h1>`, and the four honesty disclosures that label the demo's own assets.

If an asset or a fact is missing, the spec names a fallback. Use it rather than
inventing a substitute.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # runs the asset gate, then exports to out/
npm run typecheck  # tsc --noEmit
npm run lint
```

`npm run build` runs `prebuild` first (`scripts/check-assets.mjs`). That gate
fails the build if a required image is missing or oversized, which is what stops
a deploy whose Open Graph card would render blank on LinkedIn and Slack.

Build with the canonical host set, the way CI should:

```bash
NEXT_PUBLIC_SITE_URL=https://gopilot.earth npm run build
```

Unset, `SITE_URL` falls back to `https://gopilot.earth`, so the canonical,
the sitemap and the JSON-LD `@id`s stay absolute and correct. Override it only
to ship a preview at another origin.

## `out/` is the deployable artifact

`next.config.ts` sets `output: 'export'`. `npm run build` writes a fully
pre-rendered `out/` directory: `index.html`, `sitemap.xml`, `robots.txt` and the
hashed `_next/` assets. Serve it from any static host. There is no Node runtime
in production.

What that rules out, permanently: route handlers, `next/headers`, cookies,
middleware, `fetch` at request time, `next/image` optimization (hence
`images.unoptimized`) and anything else request-scoped. A metadata route must
also carry `export const dynamic = 'force-static'` or the build refuses it —
see `app/sitemap.ts` and `app/robots.ts`.

`trailingSlash: true`, so the canonical URL is `https://gopilot.earth/` and
every sitemap entry ends in a slash.

## Layout

```
app/
  layout.tsx          metadata, fonts, skip link        §18
  page.tsx            composition only                  §19
  globals.css         tokens, components, demo motion    §17, §22.11
  sitemap.ts robots.ts                                   §21
components/
  Nav NavMobile Footer Hero ...                          §4-§15
  JsonLd.tsx          three ld+json blocks               §20
  demo/               the hero's animated transcript     §22
lib/content/          all copy and data, one module each §25
scripts/
  check-assets.mjs    the prebuild gate                  §24.3
  make-og.py          regenerates the 1200x630 OG card   §24.2
docs/BUILD_SPEC.md    the contract
```

**Copy and data live in `lib/content/`, never inline in a component.** Several
strings are deliberately single-sourced because drift between their copies is
invisible in review: `SITE.ctaPrimaryLabel` appears in the nav, the hero, the
Free pricing card and the closing band; `FAQ_ITEMS` feeds both the rendered
`<details>` elements and the `FAQPage` JSON-LD, and a mismatch between those two
is a structured-data spam violation.

## Server components by default

Exactly three client components exist, and the list is a budget, not an
accident:

- `components/NavMobile.tsx` — the mobile sheet
- `components/Reveal.tsx` — the IntersectionObserver fade-up
- `components/demo/GoPilotDemo.tsx` — the hero demo's state machine

Everything else is a server component. If a section needs interactivity, push
the interactive leaf into one of those three rather than adding `"use client"`
to a whole section: that is what keeps hydration off the critical path and the
H1 as the LCP element.

The demo server-renders its **finished** state, so it is complete and readable
with JavaScript disabled, under `prefers-reduced-motion`, and before hydration.
The same holds for `Reveal` and the FAQ answers. Do not regress that.

## Regenerating the OG card

`public/og/gopilot-og.png` must exist, be exactly 1200x630 and stay under
300 KB, or the prebuild gate fails.

```bash
python -I scripts/make-og.py <space-grotesk.ttf> <inter.ttf>
```

The script wants `.ttf` files and takes their paths as arguments; the committed
web fonts in `app/fonts/` are `.woff2`, which PIL cannot read, so fetch the TTFs
from Google Fonts when you need to regenerate the card. The script composites
the real Sentinel-2 capture in `public/demo/` with the field polygons parsed out
of `components/demo/fieldPaths.ts`, so the share card and the on-page map cannot
drift apart.

## Fonts are self-hosted

`app/fonts/` holds Inter and Space Grotesk as committed `woff2` (70 KB for both,
latin subset, variable). `app/layout.tsx` loads them with `next/font/local`.

This deliberately replaces `next/font/google`, which downloads the files from
`fonts.gstatic.com` during `next build`. That made the build depend on a live
network call, and on a cold cache it intermittently failed with
`Failed to fetch \`Space Grotesk\``  — a broken CI run and a broken fresh clone,
for files that never change. The build is now deterministic and works offline.

Both are variable fonts, so one file covers the whole weight range and the
`weight` values in `layout.tsx` are ranges (`'400 700'`), not lists.
`adjustFontFallback: 'Arial'` keeps the metric-matched fallback that
`next/font/google` used to generate, so swapping in the real face causes no
layout shift.

To update a face: take the `latin` `@font-face` `src` from
`fonts.googleapis.com/css2?family=Inter:wght@400..700` and replace the file.

## Troubleshooting

**`EPERM: operation not permitted, open '.next\trace'`**

Next holds an exclusive handle on `<distDir>/trace`. Two Next processes sharing
one output directory therefore kill each other on Windows — the second dies with
this error. Linux and macOS tolerate the same collision silently, so it only
shows up here.

`next.config.ts` prevents the common case by giving each command its own
directory: `dev` writes `.next-dev`, `build` writes `.next`. **`npm run dev` and
`npm run build` can run at the same time, in any order.**

If a process was killed mid-write and left a locked directory behind:

```bash
npm run clean      # removes .next, .next-dev and out
```

If `clean` reports `EPERM`/`EBUSY`, something still owns the directory:

```bash
powershell "Get-Process node | Stop-Process -Force"   # Windows
pkill -f "next (dev|build|start)"                     # macOS/Linux
```

**`EBUSY: resource busy or locked, rmdir 'out'`** — a shell is `cd`'d into
`out/`. On Windows a process's working directory locks it against deletion. Move
out of it and rebuild.

**Port already in use** — Next silently moves to the next free port and prints
the real one. Read the `- Local:` line rather than assuming 3000.

## Provenance

Every testimonial, partner, award, metric and transcript on this page traces to
something verified on `rasid.ai`, in `app.gopilot.earth`, in the `saas-ui`
repository, or in a live API transcript. The hero demo is a real GoPilot run:
324 fields over 2,097.9 ha in Al Jawf Province, Saudi Arabia, from Sentinel-2
L2A scene `S2A_37RFP_20260927_1_L2A`. The research that backs it lives in
`.research/`, which is gitignored on purpose.

**If you add a claim, it must trace too.**

## Before you ship

Run **§28 Verification** in the spec. It is a list of commands, not a vibe
check — a tag that only appears in devtools was injected by client JS and the
crawlers that matter never execute it. §28.12 covers the launch-day steps that
live outside this repo, including the `rasid.ai` title change that stops the
parent site cannibalising this page.
