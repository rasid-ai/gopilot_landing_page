# GoPilot Landing Page — BUILD SPECIFICATION

**Status:** FINAL. This document is the contract. Build exactly this.
**Target directory:** `C:/Users/LEGION/Desktop/gopilot_landing_page`
**Stack:** Next.js 15.5 (App Router, `output: 'export'`) + Tailwind CSS 3.4 + TypeScript 5.8 + lucide-react. Already scaffolded — `package.json`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json` exist and are correct. Do not change them.
**Deploy target:** `https://gopilot.earth/`

Six specialists reported. Their reports are resolved here. **If something in this document contradicts a specialist report, this document wins.** If something is not in this document, it is not in the build.

---

## 0. THE DECISION SUMMARY

| Decision | Value | Why |
|---|---|---|
| **H1** | `Ask Earth a question.` / `Get the layer back.` | The brand's signature shape is two short declaratives separated by a full stop ("Start free. Scale when you need to.", "One engine. Three ways to use it."). This line is the voice specialist's top candidate, it ends on the *artefact* rather than the chat, and it is memorable. The primary keyword lives in the `<title>`, the eyebrow and the subhead — which is where Google actually reads it. A keyword-stuffed H1 ("The geospatial AI agent that runs your GIS work in plain language") is 12 flat words and loses the one thing a challenger brand needs: a line people repeat. |
| **Eyebrow** | `GEOSPATIAL AI AGENT · BY RASID` | Disambiguates the category in one line, carries the primary keyword above the H1, and inherits consultancy credibility at a glance. |
| **Subhead** | `GoPilot is RASID's AI geospatial agent. Describe the analysis in plain language. It finds the satellite data, runs the models, and hands back GeoTIFF and GeoJSON layers you can open in QGIS.` | Names two file formats and one desktop GIS above the fold. For this buyer that is the highest-value trust move on the page: a format is a commitment you cannot fake. Both formats and QGIS are verified on the live site and in the code. |
| **Primary CTA** | `Sign up free · 500 tokens` → `https://app.gopilot.earth/auth?active_form=register` | One label everywhere: nav, hero, pricing Free card, closing band. "Sign up free" is the brand's own verb (verbatim on the live Free plan CTA). "· 500 tokens" answers the buyer's unspoken "free until what?", which no competitor answers. The middot is on-brand (`2026 · Winner`, `GoServers · MCP`) and the brand uses no em dashes. |
| **Secondary CTA** | `Try it now, no account` → `https://app.gopilot.earth/try-gopilot` | A real, live, zero-friction trial of the real backend beats a video we do not have. This is the one structural advantage GoPilot has over Harvey and Sierra. |
| **Tertiary CTA** | `Book a 30-minute call` → `https://calendly.com/rasid/30mins` | Closing band only. Thirty, not twenty — that is the real calendar link. |
| **Title tag** | `Geospatial AI Agent for Satellite Imagery \| GoPilot` | Keyword-first, brand-last, 52 chars. |
| **Dark/saturated moments** | Exactly three: `bg-slate-800` code blocks, the `bg-brand` closing band, the `bg-brand-900` footer. Plus one `bg-brand-900` callout bar inside the trust section. | The product has zero `dark:` variants. A dark landing page would be a lie about the product. |
| **Section count** | 10 content sections + nav + footer | Cut from the researcher's 14. Every surviving section is backed by verified material. |
| **Demo** | One `<GoPilotDemo />` in the hero. Two real exchanges, 41 real tool rows, one real file, one real satellite image, one real model output. ~25s, with Skip and Replay. | The agent's transaction (prompt → reasoning → named tool calls → artefact) is the only thing that persuades a GIS analyst, and GoPilot's real UI already emits all four. |

### The one-sentence thesis of this page

Every competitor asserts trust with adjectives. GoPilot can **show** it: a real run, with its real reasoning, its real tool names, its real scene ID, and a real moment where the agent says *"No vector-to-CSV conversion tool is available in the toolchain"* and works around it in the open. That sentence is the most persuasive asset on this page and it exists because it is true. Build the page around it.

---

## 1. CONFLICTS RESOLVED

Product truth beats marketing ambition, always. Twenty-three rulings, each binding.

### 1.1 The four "worked example" scenarios were invented. CUT.
The patterns researcher specified four worked-example cards (Bousculade flood, NDVI fields, new buildings, reservoir water loss) with full run logs — datasets, dates, tool chains, runtimes, token counts — and called the run logs "a screenshot of real telemetry". **None of it is real.** No such runs exist in any research artefact.
**Ruling:** the entire worked-examples section is cut. In its place: (a) the hero demo, which is one *actually verified* run with actually verified telemetry; and (b) a section built from the **six real prompt-suggestion strings fetched live from `GET /api/llm/prompt-suggestions/`**. Fabricating four run logs on a page whose entire argument is auditability would be the single worst decision available.

### 1.2 The third demo exchange was invented. CUT.
The demo specialist's `realConversation` lists a third exchange ("Shift the AOI north to the denser pivot cluster and keep only fields above 15 ha") producing `sakaka_pivots_gte_15ha.geojson`. The research files contain **two** exchanges only (`task.json.txt`, `task2.json.txt`, `turn2.json`). There is no third prompt, no 47-field result, no second filename.
**Ruling:** demo script is **4 turns / 2 exchanges**. `mapStep` 3 is deleted. `sakaka_pivots_gte_15ha.geojson` never appears anywhere in the build.

### 1.3 The second answer produced no CSV file. The bar chart is CUT.
The demo specialist specified a 13-bin bar chart in a `CsvViewer`-style panel with a Table|Chart toggle. The real second answer emitted a **fenced ```csv code block**, and the only file it presented was `sakaka_fields_with_area.geojson` again (id 3671, same 282,222 bytes). There is no `.csv` artefact.
**Ruling:** render the fenced code block verbatim. No chart, no `DemoChart.tsx`, no Table|Chart toggle, no `distribution.csv` chip. This is also the better outcome: the code block contains the agent naming its own tool gap, which is worth more than a chart.

### 1.4 The 12 GoBox solution names were invented. CUT.
"Flood Footprint, Change Detection, Wildfire Hotspots, Urban Heat Islands, Crop Vigor Monitor, Landslide Susceptibility, Drought Severity, Urban Growth Monitor, Coastal Flood Index, Road Network Damage, Groundwater Decline, Quake Intensity Map" were presented as "the REAL names from the product". Product truth: GoBox solutions are curated in the Django admin and are **not in the repository**.
**Ruling:** GoBox loses its own section. The nine **verified** AI model names from `rasid.ai/products` (Field delineation, Solar panel segmentation, Tree crown & palm detection, Cloud & shadow detection, Methane plume detection, Banana TR4 disease detection, Wheat crop classification, Scene parsing · open vocabulary, DINOv3 embeddings + PCA) carry the domain-recognition job inside §6 instead. GoBox is named only where the live site names it.

### 1.5 Nine of the sixteen dataset chips were invented. STRIPPED.
The researcher's chip list included Sentinel-1, Sentinel-3, MODIS, SRTM, ESA WorldCover, GHSL, VIIRS, CHIRPS, OpenStreetMap, Overture. **None are on the verified `rasid.ai/products` dataset list.**
**Ruling:** exactly the ten verified names ship, in the live site's own order, plus the live site's own eleventh entry `… and more`. See §6.

### 1.6 "Link the 10,000+ claim to a real /datasets page" — no such page exists.
**Ruling:** `10,000+ datasets` links to `https://rasid.ai/products#gopilot`, which carries the named dataset inventory. That is the verifiable destination we actually have. An unlinked count reads as marketing; this one lands in an inventory.

### 1.7 "10,000+ datasets / hundreds of AI models" is not supported by the codebase.
Product truth flags both as unsupported in `saas-ui`. The voice specialist verified both as RASID's own published positioning on **every page** of `rasid.ai`, including the `<title>` and meta description.
**Ruling:** both claims ship. They are the company's official public marketing claims, already indexed, and the landing page must not contradict the parent site. They are never attributed to a product surface, never presented as a number the app displays, and they always appear in the live site's exact phrasing.

### 1.8 MCP / GoServers: real product, absent codebase.
`grep mcp` and `grep goserver` return zero hits in `saas-ui`. But `rasid.ai/products` ships a full GoServers section with four named servers and descriptions, and the live pricing table lists "MCP connector for AI agents" as an Enterprise feature.
**Ruling:** GoServers ships as one integration card using the live site's **verbatim** copy, with the availability caveat stated in the card: *"The MCP connector for AI agents is an Enterprise plan feature."* **The copy-to-clipboard MCP config block is CUT** — no config string is verified to exist anywhere, and a copyable snippet that does not work is worse than no snippet.

### 1.9 Pricing: "never hardcode" vs. "it is published on the homepage".
Product truth says prices come from `GET /api/billing/plans/` and hardcoding is the staleness bug the Plan model was designed to prevent. The voice specialist verified €0/500, €149/5,000, €499/25,000, Custom on the live homepage, with full feature lists.
**Ruling:** the prices ship, because they are already published publicly by RASID and omitting them would make this page weaker than the parent site. Mitigations, all mandatory: (a) every price, token count, storage figure and feature row lives in **one file**, `lib/content/pricing.ts`, which also feeds the JSON-LD, so one edit updates the page and the structured data together; (b) a visible footnote links to the live plan page as the source of truth; (c) no annual discount, no plan code in a URL, no invented tier.

### 1.10 "A typical flood analysis costs 30-40 tokens." CUT.
No per-analysis token figure exists anywhere. Product truth's verified line is *"A turn costs what it costs. A long analysis with large rasters uses more than a one-line question."*
**Ruling:** the verified line ships verbatim. The invented figure does not. The honest sentence is also better copy than a number a prospect would test and find wrong.

### 1.11 "Tokens are one pool across GoPilot, GoBox and MCP/API" — the app contradicts the gloss.
The live site's footnote is *"Tokens are used across GoPilot, GoBox, and RASID's MCP / API services."* The app bills geospatial processing against a **separate euro balance**, and `AGENTS.md` warns explicitly: "Do not confuse the two currencies in copy."
**Ruling:** ship the live footnote **verbatim and unexpanded**. Do not gloss it, do not say "one pool", do not mention the euro balance. Any sentence beyond the verbatim footnote generates billing tickets on day one.

### 1.12 "Watch GoPilot run (90s)" — no video exists. CUT.
**Ruling:** the secondary CTA becomes `Try it now, no account` → `/try-gopilot`. A real live trial is strictly stronger than a video we would have to shoot. No play glyph anywhere on the page.

### 1.13 "Run this yourself →, pre-seeded with that prompt" — no pre-seed mechanism exists.
No URL parameter for seeding an anonymous prompt is documented anywhere.
**Ruling:** prompt cards carry no "run this" link. One section-level link goes to `/try-gopilot`, with honest microcopy about what the anonymous trial can and cannot do (§4).

### 1.14 The anonymous trial is not the full product.
Product truth: anonymous visitors get text prompts only — no file upload (padlock), no AOI drawing (`if (!mapReady || isAnonymous) return;`), `sessionStorage` only, an undisclosed server-side message cap.
**Ruling:** the secondary CTA never implies the full product. Its microcopy is exact: *"Text prompts, the real map, no sign-up. Uploads and drawing an area need an account."* No number is put on the message cap.

### 1.15 The dark trust band. OVERRULED.
The researcher specified `bg-slate-900` for the trust section. The design system permits exactly three dark moments and warns: "Do NOT alternate light/dark every section; the app never does."
**Ruling:** the trust section is light — `.surface-canvas` with white cards — and closes with a single full-width `bg-brand-900` callout bar. The saturated element stays; the dark band does not.

### 1.16 Headshots for testimonials. OVERRULED.
The researcher required "a real headshot" per card and warned that placeholder avatars read as unfinished. We have no headshots. The live site uses **initials badges** (GP, MP, PC, OR).
**Ruling:** initials badges, exactly as the live site renders them. This is not a compromise — it is matching the parent brand.

### 1.17 Four testimonials, three slots.
**Ruling:** Poggi first (attests to reasoning quality and raster/vector output — the exact claim a GIS analyst is trying to verify), Puertos second (AWS, institutional legitimacy), Rayis third (regional and domain fit). **Phil Cooper's quote is cut**: it praises the team's effort, not the product, and on a product page that is the weakest of the four.

### 1.18 "Imagery shown is procedurally generated for demonstration." DO NOT COPY.
The live site carries this because its hero globe is synthetic. **On this page the satellite image is a real Mapbox capture of the real AOI and the polygons are real model output.** Copying the disclaimer verbatim would make it false.
**Ruling:** the accurate disclosures ship instead — a visible demo caption and a footer credit line, both in §3.2 and §12. On a page whose argument is provenance, labelling things *correctly* is the proof.

### 1.19 A `Docs` nav item would be a dead link. CUT.
No public API-documentation URL is verified (`docs/GOPILOT_PLUGIN_API.md` is in-repo, not published). The researcher's own rule applies: "a dead link costs more trust than a thin nav."
**Ruling:** four nav items. `API Documentation` is also removed from the footer. The integrations section links to `https://app.gopilot.earth/api-keys` instead, which is real.

### 1.20 File layout: `src/` vs. root.
The demo specialist wrote `src/components/demo/…`. `tsconfig.json` maps `@/*` → `./*` and the design specialist's Tailwind `content` globs are `./app/**`, `./components/**`.
**Ruling:** **root-level** `app/`, `components/`, `lib/`. No `src/`. All demo paths in §22 are corrected accordingly.

### 1.21 Fonts: `next/font/local` is unnecessary.
`next/font/google` downloads and self-hosts at build time, so it already satisfies the demo specialist's "zero runtime network" requirement.
**Ruling:** use `next/font/google` exactly as the design specialist wrote it. No files in `public/fonts/`.

### 1.22 Two bugs in the design specialist's config. FIXED.
(a) `backgroundImage: { 'dot-grid', shimmer }` and `backgroundSize: { 'dot-grid', shimmer }` use the **same keys**, so both generate the class `bg-dot-grid` / `bg-shimmer`; Tailwind's `backgroundSize` plugin runs later and wins, so the background *image* silently never applies. Keys renamed to `dot-grid-size` / `shimmer-size`.
(b) The `content` array omits `./lib/**`, so any class string in a data module would be purged. Glob added.
Both fixes are marked `[ARCHITECT AMENDMENT]` inline in §16.

### 1.23 The icon manifest references files that do not exist. FIXED.
The SEO specialist's metadata points at `/icon-192.png`, `/icon-512.png`, `/safari-pinned-tab.svg`. `public/` actually contains `android-chrome-192x192.png` and `android-chrome-512x512.png`, and no pinned-tab SVG.
**Ruling:** the icons block in §10 references only files that exist, plus a `site.webmanifest` whose full contents are given. `safari-pinned-tab.svg` is dropped (legacy Safari 9–13 only).

### Smaller rulings, all binding

- **No em dashes anywhere in page copy.** The brand uses none. Every specialist's copy has been rewritten with commas, full stops and middots. Builders: if you see `—` in a string you are about to type, you have copied from the wrong source.
- **No "instant", "real-time", "in seconds".** The product budgets 90s for one answer. Approved verbs: *while you watch*, *as it works*, *streams in*.
- **"GoToken"/"GoTokens" must never appear in rendered output.** User-facing word is `tokens`.
- **Scale bar on the demo map: CUT.** A fixed-pixel scale bar cannot stay accurate at a responsive width, and an inaccurate scale bar on this page would be the worst possible error. The legend carries the provenance instead.
- **NDVI legend on the demo map: CUT.** That run produced vectors, not an index raster.
- **Award wording:** one string only, everywhere — `Winner, AWS and thriveGEO GenAI for Geospatial Challenge 2026`, linked to `https://thrivegeo.com/genai-geospatial-challenge/`. RASID's own surfaces use four different names; this is the one that is independently checkable and credits both hosts.
- **`/about` and consultancy framing:** no consultancy section on this page. The footer carries the RASID relationship. The page's only job is converting a skeptical evaluator into a first prompt.
- **No `aggregateRating`, no star schema, no SOC 2 / ISO / FedRAMP badges, no "trusted by" framing, no customer logos, no fabricated metric, no email capture, no exit-intent modal, no chat widget, no cookie banner, no analytics at launch.**
- **Partner strip header is `Built with leading organizations.`** verbatim. Never "Trusted by" — they are ecosystem partners, not customers.
- **`public/img/globe.png` (1.14 MB) and `public/img/bg/auth-topo.png` (1.37 MB) are DELETED.** The floating-globe hero and the single frosted-glass section were both cut; 2.5 MB of unreferenced binary in the repo is pure cost.

---

## 2. THE CUT LIST

Sections, components and claims that a specialist asked for and that are not in this build.

| Cut | Reason |
|---|---|
| Worked-examples section (4 cards with run logs) | Scenarios and telemetry were invented (§1.1). Replaced by the hero demo (real) + §4 real prompts (real). |
| Third demo exchange + `mapStep` 3 + `sakaka_pivots_gte_15ha.geojson` | Invented (§1.2). |
| `DemoChart.tsx` + 13-bin bar chart + Table\|Chart toggle | The run produced no `.csv` file (§1.3). The fenced block is real and better. |
| GoBox section (12 named solution tiles, domain chips, "Browse all solutions") | Names invented (§1.4). GoBox is referenced only where the live site references it. |
| "How it works — Ask / Watch / Verify" as a section | Its three beats are each the subject of a dedicated section (§5 trust, §7 integrations). Replaced by a one-line flow breadcrumb inside §3, using the product's real breadcrumb recipe. Saves a full screen. |
| Copy-to-clipboard MCP config block | No verified config string exists (§1.8). |
| 90-second hero video + play glyph + "Watch the full video" | No video exists (§1.12). |
| "Run this yourself →" per-card deep links | No prompt pre-seed mechanism (§1.13). |
| `Docs` nav item; `API Documentation` footer link | No verified public URL (§1.19). |
| Dark `bg-slate-900` trust band | Product is light-only (§1.15). |
| Testimonial headshots | None exist; live site uses initials (§1.16). |
| Phil Cooper testimonial | Praises the team, not the product (§1.17). |
| Nine invented dataset chips | Unverified (§1.5). |
| "A typical flood analysis costs 30-40 tokens" | Invented (§1.10). |
| Token-pool explanation beyond the verbatim footnote | App contradicts the gloss (§1.11). |
| Scale bar, NDVI ramp, time slider, share button, confidence score, per-field crop label on the demo map | None exist in that output, or cannot stay accurate responsively. |
| "Use cases / sectors" section (Urban / Agriculture / Defense / Environmental) | The six real prompts already span six domains and are tagged; a separate vertical grid would be invented content competing for the same scroll. |
| Logo marquee animation on desktop | Static row is specified; the marquee runs only below `md` where seven logos do not fit. |
| Eight-tile generic feature grid; team bios; blog feed; changelog; careers | Belong on `rasid.ai`. On a product page they dilute. |
| Animated globe, particle mesh, mesh gradient, glow blobs, parallax, scroll-jacking, counting-up numbers, autoplay carousel | Zero gradients exist in the product; these cost the LCP budget and signal "generic AI vendor". |
| Frosted-glass (`backdrop-blur-md` over `auth-topo.png`) section | The product's one glassmorphism moment is sign-in. Repeating it cheapens it, and the asset is 1.37 MB. |
| `/datasets` page, `/privacy`, `/terms`, `/blog` sub-pages | Single-page build. Legal links point at the real app URLs. |
| Analytics, consent banner, GA4, PostHog | Deliberate launch omission. Zero third-party JS. |

---

## 3. GLOBAL PAGE ARCHITECTURE

### 3.0 Section order, surfaces and headings

| # | Section | `id` | Surface | H-level | Heading |
|---|---|---|---|---|---|
| 1 | Sticky nav | — | `bg-white/85 backdrop-blur-md` | — | — |
| 2 | Hero | `hero` | `.surface-canvas` | **H1** | Ask Earth a question. / Get the layer back. |
| 3 | Credibility strip | `proof-strip` | `bg-white` | H2 (sr-only) | Credibility |
| 4 | Real prompts | `prompts` | `bg-slate-50` | H2 | What people actually ask it. |
| 5 | Trust | `shows-its-work` | `.surface-canvas` | H2 | It shows its work. All of it. |
| 6 | Data and models | `datasets` | `bg-white` | H2 | One interface over 10,000+ datasets. |
| 7 | Integrations | `integrations` | `.surface-sand` | H2 | It does not ask you to leave QGIS. |
| 8 | Proof | `reviewed` | `bg-white` | H2 | Reviewed by people who do this for a living. |
| 9 | Pricing | `pricing` | `bg-slate-50` | H2 | Start free. Scale when you need to. |
| 10 | FAQ | `faq` | `bg-white` | H2 | GoPilot, answered. |
| 11 | Closing CTA | `start` | `bg-brand` | H2 | GoPilot is the interface to Earth. |
| 12 | Footer | — | `bg-brand-900` | H2 (sr-only) | Footer |

Surface sequence: canvas, white, slate-50, canvas, white, sand, white, slate-50, white, brand, brand-900. Never two identical adjacent surfaces. Total saturated/dark area is roughly 22% of scroll height, all of it at the bottom.

**Exactly one `h1` on the page.** Footer and nav column labels are `<p class="eyebrow">`, never headings. Footer `h3`s inflate the heading outline and dilute the on-page topic.

### 3.1 Section rhythm and reveal

Every content section follows this shell:

```html
<section id="..." class="section">
  <div class="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
    <Reveal> ... </Reveal>
  </div>
</section>
```

`.section` is `py-16 md:py-24`. `components/Reveal.tsx` adds `class="reveal"` and sets `data-revealed="true"` from an IntersectionObserver at threshold `0.15`, then disconnects. It never re-animates on scroll-up. Stagger at most three children using Tailwind arbitrary properties: `[animation-delay:80ms]`, `[animation-delay:160ms]`.

### 3.2 Honesty disclosures: exact strings, exact placement

1. **Under the hero demo card**, class `mt-3 text-[11px] leading-snug text-slate-500`:
   `Real GoPilot output. Sentinel-2 L2A scene S2A_37RFP_20260927_1_L2A, 2026-09-27, Al Jawf Province, Saudi Arabia. Transcript condensed; animation timing is illustrative.`
2. **Inside the demo map legend**, class `text-[10px] text-white/80`:
   `Sentinel-2 L2A · 2026-09-27 · 10 m`
3. **Map attribution, bottom-right of the map region**, class `text-[9px] text-white/60`:
   `© Mapbox © Maxar © OpenStreetMap`
4. **Footer legal line 2**, class `text-xs text-white/50`:
   `Satellite basemap © Mapbox © Maxar © OpenStreetMap. Field boundaries shown are real GoPilot model output.`

### 3.3 Accessibility floor, applies everywhere

- Skip link, the first focusable element in `body`:
  `<a href="#hero" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-dark focus:shadow-lg">Skip to content</a>`
- **`#008B6A` on white is 4.29:1 and FAILS AA for text under 18.66px.** Any green text below `text-lg` uses `text-brand-dark` (`#007A5E`, 5.37:1). The only two exceptions are the H1's second line and the `10,000+` stat numeral, which are both large text and only need 3:1.
- `text-slate-400` is 2.6:1 on white and is decorative only. Never put load-bearing information in it. Wherever a specialist recipe used `text-slate-400` for a sentence a visitor must read, this spec promotes it to `text-slate-500` (`#7C7477`, 4.9:1).
- Icons next to a text label get `aria-hidden="true"`. Icon-only buttons get both `aria-label` and `title`.
- Every `img` carries explicit `width` and `height` attributes.
- Every disclosure button carries `aria-expanded` and `aria-controls`.
- The page-wide focus floor lives in `globals.css` (`:focus-visible { outline: 2px solid #008B6A; outline-offset: 2px }`). Buttons additionally carry `focus:ring-2 focus:ring-brand focus:ring-offset-2`.

---

## 4. SECTION 1, STICKY NAV

**File:** `components/Nav.tsx`, a server component. No top-level `"use client"`. The mobile sheet is a separate client leaf, `components/NavMobile.tsx`.

**Shell:**

```html
<header class="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/85 backdrop-blur-md">
  <nav aria-label="Main" class="mx-auto flex h-16 max-w-page items-center gap-6 px-4 sm:px-6 lg:px-8">
```

**Left, logo lockup**, wrapped in `<a href="#hero" class="flex shrink-0 items-center gap-2.5">`:

- `<img src="/img/logo.svg" alt="RASID" width="32" height="40" class="h-8 w-auto" />`
- `<span class="font-display text-lg font-bold tracking-tight text-brand">GoPilot</span>`
- `<span class="hidden text-[11px] font-medium text-slate-500 sm:inline">by RASID</span>`

**Centre, four links** inside `<ul class="ml-auto hidden items-center gap-7 lg:flex">`, each link
`class="text-sm font-medium text-slate-600 transition-colors hover:text-brand-dark"`:

| Label | Href |
|---|---|
| `How it works` | `#shows-its-work` |
| `Datasets & models` | `#datasets` |
| `Integrations` | `#integrations` |
| `Pricing` | `#pricing` |

**Right**, inside `<div class="ml-auto flex items-center gap-3 lg:ml-0">`:

- `<a href="https://app.gopilot.earth/auth?active_form=login" class="hidden text-sm font-medium text-slate-600 transition-colors hover:text-brand-dark sm:inline">Sign in</a>`
- Primary CTA:
  ```html
  <a href="https://app.gopilot.earth/auth?active_form=register" class="btn btn-primary">
    <span class="sm:hidden">Sign up free</span>
    <span class="hidden sm:inline">Sign up free&nbsp;· 500 tokens</span>
    <span aria-hidden="true">&rarr;</span>
  </a>
  ```
  Two spans so the button never wraps on a 320px screen.
- Mobile trigger:
  `<button type="button" aria-label="Open menu" aria-expanded={open} aria-controls="nav-sheet" class="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"><Menu class="h-6 w-6" aria-hidden="true" /></button>`

**Mobile sheet**, `components/NavMobile.tsx`, `"use client"`:
`id="nav-sheet"`, root `fixed inset-0 z-50 lg:hidden`; scrim `absolute inset-0 bg-slate-900/50 transition-opacity duration-200`; panel `absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col gap-1 bg-white p-5 shadow-2xl transition-transform duration-200`, toggling `translate-x-full` and `translate-x-0`. Contains the same four links at `text-base font-medium text-slate-700`, a `my-3 border-t border-slate-200` divider, then `Sign in` and the primary CTA at `btn btn-primary w-full justify-center`. Closes on link click, scrim click and Escape. Focus is trapped while open and returns to the trigger on close.

**Nav rules:** no mega-menu, no dropdowns, no label drift. The primary CTA label is byte-identical in the nav, the hero, the pricing Free card and the closing band.

---

## 5. SECTION 2, HERO

**File:** `components/Hero.tsx`, a server component. It renders `<GoPilotDemo />`, the only client island above the fold.

### 5.1 Layout

```html
<section id="hero" aria-labelledby="hero-heading" class="surface-canvas overflow-hidden">
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,48%)_minmax(0,52%)] lg:items-center">

    <!-- LEFT: copy -->
    <div class="px-4 pb-10 pt-10 sm:px-6 lg:py-20 lg:pl-[max(2rem,calc(50vw-600px+2rem))] lg:pr-10">
      <!-- copy block, max-w-[34rem] -->
    </div>

    <!-- RIGHT: demo, flush to the viewport's right edge on lg+ -->
    <div class="px-4 pb-12 sm:px-6 lg:px-0 lg:py-20">
      <GoPilotDemo />
    </div>

  </div>
</section>
```

`lg:pl-[max(2rem,calc(50vw-600px+2rem))]` aligns the copy's left edge with a centred 1200px container at any viewport and falls back to `2rem` below 1264px. The right column carries no horizontal padding on `lg+`, so the demo card bleeds off the right edge, which is exactly how the real app's map extends past the viewport.

**Responsive:** below `lg` the grid is one column, copy then demo. Hero height is content-driven, never `h-screen`. A forced `100vh` hero clips the CTA on a 667px-tall phone.

### 5.2 Copy block, in DOM order, with exact classes

```html
<div class="max-w-[34rem]">

  <p class="eyebrow">Geospatial AI agent <span aria-hidden="true">·</span> by RASID</p>

  <h1 id="hero-heading"
      class="mt-4 font-display text-display-sm font-bold text-slate-900 sm:text-display-md lg:text-[2.75rem] lg:leading-[1.06]">
    Ask Earth a question.
    <span class="block text-brand">Get the layer back.</span>
  </h1>

  <p class="mt-5 text-lg leading-relaxed text-slate-600">
    GoPilot is RASID&rsquo;s AI geospatial agent. Describe the analysis in plain language.
    It finds the satellite data, runs the models, and hands back GeoTIFF and GeoJSON layers
    you can open in QGIS.
  </p>

  <p class="mt-7 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
    Real prompts people send GoPilot
  </p>
  <ul class="mt-2.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
    <!-- 3 chips, see 5.3 -->
  </ul>

  <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
    <a href="https://app.gopilot.earth/auth?active_form=register"
       class="btn btn-lg btn-primary w-full justify-center sm:w-auto">
      Sign up free&nbsp;· 500 tokens <span aria-hidden="true">&rarr;</span>
    </a>
    <a href="https://app.gopilot.earth/try-gopilot"
       class="group inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-brand-dark hover:decoration-brand">
      Try it now, no account
      <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  </div>

  <p class="mt-3 text-[13px] leading-snug text-slate-500">
    No credit card. Runs in your browser. The no-account trial takes text prompts on the real map;
    uploads and drawing an area need an account.
  </p>

  <p class="mt-7 flex items-start gap-2 text-xs leading-snug text-slate-500">
    <Trophy class="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
    <span>
      Winner,
      <a href="https://thrivegeo.com/genai-geospatial-challenge/" target="_blank" rel="noopener"
         class="font-medium text-slate-600 underline decoration-gold/50 underline-offset-2 transition-colors hover:text-gold-dark">
        AWS and thriveGEO GenAI for Geospatial Challenge 2026
      </a>
    </span>
  </p>

</div>
```

**Why the secondary CTA is a text link and not a button:** on mobile, two full-width stacked buttons halve the primary's click share. On desktop it sits inline to the right of the primary.

### 5.3 The three hero prompt chips

Each chip is an `li` containing an `a` to `#prompts`, styled from the product's real `PromptSuggestions` component so the fold and the first session look like one product. **They are real links, not a fake input.** There is no scrub-to-scenario mechanism and the page does not pretend there is one.

```html
<li>
  <a href="#prompts"
     class="group flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-brand/40 hover:bg-brand-soft">
    <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-light text-brand">
      <Icon class="h-3.5 w-3.5" aria-hidden="true" />
    </span>
    <span class="block text-xs font-medium leading-snug text-slate-700 group-hover:text-brand-dark">
      {prompt}
    </span>
  </a>
</li>
```

| # | Icon | Prompt text, verbatim from `GET /api/llm/prompt-suggestions/` |
|---|---|---|
| 1 | `Building2` | `Show me all the buildings within 2km of the Eiffel Tower` |
| 2 | `Leaf` | `How much greener is Central Park in July than in January` |
| 3 | `Flame` | `Apply burn scar analysis on the 2023 Maui wildfire zone` |

The Al Jouf prompt is deliberately held back here. It is the demo's own prompt, running beside these chips.

### 5.4 Hero performance contract

- **The LCP element is the H1**, which is text. Nothing above it fetches a webfont from a third party; `next/font/google` self-hosts at build time.
- `Inter 400` and `Space Grotesk 700` are the only weights needed above the fold. `next/font` preloads both.
- The demo's satellite image is `loading="eager" fetchPriority="low" decoding="async"`. Eager so the hero is not visibly broken, low priority so it never competes with the font fetch.
- The demo animation does not start until the card is 35% in view, so hero JS does no work during paint.
- Targets: LCP under 1.8s on 4G, CLS under 0.05 (the demo card has a fixed height at every breakpoint), First Load JS for `/` under 100 KB.
- **CI gate:** `grep -r "mapbox" .next/static/chunks/` must return nothing but the attribution string. No `mapbox-gl`, no `recharts`, no `d3`, no `framer-motion`, no `gsap`.

---

## 6. SECTION 3, CREDIBILITY STRIP

**File:** `components/CredibilityStrip.tsx`. Surface `bg-white`. Padding `.section-tight` (`py-12 md:py-16`).

Three stacked rows inside `mx-auto max-w-page px-4 sm:px-6 lg:px-8`. Heading is screen-reader only: `<h2 class="sr-only">Credibility</h2>`.

### 6.1 Row 1, flow breadcrumb

Lifted verbatim from the product's own `Solution › Project › Process › Result` breadcrumb. It replaces an entire "How it works" section.

```html
<div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
  <span>Ask</span>
  <ChevronRight class="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
  <span>Plan</span>
  <ChevronRight class="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
  <span>Run</span>
  <ChevronRight class="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
  <span class="text-brand-dark">Verify in your own GIS</span>
</div>
```

The fourth step is `Verify`, not `Done`. That single word reframes the agent from oracle to accelerator, which is also the only honest frame, and it is coloured `text-brand-dark` so the eye lands on it.

### 6.2 Row 2, three stat tiles

`<div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">`, each tile using the product's real `StatTile` recipe:

```html
<div class="stat-tile">
  <div class="flex items-center gap-3">
    <span class="icon-tile-lg"><Icon class="h-5 w-5" aria-hidden="true" /></span>
    <div>
      <p class="font-display text-3xl font-bold leading-none text-slate-900">{value}</p>
      <p class="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  </div>
</div>
```

| Icon | Value | Label | Note |
|---|---|---|---|
| `Database` | `10,000+` | `Earth observation datasets` | The value is wrapped in `<a href="https://rasid.ai/products#gopilot" class="transition-colors hover:text-brand-dark">` so the count lands in a real inventory rather than asserting itself. |
| `Cpu` | `Hundreds` | `AI and geospatial models` | |
| `Trophy` | `2026` | `AWS & thriveGEO GenAI winner` | Tile override: `icon-tile-lg` becomes `flex h-10 w-10 items-center justify-center rounded-xl bg-gold-light text-gold-dark`. Value wrapped in a link to `https://thrivegeo.com/genai-geospatial-challenge/`. |

### 6.3 Row 3, partner strip

```html
<p class="mt-14 text-center text-[13px] text-slate-500">Built with leading organizations.</p>
```

Header text is verbatim from the live site. **Never "Trusted by", never "Our customers", never "Powering teams at".** These are ecosystem and technology partners, not GoPilot customers, and the live site frames them exactly this way.

Seven organisations, in this order: **AWS, World Bank, OGC, UNDP, CGI, AOAD, FRED Engineering.**

Desktop (`sm+`): a static row, `mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6`.
Mobile (`<sm`): one marquee only, `.marquee-track` with the children duplicated once inside the track, `hover:animation-play-state: paused`, killed entirely by `prefers-reduced-motion`.

**Two render variants. Pick one at build time; both are fully specified.**

**Variant A, logos (preferred).** Requires the seven files in `public/partners/`. See §24.2 for the exact download commands.

```html
<img src="/partners/aws.png" alt="AWS" width="96" height="28"
     class="h-7 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />
```

| File | `alt` |
|---|---|
| `/partners/aws.png` | `AWS` |
| `/partners/world-bank.png` | `World Bank` |
| `/partners/ogc.svg` | `Open Geospatial Consortium` |
| `/partners/undp-rbas.png` | `UNDP Regional Bureau for Arab States` |
| `/partners/cgi.png` | `CGI` |
| `/partners/aoad.png` | `Arab Organization for Agricultural Development` |
| `/partners/fred.png` | `FRED Engineering` |

Never write the word "logo" in alt text. It is never useful.

**Variant B, text wordmarks (zero-asset fallback).** If the seven files are not present, ship this instead. Do not ship a mix, and never ship a broken `img`.

```html
<span class="font-display text-sm font-semibold tracking-tight text-slate-500">AWS</span>
```

Wordmark strings, in order: `AWS`, `World Bank`, `OGC`, `UNDP`, `CGI`, `AOAD`, `FRED Engineering`.

Below the strip, one link in both variants:

```html
<p class="mt-6 text-center text-xs text-slate-500">
  <a href="https://rasid.ai/about" class="underline decoration-slate-300 underline-offset-2 transition-colors hover:text-brand-dark">
    RASID participates in the wider geospatial ecosystem through AWS, the World Bank and the OGC
  </a>
</p>
```

That sentence is a near-verbatim lift from `rasid.ai/about` and is the defensible version of the claim.

---

## 7. SECTION 4, REAL PROMPTS

**File:** `components/RealPrompts.tsx`. Data: `lib/content/prompts.ts`. Surface `bg-slate-50`.

This section replaces the cut worked-examples section. Every one of the six prompt strings was fetched live from the public `GET /api/llm/prompt-suggestions/` endpoint. **Not one word is invented, and no run log is attached to any of them**, because we have verified output for only one of the six and that one is already running in the hero.

### 7.1 Header

```html
<p class="eyebrow text-center">Real prompts</p>
<h2 id="prompts-heading" class="mt-3 text-center font-display text-display-sm font-bold text-slate-900 md:text-display-md">
  What people actually ask it.
</h2>
<p class="lead mt-4 text-center">
  These six are the starter prompts GoPilot ships to new users. Each one is a single sentence,
  and each one is a job that used to take an afternoon.
</p>
```

### 7.2 Grid

`<ul class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">`

Each card:

```html
<li class="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-colors hover:border-brand/40 hover:bg-brand-soft">
  <div class="flex items-center gap-2">
    <span class="icon-tile-sm"><Icon class="h-3.5 w-3.5" aria-hidden="true" /></span>
    <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{domain}</span>
  </div>
  <p class="font-mono text-[13px] leading-relaxed text-slate-700">&ldquo;{prompt}&rdquo;</p>
  <p class="mt-auto text-xs leading-snug text-slate-500">{mechanism}</p>
</li>
```

The prompt is rendered in `font-mono` (which resolves to the OS stack, exactly as the product's reasoning panel does) so it reads as something typed rather than something written by a marketer.

| # | Icon | Domain | Prompt (verbatim) | `mechanism` line |
|---|---|---|---|---|
| 1 | `Building2` | `Urban` | `Show me all the buildings within 2km of the Eiffel Tower` | `Buffer in true metres, auto-UTM, then a spatial join against building footprints.` |
| 2 | `ScanSearch` | `Urban` | `Scene parse the 500-meter proximity around Burj Khalifa` | `Open-vocabulary scene parsing over high-resolution optical imagery.` |
| 3 | `Leaf` | `Vegetation` | `How much greener is Central Park in July than in January` | `Two Sentinel-2 scenes, cloud-masked, NDVI on both, differenced.` |
| 4 | `Flame` | `Wildfire` | `Apply burn scar analysis on the 2023 Maui wildfire zone` | `NBR before and after, thresholded into a burn-severity raster.` |
| 5 | `Sprout` | `Agriculture` | `Can you delineate a couple of the circular fields in the Al Jouf Province KSA` | `The run playing in the hero. 324 field polygons, 2,097.9 ha, one prompt.` |
| 6 | `Layers` | `Land cover` | `Show me land cover classification for Lake Tahoe` | `Esri annual land use and land cover at 10 m, clipped to your area.` |

Every `mechanism` line is assembled only from capabilities named on `rasid.ai/products` (`Buffer · true-meter, auto-UTM`, `Spatial join`, `Scene parsing · open vocabulary`, `Spectral indices · NDVI, NDWI, NBR`, `Multi-date change detection`, `Thresholding & reclassification`, `Esri annual LULC · 10 m`) plus the hero run's own verified numbers. Nothing here is a guess.

### 7.3 Footer line

```html
<p class="mt-10 text-center text-sm text-slate-600">
  <a href="https://app.gopilot.earth/try-gopilot" class="link-brand">Send one yourself, no account needed</a>
  <span class="text-slate-500"> &mdash; text prompts on the real map. Uploads and drawing an area need an account.</span>
</p>
```

Correction for the builder: use a middot, not an em dash. The final string is:

`Send one yourself, no account needed` · `text prompts on the real map. Uploads and drawing an area need an account.`

Render as: link, then `<span aria-hidden="true" class="mx-1.5 text-slate-300">·</span>`, then the `text-slate-500` span.

---

## 8. SECTION 5, TRUST

**File:** `components/ShowsItsWork.tsx`. Surface `.surface-canvas`.

This is the highest-leverage section on the page and the one where every competitor is weakest. Harvey, selling to the most liability-averse buyers alive, has no accuracy or citation claim on its homepage. Sierra and Decagon substitute compliance badges. **GoPilot can show mechanics instead of writing adjectives**, because its real UI already emits all four.

**The word "trusted" does not appear in this section. Neither does "reliable", "enterprise-grade" or "hallucination".**

### 8.1 Header

```html
<p class="eyebrow">Auditability</p>
<h2 id="shows-its-work-heading" class="mt-3 font-display text-display-sm font-bold text-slate-900 md:text-display-md">
  It shows its work. All of it.
</h2>
<p class="mt-4 max-w-[52ch] text-lg leading-relaxed text-slate-600">
  You should not have to defend a geospatial result you cannot audit. GoPilot exposes the whole chain:
  what it thought, what it called, which scene it used, and what it could not do.
</p>
```

### 8.2 Four proof tiles

`<ul class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">`

```html
<li class="panel flex flex-col gap-3">
  <span class="icon-tile"><Icon class="h-5 w-5" aria-hidden="true" /></span>
  <h3 class="text-base font-bold text-slate-900">{title}</h3>
  <p class="text-sm leading-relaxed text-slate-600">{body}</p>
  {optional evidence block}
</li>
```

**Tile 1.** Icon `Brain`, icon tile overridden to `flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand-highlight`.
Title: `You can watch it think.`
Body: `Every answer can open its reasoning. The Thinking panel streams the chain that produced the result while the run is still going, so if GoPilot is about to pick the wrong collection you see it before it finishes, not after you have shipped the map.`

**Tile 2.** Icon `Wrench`.
Title: `Every tool, named, with its status.`
Body: `GoPilot logs each tool it calls by name, marked in progress, succeeded or failed. No silent fallbacks and no quiet substitutions.`
Evidence block, the real tool names from the hero run:

```html
<ul class="mt-1 flex flex-wrap gap-1.5">
  <li class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">sentinel2_search_goserver</li>
  <li class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">sentinel2_fetch_goserver</li>
  <li class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">ksa_delineate_fields_goserver</li>
  <li class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">add_area_column_goserver</li>
  <li class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">filter_vector_rows_numerical_goserver</li>
</ul>
```

**Tile 3.** Icon `Satellite`.
Title: `The provenance travels with the answer.`
Body: `GoPilot names the scene it used, not just the result. Written into the answer, not buried in a log.`
Evidence block, verbatim from the hero run's answer:

```html
<p class="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[11px] leading-relaxed text-slate-600">
  Sentinel-2 L2A <span class="text-brand-dark">S2A_37RFP_20260927_1_L2A</span>, 2026-09-27,
  0% cloud cover, 10 m resolution, 12 bands
</p>
```

**Tile 4.** Icon `ShieldCheck`. **This is the most persuasive tile on the page. Build it exactly.**
Title: `It tells you when it cannot.`
Body: `When a tool it needs does not exist in its toolchain, GoPilot says so in the answer and works around it in the open, rather than improvising a result that looks useful.`
Evidence block, a verbatim quotation from the second real answer:

```html
<blockquote class="mt-1 border-l-2 border-brand-highlight pl-3 text-sm italic leading-relaxed text-slate-600">
  &ldquo;No vector-to-CSV conversion tool is available in the toolchain, so I built the distribution
  directly from the delineation output using cumulative numeric filtering and differenced the bin edges.&rdquo;
  <footer class="mt-1.5 text-[11px] not-italic text-slate-500">GoPilot, unedited, in the run playing above.</footer>
</blockquote>
```

A landing page that depicts its own limitation is making a claim its competitors structurally cannot copy. It costs nothing because it is true, and the visitor can watch it happen in the hero.

### 8.3 Data callout bar

The one saturated element in this section.

```html
<div class="mt-12 rounded-2xl bg-brand-900 px-6 py-7 md:px-8">
  <div class="flex flex-col gap-3 md:flex-row md:items-start md:gap-5">
    <Lock class="mt-0.5 h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
    <div>
      <p class="font-display text-base font-semibold text-white">Your conversations are not training data.</p>
      <p class="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-white/70">
        Conversations may be reviewed for quality and safety, but are never used to train our AI models.
        Session replay and heatmaps are switched off across the product, because the screen shows your
        imagery, your coordinates and your project names.
      </p>
    </div>
  </div>
</div>
```

Sentence one is verbatim from the product's own composer disclaimer. Sentence two is verified from the repository's analytics configuration. **No third sentence.** "Uploads are scoped to your workspace" and "exports are unrestricted" are not verified and are not claimed. **No SOC 2, ISO 27001, ISO 42001, HIPAA, GDPR or FedRAMP badge appears anywhere on this page.** RASID holds none of those attestations, and reproducing the visual grammar of compliance without the substance is the one mistake that would destroy credibility with exactly the defence and government buyers it was meant to impress.

**No CTA in this section.** Deliberate. A button in the middle of a trust argument makes the argument look like a pitch.

---

## 9. SECTION 6, DATA AND MODELS

**File:** `components/DataAndModels.tsx`. Data: `lib/content/datasets.ts`. Surface `bg-white`.

### 9.1 Header

```html
<p class="eyebrow">Coverage</p>
<h2 id="datasets-heading" class="mt-3 font-display text-display-sm font-bold text-slate-900 md:text-display-md">
  One interface over 10,000+ datasets.
</h2>
<p class="mt-4 max-w-[56ch] text-lg leading-relaxed text-slate-600">
  GoPilot searches, filters and fuses Earth observation archives so you never open another catalogue UI.
  Data sources include Sentinel-2 optical imagery, high-resolution optical imagery, DEM elevation,
  ERA5 climate reanalysis, and foundation-model embeddings such as Clay and AlphaEarth.
</p>
```

The second sentence of the lead is verbatim from `rasid.ai/products`.

### 9.2 Two-column body

`<div class="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)] lg:gap-12">`

**Left column, dataset chips.** Eleven chips, exactly the live site's list and order. Every chip is a link to `https://rasid.ai/products#gopilot`.

```html
<p class="eyebrow">Datasets and providers</p>
<ul class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
  <li>
    <a href="https://rasid.ai/products#gopilot"
       class="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-dark">
      <Satellite class="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
      <span class="truncate">Sentinel-2 L1C / L2A</span>
    </a>
  </li>
  <!-- repeat this <li> for each of the 11 rows in the table below, in order -->
</ul>
```

| # | Chip label (verbatim) | Icon |
|---|---|---|
| 1 | `Sentinel-2 L1C / L2A` | `Satellite` |
| 2 | `Landsat 4–9 Collection 2` | `Satellite` |
| 3 | `Mapbox & Google tiles` | `Map` |
| 4 | `Copernicus DEM · 30 m` | `Mountain` |
| 5 | `ERA5 climate reanalysis` | `CloudSun` |
| 6 | `ESA CCI climate variables` | `CloudSun` |
| 7 | `AlphaEarth embeddings` | `Braces` |
| 8 | `Esri annual LULC · 10 m` | `Layers` |
| 9 | `Microsoft building footprints` | `Building2` |
| 10 | `ArcGIS Living Atlas · Source Cooperative` | `Globe` |
| 11 | `… and more` | `Plus` |

Chip 11's label is the live site's own eleventh entry, verbatim. Its classes gain `border-dashed`.

**These eleven are the complete verified inventory. Do not add Sentinel-1, Sentinel-3, MODIS, SRTM, ESA WorldCover, GHSL, VIIRS, CHIRPS, OpenStreetMap or Overture. None of them appears on any RASID surface we checked.**

**Right column, models.** Nine rows, verbatim from `rasid.ai/products`.

```html
<p class="eyebrow">AI models</p>
<ul class="mt-4 divide-y divide-slate-200 border-y border-slate-200">
  <li class="flex items-center gap-2.5 py-2.5">
    <Check class="h-3.5 w-3.5 shrink-0 text-state-success" aria-hidden="true" />
    <span class="text-sm text-slate-700">Field delineation</span>
  </li>
  <!-- repeat this <li> for each of the 9 model rows listed below, in order -->
</ul>
```

Rows, in order: `Scene parsing · open vocabulary`, `Field delineation`, `Solar panel segmentation`, `Tree crown & palm detection`, `Cloud & shadow detection`, `Methane plume detection`, `Banana TR4 disease detection`, `Wheat crop classification`, `DINOv3 embeddings + PCA`.

Below the list:

```html
<p class="mt-5 text-xs leading-relaxed text-slate-500">
  Plus spectral indices (NDVI, NDWI, NBR), multi-date change detection, phenology, band math and
  raster algebra, thresholding and reclassification, and the vector toolkit: buffer in true metres with
  auto-UTM, intersect, union, difference, dissolve, spatial join and geodesic area columns.
</p>
<p class="mt-4 text-xs text-slate-500">
  The agent does not replace specialised geospatial models; it orchestrates them.
</p>
```

The final sentence is verbatim from the RASID case study. It is a load-bearing differentiator and it must survive copy editing.

### 9.3 Honesty note on exports

```html
<p class="mt-10 rounded-lg border border-brand/20 bg-brand-soft px-4 py-3 text-sm leading-relaxed text-brand-dark">
  Outputs come back as the file the worker produced. GoPilot can return maps, quantitative results and
  downloadable raster and vector layers, in formats such as GeoTIFF and GeoJSON, so results drop into
  standard GIS workflows.
</p>
```

Sentence two is verbatim from the `rasid.ai/about` FAQ. **Do not list shapefile, KML, GeoPackage or PDF as exports.** There is no format-conversion feature in the product; the only download path is a plain fetch-and-save of the produced file.

---

## 10. SECTION 7, INTEGRATIONS

**File:** `components/Integrations.tsx`. Surface `.surface-sand`.

The section that removes the real reason this buyer says no: switching cost plus professional identity.

### 10.1 Header

```html
<p class="eyebrow">Integrations</p>
<h2 id="integrations-heading" class="mt-3 font-display text-display-sm font-bold text-slate-900 md:text-display-md">
  It does not ask you to leave QGIS.
</h2>
<p class="mt-4 max-w-[52ch] text-lg leading-relaxed text-slate-600">
  GoPilot runs where you already work. One engine, three ways to use it: the agent in your browser,
  GoServers over MCP and the API, and plugins inside the GIS tools you already use.
</p>
```

"One engine, three ways to use it" is the live `rasid.ai/products` H1, lightly re-cased to fit the sentence.

### 10.2 Four cards

`<ul class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">`

```html
<li class="panel flex flex-col gap-3">
  <span class="icon-tile"><Icon class="h-5 w-5" aria-hidden="true" /></span>
  <h3 class="text-base font-bold text-slate-900">{title}</h3>
  <p class="text-sm leading-relaxed text-slate-600">{body}</p>
  {optional extras}
  <a href="{href}" class="group mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark transition-colors hover:text-brand">
    {linkLabel}
    <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
  </a>
</li>
```

**Card 1, lead with this one. It is the single best anti-churn signal for this buyer.**
Icon `Map`. Title: `GoPilot, inside QGIS`
Body: `Install it from the QGIS Plugin Manager: open Plugins, Manage and Install Plugins, and search for GoPilot. Sign in with a key, pick a solution, define or upload your area of interest, and run AI-assisted geospatial and Earth observation processes without leaving your project.`
Link: `Open the QGIS plugin page` → `https://plugins.qgis.org/plugins/rasid_plugin/` (`target="_blank" rel="noopener"`)

**Card 2.** Icon `AppWindow`. Title: `GoPilot, docked inside ArcGIS Pro`
Body: `Download the add-in, close ArcGIS Pro, double-click to install, and a RASID tab appears on the ribbon. Same solutions, same areas of interest, same results, reviewed and exported in place.`
Link: `Download the add-in` → `https://github.com/rasid-ai/arcgispro_addin_gopilot/releases/latest/download/RASID.esriAddinX` (`target="_blank" rel="noopener"`)

**Card 3.** Icon `Terminal`. Title: `GoServers: geospatial analysis as a tool call`
Body, verbatim from the live site: `GoPilot's geospatial capabilities are exposed over MCP through four GoServers. Fetch data, run vector operations, analyse rasters and time series, and run AI models. Orchestrated by GoPilot, or called directly from your own code.`
Extras, the four server rows, verbatim:

```html
<ul class="mt-1 space-y-1.5">
  <li class="flex items-baseline gap-2 text-xs">
    <span class="font-mono font-medium text-slate-700">GoServer-Fetch</span>
    <span class="text-slate-400" aria-hidden="true">·</span>
    <span class="text-slate-500">Discover and retrieve from 10,000+ datasets</span>
  </li>
  <li>... GoServer-Geo · Vector operations on GeoJSON, GeoParquet and shapefiles</li>
  <li>... GoServer-Analyze · Raster processing, spectral indices, change detection and time series</li>
  <li>... GoServer-AI · Run RASID's geospatial AI models on imagery</li>
</ul>
<p class="mt-2 text-[11px] text-slate-500">
  The MCP connector for AI agents is an Enterprise plan feature.
</p>
```

That availability line is mandatory and verbatim from the live pricing table. **No copyable config block.** No config string is verified to exist, and a snippet that does not work is worse than no snippet.
Link: `Read about GoServers` → `https://rasid.ai/products#mcps`

**Card 4.** Icon `KeyRound`. Title: `Your own tools, with your own key`
Body: `Create a named API key in Settings, Developer, API Keys, with an optional expiry. The key is shown once and is revocable at any time, and each one carries its own usage analytics: total, successful and failed requests, average response time, and a log of every call.`
Link: `Create an API key` → `https://app.gopilot.earth/api-keys`

**No buttons in this section.** A technical evaluator's next step is documentation, not signup. Four inline links, nothing more.

---

## 11. SECTION 8, PROOF

**File:** `components/Proof.tsx`. Surface `bg-white`.

Four testimonials are verified on `rasid.ai`. Three ship. Ranked by the objection they answer, not by logo size.

### 11.1 Header

```html
<p class="eyebrow text-center">Recognition</p>
<h2 id="reviewed-heading" class="mt-3 text-center font-display text-display-sm font-bold text-slate-900 md:text-display-md">
  Reviewed by people who do this for a living.
</h2>
```

### 11.2 Three quote cards

`<ul class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">`

```html
<li class="card flex h-full flex-col">
  <div class="card-body flex flex-1 flex-col gap-4">
    <Quote class="h-5 w-5 text-brand-light" aria-hidden="true" />
    <blockquote class="flex-1 text-sm leading-relaxed text-slate-700">
      <p>{quote}</p>
    </blockquote>
    <figcaption class="flex items-center gap-3 border-t border-slate-200 pt-4">
      <span aria-hidden="true"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light font-display text-xs font-bold text-brand-dark">
        {initials}
      </span>
      <span class="min-w-0">
        <span class="block text-sm font-semibold text-slate-900">{name}</span>
        <span class="block text-xs leading-snug text-slate-500">{title}</span>
      </span>
    </figcaption>
  </div>
</li>
```

Wrap each card in `<figure>` so `figcaption` is valid; the `li` is the `figure`.

**Initials badges, not headshots.** No headshots exist, and the live site uses initials. A grey placeholder avatar reads as unfinished and contaminates the credibility of the real proof around it.

**Card 1, first position, non-negotiable.** `GP`
Name: `Giulio Poggi`
Title: `Post-doctoral researcher, Centre for Cultural Heritage Technology (CCHT), Istituto Italiano di Tecnologia`
Quote, verbatim: `I was impressed by GoPilot's detailed reasoning and its ability to autonomously adapt its workflow to complex geospatial queries. It successfully produced the requested raster and vector outputs, and its capabilities stood out compared with other geospatial AI systems I have tested.`
Emphasis: wrap `stood out compared with other geospatial AI systems I have tested` in `<strong class="font-semibold text-slate-900">`, matching the live site's own emphasis.

This quote leads because an independent researcher vouching for the agent's reasoning and its raster and vector outputs is precisely the claim a GIS analyst is trying to verify. Vendor-partner praise is not.

**Card 2.** `MP`
Name: `Miriam Puertos`
Title: `Partner Manager, AWS`
Quote, verbatim: `What impressed me about RASID is their ability to bring together Earth observation, geospatial technologies, and AI into practical solutions. GoPilot is a strong example of this, combining advanced AI with geospatial data and tools to simplify complex analysis. It has been exciting to see the team develop this capability and we look forward to seeing what they build next.`
Emphasis on `bring together Earth observation, geospatial technologies, and AI into practical solutions`.

**Card 3.** `OR`
Name: `Dr Osama Rayis`
Title: `Chair of Agripreneurship, Arab Organization for Agricultural Development (AOAD)`
Quote, verbatim: `Using GoPilot gave me a different perspective on how geospatial analysis can be approached. I was particularly interested in exploring how it could be applied to different challenges across the Arab region, and I see significant potential for developing practical use cases around the needs of the region.`
Emphasis on `significant potential for developing practical use cases around the needs of the region`.

### 11.3 Gold award strip

```html
<div class="mt-10 flex flex-col items-center gap-3 rounded-xl border border-gold bg-gold-light px-6 py-5 text-center sm:flex-row sm:justify-center sm:text-left">
  <Trophy class="h-6 w-6 shrink-0 text-gold" aria-hidden="true" />
  <p class="text-sm font-semibold text-gold-dark">
    Winner, AWS and thriveGEO GenAI for Geospatial Challenge 2026
    <span class="mx-1.5 font-normal text-gold-dark/60" aria-hidden="true">·</span>
    <span class="font-normal">GoPilot launch, AWS London</span>
  </p>
  <a href="https://thrivegeo.com/genai-geospatial-challenge/" target="_blank" rel="noopener"
     class="group inline-flex items-center gap-1 text-xs font-medium text-gold-dark underline underline-offset-2 sm:ml-2">
    Read about the challenge
    <ArrowRight class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
  </a>
</div>
```

`#C9A227` gold is for accolades only. **Never use `state.warning` `#F59E0B` for a trophy, and never use gold for a caution state.** The design system gives gold its own token specifically to prevent this.

### 11.4 Research link

```html
<p class="mt-8 text-center text-sm text-slate-600">
  <a href="https://rasid.ai/publications" class="group inline-flex items-center gap-1.5 link-brand">
    Grounded in peer-reviewed research: three papers with DOIs
    <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
  </a>
</p>
```

**Nothing else in this section.** No stat band, no customer count, no "10,000 analysts trust GoPilot", no quantified customer outcome. **GoPilot has zero published customer outcome metrics.** Three credible named humans outperform one invented percentage, and this audience will probe a fabricated number in the first sales call.

---

## 12. SECTION 9, PRICING

**File:** `components/Pricing.tsx`. Data: `lib/content/pricing.ts`, which is also the single source for the JSON-LD offers. Surface `bg-slate-50`.

### 12.1 Header

```html
<p class="eyebrow text-center">Pricing</p>
<h2 id="pricing-heading" class="mt-3 text-center font-display text-display-sm font-bold text-slate-900 md:text-display-md">
  Start free. Scale when you need to.
</h2>
<p class="lead mt-4 text-center">
  Every plan includes the full map workspace. What changes is how much GoPilot you get, how much you
  can store, and which datasets and exports are unlocked.
</p>
```

Both the H2 and the lead are verbatim from RASID's own surfaces: the H2 from the live homepage pricing section, the lead from the in-app plans page.

### 12.2 Four cards

`<ul class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">`

```html
<li class="card flex flex-col {highlighted ? 'ring-2 ring-brand' : ''}">
  <div class="card-body flex flex-1 flex-col gap-4">

    <div class="flex items-start justify-between gap-2">
      <h3 class="text-lg font-bold text-slate-900">{name}</h3>
      {badge && <span class="badge bg-brand-light text-brand-dark">{badge}</span>}
    </div>
    <p class="-mt-2 text-sm text-slate-500">{tagline}</p>

    <div>
      <span class="text-3xl font-bold text-slate-800">{price}</span>
      <span class="ml-1 text-xs text-slate-500">{interval}</span>
    </div>

    <dl class="grid grid-cols-2 gap-3 rounded-lg bg-brand-soft p-3 text-sm">
      <div>
        <dt class="text-xs uppercase tracking-wide text-slate-500">Tokens</dt>
        <dd class="font-semibold text-slate-800">{tokens}</dd>
      </div>
      <div>
        <dt class="text-xs uppercase tracking-wide text-slate-500">Storage</dt>
        <dd class="font-semibold text-slate-800">{storage}</dd>
      </div>
    </dl>

    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{featuresHeading}</p>
    <ul class="space-y-1.5">
      <li class="flex items-start gap-2 text-sm text-slate-700">
        <Check class="mt-0.5 h-3.5 w-3.5 shrink-0 text-state-success" aria-hidden="true" />
        <span>{feature}</span>
      </li>
    </ul>

    <a href="{ctaHref}" class="btn {ctaVariant} mt-auto w-full justify-center">{ctaLabel}</a>

  </div>
</li>
```

Highlighting is `ring-2 ring-brand`. **Not a gradient border, not a scale transform, not a coloured background.** That is the product's own treatment.

| | **Free** | **Pro** | **Business** | **Enterprise** |
|---|---|---|---|---|
| `badge` | — | `Most popular` | — | — |
| `highlighted` | false | **true** | false | false |
| `tagline` | `Explore GoPilot and run your first analyses.` | `For analysts running recurring geospatial work.` | `For organizations scaling geospatial intelligence.` | `For organizations with custom deployment needs.` |
| `price` | `€0` | `€149` | `€499` | `Custom` |
| `interval` | `per month` | `per month` | `per month` | `tailored to your deployment` |
| `tokens` | `500` | `5,000` | `25,000` | `Custom` |
| `storage` | `1 GB` | `100 GB` | `1 TB` | `Custom` |
| `featuresHeading` | `Includes` | `Everything in Free, plus` | `Everything in Pro, plus` | `Everything in Business, plus` |
| `ctaLabel` | `Sign up free · 500 tokens` | `Start Pro →` | `Start Business →` | `Talk to sales →` |
| `ctaHref` | `https://app.gopilot.earth/auth?active_form=register` | `https://app.gopilot.earth/pricing` | `https://app.gopilot.earth/pricing` | `https://calendly.com/rasid/30mins` |
| `ctaVariant` | `btn-primary` | `btn-primary` | `btn-outline` | `btn-outline` |

Feature lists, verbatim from the live homepage pricing table:

- **Free:** `Basic datasets` · `Basic AI models` · `Export raster and vector results` · `Session history management`
- **Pro:** `Pro datasets` · `Pro AI models` · `Dashboard` · `GoBox` · `QGIS Plugin` · `Personal license` · `1 named user`
- **Business:** `Premium datasets` · `Premium AI models` · `ArcGIS Pro Add-in` · `Priority email support` · `Commercial license` · `1 named user`
- **Enterprise:** `MCP connector for AI agents` · `Custom on-prem installation` · `Custom Cloud installation` · `Dedicated account manager`

`1 named user` appears on both Pro and Business on the live site. **Reproduce it as-is. Do not "correct" it.**

Pro and Business link to `https://app.gopilot.earth/pricing` rather than a `?plan=` deep link, because **no plan code is verified**. The live plans endpoint is publicly readable before signup, so a guest lands on a working page.

### 12.3 Footnotes

```html
<div class="mt-8 space-y-2 text-center">
  <p class="text-xs text-slate-500">
    Tokens are used across GoPilot, GoBox, and RASID&rsquo;s MCP / API services.
  </p>
  <p class="text-xs text-slate-500">
    A turn costs what it costs. A long analysis over large rasters uses more than a one-line question,
    and unused tokens expire when the period resets rather than rolling over.
  </p>
  <p class="text-xs text-slate-500">
    <a href="https://app.gopilot.earth/pricing" class="link-brand">See the live plan page</a>
    for the current list.
  </p>
</div>
```

Footnote 1 is verbatim from the live site. **Do not expand it.** Do not say "one pool", do not explain what a token buys beyond footnote 2, and do not mention the separate account balance. The app bills geospatial processing in euros against an account balance, not in tokens, and conflating the two currencies generates billing tickets on day one.

Footnote 2 is verbatim product truth. Both of its sentences are defensible.

### 12.4 Hard prohibitions in this section

- No annual toggle. No annual discount. Only monthly is published.
- No invented tier, no invented feature row, no invented token economics.
- No "typical analysis costs 30-40 tokens". That figure does not exist.
- The word `GoToken` must never render.

---

## 13. SECTION 10, FAQ

**File:** `components/Faq.tsx`. Data: `lib/content/faq.ts`. Surface `bg-white`.

**Six items. Each is a native `<details>` element with the answer text present in the static DOM.** Not a JS accordion that removes the answer when collapsed. Two reasons: these answers are the page's long-tail search surface, and FAQPage markup whose text is not visible on the page is a structured-data spam violation.

**The strings in `lib/content/faq.ts` are the single source for both the rendered DOM and the FAQPage JSON-LD in §19. They must match character for character.** If you edit one, edit both, or generate the JSON-LD from the same module (preferred).

### 13.1 Header

```html
<p class="eyebrow text-center">Questions</p>
<h2 id="faq-heading" class="mt-3 text-center font-display text-display-sm font-bold text-slate-900 md:text-display-md">
  GoPilot, answered.
</h2>
```

### 13.2 Item markup

```html
<ul class="mx-auto mt-12 max-w-[68ch] divide-y divide-slate-200 border-y border-slate-200">
  <li>
    <details class="group py-5" name="faq">
      <summary class="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
        <h3 class="text-base font-semibold text-slate-900">{question}</h3>
        <ChevronDown class="mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div class="mt-3 space-y-3 pr-9 text-sm leading-relaxed text-slate-600">
        <p>{answerParagraph}</p>
      </div>
    </details>
  </li>
</ul>
```

Add `summary::-webkit-details-marker { display: none }` via the `list-none` class plus the `marker:hidden` fallback already handled by `list-none` in modern browsers; if the default triangle still shows in Safari, add `[&::-webkit-details-marker]:hidden` to the `summary`.

The `name="faq"` attribute makes the group mutually exclusive in browsers that support it and degrades to independent toggles elsewhere. Either behaviour is acceptable; the text is always in the DOM.

### 13.3 The six questions and answers, final copy

**1. What is GoPilot?**

> GoPilot is RASID's AI geospatial agent. You describe the analysis you want in plain language, and GoPilot interprets the request, plans the workflow, retrieves the relevant imagery and Earth observation data, selects and runs the appropriate AI models and geospatial operations such as segmentation, detection and change analysis, then returns the results as downloadable raster and vector layers alongside the numbers that matter. One platform, 10,000+ datasets, hundreds of AI models, one natural-language interface.

**2. Is GoPilot real GIS, or an AI chat wrapper on a basemap?**

> Real GIS. The map is a live Mapbox canvas, not a picture, and the agent adds and removes layers on it while it works. The operations it calls are the ones you would run by hand: catalogue search across Sentinel-2 and Landsat, cloud and shadow masking, spectral indices, segmentation, change detection, geodesic area columns, spatial joins. Every output is a georeferenced file with a CRS, not a screenshot. What GoPilot removes is the catalogue hunting, the reprojection and the parameter fiddling in front of the analysis, not the analysis itself.

**3. How is this different from just using QGIS or ArcGIS Pro?**

> It is not better than them. Desktop GIS is more powerful and more precise, and GoPilot exports into it on purpose. The difference is everything in front of the analysis: finding a clear scene, masking cloud, aligning projections, writing the same index expression again. GoPilot does that part while you watch and hands you the layer. There is a GoPilot plugin for QGIS and an add-in for ArcGIS Pro, so results come back into the tool you already work in.

**4. What happens when GoPilot gets the analysis wrong?**

> You see it before it finishes. The reasoning panel and the tool list stream while the run is in progress, each tool marked in progress, succeeded or failed, so a wrong collection or a failed step is visible as it happens rather than after you have shipped the map. GoPilot also tells you when it cannot do something: when a tool it needs does not exist in its toolchain it says so in the answer instead of improvising. And because every result is a standard georeferenced file, you can open it in QGIS or ArcGIS Pro and check the numbers against your own data.

**5. Can I use GoPilot inside QGIS or ArcGIS Pro?**

> Yes. The GoPilot plugin is published on the official QGIS plugin repository: open Plugins, Manage and Install Plugins, and search for GoPilot. For ArcGIS Pro, download the add-in and a RASID tab appears on the ribbon. Both authenticate with an API key you create yourself in Settings, Developer, API Keys. On the published plans the QGIS plugin is included from Pro at EUR 149 per month and the ArcGIS Pro add-in from Business at EUR 499 per month.

**6. Is GoPilot free, and what is a token?**

> Yes, there is a free plan: EUR 0 per month with 500 tokens, basic datasets and models, raster and vector export, session history and 1 GB of storage, and no credit card. Tokens pay for GoPilot's work. A turn costs what it costs, so a long analysis over large rasters uses more than a one-line question, and unused tokens expire when the period resets rather than rolling over. Tokens are used across GoPilot, GoBox, and RASID's MCP / API services. The paid plans are Pro at EUR 149 per month with 5,000 tokens, Business at EUR 499 per month with 25,000 tokens, and Enterprise with custom pricing.

**Why these six and not the SEO specialist's six:** questions 2, 3 and 4 are written as the buyer's harshest private doubts rather than as feature prompts, which is enormously disarming to a technical reader and captures the exact phrasing they would type into Google. Question 3 concedes that desktop GIS is more powerful, which is load-bearing: a GIS analyst who sees fifteen years of QGIS expertise dismissed closes the tab. Questions 1, 5 and 6 are kept because they are the three highest-volume AI-answer-engine queries for this brand ("what is GoPilot", "does GoPilot work with QGIS", "is GoPilot free") and `rasid.ai` currently has no FAQ anywhere, which makes this page the only machine-readable answer source RASID owns.

Three of the SEO specialist's questions were rewritten because their answers contained unverifiable claims: "re-run it later" (no GoPilot chat re-run feature exists), "you can override it" (no model-override UI exists), and "write the results straight back into your existing project layers" (the plugin flow is solution, project, AOI, process, result, reviewed in place).

### 13.4 Expectation setting

Google removed FAQ rich results for non-government, non-health sites in August 2023. **This markup will not produce accordion SERP snippets.** It ships because it costs about 2 KB and because these are the exact strings ChatGPT, Perplexity and Google AI Overviews lift when asked about GoPilot.

---

## 14. SECTION 11, CLOSING CTA

**File:** `components/ClosingCta.tsx`. Surface `bg-brand` (`#008B6A`). Full-bleed. Padding `py-20 md:py-28`.

```html
<section id="start" aria-labelledby="start-heading" class="bg-brand">
  <div class="mx-auto max-w-page px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">

    <h2 id="start-heading" class="font-display text-display-sm font-bold text-white md:text-display-md">
      GoPilot is the interface to Earth.
    </h2>

    <p class="mx-auto mt-4 max-w-[46ch] text-lg leading-relaxed text-white/80">
      Sign up, draw an area, and ask. 500 tokens, no credit card.
    </p>

    <div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a href="https://app.gopilot.earth/auth?active_form=register"
         class="btn btn-lg btn-on-brand w-full justify-center sm:w-auto">
        Sign up free&nbsp;· 500 tokens <span aria-hidden="true">&rarr;</span>
      </a>
      <a href="https://calendly.com/rasid/30mins" target="_blank" rel="noopener"
         class="btn btn-lg w-full justify-center border-white/30 text-white transition-colors hover:bg-white/10 hover:text-white sm:w-auto">
        Book a 30-minute call <span aria-hidden="true">&rarr;</span>
      </a>
    </div>

  </div>
</section>
```

**Why this headline here and nowhere else.** `GoPilot is the interface to Earth.` is the footer tagline on every page of `rasid.ai`. It is the best line the brand owns. In the hero it would be vapor the visitor has no basis to accept. After ten sections of mechanics it reads as a summary they arrive at themselves. **Do not move it up the page.**

**No contour-line SVG texture.** The researcher asked for one at 6% opacity; the product has no decorative background textures other than the canvas dot grid, and a flat brand band is both on-system and faster. The `bg-brand` slab is itself the strongest "this is RASID" signal available, because it is the app's sidebar scaled up.

"Ask your first question in about ninety seconds" was cut. No timing claim is verified, and the product's own code budgets ninety seconds for a single answer.

---

## 15. SECTION 12, FOOTER

**File:** `components/Footer.tsx`. Surface `bg-brand-900` (`#0C3F37`). Composed strictly from the product sidebar's on-green opacity ladder: white, white/75, white/50, white/15.

```html
<footer class="bg-brand-900 text-white">
  <h2 class="sr-only">Footer</h2>
  <div class="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">

      <!-- brand block -->
      <div>
        <div class="flex items-center gap-2.5">
          <img src="/img/logo-white.png" alt="RASID" width="32" height="40" class="h-8 w-auto" />
          <span class="font-display text-lg font-bold tracking-tight text-white">GoPilot</span>
        </div>
        <p class="mt-4 max-w-[30ch] font-display text-sm font-semibold text-white">
          GoPilot is the interface to Earth.
        </p>
        <a href="https://app.gopilot.earth/auth?active_form=register"
           class="btn btn-on-brand mt-5 w-full justify-center sm:w-auto">
          Sign up free&nbsp;· 500 tokens <span aria-hidden="true">&rarr;</span>
        </a>
        <p class="mt-5 text-xs text-white/50">Paris, France <span aria-hidden="true">·</span> Beirut, Lebanon</p>
        <a href="mailto:info@rasid.ai" class="mt-1 block text-xs text-white/75 transition-colors hover:text-white">info@rasid.ai</a>
      </div>

      <!-- 4 link columns -->
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-wider text-white/50">Product</p>
        <ul class="mt-4 space-y-2.5">
          <!-- one <li> per row of the "Product" table in 15.1 -->
          <li><a class="text-sm text-white/75 transition-colors hover:text-white" href={href}>{label}</a></li>
        </ul>
      </div>
      <!-- then three more identical <div> blocks for Solutions, Company, and
           Legal & social, using the three remaining tables in 15.1 -->
    </div>

    <div class="mt-12 space-y-2 border-t border-brand-800 pt-6">
      <p class="text-xs text-white/50">&copy; 2026 RASID. All rights reserved.</p>
      <p class="text-xs text-white/50">
        Satellite basemap &copy; Mapbox &copy; Maxar &copy; OpenStreetMap.
        Field boundaries shown are real GoPilot model output.
      </p>
    </div>

  </div>
</footer>
```

### 15.1 Footer link columns, exact labels and hrefs

**Product**

| Label | Href |
|---|---|
| `GoPilot` | `#hero` |
| `GoServers / MCP` | `https://rasid.ai/products#mcps` |
| `QGIS plugin` | `https://plugins.qgis.org/plugins/rasid_plugin/` |
| `ArcGIS Pro add-in` | `https://rasid.ai/products#plugins` |
| `Pricing` | `#pricing` |
| `Try with no account` | `https://app.gopilot.earth/try-gopilot` |

**Solutions**

| Label | Href |
|---|---|
| `Urban` | `https://rasid.ai/services#urban` |
| `Agriculture` | `https://rasid.ai/services#agriculture` |
| `Environmental` | `https://rasid.ai/services#environmental` |
| `Transportation` | `https://rasid.ai/services#transportation` |
| `Defense` | `https://rasid.ai/services#defense` |
| `All services` | `https://rasid.ai/services` |

**Company**

| Label | Href |
|---|---|
| `RASID, AI & geospatial consultancy` | `https://rasid.ai/` |
| `What we do` | `https://rasid.ai/about` |
| `GoPilot case study` | `https://rasid.ai/case-studies/gopilot-ai-geospatial-agent` |
| `Case studies` | `https://rasid.ai/case-studies` |
| `Publications` | `https://rasid.ai/publications` |
| `Contact` | `https://rasid.ai/#contact` |

**Legal & social**

| Label | Href |
|---|---|
| `Terms of Service` | `https://app.gopilot.earth/terms` |
| `Privacy Policy` | `https://app.gopilot.earth/privacy-policy` |
| `LinkedIn` | `https://www.linkedin.com/company/rasid-ai/` |
| `YouTube` | `https://www.youtube.com/@RASIDAI` |

All external links carry `target="_blank" rel="noopener"` except the `rasid.ai` and `app.gopilot.earth` links, which are same-brand and open in place.

**All cross-property links are plain follow links. Never `rel="nofollow"` between your own properties.** These footer links to `rasid.ai` are the entity-consolidation signal that keeps Google treating `gopilot.earth` as part of the RASID entity rather than an orphan subdomain. They are not decoration.

`API Documentation` is omitted: no public URL is verified. Terms and Privacy are **added** relative to the live `rasid.ai` footer, which omits them. A self-serve product page that takes card payments must link both, and reCAPTCHA on the signup form makes a privacy policy link effectively mandatory under Google's own terms.

---

## 16. `tailwind.config.ts` — WRITE THIS FILE EXACTLY

This is the design specialist's file, which is itself a faithful port of the product app's token system at `C:/Users/LEGION/Desktop/saas-ui/tailwind.config.js`. The team's comments are preserved because they are the reasoning, not decoration.

**Two `[ARCHITECT AMENDMENT]` blocks are marked inline. Both fix real bugs. Do not drop them.**

1. `content` gains `./lib/**/*.{ts,tsx}`. Data modules live in `lib/content/`, and without this glob any class string in a data module is purged in production.
2. `backgroundSize` keys are renamed to `dot-grid-size` and `shimmer-size`. As originally written, `backgroundImage.shimmer` and `backgroundSize.shimmer` both generate the class `bg-shimmer`; Tailwind's `backgroundSize` core plugin runs later and wins, so the background *image* silently never applies. Same collision on `dot-grid`.

````ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

/* ---------------------------------------------------------------------------
 * GoPilot landing page — Tailwind config.
 *
 * This is a FAITHFUL PORT of the product app's token system
 * (C:/Users/LEGION/Desktop/saas-ui/tailwind.config.js). The team's comments are
 * preserved verbatim because they are the reasoning, not decoration.
 *
 * Everything under "LANDING-ONLY ADDITIONS" does not exist in the app and was
 * added for things a marketing page needs that a product UI does not
 * (a container, a display type scale above text-4xl, a few restrained
 * keyframes). Nothing above that marker was invented here.
 * ------------------------------------------------------------------------- */

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    /* [ARCHITECT AMENDMENT] Data modules live in lib/content/*.ts and may carry
       class strings (icon tiles, badge tones). Without this glob they are purged. */
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Primary UI font (navigation, forms, body, tables, controls).
        // `var(--font-inter)` comes from next/font in app/layout.tsx; the
        // literal 'Inter' keeps the stack working without it.
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Display / headings font — use selectively via `font-display`
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 1. BRAND IDENTITY — RASID green system (exact logo values).
        //    Primary green (#008B6A) + white is the dominant relationship; teal
        //    (#009D84) is the secondary accent. Full 50–900 scale gives depth
        //    for hover / active / fills without inventing foreign hues.
        brand: {
          DEFAULT:   '#008B6A', // Primary Green (logo mark) — buttons, active nav, key accents
          50:  '#E6F5F0',       // Mint
          100: '#C7EBE0',
          200: '#97D9C8',
          300: '#5FC2AC',
          400: '#29A98C',
          500: '#008B6A',       // = DEFAULT
          600: '#007A5E',       // pressed / hover-dark
          700: '#006655',       // deep logo green
          800: '#0A5044',
          900: '#0C3F37',
          dark:      '#007A5E', // alias = 600 — pressed states / emphasis text
          highlight: '#009D84', // Bright logo green — hover states, active highlights, progress
          light:     '#E6F5F0', // alias = 50 (Mint) — subtle surfaces, selected cards
          soft:      '#F2FBF8', // very subtle brand-tinted surface
          mint:      '#E6F5F0', // explicit Mint alias
        },

        // Secondary accent — RASID teal (#009D84). Secondary actions, links,
        // active highlights, data-viz series. Named `accent` (not `secondary`)
        // to avoid clashing with the `.bg-secondary` badge component class.
        accent: {
          DEFAULT: '#009D84',
          light:   '#E0F4EF',
          dark:    '#007E6A',
        },

        // Body/content text + brand-adjacent neutral (RASID spec)
        ink:          '#4A4A4A', // Body text / descriptions / helper text
        'gray-brown': '#5F575A', // Supporting labels / secondary brand-adjacent accents

        // 2. NEUTRALS — WARM TAUPE scale derived from the brand gray-brown
        //    (#5F575A, the most-used color in the brand kit). Kept under the
        //    `slate` key so the whole app re-tones at once; values are warm.
        //    NOTE: this deliberately OVERRIDES Tailwind's cool default slate.
        //    Never import or hardcode #64748B-family greys anywhere.
        slate: {
          50:  '#F8F7F7',     // card bg / alternating rows
          100: '#F1EEEF',     // app background
          200: '#E6E2E3',     // hover state on light backgrounds
          300: '#D4CED0',     // borders / dividers
          400: '#A99FA2',     // muted text / icons / placeholders
          500: '#7C7477',     // secondary text
          600: '#5F575A',     // brand gray-brown — strong labels
          700: '#4A4446',     // body / subheadings
          800: '#322E30',     // primary text / card headers
          900: '#201D1F',     // headings / darkest surfaces
          950: '#141213',
        },

        // Warm support surface (letterhead / wallpaper family) — alongside Mint.
        sand: {
          DEFAULT: '#F1ECE4',
          50:  '#FAF8F4',
          100: '#F1ECE4',
          200: '#E7E0D4',
        },

        // Award / accolade gold. Its own token on purpose: `state.warning` is
        // semantically "caution" and must not be borrowed for a trophy, and the
        // gold in chartColors.ts is a data-series colour. DEFAULT matches that
        // gold so the brand reads consistently. `dark` is the text shade, chosen
        // for 5.4:1 on `light` (passes AA for small text).
        // usage: text-gold-dark, bg-gold-light, border-gold
        gold: {
          DEFAULT: '#C9A227', // brand gold / ochre
          light:   '#FAF3DF', // pale cream badge surface
          dark:    '#7A5F0F', // readable text on gold-light
        },

        // 3. SEMANTIC STATES (The Feedback)
        // usage: text-state-error, bg-state-success
        state: {
          success:     '#10B981', // Success (Green) - distinct from Brand
          successDark: '#059669', // Success hover / emphasis
          warning:     '#F59E0B', // Warning (Amber)
          warningDark: '#D97706', // Warning hover / emphasis
          error:       '#EF4444', // Danger/Delete (Red)
          errorDark:   '#DC2626', // Danger hover / emphasis
          info:        '#3B82F6', // Information (Blue)
          infoDark:    '#2563EB', // Info hover / emphasis
        },

        /* --- LANDING-ONLY ADDITION ---
           The app's data-viz palette lived in src/lib/chartColors.ts as plain
           constants because Recharts takes hex strings. Exposed here as colour
           tokens too so marketing charts/illustrations can use classes.
           Ordered for maximum distinctness across the first few series
           (green -> gold -> blue -> terracotta), which also helps
           colour-vision-deficient readers when only 2-4 series are shown. */
        chart: {
          1: '#008B6A', // brand green
          2: '#C9A227', // gold / ochre
          3: '#4E7C8A', // slate-blue
          4: '#B2714E', // terracotta
          5: '#009D84', // teal
          6: '#7A5C7B', // mauve
          7: '#5F575A', // gray-brown
          8: '#2AA588', // mid green
          grid:     '#ECE8E9', // subtle gridlines
          axisTick: '#A99FA2', // axis labels (slate-400)
          axisLine: '#E6E2E3', // axis lines (slate-200)
        },

        /* --- LANDING-ONLY ADDITION ---
           The app's working canvas (#EEF3F1) and warm support surface (#F5F1EA)
           existed only as the `.surface-canvas` / `.surface-sand` CSS classes in
           index.css. Named here as well so `bg-canvas` works in markup. */
        canvas: '#EEF3F1',
      },

      /* ===================================================================
       * LANDING-ONLY ADDITIONS
       * Everything below is new for the marketing page. The product app has
       * none of it.
       * =================================================================== */

      // Matches the app's own page width (`max-w-[1200px]` in PageShell).
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px',
          '2xl': '1200px',
        },
      },

      maxWidth: {
        page: '1200px',   // = PageShell's max-w-[1200px]
        panel: '48rem',   // = the chat transcript's max-w-3xl
        measure: '68ch',  // comfortable long-form measure for legal/blog
      },

      // A display scale above the app's ceiling (text-3xl/4xl). Tracking is
      // baked in, matching `.font-display`'s -0.01em intent but tighter as
      // sizes grow — large Space Grotesk needs it.
      fontSize: {
        'display-sm':  ['2rem',    { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-md':  ['2.5rem',  { lineHeight: '1.12', letterSpacing: '-0.02em',  fontWeight: '700' }],
        'display-lg':  ['3rem',    { lineHeight: '1.08', letterSpacing: '-0.02em',  fontWeight: '700' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.02', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-2xl': ['4.5rem',  { lineHeight: '1',    letterSpacing: '-0.03em',  fontWeight: '700' }],
      },

      // The app's shared elevation tokens, lifted out of index.css's
      // `.shadow-card` / `.shadow-card-hover` base classes into real theme
      // values so `shadow-card` is a normal utility here.
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.07)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.08)',
        // Marketing-only: a slightly deeper lift for the hero product frame.
        frame: '0 18px 40px -16px rgba(32, 29, 31, 0.18), 0 2px 8px -2px rgba(32, 29, 31, 0.08)',
      },

      backgroundImage: {
        // The signature product texture (index.css `.surface-canvas`).
        'dot-grid': 'radial-gradient(circle at 1px 1px, rgba(0, 139, 106, 0.05) 1px, transparent 0)',
        // Loading shimmer sweep, tuned to the warm neutral scale.
        shimmer: 'linear-gradient(90deg, rgba(230,226,227,0) 0%, rgba(248,247,247,0.9) 50%, rgba(230,226,227,0) 100%)',
      },

      /* [ARCHITECT AMENDMENT] Keys renamed from 'dot-grid' / 'shimmer'.
         Tailwind's backgroundSize plugin also emits `bg-{key}` and runs AFTER
         backgroundImage, so identical keys meant `bg-dot-grid` and `bg-shimmer`
         resolved to background-size and the background-image silently never
         applied. Use `bg-dot-grid bg-dot-grid-size` and
         `bg-shimmer bg-shimmer-size` together. */
      backgroundSize: {
        'dot-grid-size': '22px 22px',
        'shimmer-size': '200% 100%',
      },

      keyframes: {
        // Scroll reveal. One per section, nothing more.
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Very subtle drift for the hero map/globe. 6px, not 20px.
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        // Skeleton sweep for genuine loading placeholders only.
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        // Ported verbatim from the app (index.css:159) so the hero's typewriter
        // caret blinks at exactly the product's cadence.
        'caret-blink': {
          '50%': { opacity: '0' },
        },
        // Logo / dataset strip. Pair with a duplicated track and hover:pause.
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        'caret-blink': 'caret-blink 1.1s steps(2, start) infinite',
        marquee: 'marquee 38s linear infinite',
      },

      transitionTimingFunction: {
        // The easing used for every reveal, so motion feels like one system.
        reveal: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      // The typography plugin is already a product dependency (used by `.prose`
      // in prose.tsx and the solution-card HTML). Re-toned onto the warm scale
      // so legal/blog pages do not fall back to cool Tailwind greys.
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#4A4446',            // slate-700
            '--tw-prose-headings': '#201D1F',        // slate-900
            '--tw-prose-lead': '#7C7477',            // slate-500
            '--tw-prose-links': '#008B6A',           // brand
            '--tw-prose-bold': '#322E30',            // slate-800
            '--tw-prose-counters': '#A99FA2',        // slate-400
            '--tw-prose-bullets': '#D4CED0',         // slate-300
            '--tw-prose-hr': '#E6E2E3',              // slate-200
            '--tw-prose-quotes': '#322E30',
            '--tw-prose-quote-borders': '#009D84',   // brand-highlight
            '--tw-prose-captions': '#A99FA2',
            '--tw-prose-code': '#007A5E',            // brand-dark
            '--tw-prose-pre-code': '#F1EEEF',        // slate-100
            '--tw-prose-pre-bg': '#322E30',          // slate-800
            '--tw-prose-th-borders': '#D4CED0',
            '--tw-prose-td-borders': '#E6E2E3',
            maxWidth: '68ch',
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config
````

### 16.1 Token rules that are not negotiable

- **Never use Tailwind's default cool `slate` (`#64748B` family) or any cool grey.** The `slate` key is deliberately overridden to a warm taupe scale derived from the brand gray-brown `#5F575A`, so the whole page re-tones at once. A single hardcoded `#E5E7EB` gridline reads as a different product.
- **`#10B981` is `state.success`, not the brand.** The brand green is `#008B6A`. Never substitute Tailwind `emerald`, `green` or `teal`.
- **Gold `#C9A227` is for accolades and chart series 2 only.** Warnings are `#F59E0B`.
- **No `primary` or `secondary` colour keys.** `.bg-secondary` is already a component class meaning "neutral slate-200 badge", and the teal is `accent` specifically to avoid that collision.
- **No purple, indigo, violet, cyan, and no multi-stop gradient anywhere.** The product contains exactly zero colour-ramp gradients. Depth comes from 1px borders, warm neutrals and a `0 1px 3px` shadow.
- **Maximum border radius is `rounded-2xl` (16px).** No `rounded-3xl`, no pill-shaped large cards.
- **Do not deepen the shadows.** `shadow-card` is deliberately shallow. `shadow-2xl` exists only on the mobile sheet and modals.
- **Never place white cards on pure white.** Ground card groups on `.surface-canvas`, `bg-slate-50` or `.surface-sand`. The documented reason: "so white surfaces read as grounded cards with depth, not boxes floating on a white board."
- **No third typeface and no mono webfont.** Inter (400/500/600/700) plus Space Grotesk (500/600/700) is the entire system. `font-mono` intentionally falls back to the OS stack, exactly as the product's reasoning panel does.
- **Space Grotesk is opt-in via `font-display` only** — page titles, section H2s, stat values, logo wordmarks, empty-state titles. Card titles and section labels are Inter.
- **Never stack `tracking-tight` on a display heading.** `.font-display` already sets `-0.01em` and the `text-display-*` sizes bake in `-0.015em` to `-0.03em`. The only place the product combines them is the small logo wordmark.
- **lucide-react only**, `strokeWidth` 2, at `w-3`, `w-3.5`, `w-4`, `w-5`, `w-6` or `w-8`. No emoji as icons or bullets, no 1.5 hairline strokes, no free-floating icons larger than `w-5` outside a tinted tile.
- **Do not redefine `.btn`, `.card`, `.badge`, `.bg-secondary`, `.form-control` or `.surface-canvas`** with different values. They are ported verbatim so any snippet lifted from the product renders identically. Extend with new class names instead.

---

## 17. `app/globals.css` — WRITE THIS FILE EXACTLY

A faithful port of the product app's stylesheet at `C:/Users/LEGION/Desktop/saas-ui/src/index.css`. Component classes keep their exact declarations so `btn btn-primary`, `card`, `badge`, `bg-secondary`, `form-control`, `.surface-canvas` and friends render pixel-identically to the real GoPilot UI.

One `[ARCHITECT AMENDMENT]` on the `.shimmer` utility, matching the `backgroundSize` key rename in §16.

````css
/* ---------------------------------------------------------------------------
 * app/globals.css — GoPilot landing page
 *
 * A faithful port of the product app's stylesheet
 * (C:/Users/LEGION/Desktop/saas-ui/src/index.css). Component classes keep their
 * exact declarations so `btn btn-primary`, `card`, `badge`, `bg-secondary`,
 * `form-control`, `.surface-canvas` and friends render pixel-identically to the
 * real GoPilot UI.
 *
 * Two deliberate departures from the app, both noted inline:
 *   1. `body` is white here, not `bg-slate-100` — a marketing page needs white
 *      as the default and reaches for the canvas per-section.
 *   2. The app's global `::-webkit-scrollbar-button` reset is dropped: it exists
 *      only to undo a bare rule shipped by the vendored geojson.io bundle, which
 *      this page does not load.
 *
 * Blocks tagged [LANDING-ONLY] are new for the marketing page.
 * ------------------------------------------------------------------------- */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ---------------------------------------------------------------------------
 * CSS VARIABLES
 * The same hexes as tailwind.config.ts, exposed for inline styles, SVG fills,
 * Recharts props and anything that cannot take a class. Mirrors the constants
 * in src/lib/chartColors.ts.
 * ------------------------------------------------------------------------- */
:root {
  /* Brand */
  --brand: #008b6a;
  --brand-dark: #007a5e;
  --brand-highlight: #009d84;
  --brand-light: #e6f5f0;
  --brand-soft: #f2fbf8;
  --brand-700: #006655;
  --brand-900: #0c3f37;

  /* Accent / neutrals from the RASID brand spec */
  --accent: #009d84;
  --ink: #4a4a4a;
  --gray-brown: #5f575a;

  /* Warm taupe scale */
  --slate-50: #f8f7f7;
  --slate-100: #f1eeef;
  --slate-200: #e6e2e3;
  --slate-300: #d4ced0;
  --slate-400: #a99fa2;
  --slate-500: #7c7477;
  --slate-600: #5f575a;
  --slate-700: #4a4446;
  --slate-800: #322e30;
  --slate-900: #201d1f;

  /* Surfaces */
  --canvas: #eef3f1;
  --sand: #f5f1ea;

  /* Accolade gold */
  --gold: #c9a227;
  --gold-light: #faf3df;
  --gold-dark: #7a5f0f;

  /* Data-viz — RASID palette, ordered for distinctness */
  --chart-1: #008b6a;
  --chart-2: #c9a227;
  --chart-3: #4e7c8a;
  --chart-4: #b2714e;
  --chart-5: #009d84;
  --chart-6: #7a5c7b;
  --chart-7: #5f575a;
  --chart-8: #2aa588;
  --chart-grid: #ece8e9;
  --chart-axis-tick: #a99fa2;
  --chart-axis-line: #e6e2e3;

  /* Elevation */
  --shadow-card: 0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.07);
  --shadow-card-hover: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.08);

  /* [LANDING-ONLY] height of the sticky header, used for scroll-padding and
     section anchor offsets so in-page links do not land under the nav. */
  --nav-h: 4rem;
}

/* 1. APPLY GLOBAL DEFAULTS */
@layer base {
  html {
    /* [LANDING-ONLY] anchor links land below the sticky nav. */
    scroll-behavior: smooth;
    scroll-padding-top: calc(var(--nav-h) + 1rem);
    -webkit-tap-highlight-color: transparent;
  }

  body {
    /* Inter is the primary UI font; content text sits on the RASID neutral.
       DEPARTURE FROM THE APP: the app uses `bg-slate-100` because it is a
       workspace. A landing page defaults to white and opts into the canvas
       per section via `.surface-canvas`. */
    @apply bg-white text-slate-800 antialiased font-sans;
  }

  /* Headings are bold on the primary text neutral; opt into Space Grotesk with
     `font-display`. */
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold text-slate-800;
  }

  /* Display type — apply selectively to page titles / major headings. */
  .font-display {
    font-family: theme('fontFamily.display');
    letter-spacing: -0.01em;
  }

  /* The application working canvas — a soft mint-gray so white surfaces read
     as grounded cards with depth, not boxes floating on a white board.
     This is the single most recognisable surface in the product; use it behind
     anything that shows real GoPilot UI. */
  .surface-canvas {
    background-color: #eef3f1;
    background-image:
      radial-gradient(circle at 1px 1px, rgba(0, 139, 106, 0.05) 1px, transparent 0);
    background-size: 22px 22px;
  }

  /* Warm support surface — for sections that want a soft, on-brand contrast to
     white/mint (derived from the letterhead/wallpaper family). */
  .surface-sand {
    background-color: #f5f1ea;
  }

  /* [LANDING-ONLY] The faintest brand tint, for a band that should read as
     "slightly green" without going mint. Matches brand-soft. */
  .surface-mint {
    background-color: #f2fbf8;
  }

  /* Consistent soft elevation for cards/panels across the app.
     NOTE: `shadow-card` / `shadow-card-hover` are now real theme tokens in
     tailwind.config.ts, so these are utilities rather than hand-written
     classes. The values are byte-identical to the app's. */

  ::selection {
    background-color: theme('colors.brand.light'); /* Mint #E6F5F0 */
    color: theme('colors.brand.dark');             /* On-brand, stays readable */
  }

  /* Focus visibility, on-brand. The app sets rings per-component
     (`focus:ring-2 focus:ring-brand`); this is the page-wide floor for links
     and anything without its own treatment. */
  :focus-visible {
    outline: 2px solid theme('colors.brand.DEFAULT');
    outline-offset: 2px;
  }

  /* The app also ships a global `::-webkit-scrollbar-button` reset. It exists
     purely to undo a bare `::-webkit-scrollbar{width:5px}` rule in the vendored
     geojson.io bundle, which this page never loads — so it is omitted here
     on purpose rather than by oversight. */
}

@layer components {
  /* Hide the scrollbar on horizontally-scrollable strips (e.g. a mobile tab bar
     or a logo marquee) while keeping the content scrollable via touch/trackpad. */
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }

  /* --- SCROLLBARS ---
     A slim, self-effacing scrollbar. The OS default is wide and opaque, which on a
     coloured or rounded container reads as a bright bar bolted to the edge.
     Transparent track + pill thumb keeps the container's own shape intact.

     `.custom-scrollbar` — dark thumb, for light surfaces.
     `.custom-scrollbar-on-dark` — light thumb, for dark/saturated surfaces. */
  .custom-scrollbar {
    scrollbar-width: thin;                                   /* Firefox */
    scrollbar-color: rgba(95, 87, 90, 0.35) transparent;     /* thumb, track */
  }
  .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(95, 87, 90, 0.3);                 /* warm taupe, brand-neutral */
    border-radius: 9999px;
    /* Transparent border + background-clip insets the thumb so it never touches
       the container edge; without it a pill thumb still reads as a full-width bar. */
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(95, 87, 90, 0.55);
  }
  /* Corner where a vertical and horizontal bar meet — default is opaque grey. */
  .custom-scrollbar::-webkit-scrollbar-corner { background: transparent; }

  .custom-scrollbar-on-dark {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.28) transparent;
  }
  .custom-scrollbar-on-dark::-webkit-scrollbar { width: 8px; height: 8px; }
  .custom-scrollbar-on-dark::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar-on-dark::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.25);
    border-radius: 9999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
  .custom-scrollbar-on-dark::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.45);
  }
  .custom-scrollbar-on-dark::-webkit-scrollbar-corner { background: transparent; }

  /* --- STREAMING CARET ---
     Sits at the end of a message that is still being written. Attached with
     ::after on the last rendered block rather than as a sibling element, because
     markdown output is a list of block elements: a sibling caret would land on
     its own line, while ::after on the final <p> flows inline right after the
     last character, which is where a cursor belongs.

     On the landing page this is what makes the hero's scripted GoPilot answer
     look like the real thing — same blink, same geometry. */
  .streaming-caret > *:last-child::after {
    content: '';
    display: inline-block;
  }

  /* Plain-text bodies (the reasoning panel) render a real element instead, since
     there is no block structure to hang ::after off. */
  .streaming-caret > *:last-child::after,
  .streaming-caret-inline {
    width: 0.4em;
    height: 1em;
    margin-left: 2px;
    vertical-align: text-bottom;
    background-color: currentColor;
    opacity: 0.5;
    animation: caret-blink 1.1s steps(2, start) infinite;
  }

  @keyframes caret-blink {
    50% { opacity: 0; }
  }

  /* A blinking block is exactly the kind of motion this setting is asking us to
     drop; the caret still marks the write position, it just holds steady. */
  @media (prefers-reduced-motion: reduce) {
    .streaming-caret > *:last-child::after,
    .streaming-caret-inline {
      animation: none;
    }
  }

  /* --- BUTTONS --- */
  .btn {
    @apply inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md border border-transparent
           text-sm font-medium transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand
           disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none;
  }

  /* Compact size modifier — pair with a variant, e.g. `btn btn-sm btn-primary`. */
  .btn-sm { @apply px-3 py-1.5 text-xs; }

  /* [LANDING-ONLY] Hero-scale modifier. The app never needs a button this big;
     a landing page's primary CTA does. Same variant classes apply. */
  .btn-lg { @apply px-5 py-3 text-base rounded-xl; }

  /* NOTE on the `hover:text-*` below, which looks redundant next to each variant's
     base text colour but is not:
     In the product, the vendored map bundle carries a bare `a:hover{color:#199cf4}`
     at specificity (0,1,1), which OUTRANKS a plain `text-white` (0,1,0) — so any
     button rendered as an <a> turned bright blue on hover. A `hover:` variant
     compiles to `.hover\:text-white:hover` (0,2,0), which wins.
     Kept here verbatim: the landing page renders almost every CTA as an <a> or
     Next <Link>, and keeping the rule means the two codebases stay copy-pasteable.
     Keep a hover text colour on every variant you add. */

  /* Primary Action: RASID green */
  .btn-primary {
    @apply bg-brand text-white hover:bg-brand-dark hover:text-white focus:ring-brand;
  }

  /* Outline: brand border + brand text */
  .btn-outline {
    @apply border-brand text-brand bg-transparent hover:bg-brand-light hover:text-brand-dark focus:ring-brand-dark;
  }

  /* Dark/Neutral Action (e.g. Cancel) */
  .btn-shady {
    @apply bg-slate-800 text-white hover:bg-slate-500 hover:text-white focus:ring-slate-500;
  }

  /* Danger: Uses 'state-error' (#EF4444) instead of hardcoded red */
  .btn-danger {
    @apply bg-state-error text-white hover:bg-state-errorDark hover:text-white focus:ring-state-error;
  }

  /* Transparent Ghost Button */
  .btn-transparent {
    @apply bg-transparent text-slate-800 hover:bg-slate-200 hover:text-slate-800;
  }

  /* Secondary Positive Action (Dark green) */
  .btn-opp {
    @apply bg-brand-dark text-white hover:bg-brand hover:text-white shadow-sm;
  }

  /* Neutral white button — pagination, subtle secondary actions. */
  .btn-white {
    @apply bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-700 focus:ring-slate-400;
  }

  /* [LANDING-ONLY] The inverse CTA used on brand-green bands — lifted from the
     app's sidebar sign-in button and the dashboard upgrade card, which both use
     `bg-white text-brand hover:bg-brand-mint`. */
  .btn-on-brand {
    @apply bg-white text-brand hover:bg-brand-mint hover:text-brand focus:ring-white focus:ring-offset-brand font-semibold;
  }

  /* --- FORMS --- */
  /* Focus ring is brand green */
  .form-control {
    @apply w-full border border-slate-300 rounded-md px-3 py-2
           focus:border-brand focus:ring-1 focus:ring-brand outline-none bg-white;
  }

  .form-select {
    @apply w-full border border-slate-300 rounded-md px-3 py-2 bg-white
           focus:border-brand focus:ring-1 focus:ring-brand outline-none;
  }

  /* --- BADGES & UI ELEMENTS --- */
  .badge { @apply inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold; }

  .bg-secondary { @apply bg-slate-200 text-slate-800; }

  /* --- TABLES --- */
  .table { @apply w-full text-sm text-slate-800; }
  /* Header uses slate-200 to stand out slightly from the mint background.
     align-middle is deliberate: a cell's default `vertical-align: inherit`
     resolves to `baseline`, so single-line cells align to the FIRST line of a
     taller neighbour (e.g. a two-line label) instead of centring in the row. */
  .table th { @apply text-left align-middle font-semibold border-b border-slate-300 py-3 bg-slate-200/50; }
  .table td { @apply align-middle border-b border-slate-200 py-3; }

  /* --- PAGINATION --- */
  .pagination { @apply inline-flex items-center gap-1; }
  .page-item .page-link { @apply btn px-3 py-1 border border-slate-300 bg-white text-slate-800 hover:bg-slate-50; }
  .page-item.active .page-link { @apply bg-brand border-brand text-white; }
  .page-item.disabled .page-link { @apply opacity-50 cursor-not-allowed; }

  /* --- CARDS & CONTAINERS --- */
  /* Cards remain pure white to pop against the slate-100 / canvas background.
     Elevation matches the shared shadow-card token so every card surface
     (.card, .panel, .rail-card) reads at the same depth. */
  .card {
    @apply rounded-xl border border-slate-200 bg-white overflow-hidden shadow-card;
  }
  .card-body { @apply p-5; }

  /* The app's `Panel` component (pagescaffold.tsx) as a class. */
  .panel {
    @apply shadow-card overflow-hidden rounded-xl border border-slate-200 bg-white p-5;
  }

  /* The app's `RailCard` tones (pagescaffold.tsx). */
  .rail-card        { @apply shadow-card rounded-xl border border-slate-200 bg-white p-5; }
  .rail-card-brand  { @apply shadow-card rounded-xl border border-brand/20 bg-brand-light/50 p-5; }
  .rail-card-muted  { @apply shadow-card rounded-xl border border-slate-200 bg-slate-50 p-5; }

  /* --- DROPDOWNS --- */
  .dropdown      { @apply relative; }
  .dropdown-menu { @apply absolute right-0 mt-2 w-56 rounded-md border border-slate-200 bg-white shadow-lg z-50; }
  /* Hover uses brand-light (Mint) for consistent feel */
  .dropdown-item { @apply block px-4 py-2 text-sm text-slate-800 hover:bg-brand-light hover:text-brand-dark cursor-pointer; }
  .dropdown-item.disabled { @apply opacity-40 pointer-events-none; }

  /* --- MISC --- */
  .tag-element { @apply bg-brand text-white px-2 py-1 rounded; }
  .info-container { @apply rounded-xl border border-slate-200 bg-white; }
  .table_row { @apply border-b border-slate-100 last:border-0; }

  /* =====================================================================
   * [LANDING-ONLY] MARKETING-PAGE PRIMITIVES
   * Section rhythm, eyebrows, reveals — things an app shell never needs.
   * Each one is built only from the tokens above.
   * ===================================================================== */

  /* Vertical rhythm. The app uses space-y-6 inside a py-8 page; a landing page
     needs section-scale breathing room. */
  .section       { @apply py-16 md:py-24; }
  .section-tight { @apply py-12 md:py-16; }

  /* The house eyebrow, verbatim from PageShell / RailCard / StatTile. */
  .eyebrow { @apply text-[11px] font-semibold uppercase tracking-wider text-slate-400; }

  /* The mint eyebrow pill, verbatim from the GoBox page header. */
  .chip-brand {
    @apply inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark;
  }

  /* Accolade pill — the one legitimate use of gold ("#1 GeoAgent", awards). */
  .chip-gold {
    @apply inline-flex items-center gap-1.5 rounded-full border border-gold bg-gold-light px-3 py-1 text-xs font-semibold text-gold-dark;
  }

  /* Section lead paragraph, verbatim from the GoBox page header. */
  .lead { @apply mx-auto max-w-2xl text-lg leading-relaxed text-slate-500; }

  /* Brand-coloured link, verbatim from the Anchor component. */
  .link-brand { @apply text-brand underline hover:text-brand-dark; }

  /* Nav link on a brand-green band — the sidebar's inactive/active pair. */
  .nav-on-brand        { @apply flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white; }
  .nav-on-brand-active { @apply flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-brand shadow-sm; }

  /* The dashboard stat tile, verbatim from overview.tsx. */
  .stat-tile { @apply rounded-2xl border border-slate-200 bg-white p-5 shadow-card; }

  /* The prompt-suggestion card — the hero's most product-authentic element.
     Verbatim from PromptSuggestions.tsx. */
  .prompt-card {
    @apply group flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5
           text-left transition-colors hover:border-brand/40 hover:bg-brand-soft;
  }
  .prompt-card-icon {
    @apply mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-brand-light text-brand;
  }

  /* The GoPilot thinking panel, verbatim from ChatMessage.tsx's MessageHeader. */
  .thinking-panel { @apply min-w-0 rounded-lg border border-brand/15 bg-brand-soft p-2.5; }
  .thinking-label { @apply text-[11px] font-medium uppercase tracking-wide text-brand-highlight; }
  .thinking-body  {
    @apply mt-1.5 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-md border border-brand/15
           bg-white/70 px-2 py-1.5 font-mono text-[11px] leading-relaxed text-slate-500;
  }
  .tools-panel { @apply min-w-0 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5; }

  /* Chat bubbles, verbatim from ChatMessage.tsx. */
  .bubble-user { @apply max-w-[80%] rounded-2xl rounded-br-sm bg-brand-light px-4 py-2.5 text-slate-800; }
  .bubble-body { @apply space-y-3 break-words text-sm leading-relaxed text-slate-700; }

  /* Icon tile, the app's recurring "coloured square behind a lucide glyph".
     Three sizes, matching PromptSuggestions (h-6), overview quick-links (h-9)
     and StatTile (h-10). */
  .icon-tile-sm { @apply flex h-6 w-6 items-center justify-center rounded-md bg-brand-light text-brand; }
  .icon-tile    { @apply flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand; }
  .icon-tile-lg { @apply flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand; }

  /* The product frame — a screenshot or live demo grounded on the canvas,
     matching the app's docked chat panel (border + shadow-xl). */
  .product-frame {
    @apply overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-frame;
  }

  /* Loading shimmer. The app uses `animate-pulse` on bg-slate-200 blocks; this
     is the same idea with a sweep, for larger hero placeholders only.
     [ARCHITECT AMENDMENT] was `bg-shimmer bg-shimmer`; the backgroundSize key is
     now `shimmer-size` so the image and the size no longer collide. */
  .shimmer {
    @apply bg-slate-200 bg-shimmer bg-shimmer-size animate-shimmer;
  }

  /* Scroll reveal. Toggle `data-revealed="true"` from an IntersectionObserver;
     the initial state is already applied so nothing flashes. Stagger with
     Tailwind's arbitrary property syntax, exactly as the app staggers its
     bouncing dots: `[animation-delay:80ms]`. */
  .reveal { @apply opacity-0; }
  .reveal[data-revealed='true'] { @apply animate-fade-up; }

  /* Marquee track for a dataset/integration strip. Duplicate the children once
     inside the track so the -50% translate loops seamlessly. */
  .marquee-track { @apply flex w-max animate-marquee gap-10; }
  .marquee-track:hover { animation-play-state: paused; }
}

/* ---------------------------------------------------------------------------
 * [LANDING-ONLY] REDUCED MOTION
 * The app only silences its caret; a marketing page has reveals, floats and a
 * marquee, so the guard is page-wide. Anything that conveys information (the
 * typewriter's final text, the caret's position) must still end up visible.
 * ------------------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }

  .reveal,
  .reveal[data-revealed='true'] {
    animation: none !important;
    opacity: 1 !important;
  }

  .marquee-track,
  .animate-float,
  .animate-shimmer,
  .animate-fade-up,
  .animate-fade-in {
    animation: none !important;
  }
}
````

### 17.1 Classes this build actually uses

From the port: `.btn`, `.btn-lg`, `.btn-primary`, `.btn-outline`, `.btn-on-brand`, `.card`, `.card-body`, `.panel`, `.badge`, `.stat-tile`, `.eyebrow`, `.lead`, `.link-brand`, `.section`, `.section-tight`, `.chip-gold`, `.icon-tile-sm`, `.icon-tile`, `.icon-tile-lg`, `.surface-canvas`, `.surface-sand`, `.reveal`, `.marquee-track`, `.custom-scrollbar`, `.streaming-caret`, `.streaming-caret-inline`, `.thinking-panel`, `.thinking-label`, `.thinking-body`, `.tools-panel`, `.bubble-user`, `.bubble-body`, `.font-display`.

Unused but retained so product snippets stay copy-pasteable: `.btn-sm`, `.btn-shady`, `.btn-danger`, `.btn-transparent`, `.btn-opp`, `.btn-white`, `.form-control`, `.form-select`, `.table*`, `.pagination*`, `.dropdown*`, `.rail-card*`, `.tag-element`, `.info-container`, `.table_row`, `.prompt-card`, `.prompt-card-icon`, `.nav-on-brand*`, `.product-frame`, `.shimmer`, `.chip-brand`, `.surface-mint`, `.no-scrollbar`, `.custom-scrollbar-on-dark`.

**Do not delete the unused ones.** They are the compatibility layer with the product codebase and they cost nothing after Tailwind purges unused *utilities*; component classes defined in `@layer components` are only emitted when referenced.

### 17.2 Motion budget

Approved motion, and nothing else:

| Motion | Where | Spec |
|---|---|---|
| `animate-fade-up` | One per section, via `Reveal` | 600ms, `cubic-bezier(0.22, 1, 0.36, 1)`, once, never on scroll-up |
| `transition-colors duration-200` | Every button, link, chip, card hover | The product's default interaction, full stop |
| `group-hover:translate-x-0.5` | Trailing `ArrowRight` on inline links | 2px, that is all |
| `group-open:rotate-180` | FAQ chevrons | `transition-transform` |
| `animate-bounce` with `[animation-delay:0ms|150ms|300ms]` | Demo thinking dots | Ported from the product |
| `caret-blink` | Demo streaming caret | 1.1s `steps(2, start)`, 0.9 Hz |
| `animate-spin` | Demo in-flight tool row and send button | `Loader2` only |
| `animate-marquee` | Partner strip, **below `md` only** | 38s linear, duplicated track, pause on hover |
| `transition-transform duration-200` | Mobile nav sheet | Matches the app |

**Banned:** parallax, scroll-jacking, pinned scrollytelling, horizontal scroll sections, autoplaying carousels, counting-up numbers, spring or bounce easing on UI, animated gradients, glow pulses, blurred colour blobs, `hover:-translate-y` card lifts (nothing in the product moves on hover), `animate-float` (no hero decoration survived the cut).

Durations: 150 to 300ms for interaction, 500 to 600ms for reveals. **Nothing between 1s and 5s.** A visitor should be able to count the moving things on screen on one hand at any moment.

---

## 18. `app/layout.tsx` — WRITE THIS FILE EXACTLY

The SEO specialist's metadata export, with one `[ARCHITECT AMENDMENT]`: the `icons` block now references only files that exist in `public/`, and `safari-pinned-tab.svg` is dropped (legacy Safari 9 to 13 only, and no such asset exists).

**Cannibalisation note, read before deploying.** `https://rasid.ai/` currently ships `<title>GoPilot by RASID: AI Geospatial Agent for Earth Data</title>` and the keyword "AI geospatial agent". That is this page's exact query set. `rasid.ai` must be retitled toward consultancy intent before or with this launch. This page is self-canonical. **Do not cross-canonical to `rasid.ai`.**

**Domain note.** `gopilot.earth` must be provisioned. If the page ships at a path on the marketing site instead, set `NEXT_PUBLIC_SITE_URL` to the origin only (e.g. `https://rasid.ai`) and add `basePath: '/gopilot'` to `next.config.ts`; `alternates.canonical: '/'` then resolves correctly through `metadataBase`.

````tsx
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
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
          href="#hero"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-dark focus:shadow-lg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
````

**Note on the em dash in `DESCRIPTION` and in the two OG titles.** The no-em-dash rule governs *page copy*. These three strings are the SEO specialist's tuned SERP and share-card text, already length-optimised, and they are never rendered on the page. Leave them exactly as written. Every string that appears in the DOM uses commas, full stops or middots.

---

## 19. `app/page.tsx` — composition

````tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import CredibilityStrip from '@/components/CredibilityStrip'
import RealPrompts from '@/components/RealPrompts'
import ShowsItsWork from '@/components/ShowsItsWork'
import DataAndModels from '@/components/DataAndModels'
import Integrations from '@/components/Integrations'
import Proof from '@/components/Proof'
import Pricing from '@/components/Pricing'
import Faq from '@/components/Faq'
import ClosingCta from '@/components/ClosingCta'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'

export default function Home() {
  return (
    <>
      <JsonLd />
      <Nav />
      <main>
        <Hero />
        <CredibilityStrip />
        <RealPrompts />
        <ShowsItsWork />
        <DataAndModels />
        <Integrations />
        <Proof />
        <Pricing />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
````

No `"use client"` in this file or in any of the twelve section components except `NavMobile`, `Reveal` and the demo tree. That is what protects INP: hydration work happens after LCP.

---

## 20. JSON-LD

**File:** `components/JsonLd.tsx`, a server component rendering three `<script type="application/ld+json">` tags.

**Escape rule, mandatory.** Serialise with
`JSON.stringify(obj).replace(/</g, '\\u003c')`
and inject through `dangerouslySetInnerHTML`. Without the `<` escape, a stray `</script>` inside any string terminates the block and Google sees nothing.

The FAQPage block **must be generated from `lib/content/faq.ts`**, the same module the rendered `<details>` elements read, so the two can never drift. Mismatched FAQ markup is a structured-data spam violation.

### 20.1 SoftwareApplication

Declares GoPilot as a named software entity with real, verifiable prices. In 2026 the payoff is less about price annotations in SERPs and more about what AI answer engines quote when asked "how much does GoPilot cost". `@id` is a stable fragment URI so the Organization block can reference it. **Enterprise is deliberately excluded from `offers`:** its price is "Custom", `schema.org/Offer` requires `price` plus `priceCurrency`, and inventing a number would be both false and invalid. **No `aggregateRating`** — there are no collected reviews and fabricating one is a manual-action risk.

Prices, token counts and feature strings come from `lib/content/pricing.ts`. Do not duplicate them here by hand.

````json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://gopilot.earth/#gopilot",
  "name": "GoPilot",
  "alternateName": ["GoPilot by RASID", "RASID GoPilot"],
  "url": "https://gopilot.earth/",
  "description": "GoPilot is a geospatial AI agent. Describe the analysis you want in plain language and GoPilot picks the datasets, runs the right AI models, and returns raster and vector layers on an interactive map.",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Geographic Information System (GIS)",
  "operatingSystem": "Web browser (Chrome, Edge, Safari, Firefox); QGIS 3.x plugin; ArcGIS Pro add-in",
  "browserRequirements": "Requires JavaScript and a WebGL-capable browser",
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "image": "https://gopilot.earth/og/gopilot-og.png",
  "screenshot": {
    "@type": "ImageObject",
    "url": "https://gopilot.earth/demo/sakaka-aoi@2x.jpg",
    "width": 1280,
    "height": 800,
    "caption": "Satellite view of irrigated farmland near Sakaka, Al Jawf Province, Saudi Arabia, with GoPilot's delineated field boundaries drawn over it"
  },
  "featureList": [
    "Natural-language geospatial analysis over 10,000+ datasets",
    "Hundreds of AI and Earth observation models selected automatically",
    "Raster and vector export in formats such as GeoTIFF and GeoJSON",
    "Visible reasoning and a named tool-call log for every run",
    "Draw or upload an area of interest and send it with the prompt",
    "QGIS plugin and ArcGIS Pro add-in",
    "GoServers over MCP and a key-authenticated REST API",
    "GoBox packaged geospatial solutions"
  ],
  "publisher": { "@id": "https://rasid.ai/#organization" },
  "author": { "@id": "https://rasid.ai/#organization" },
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "description": "Explore GoPilot and run your first analyses. 500 tokens per month, basic datasets and AI models, raster and vector export, session history management, 1 GB storage.",
      "price": "0",
      "priceCurrency": "EUR",
      "url": "https://gopilot.earth/#pricing",
      "availability": "https://schema.org/InStock",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "0",
        "priceCurrency": "EUR",
        "billingDuration": 1,
        "billingIncrement": 1,
        "unitCode": "MON"
      }
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "description": "For analysts running recurring geospatial work. 5,000 tokens per month, Pro datasets and AI models, Dashboard, GoBox, QGIS Plugin, 100 GB storage, personal license, 1 named user.",
      "price": "149",
      "priceCurrency": "EUR",
      "url": "https://gopilot.earth/#pricing",
      "availability": "https://schema.org/InStock",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "149",
        "priceCurrency": "EUR",
        "billingDuration": 1,
        "billingIncrement": 1,
        "unitCode": "MON"
      }
    },
    {
      "@type": "Offer",
      "name": "Business",
      "description": "For organizations scaling geospatial intelligence. 25,000 tokens per month, premium datasets and AI models, ArcGIS Pro Add-in, 1 TB storage, priority email support, commercial license, 1 named user.",
      "price": "499",
      "priceCurrency": "EUR",
      "url": "https://gopilot.earth/#pricing",
      "availability": "https://schema.org/InStock",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "499",
        "priceCurrency": "EUR",
        "billingDuration": 1,
        "billingIncrement": 1,
        "unitCode": "MON"
      }
    }
  ]
}
````

### 20.2 Organization

Ties the new subdomain to the existing RASID entity instead of letting Google treat `gopilot.earth` as an unknown orphan. `@id` is the **main-domain** entity URI, `https://rasid.ai/#organization`, so both hosts resolve to the same node and the E-E-A-T signals consolidate. `sameAs` lists only accounts that exist: there is no X/Twitter and no GitHub organisation page verified, and listing a dead profile is a trust signal pointed at nothing. `award` uses the one canonical wording from §1.

````json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://rasid.ai/#organization",
  "name": "RASID",
  "url": "https://rasid.ai",
  "description": "RASID combines deep-tech AI, geospatial, data and software engineering to turn complex data into actionable intelligence.",
  "slogan": "Seeing Earth, Smarter.",
  "email": "info@rasid.ai",
  "logo": {
    "@type": "ImageObject",
    "url": "https://rasid.ai/logo/manifest-512.png",
    "width": 512,
    "height": 512
  },
  "award": "Winner, AWS and thriveGEO GenAI for Geospatial Challenge 2026",
  "knowsAbout": [
    "Geospatial AI",
    "Earth observation",
    "Remote sensing",
    "Satellite imagery analysis",
    "Geographic information systems",
    "Change detection"
  ],
  "sameAs": [
    "https://www.linkedin.com/company/rasid-ai/",
    "https://www.youtube.com/@RASIDAI"
  ],
  "brand": {
    "@type": "Brand",
    "name": "GoPilot",
    "url": "https://gopilot.earth/"
  },
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "47 rue Vivienne",
      "postalCode": "75002",
      "addressLocality": "Paris",
      "addressCountry": "FR"
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "Badaro Building 4961, 3rd Floor, Badaro Street, Al Mathaf",
      "postalCode": "1100",
      "addressLocality": "Beirut",
      "addressCountry": "LB"
    }
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "email": "info@rasid.ai",
      "availableLanguage": ["en", "fr", "ar"]
    }
  ]
}
````

### 20.3 FAQPage

Generated from `lib/content/faq.ts`. The six `name` values are the six `<h3>` strings in §13.3 and the six `text` values are the six answer paragraphs, character for character.

````json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://gopilot.earth/#faq",
  "mainEntity": [
    { "@type": "Question", "name": "What is GoPilot?", "acceptedAnswer": { "@type": "Answer", "text": "<answer 1 from 13.3>" } },
    { "@type": "Question", "name": "Is GoPilot real GIS, or an AI chat wrapper on a basemap?", "acceptedAnswer": { "@type": "Answer", "text": "<answer 2 from 13.3>" } },
    { "@type": "Question", "name": "How is this different from just using QGIS or ArcGIS Pro?", "acceptedAnswer": { "@type": "Answer", "text": "<answer 3 from 13.3>" } },
    { "@type": "Question", "name": "What happens when GoPilot gets the analysis wrong?", "acceptedAnswer": { "@type": "Answer", "text": "<answer 4 from 13.3>" } },
    { "@type": "Question", "name": "Can I use GoPilot inside QGIS or ArcGIS Pro?", "acceptedAnswer": { "@type": "Answer", "text": "<answer 5 from 13.3>" } },
    { "@type": "Question", "name": "Is GoPilot free, and what is a token?", "acceptedAnswer": { "@type": "Answer", "text": "<answer 6 from 13.3>" } }
  ]
}
````

The six `<answer N from 13.3>` placeholders are filled by mapping over `FAQ_ITEMS` from `lib/content/faq.ts`. Do not retype the answers.

**Expected validator output:** `validator.schema.org` must report 0 errors. Google's Rich Results Test must report `SoftwareApplication` detected with 3 offers, and `FAQPage` as "detected but not eligible for rich results". **That last line is the correct post-August-2023 outcome, not a bug.**

---

## 21. `app/sitemap.ts`, `app/robots.ts`, `public/site.webmanifest`

### 21.1 `app/sitemap.ts`

Works under `output: 'export'`: a static metadata route rendered to a file at build time. It must not read cookies, headers or any request-scoped API or the export fails. `next.config.ts` sets `trailingSlash: true`, so the homepage URL ends in `/`.

**Hash anchors are not sitemap entries.** The fragment is stripped before crawl, so adding `#pricing` and friends just submits the homepage six times.

````ts
import type { MetadataRoute } from 'next'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

// One shared build timestamp: distinct per-URL times on a single static deploy
// are fiction, and inconsistent lastmod values get the whole file discounted.
const BUILD_TIME = new Date()

type Route = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

const routes: Route[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },

  // Uncomment each line ONLY once the corresponding app/<route>/page.tsx exists
  // and returns 200 in the exported `out/` directory.
  // { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  // { path: '/terms',   changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`,
    lastModified: BUILD_TIME,
    changeFrequency,
    priority,
  }))
}
````

### 21.2 `app/robots.ts`

Policy mirrors the already-deployed `https://rasid.ai/robots.txt`, which explicitly allow-lists AI crawlers. Keeping the two hosts consistent matters: being quoted by AI answer engines is a primary acquisition channel for a product whose whole pitch is "an AI agent", and a blanket block on one host while allowing the other is an accidental, invisible policy split.

The default `*` rule already allows everything, so the named AI agents are redundant to a strict parser. They are listed on purpose: several of these operators look for an explicit opt-in grant, and it documents intent for whoever edits this next.

````ts
import type { MetadataRoute } from 'next'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Next's build artefact directory. Nothing user-facing lives there and
        // it burns crawl budget on hashed JS chunks.
        disallow: ['/_next/static/chunks/'],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Canonical host declaration. Yandex honours it; other crawlers ignore it
    // harmlessly. rasid.ai/robots.txt already uses the same directive.
    host: SITE_URL,
  }
}
````

### 21.3 `public/site.webmanifest`

Referenced by `metadata.manifest`. Create it; it does not exist yet.

````json
{
  "name": "GoPilot by RASID",
  "short_name": "GoPilot",
  "description": "The geospatial AI agent. Ask in plain language, get raster and vector layers back.",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#008B6A",
  "background_color": "#F8F7F7",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
````

The third entry reuses the 512 icon with `purpose: "maskable"`. If the mark does not sit inside the 80% safe circle it will be visibly cropped on Android; producing a dedicated maskable variant is listed in the missing-assets table.

---

## 22. THE DEMO COMPONENT

`<GoPilotDemo />` is a self-contained, zero-network, dependency-light animated recreation of **one real GoPilot session**, rebuilt in React rather than captured as video. Because it is DOM it is crisp at any resolution, selectable, indexable as text, accessible, and roughly a hundred times lighter than a screen recording.

**Budget:** under 16 KB gzipped for the whole demo tree. Runtime imports are `react` plus eleven individually-imported lucide icons: `Brain`, `Wrench`, `CheckCircle2`, `Loader2`, `ChevronDown`, `Eye`, `Download`, `Send`, `Upload`, `RotateCcw`, `FastForward`.

### 22.1 Provenance of every string in the demo

| Element | Source |
|---|---|
| User prompt 1 | `prompt_text` of prompt-suggestion id 5, fetched live from `GET /api/llm/prompt-suggestions/` |
| User prompt 2 | Verbatim from `.research/turn2.json`, the real message sent in session 1300 |
| Reasoning text, both turns | Condensed from the real `thinking_content` arrays in `.research/task.json.txt` and `task2.json.txt` |
| Tool rows, turn 2 | The real 16 deduped `tool_calls_content` ids from `task.json.txt` |
| Tool rows, turn 4 | The real 25 deduped ids from `task2.json.txt` |
| Answer bodies | Condensed from the real `content` fields, with every number, scene ID, filename and quoted sentence unaltered |
| File chip | `{ id: 3670, name: "sakaka_fields_with_area.geojson", size_bytes: 282222, file_type: "geojson", visualization: true }` |
| Field polygons | Ten simplified paths from `.research/aligned_paths.json`, derived from the real 324-feature output |
| Polygon colours | `#e6194b` fill and `#232323` stroke, read out of the real SLD the backend returned |
| Satellite basemap | A real Mapbox `satellite-v9` static capture of the real AOI, already in `.research/` |

**Quoted agent output is reproduced verbatim, including its em dashes and its `~` and `≈` characters.** The no-em-dash house rule governs copy we write, not machine output we quote. Altering quoted output on a page that argues for auditability would be self-defeating.

### 22.2 File tree

```
components/demo/
├─ GoPilotDemo.tsx      "use client"  — the orchestrator, state machine, rAF loop, controls, sr-only transcript
├─ DemoTranscript.tsx                 — turn list, message header (thinking + tools), chips, composer
├─ DemoBlocks.tsx                     — the 7-case block renderer; replaces react-markdown
├─ DemoMap.tsx                        — image, SVG overlay, AOI frame, chrome
├─ useTypewriter.ts                   — ~55-line port of the product's hook
├─ demoScript.ts                      — all hardcoded data, no JSX
└─ fieldPaths.ts                      — the ten real SVG paths and their centroids
```

`components/demo/` is the only place `"use client"` appears above the fold, and only on `GoPilotDemo.tsx`. The four children are plain functions it calls.

### 22.3 Types — `demoScript.ts`

````ts
export type DemoBlock =
  | { t: 'p';     s: string }                        // s may contain **bold** and `code`
  | { t: 'h2';    s: string }
  | { t: 'h3';    s: string }
  | { t: 'kv';    k: string; s: string }             // "**AOI:** 30x30 km ..." lines
  | { t: 'table'; headers: string[]; rows: string[][] }
  | { t: 'code';  lang: 'csv'; s: string }
  | { t: 'dl';    label: string }                    // the "### Download" link item

export type DemoTool = { id: number; name: string }

export type DemoChip = { kind: 'map'; name: string; size: string }

export type MapStep = 0 | 1 | 2
// 0 = basemap + AOI frame only
// 1 = polygons draw on, layer row appears, viewport settles
// 2 = per-field hectare labels fade in

export type DemoTurn = {
  id: number
  role: 'user' | 'assistant'
  text?: string          // user turns only, plain text, never markdown-rendered
  thinking?: string      // assistant, font-mono panel content
  tools?: DemoTool[]
  blocks?: DemoBlock[]
  chips?: DemoChip[]
  time: string
  mapStep: MapStep
}
````

### 22.4 `fieldPaths.ts` — the ten real polygons

`viewBox` is `0 0 640 400`, matching the captured image exactly. `areaHa` values are the real `area_ha` attribute of each feature. `cx`/`cy` are shoelace polygon centroids, precomputed so the build never calls `getTotalLength()` or measures the DOM.

````ts
export type FieldPath = { id: number; areaHa: number; d: string; cx: number; cy: number }

export const FIELD_PATHS: FieldPath[] = [
  { id: 294, areaHa: 24.6, cx: 279.9, cy: 376.4, d: 'M251.1 364.3L248.9 386.4L253.3 395.2L266.6 406.3L297.6 404.1L310.9 386.4L308.6 362.1L302.0 353.2L284.3 344.4L260.0 351.0L251.1 364.3Z' },
  { id: 286, areaHa: 20.1, cx: 240.3, cy:  27.3, d: 'M211.3 20.3L213.5 39.1L229.0 52.4L268.8 50.2L268.8 23.6L251.1 1.5L245.5 -0.7L226.8 1.5L215.7 8.1L211.3 20.3Z' },
  { id: 292, areaHa: 19.9, cx: 184.4, cy: 374.8, d: 'M147.1 355.4L147.1 369.8L153.8 384.2L164.8 393.0L178.1 397.4L201.3 395.2L209.1 390.8L217.9 379.7L222.4 364.3L220.1 355.4L187.0 359.8L157.8 357.6L152.7 353.2L147.1 355.4Z' },
  { id: 291, areaHa: 18.1, cx: 333.8, cy: 356.3, d: 'M310.9 366.5L317.5 382.0L326.3 390.8L336.3 393.0L339.4 386.9L344.0 386.4L344.1 376.9L355.1 355.4L355.1 325.6L337.4 324.5L326.3 328.9L315.3 342.2L310.9 366.5Z' },
  { id: 288, areaHa: 17.7, cx: 323.8, cy: 201.7, d: 'M297.6 194.0L299.8 213.9L313.1 227.1L335.2 227.1L348.5 216.1L348.5 191.7L335.2 176.3L321.9 174.0L304.2 182.9L297.6 194.0Z' },
  { id: 287, areaHa: 16.8, cx: 445.6, cy:  42.7, d: 'M419.3 39.1L423.7 56.8L437.0 67.9L461.3 66.8L470.1 52.4L467.9 28.0L459.1 19.2L448.0 17.0L433.6 19.2L423.7 28.0L419.3 39.1Z' },
  { id: 168, areaHa: 15.7, cx: 521.4, cy:  48.9, d: 'M485.6 32.5L485.6 43.5L503.3 56.8L505.5 65.7L518.8 65.7L529.9 74.5L536.5 74.5L536.5 70.1L543.2 65.7L552.0 48.0L552.0 43.5L547.6 41.3L549.8 34.7L540.9 32.5L485.6 32.5Z' },
  { id: 293, areaHa: 11.0, cx: 235.2, cy: 377.7, d: 'M213.5 382.0L215.7 393.0L226.8 397.4L253.3 395.2L253.3 362.1L224.6 353.2L220.0 374.0L213.5 382.0Z' },
  { id: 289, areaHa:  9.2, cx: 299.0, cy: 333.4, d: 'M275.5 322.2L275.5 337.7L288.7 348.8L313.1 346.6L324.1 333.3L321.9 322.2L304.2 320.0L275.5 322.2Z' },
  { id: 290, areaHa:  7.7, cx: 243.6, cy: 343.4, d: 'M224.6 339.9L231.2 357.6L255.5 359.8L260.0 353.2L260.0 335.5L251.1 326.7L231.2 328.9L224.6 339.9Z' },
]
````

### 22.5 `demoScript.ts` — the four turns

````ts
export const THINKING_PHRASES = [
  'Thinking...',
  'Working on it...',
  'Putting things together...',
  'Almost there...',
  'Give me a moment...',
  'On it...',
] as const

export const DEMO_TURNS: DemoTurn[] = [
  // ---------- TURN 1 ----------
  {
    id: 1,
    role: 'user',
    text: 'Can you delineate a couple of the circular fields in the Al Jouf Province KSA',
    time: 'Just now',
    mapStep: 0,
  },

  // ---------- TURN 2 ----------
  {
    id: 2,
    role: 'assistant',
    time: 'Just now',
    mapStep: 1,
    thinking:
      'I need to geocode Al Jawf Province, Saudi Arabia to establish the AOI, then pull imagery and run field delineation. Since the province is large, I should narrow in on a known agricultural zone with circular pivot fields rather than the whole region.\n\n' +
      'I recall this area is famous for circular center-pivot farms irrigated from fossil aquifers, especially near Sakaka and Al Qurayyat. I\'ll geocode "Sakaka, Al Jawf, Saudi Arabia" instead and use a focused point with a small buffer for the AOI.\n\n' +
      'There\'s a tool called ksa_delineate_fields specifically for KSA Sentinel-2 that might be better suited for detecting circular fields there, so I should check the catalog for it.\n\n' +
      'Since this model is trained specifically for Saudi Arabia, it\'s the better fit. I\'ll use locate_point for Sakaka at lat 29.9784, lon 40.2048 with a 15km buffer to get a 30x30km bounding box, then search sentinel2_search_goserver with low cloud cover and recent growing-season dates, fetch the 12 bands L2A product, and run ksa_delineate_fields_goserver on it.',
    tools: [
      { id:  0, name: 'pre_order_tools' },
      { id:  1, name: 'geocode' },
      { id:  2, name: 'list_tools' },
      { id:  3, name: 'load_tools' },
      { id:  4, name: 'catalog_tools' },
      { id:  5, name: 'list_tools' },
      { id:  6, name: 'locate_point' },
      { id:  7, name: 'load_tools' },
      { id:  8, name: 'sentinel2_search_goserver' },
      { id:  9, name: 'sentinel2_fetch_goserver' },
      { id: 10, name: 'ksa_delineate_fields_goserver' },
      { id: 11, name: 'list_tools' },
      { id: 12, name: 'load_tools' },
      { id: 13, name: 'add_area_column_goserver' },
      { id: 14, name: 'present_files' },
      { id: 15, name: 'signal_end' },
    ],
    blocks: [
      { t: 'p', s: 'Using the latest clear scene (2026-09-27, 0% cloud cover). Fetching the required 12 bands.' },
      { t: 'p', s: 'Delineation complete over the Sakaka agricultural belt, Al Jawf Province.' },
      { t: 'h2', s: 'Results — Al Jawf Province (Sakaka area), Saudi Arabia' },
      { t: 'kv', k: 'AOI:', s: '30×30 km square centered on Sakaka (29.978°N, 40.205°E)' },
      { t: 'kv', k: 'Source scene:', s: 'Sentinel-2 L2A `S2A_37RFP_20260927_1_L2A`, 2026-09-27, 0% cloud cover, 10 m resolution, 12 bands' },
      { t: 'kv', k: 'Model:', s: '`ksa_delineate_fields` (Mask R-CNN, trained specifically for Saudi Arabia field geometry)' },
      {
        t: 'table',
        headers: ['Metric', 'Value'],
        rows: [
          ['Fields delineated', '324'],
          ['Total mapped area', '2,097.9 ha (~21.0 km²)'],
          ['Mean field size', '~6.5 ha'],
        ],
      },
      { t: 'p', s: 'This part of Al Jawf is a classic center-pivot irrigation zone drawing on fossil (non-renewable) groundwater from the Saq aquifer — the characteristic circular pivot fields seen from space are typical here, ranging from a few hectares up to large >20 ha pivots. The output GeoJSON holds one regularized polygon per field.' },
      { t: 'h3', s: 'Download' },
      { t: 'dl', label: 'sakaka_fields_with_area.geojson' },
    ],
    chips: [{ kind: 'map', name: 'sakaka_fields_with_area.geojson', size: '275.6 KB' }],
  },

  // ---------- TURN 3 ----------
  {
    id: 3,
    role: 'user',
    text: 'Give me the field size distribution as a CSV so I can chart it',
    time: '1m ago',
    mapStep: 1,
  },

  // ---------- TURN 4 ----------
  {
    id: 4,
    role: 'assistant',
    time: '1m ago',
    mapStep: 2,
    thinking:
      'I don\'t see a direct geojson-to-csv tool in the catalog, only the reverse conversion exists. inspect_file only samples 50 of 324 features, and without code execution I have no way to convert it myself.\n\n' +
      'I can use filter_vector_rows_numerical repeatedly across bin ranges to build a histogram of counts per range. That gives a usable distribution for charting without needing every raw value. I\'ll probe thresholds at 0.5, 1, 2, 3, 5, 7, 10, 15, 20, 30, 50 and 80 ha, then difference consecutive counts to get bin sizes and verify they sum to 324.',
    tools: [
      { id:  0, name: 'catalog_tools' },
      { id:  1, name: 'load_tools' },
      { id:  2, name: 'catalog_tools' },
      { id:  3, name: 'list_tools' },
      { id:  4, name: 'catalog_tools' },
      { id:  5, name: 'inspect_file' },
      { id:  6, name: 'present_files' },
      { id:  7, name: 'load_tools' },
      { id:  8, name: 'execute_tool' },
      { id:  9, name: 'web_fetch_exa' },
      { id: 10, name: 'catalog_tools' },
      { id: 11, name: 'filter_vector_rows_numerical_goserver' },
      { id: 12, name: 'filter_vector_rows_numerical_goserver' },
      { id: 13, name: 'filter_vector_rows_numerical_goserver' },
      { id: 14, name: 'filter_vector_rows_numerical_goserver' },
      { id: 15, name: 'filter_vector_rows_numerical_goserver' },
      { id: 16, name: 'filter_vector_rows_numerical_goserver' },
      { id: 17, name: 'filter_vector_rows_numerical_goserver' },
      { id: 18, name: 'filter_vector_rows_numerical_goserver' },
      { id: 19, name: 'filter_vector_rows_numerical_goserver' },
      { id: 20, name: 'filter_vector_rows_numerical_goserver' },
      { id: 21, name: 'filter_vector_rows_numerical_goserver' },
      { id: 22, name: 'filter_vector_rows_numerical_goserver' },
      { id: 23, name: 'catalog_tools' },
      { id: 24, name: 'signal_end' },
    ],
    blocks: [
      { t: 'p', s: 'No vector-to-CSV conversion tool is available in the toolchain, so I built the distribution directly from the delineation output (`sakaka_fields_with_area.geojson`, 324 fields, `area_ha` column) using cumulative numeric filtering and differenced the bin edges. Here\'s the histogram, ready to paste into a `.csv` file:' },
      {
        t: 'code',
        lang: 'csv',
        s:
          'bin_min_ha,bin_max_ha,field_count,pct_of_fields\n' +
          '0.0,0.5,103,31.8\n' +
          '0.5,1.0,36,11.1\n' +
          '1.0,2.0,27,8.3\n' +
          '2.0,3.0,20,6.2\n' +
          '3.0,5.0,33,10.2\n' +
          '5.0,7.0,21,6.5\n' +
          '7.0,10.0,23,7.1\n' +
          '10.0,15.0,14,4.3\n' +
          '15.0,20.0,20,6.2\n' +
          '20.0,30.0,14,4.3\n' +
          '30.0,50.0,9,2.8\n' +
          '50.0,80.0,3,0.9\n' +
          '80.0,inf,1,0.3',
      },
      { t: 'kv', k: 'Checks:', s: 'counts sum to 324 (matches total delineated fields); total mapped area 2,097.9 ha (mean ≈ 6.5 ha/field).' },
      { t: 'kv', k: 'Read:', s: 'Heavily right-skewed — ~43% of fields are under 1 ha (small plots and pivot edges clipped by the model), while a long tail of 13 fields exceed 30 ha. Classic center-pivot irrigation footprints in this part of Al Jawf typically fall in the 15–30 ha band, which holds 34 fields (~10.5%) here.' },
      { t: 'h3', s: 'Download' },
      { t: 'dl', label: 'sakaka_fields_with_area.geojson' },
    ],
    chips: [],
  },
]
````

The `h3` label is `Download`, not `⬇️ Download`. The real answer uses a `⬇️` emoji; the design system bans emoji as iconography, so the renderer prefixes an `<ArrowDownToLine class="h-3.5 w-3.5" />` icon instead. That is the only substitution made to quoted output anywhere in the build, and it is purely a glyph swap.

Turn 4 carries **no file chip**. The real answer re-presented the same file (id 3671, identical name and byte count) rather than producing a new artefact, so showing a second chip would imply a second deliverable. The `dl` block is kept because it is literally what the answer contained.

### 22.6 Timeline — one reducer, one `requestAnimationFrame` loop

Use `requestAnimationFrame`, never `setInterval`. rAF auto-suspends in a background tab, which is the behaviour you want.

````ts
type Phase =
  | { k: 'idle' }
  | { k: 'typing-prompt'; turn: number; chars: number }
  | { k: 'sending';       turn: number }
  | { k: 'thinking';      turn: number }
  | { k: 'reasoning';     turn: number; chars: number }
  | { k: 'tools';         turn: number; upto: number }
  | { k: 'answering';     turn: number; chars: number }
  | { k: 'artifact';      turn: number }
  | { k: 'settle';        turn: number }
  | { k: 'done' }
````

Constants:

````ts
const FRAME_MS      = 33    // ~30fps. The product's own choice: "smooth for text,
                            // and half the markdown re-parses of a 60fps reveal."
const PROMPT_CPS    = 55
const REASON_CPS    = 320
const PROSE_CPS     = 380
const SENDING_MS    = 260
const THINKING_MS   = 900
const TOOL_ROW_MS   = 160
const ARTIFACT_MS   = 520
const SETTLE_MS     = 700
const BEAT_MS       = 1400  // between exchanges
const PHRASE_MS     = 3000  // thinking-phrase rotation, the product's real interval
````

Measured schedule:

| Step | Turn 2 | Turn 4 |
|---|---|---|
| typing-prompt | 1.38s (76 chars) | 1.13s (62 chars) |
| sending | 0.26s | 0.26s |
| thinking | 0.90s | 0.90s |
| reasoning | 2.78s (890 chars) | 1.63s (520 chars) |
| tools | 2.56s (16 rows) | 4.00s (25 rows) |
| answering | 2.97s (1127 chars) | 2.71s (1030 chars) |
| artifact | 0.52s | 0.52s |
| settle | 0.70s | 0.70s |
| **subtotal** | **12.07s** | **11.85s** |

Plus one 1.40s beat between exchanges: **total ≈ 25.3s.**

Per-step behaviour:

- **typing-prompt** — characters appear in the composer textarea with `streaming-caret-inline`. The send button flips from `disabled:opacity-30` to full `bg-brand` the moment `chars > 0`.
- **sending** — the send icon swaps to `<Loader2 class="w-4 h-4 animate-spin" />`. The user bubble slides in: `opacity 0→1`, `translateY(6px)→0`, 220ms, `cubic-bezier(.2,.8,.2,1)`.
- **thinking** — three `h-1.5 w-1.5 animate-bounce rounded-full bg-brand` dots at `[animation-delay:0ms|150ms|300ms]` beside `text-xs italic text-slate-500` carrying a phrase from `THINKING_PHRASES`, rotated every 3000ms.
- **reasoning** — the thinking panel is **open**, matching the product's real `open = manualOpen ?? !!streaming`. Body is `font-mono text-[11px]` with `streaming-caret-inline`, and it auto-scrolls to the bottom.
- **tools** — rows appear top-down. The newest row shows `<Loader2 class="w-3 h-3 text-slate-400 animate-spin" />`; every earlier row flips to `<CheckCircle2 class="w-3 h-3 text-state-success" />`. The panel is capped at `max-h-[132px] overflow-y-auto` with the `custom-scrollbar` styling and auto-scrolls to the newest row.
- **answering** — `streaming-caret` on the body wrapper; blocks reveal progressively per §22.8.
- **artifact** — chips fade and rise in. **On the same frame the map begins its draw-on.** The `MapFileChip` animates `bg-brand-light text-brand-dark` → `bg-brand text-white` over 300ms and its `Eye` icon scales `0.6 → 1`. That synchronised state change is the single most product-true micro-moment available; do not stagger it.
- **settle** — the reasoning panel collapses to the `Show reasoning` button (240ms height transition) and the tools panel collapses to its header row, exactly as the product does when a turn lands.

Stick-to-bottom: the transcript follows its own growth **only while the reader is within 140px of the bottom**, and bails the instant they scroll up. Port `STICK_THRESHOLD = 140` from the product. **Never scroll the page itself.**

### 22.7 `useTypewriter.ts` — the port

Keep the product's frame budget and its dangling-marker guard. Do not re-implement the EMA arrival-gap logic; there is no network here, so there is no gap to measure.

````ts
const MARKERS = '*_`~'

/** Pull the cut back off up to 3 trailing markdown markers so a lone `*`
 *  never flashes. Ported verbatim from the product's useTypewriter.ts. */
export function trimDanglingMarkers(text: string, end: number): number {
  const floor = Math.max(0, end - 3)
  let i = end
  while (i > floor && MARKERS.includes(text[i - 1])) i--
  return i
}
````

The hook advances a fractional character counter at `FRAME_MS` intervals, slices on whole characters, and keeps the cut monotonic with `Math.max(emitted, trimDanglingMarkers(text, next))`. It returns `{ chars, isTyping }` and the parent owns the phase machine.

### 22.8 `DemoBlocks.tsx` — progressive reveal without a markdown parser

Takes `blocks: DemoBlock[]` and `revealed: number` (a character budget) and walks the blocks, spending budget block by block.

| Block | Cost | Reveal behaviour |
|---|---|---|
| `p`, `h2`, `h3`, `kv` | `s.length` (+ `k.length` for `kv`) | Render `s.slice(0, remaining)` |
| `table` | 40 per row | Not rendered at all below the headers' cost; then rows appear one at a time. `even:bg-slate-50` striping is index-based so it stays stable |
| `code` | `s.length` | Typed line by line |
| `dl` | 120 | All-or-nothing fade-in |

Inline emphasis is a twelve-line tokeniser, not a markdown library. Split on this regex and nothing else:

````ts
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`)/g
````

`**bold**` maps to `<strong class="font-semibold text-slate-800">`, backtick-code maps to `<code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-brand-dark">`. **No `dangerouslySetInnerHTML` anywhere in the demo tree.**

Block class strings, lifted verbatim from the product's `markdownComponents()`:

| Block | Classes |
|---|---|
| `p` | `mb-2 text-sm leading-relaxed text-slate-700 last:mb-0` |
| `h2` | `mt-3 mb-1.5 text-sm font-semibold text-slate-800 first:mt-0` |
| `h3` | `mt-3 mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-800 first:mt-0` |
| `kv` | `mb-1.5 text-sm leading-relaxed text-slate-700`, key wrapped in `<strong class="font-semibold text-slate-800">` |
| table wrapper | `my-3 overflow-x-auto rounded-lg border border-slate-200` |
| table | `w-full border-collapse text-sm` |
| `thead` | `bg-brand-light` |
| `th` | `whitespace-nowrap border-b border-slate-200 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-brand-dark` |
| `tbody` | `divide-y divide-slate-100` |
| `tr` | `even:bg-slate-50` |
| `td` | `whitespace-nowrap px-4 py-2 text-slate-700` |
| `code` block | `my-3 overflow-x-auto rounded-xl bg-slate-800 px-4 py-3 font-mono text-[10px] leading-relaxed text-slate-100` |
| `dl` | `<a class="inline-flex items-center gap-1.5 text-sm text-brand transition-colors hover:text-brand-dark hover:underline">` |

The mint `bg-brand-light` table header is the strongest single visual tell that a table came from GoPilot. Keep it.

### 22.9 Transcript chrome — `DemoTranscript.tsx`

**There are no avatars, no "GoPilot" name label and no icon badge.** The real `ChatMessage.tsx` renders none. Adding a robot avatar would instantly make this look like a different product.

- Assistant turn: full-width unbubbled prose, left-aligned, no background.
- User turn: right-aligned pill bubble only.

Message row wrapper, both roles: `<div class="px-4 py-3">` containing `<div class="mx-auto max-w-panel">`. (The product uses `px-5` and `max-w-3xl`; `px-4` fits the narrower demo panel.)

**User message:**
```html
<div class="flex flex-col items-end gap-1">
  <div class="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-light px-4 py-2.5 text-slate-800">
    <p class="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
  </div>
  <span class="mr-1 text-[10px] text-slate-400">{time}</span>
</div>
```
The asymmetric `rounded-br-sm` on a `rounded-2xl` bubble is the signature. Keep it. User content is never markdown-rendered.

**Message header**, when both reasoning and tools exist: `grid grid-cols-1 gap-2 mb-3 sm:grid-cols-2` (thinking left, tools right). The product uses an unconditional `grid-cols-2`; the demo panel is narrower, so it stacks below `sm`.

Thinking panel: `.thinking-panel`, header row `flex items-center gap-1.5 mb-1.5` with `<Brain class="w-3.5 h-3.5 text-brand-highlight shrink-0" />` and `<span class="thinking-label">Thinking</span>`, plus the three bouncing `w-1 h-1 bg-brand-highlight rounded-full animate-bounce` dots while streaming. Collapsed state is a button: `flex items-center gap-1 text-[11px] text-brand-highlight transition-colors hover:text-brand-dark` reading `Show reasoning` / `Hide reasoning` with a `<ChevronDown class="w-3 h-3 transition-transform" />` that rotates 180° when open. Body is `.thinking-body`.

**Accessibility correction to the product:** the real `ThinkingBlock` has neither `aria-expanded` nor `aria-controls`. Add both here.

Tools panel: `.tools-panel`, header `<Wrench class="w-3.5 h-3.5 text-slate-400" />` + `<span class="text-[11px] font-medium uppercase tracking-wide text-slate-400 flex-1">Tools</span>` + chevron. Rows: `flex items-center gap-1.5 text-[11px] text-slate-600 truncate` with the status icon then `<span class="truncate font-mono">{name}</span>` then `<span class="sr-only">{status === 'success' ? 'completed' : 'running'}</span>`. **The status icon must not be the only signal**; the `sr-only` span is mandatory.

Assistant body: `<div class="space-y-3 break-words text-sm leading-relaxed text-slate-700">` plus `streaming-caret` while typing.

**File chip**, the `MapFileChip` split control:
```html
<div class="flex items-center gap-0.5">
  <span class="inline-flex items-center gap-1 rounded-l-lg bg-brand px-3 py-1.5 text-xs font-medium text-white shadow-sm">
    <Eye class="h-3 w-3 shrink-0" aria-hidden="true" />
    sakaka_fields_with_area.geojson
  </span>
  <span class="rounded-r-lg bg-brand px-2 py-1.5 text-white shadow-sm">
    <Download class="h-3.5 w-3.5" aria-hidden="true" />
  </span>
</div>
<span class="text-[11px] text-slate-500">275.6 KB</span>
```
Pre-artifact state is `bg-brand-light text-brand-dark` with no `Eye` icon. These are `<span>`s, not `<button>`s: a focusable control that does nothing is worse than a picture of one.

**Composer**, pinned to the bottom of the panel:
```html
<div class="border-t border-slate-200 bg-white px-3 py-2.5">
  <div class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
    <span class="rounded-lg p-1.5 text-slate-400"><Upload class="h-4 w-4" aria-hidden="true" /></span>
    <span class="min-w-0 flex-1 truncate py-1 text-sm leading-5 text-slate-800">{typedPrompt}</span>
    <span class="shrink-0 rounded-full bg-brand p-2 text-white"><Send class="h-4 w-4" aria-hidden="true" /></span>
  </div>
</div>
```
Placeholder while idle, verbatim from the product: `Type your prompt here...` in `text-slate-400`. While a turn is in flight it becomes `Waiting for response...`.

**Panel header:** `flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2.5` containing `<h3 class="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">Try GoPilot</h3>` and the Replay / Skip controls.

**Transcript scroller:** `min-h-0 flex-1 overflow-y-auto bg-slate-50/60 custom-scrollbar`.

### 22.10 Card geometry

**Desktop, `lg` and up:**
```html
<figure class="overflow-hidden rounded-2xl rounded-r-none border border-r-0 border-slate-200 bg-white shadow-frame lg:h-[460px] xl:h-[500px]">
  <div class="flex h-full">
    <div class="flex w-[46%] min-w-[300px] max-w-[340px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <!-- panel header, transcript scroller, composer -->
    </div>
    <DemoMap />   <!-- flex-1 min-w-0 -->
  </div>
</figure>
```
`rounded-r-none border-r-0` makes the card read as bleeding off the viewport's right edge, which is how the real app's map behaves.

**Mobile and tablet, below `lg`** — mirrors the product's real mobile shape, a map with a sheet over it:
```html
<figure class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-frame">
  <DemoMap class="h-[200px]" compact />
  <div class="flex h-[380px] flex-col">
    <!-- panel header, transcript scroller, composer -->
  </div>
</figure>
```

The caption from §3.2 sits in a `<figcaption>` directly below the `<figure>`.

### 22.11 `DemoMap.tsx`

**The crop rule, and why it is this rule.** The map region's aspect never matches the image's 1.6:1, so something must be cropped. Use `object-cover object-center` on the image and `preserveAspectRatio="xMidYMid slice"` on the SVG. **Those two agree by construction at every container size**, so the polygons sit exactly on their fields with no magic numbers and no runtime measurement. At the desktop map region (~409×500) the centred cover crop shows native x 156 to 484, which contains nine of the ten polygons including the whole dense bottom cluster. At mobile (~360×200) it crops vertically to native y 22 to 378. Both verified against the capture.

```html
<div class="relative min-w-0 flex-1 overflow-hidden bg-[#8E7A5F]">

  <img src="/demo/sakaka-aoi.jpg"
       srcSet="/demo/sakaka-aoi.jpg 1x, /demo/sakaka-aoi@2x.jpg 2x"
       width="640" height="400"
       loading="eager" fetchPriority="low" decoding="async"
       class="absolute inset-0 h-full w-full object-cover object-center"
       alt="Satellite view of irrigated farmland near Sakaka, Al Jawf Province, Saudi Arabia: pale desert sand crossed by tracks, with about a dozen dark-green circular centre-pivot fields." />

  <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice"
       class="absolute inset-0 h-full w-full" role="img"
       aria-labelledby="aoiTitle aoiDesc">
    <title id="aoiTitle">GoPilot field delineation overlay</title>
    <desc id="aoiDesc">Crimson outlines traced onto the satellite image, each marking a detected field boundary. The largest is 24.6 hectares.</desc>
    <defs><filter id="fieldGlow"><feGaussianBlur stdDeviation="2" /></filter></defs>
    <!-- per field, two paths + optional label -->
  </svg>

  <!-- AOI frame: a plain div, NOT in the SVG, so it is always correct -->
  <div aria-hidden="true" class="pointer-events-none absolute inset-3 rounded-sm border-2 border-dashed border-brand/80"></div>
  <span aria-hidden="true"
        class="absolute bottom-3 left-3 rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-medium text-brand-dark">
    AOI · 30 × 30 km
  </span>

  <!-- layer list, top-right, rows appear with mapStep -->
  <div aria-hidden="true" class="absolute right-3 top-3 hidden w-56 rounded-lg border border-slate-200 bg-white/90 p-2 text-[11px] backdrop-blur sm:block">
    <div class="flex items-center gap-1.5">
      <span class="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#e6194b]"></span>
      <span class="min-w-0 flex-1 truncate font-mono text-slate-700">sakaka_fields_with_area.geojson_3670</span>
      <Eye class="h-3 w-3 shrink-0 text-brand" />
    </div>
  </div>

  <!-- legend, bottom-right -->
  <div aria-hidden="true" class="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2.5 py-2 text-[11px] backdrop-blur">
    <div class="flex items-center gap-1.5">
      <span class="h-2.5 w-2.5 rounded-sm bg-[#e6194b]"></span>
      <span class="text-slate-700">field</span>
      <span class="text-slate-400">· 324 polygons</span>
    </div>
    <p class="mt-1 text-[10px] text-slate-500">Sentinel-2 L2A · 2026-09-27 · 10 m</p>
  </div>

  <!-- attribution, required -->
  <p aria-hidden="true" class="absolute bottom-0.5 right-1.5 text-[9px] text-white/60">
    © Mapbox © Maxar © OpenStreetMap
  </p>

</div>
```

**Per-field rendering**, two stacked paths so the real SLD's near-black hairline survives against both sand and green:
```html
<path d={d} pathLength="1000" fill="none" stroke="#232323" stroke-width="2.75"
      stroke-opacity="0.35" stroke-linejoin="bevel" vector-effect="non-scaling-stroke"
      class="field-stroke" style={{ animationDelay: `${i * 70}ms` }} />
<path d={d} pathLength="1000" fill="#e6194b" fill-opacity="0" stroke="#e6194b"
      stroke-width="1.75" stroke-linejoin="bevel" vector-effect="non-scaling-stroke"
      class="field-path" style={{ animationDelay: `${i * 70}ms` }} />
```

`pathLength="1000"` normalises every path's length so a single `stroke-dasharray: 1000; stroke-dashoffset: 1000 → 0` keyframe draws all ten correctly **with no `getTotalLength()` call and no precomputed lengths**. The fill fades `fill-opacity 0 → 0.22` over 600ms starting at `+500ms`.

The product fills solid `#e6194b` and the user lowers layer opacity by hand; the demo lowers the fill to 0.22 so the imagery still reads underneath. **Put that in a code comment.** It is the only styling deviation from the real SLD.

Hectare labels, `mapStep 2`, desktop only:
```html
<text x={cx} y={cy} text-anchor="middle" dominant-baseline="middle"
      fill="#fff" font-size="9" font-weight="600" paint-order="stroke"
      stroke="#232323" stroke-width="2.5" stroke-opacity="0.55"
      class="field-label" style={{ animationDelay: `${i * 50}ms` }}>
  {areaHa.toFixed(1)} ha
</text>
```
Set from a `matchMedia` effect, not CSS: ten haloed 9px labels are illegible below `sm` and should not be in the DOM there.

Viewport settle on `mapStep 0 → 1`, mirroring the product's single `fitBounds(..., {padding: 50, duration: 1000})`: transition the wrapper's `transform` from `scale(1.06)` to `scale(1)` over 1000ms `cubic-bezier(.25,.1,.25,1)`. **Nothing else moves.**

Three keyframes go in `globals.css` under `@layer components`, each wrapped in `@media (prefers-reduced-motion: no-preference)`: `field-draw`, `field-fill`, `field-label-in`.

**No basemap switcher.** The researcher's three fake `Satellite | Standard | OSM` buttons were cut: they would be focusable controls that do nothing. **No scale bar** (cannot stay accurate at a responsive width). **No NDVI ramp** (this run produced vectors, not an index raster).

### 22.12 Playback control and accessibility

- **Start on first intersection:** one `IntersectionObserver` at `threshold: 0.35`, disconnect after firing. A hero demo already half-played when the visitor arrives has thrown away its own payload.
- **Run once**, then `{k:'done'}` and render the full final state. No infinite loop.
- **Pause when off-screen:** a second observer at `threshold: 0` sets a `paused` ref; the rAF loop returns early while paused.
- **`Skip to result`**, visible during playback: `inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2`, with `<FastForward class="h-3 w-3" />`. **This is the highest-value affordance on the demo.** A visitor who wants the answer now must not be held hostage for 25 seconds.
- **`Replay`**, visible only in `done`: same classes, `<RotateCcw class="h-3 w-3" />`.
- Both are real `<button type="button">` elements with visible labels, placed **before** the demo region in tab order so a keyboard user can stop the motion immediately. Minimum 44×44 CSS px touch target via `p-2.5` on mobile.

**Two DOM layers: one for eyes, one for assistive technology.** This is the only clean answer.

1. The animated transcript carries `aria-hidden="true"`. A screen reader must never be fed a half-typed sentence, and `aria-live` on typing text produces a torrent of partial announcements.
2. Beside it, the **complete** final transcript renders in a `sr-only` container that is fully in the accessibility tree:

````tsx
<div className="sr-only">
  <h3 id="demo-transcript-heading">
    Example GoPilot conversation: delineating centre-pivot fields in Al Jawf Province, Saudi Arabia
  </h3>
  <ol aria-labelledby="demo-transcript-heading">
    {DEMO_TURNS.map(t => (
      <li key={t.id}>
        <span>{t.role === 'user' ? 'Analyst asked:' : 'GoPilot replied:'}</span>
        {t.thinking && <p>Reasoning: {t.thinking}</p>}
        {t.tools && <p>Tools used: {t.tools.map(x => x.name).join(', ')}</p>}
        {/* plain-text blocks; the table rendered as a real <table> with a <caption> */}
        {t.chips?.length ? <p>Result file: sakaka_fields_with_area.geojson, 275.6 KB, shown on map</p> : null}
      </li>
    ))}
  </ol>
</div>
````

Use the real `sr-only` recipe (`position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border-width:0`). **Never `display:none` or `visibility:hidden`** — both remove it from the tree.

3. **Exactly one small, low-frequency live region**, not the transcript:
```html
<p class="sr-only" role="status" aria-live="polite" aria-atomic="true">{statusText}</p>
```
At most six announcements across the whole run, debounced to one per 1200ms: `Demo started.` / `GoPilot is thinking.` / `GoPilot ran 16 tools.` / `Answer complete. 324 fields delineated, 2,097.9 hectares.` / `Map layer added: sakaka_fields_with_area.geojson.` / `Demo complete.`

**`prefers-reduced-motion: reduce`:**
- The reducer initialises directly at `{k:'done'}`. Everything renders in final state on mount: no typing, no tool cascade, no draw-on.
- Reasoning panels render **collapsed** (`Show reasoning`), matching the product's post-stream resting state, and remain expandable by click.
- The caret still renders but holds steady. `globals.css` already ships this rule; copy it rather than hiding the caret.
- `Replay` relabels to `Play demo`. If pressed, it runs the animation once. An explicit user request overrides the preference.
- `useReducedMotion()` defaults to `false` on the server so the SSR output is the finished markup, then the first client effect corrects it. **Server-render the animation's end, not its beginning** — that way the demo is fully usable with JavaScript off and before hydration.

**Contrast notes for the demo specifically:** `#e6194b` on sand `#C9A880` is about 2.9:1 as a bare stroke, which is why the `#232323` 2.75px under-stroke is mandatory — the combined edge clears the 3:1 non-text threshold against both sand and the green pivots. The product's `text-brand-highlight` `#009D84` on `bg-brand-soft` is roughly 3.4:1; it is acceptable for the 11px uppercase `Thinking` label only because it is paired with the `Brain` icon and is never the sole carrier of meaning.

Nothing in the demo flashes faster than 3 Hz: the caret is 0.9 Hz, the bounce dots 1 Hz.

### 22.13 Zero-network checklist

- No `fetch`, no `XMLHttpRequest`, no runtime font request (`next/font/google` inlines and self-hosts at build).
- No `mapbox-gl`, no `mapbox-gl.css`, no tile request, no Mapbox token in the bundle. The only permitted occurrence of the string `mapbox` in the output is the attribution text.
- No Recharts, no d3, no framer-motion, no GSAP. All motion is CSS keyframes plus one rAF counter.
- The satellite image is a build-time asset in `public/demo/`. With `output: 'export'`, use a plain `<img>` with `srcSet`, not `next/image`: `next/image` degrades to an unoptimised `<img>` under static export anyway and adds wrapper markup for nothing.
- No `Math.random()` at module scope. That would break static-export hydration. If you want phrase variety, pick the index inside a `useState(() => ...)` initialiser in the client component.

---

## 23. FILE MANIFEST

`✓` already exists and is correct. `NEW` must be created. `DELETE` must be removed.

```
C:/Users/LEGION/Desktop/gopilot_landing_page/
├─ app/
│  ├─ layout.tsx                      NEW   §18
│  ├─ page.tsx                        NEW   §19
│  ├─ globals.css                     NEW   §17
│  ├─ sitemap.ts                      NEW   §21.1
│  └─ robots.ts                       NEW   §21.2
├─ components/
│  ├─ Nav.tsx                         NEW   §4
│  ├─ NavMobile.tsx                   NEW   §4   "use client"
│  ├─ Hero.tsx                        NEW   §5
│  ├─ CredibilityStrip.tsx            NEW   §6
│  ├─ RealPrompts.tsx                 NEW   §7
│  ├─ ShowsItsWork.tsx                NEW   §8
│  ├─ DataAndModels.tsx               NEW   §9
│  ├─ Integrations.tsx                NEW   §10
│  ├─ Proof.tsx                       NEW   §11
│  ├─ Pricing.tsx                     NEW   §12
│  ├─ Faq.tsx                         NEW   §13
│  ├─ ClosingCta.tsx                  NEW   §14
│  ├─ Footer.tsx                      NEW   §15
│  ├─ JsonLd.tsx                      NEW   §20
│  ├─ Reveal.tsx                      NEW   §3.1  "use client"
│  └─ demo/
│     ├─ GoPilotDemo.tsx              NEW   §22   "use client"
│     ├─ DemoTranscript.tsx           NEW   §22.9
│     ├─ DemoBlocks.tsx               NEW   §22.8
│     ├─ DemoMap.tsx                  NEW   §22.11
│     ├─ useTypewriter.ts             NEW   §22.7
│     ├─ demoScript.ts                NEW   §22.5
│     └─ fieldPaths.ts                NEW   §22.4
├─ lib/
│  └─ content/
│     ├─ site.ts                      NEW   §25.1
│     ├─ pricing.ts                   NEW   §25.2
│     ├─ datasets.ts                  NEW   §25.3
│     ├─ prompts.ts                   NEW   §25.4
│     ├─ partners.ts                  NEW   §25.5
│     ├─ testimonials.ts              NEW   §25.6
│     └─ faq.ts                       NEW   §25.7
├─ public/
│  ├─ demo/
│  │  ├─ sakaka-aoi.jpg               NEW   copy from .research/aligned.jpg
│  │  ├─ sakaka-aoi@2x.jpg            NEW   copy from .research/sakaka-aoi@2x.jpg
│  │  └─ sakaka_fields_with_area.geojson  NEW (optional) copy from .research/fields.geojson
│  ├─ og/gopilot-og.png               MISSING  §24.2
│  ├─ partners/*.png|svg              MISSING  §24.2, fallback in §6.3 Variant B
│  ├─ img/logo.svg                    ✓
│  ├─ img/logo-white.png              ✓
│  ├─ img/globe.png                   DELETE  1.14 MB, unreferenced
│  ├─ img/bg/auth-topo.png            DELETE  1.37 MB, unreferenced
│  ├─ favicon.ico                     ✓
│  ├─ favicon-16x16.png               ✓
│  ├─ favicon-32x32.png               ✓
│  ├─ apple-touch-icon.png            ✓
│  ├─ android-chrome-192x192.png      ✓
│  ├─ android-chrome-512x512.png      ✓
│  └─ site.webmanifest                NEW   §21.3
├─ scripts/
│  └─ check-assets.mjs                NEW   §24.3
├─ docs/BUILD_SPEC.md                 ✓  this file
├─ tailwind.config.ts                 NEW   §16
├─ next.config.ts                     ✓
├─ postcss.config.mjs                 ✓
├─ tsconfig.json                      ✓
├─ package.json                       ✓
├─ .gitignore                         EDIT  add `.research/`
└─ README.md                          EDIT  point at docs/BUILD_SPEC.md
```

**35 new files.** No `src/` directory. `@/*` resolves to `./*` per the existing `tsconfig.json`, so imports are `@/components/Hero`, `@/lib/content/pricing`.

Client components, and the complete list of them: `NavMobile.tsx`, `Reveal.tsx`, `demo/GoPilotDemo.tsx`. **Everything else is a server component.** That is what keeps First Load JS under 100 KB and protects INP.

---

## 24. ASSETS

### 24.1 Present and verified

| Path | Size | Notes |
|---|---|---|
| `public/img/logo.svg` | 78 KB | The RASID mark for light backgrounds. Vector, `viewBox 327.35 169.32 410.72 514.52`, so it is taller than wide. Render at `h-8 w-auto`. |
| `public/img/logo-white.png` | 40 KB | The knockout mark. **Required** for the `bg-brand-900` footer. |
| `public/favicon.ico` + the five PNG icons | small | All referenced by the `icons` block in §18. |
| `.research/aligned.jpg` | 88 KB | 640×400 Mapbox `satellite-v9` capture, centre 40.3314 E / 29.95235 N, zoom 12.8727. **Visually verified**: pale sand dunes, ochre hardpan, roughly a dozen dark-green circular centre-pivot fields. Alignment with `aligned_paths.json` verified by inspection. |
| `.research/sakaka-aoi@2x.jpg` | 254 KB | The 1280×800 retina twin. |
| `.research/aligned_paths.json` | 2 KB | The ten simplified real paths, already inlined into §22.4. |
| `.research/fields.geojson` | 282 KB | The genuine 324-feature agent output. Optional download target. |
| `.research/task.json.txt`, `task2.json.txt`, `turn2.json` | small | The provenance record for every demo string. **Keep them**, add `.research/` to `.gitignore` so they are not shipped. |

Copy commands:

```bash
cd "C:/Users/LEGION/Desktop/gopilot_landing_page"
mkdir -p public/demo public/og public/partners scripts
cp .research/aligned.jpg        public/demo/sakaka-aoi.jpg
cp ".research/sakaka-aoi@2x.jpg" public/demo/sakaka-aoi@2x.jpg
cp .research/fields.geojson     public/demo/sakaka_fields_with_area.geojson
rm -f public/img/globe.png public/img/bg/auth-topo.png
rmdir public/img/bg 2>/dev/null || true
```

### 24.2 Missing, and what to do about each

| Asset | Required? | Spec | Fallback if absent |
|---|---|---|---|
| `public/og/gopilot-og.png` | **Yes.** Without it every share card on LinkedIn, Slack and X renders blank. | Exactly 1200×630, PNG, under 300 KB. Produce it by screenshotting the finished `<GoPilotDemo />` in its `done` state. Layout: RASID/GoPilot wordmark top-left at 48px; headline `The geospatial AI agent` in Space Grotesk Bold 72px `#201D1F` on a `#F8F7F7` ground; beneath it `Ask in plain language. Get the layer back.` in Inter Medium 34px `#4A4A4A`; the right 45% is the demo's composed final frame with the crimson field polygons visible. Safe margins 80px all round (LinkedIn and Slack crop to ~1200×628, Discord letterboxes). Minimum type size anywhere 28px. No critical text in the bottom 90px. | **None.** `scripts/check-assets.mjs` fails the build. **Do not reuse `https://rasid.ai/opengraph-image`** — it is branded "RASID: Seeing Earth, Smarter" and would make the GoPilot card indistinguishable from the consultancy site's. |
| `public/partners/{aws,world-bank,ogc,undp-rbas,cgi,aoad,fred}.{png,svg}` | No | Seven files, rendered at `h-7 w-auto`. | **§6.3 Variant B**, the text-wordmark strip. Fully specified, zero assets, honest. |
| Maskable 512 icon | No | `android-chrome-512x512.png` with the mark inside the 80% safe circle. | The manifest reuses the existing 512 with `purpose: "maskable"`. It may be visibly cropped on Android home screens. Cosmetic only. |
| AVIF/WebP variants of the demo capture | No | Post-launch optimisation. | The JPEGs ship. 88 KB for the 1x is already inside budget. |

Partner logo download, if Variant A is chosen:

```bash
cd "C:/Users/LEGION/Desktop/gopilot_landing_page/public/partners"
for f in aws.png world-bank.png undp-rbas.png cgi.png aoad.png fred.png ogc.svg; do
  curl -fsSL -o "$f" "https://rasid.ai/partners/$f" || echo "MISSING: $f"
done
ls -la
```

If any file reports `MISSING`, **switch the whole strip to Variant B.** Do not ship a mix and never ship a broken `img`.

Optional WebP/AVIF conversion, post-launch:

```bash
npx --yes sharp-cli -i public/demo/sakaka-aoi.jpg      -o public/demo/sakaka-aoi.webp      -f webp -q 72
npx --yes sharp-cli -i "public/demo/sakaka-aoi@2x.jpg" -o "public/demo/sakaka-aoi@2x.webp" -f webp -q 70
```

Then add `<source type="image/webp" srcSet="...">` ahead of the `<img>` inside a `<picture>`.

### 24.3 `scripts/check-assets.mjs`

A build gate. Wire it as `"prebuild": "node scripts/check-assets.mjs"` in `package.json` so a missing OG image can never reach production.

````js
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

// [path, maxBytes | null]
const REQUIRED = [
  ['public/og/gopilot-og.png', 350_000],
  ['public/demo/sakaka-aoi.jpg', 200_000],
  ['public/demo/sakaka-aoi@2x.jpg', 400_000],
  ['public/img/logo.svg', null],
  ['public/img/logo-white.png', null],
  ['public/favicon.ico', null],
  ['public/favicon-16x16.png', null],
  ['public/favicon-32x32.png', null],
  ['public/apple-touch-icon.png', null],
  ['public/android-chrome-192x192.png', null],
  ['public/android-chrome-512x512.png', null],
  ['public/site.webmanifest', null],
]

let failed = false
for (const [rel, max] of REQUIRED) {
  const abs = join(root, rel)
  if (!existsSync(abs)) {
    console.error(`MISSING ASSET: ${rel}`)
    failed = true
    continue
  }
  if (max !== null) {
    const { size } = statSync(abs)
    if (size > max) {
      console.error(`OVERSIZED ASSET: ${rel} is ${size} bytes, limit ${max}`)
      failed = true
    }
  }
}

if (failed) {
  console.error('\nAsset check failed. Fix the files above before building.')
  process.exit(1)
}
console.log('Asset check passed.')
````

---

## 25. DATA MODULES

All page content that repeats or feeds structured data lives in `lib/content/`. One edit, one effect.

### 25.1 `site.ts`

```ts
export const SITE = {
  url: 'https://gopilot.earth',
  name: 'GoPilot',
  parent: 'RASID',
  email: 'info@rasid.ai',
  tagline: 'GoPilot is the interface to Earth.',
  ctaPrimaryLabel: 'Sign up free · 500 tokens',
  ctaPrimaryHref: 'https://app.gopilot.earth/auth?active_form=register',
  ctaSignInHref: 'https://app.gopilot.earth/auth?active_form=login',
  ctaTryHref: 'https://app.gopilot.earth/try-gopilot',
  ctaSalesHref: 'https://calendly.com/rasid/30mins',
  plansHref: 'https://app.gopilot.earth/pricing',
  apiKeysHref: 'https://app.gopilot.earth/api-keys',
  qgisHref: 'https://plugins.qgis.org/plugins/rasid_plugin/',
  arcgisHref: 'https://github.com/rasid-ai/arcgispro_addin_gopilot/releases/latest/download/RASID.esriAddinX',
  awardHref: 'https://thrivegeo.com/genai-geospatial-challenge/',
  awardLabel: 'Winner, AWS and thriveGEO GenAI for Geospatial Challenge 2026',
  linkedin: 'https://www.linkedin.com/company/rasid-ai/',
  youtube: 'https://www.youtube.com/@RASIDAI',
  termsHref: 'https://app.gopilot.earth/terms',
  privacyHref: 'https://app.gopilot.earth/privacy-policy',
} as const
```

**`ctaPrimaryLabel` is used in four places and must never be overridden inline.** Label drift between nav, hero and pricing is the most invisible conversion leak on a SaaS page.

### 25.2 `pricing.ts`

Shape: `{ code, name, badge?, highlighted, tagline, price, interval, tokens, storage, featuresHeading, features: string[], ctaLabel, ctaHref, ctaVariant }`. Four entries, populated exactly from the table in §12.2. This module is the **single source** for the pricing cards and for the `offers` array in the `SoftwareApplication` JSON-LD. Enterprise is flagged `priceIsCustom: true` and is excluded from the JSON-LD offers.

### 25.3 `datasets.ts`

`DATASET_CHIPS: { label, icon }[]` with the eleven entries from §9.2, and `MODEL_ROWS: string[]` with the nine from §9.2. Both in the live site's order.

### 25.4 `prompts.ts`

`PROMPTS: { prompt, domain, icon, mechanism }[]`, the six entries from §7.2. `HERO_PROMPT_IDS = [0, 2, 3]` selects the three hero chips (Eiffel Tower, Central Park, Maui).

### 25.5 `partners.ts`

`PARTNERS: { name, file, alt }[]`, the seven from §6.3, plus `export const PARTNER_VARIANT: 'logos' | 'wordmarks'` which the builder sets once after running the download command.

### 25.6 `testimonials.ts`

`TESTIMONIALS: { initials, name, title, quote, emphasis }[]`, the three from §11.2, where `emphasis` is the exact substring of `quote` to wrap in `<strong>`.

### 25.7 `faq.ts`

`FAQ_ITEMS: { q: string; a: string }[]`, the six pairs from §13.3, **character for character**. Consumed by both `Faq.tsx` and `JsonLd.tsx`. Changing a string here changes both, which is the point.

---

## 26. CLAIMS GUARDRAILS

Rules, not suggestions. Every one of them exists because a specialist verified either that the claim is true or that it is not.

### 26.1 Never write these

| Forbidden | Why |
|---|---|
| `GoToken`, `GoTokens` | The API and the code use it; the user-facing word is `tokens`. A golden rule in `AGENTS.md`. |
| `instant`, `real-time`, `in seconds`, `answers in seconds` | The product's own code budgets 90s for one answer and the poll interval is 2s. Say *while you watch*, *as it works*, *streams in*. |
| `Upload a shapefile / GeoPackage / any GIS format` | The accepted list comes from `GET /api/llm/upload-limits/` at runtime and is not in the repo. The server once refused `.shp`, `.zip` and `.gpkg` outright. Safe: `GeoJSON and GeoTIFF`, plus KML and GPX which are converted in the browser. |
| `Export to shapefile / KML / GeoPackage / PDF` | There is no export or format-conversion feature. The only download path is a plain fetch-and-save of the file the worker produced. |
| `Try the full product free, no signup` | The anonymous trial cannot upload and cannot draw an AOI. Say *text prompts on the real map*. |
| Any number for the anonymous message cap | A cap exists server-side; the figure is not in the frontend. Do not invent one. |
| `Your trial conversation is saved` | Anonymous session lives in `sessionStorage`. A new tab is a new trial. |
| `Tokens roll over`, `never lose unused credit` | The opposite is true and is stated in-product. |
| `One price, pay as you go`, `tokens cover everything` | Two distinct currencies exist. Conflating them is explicitly warned against. |
| `It never fails`, `fully automated, hands off` | The UI has first-class failure states: `processing_status: failed`, `tiles_situation: gf`, tool calls with `status: error`. |
| `MCP server available today`, `connect GoPilot to Claude or Cursor` | Zero `mcp` hits in the app repo. The MCP connector is an Enterprise plan feature; say only that. |
| `Team workspaces`, `invite your team`, `share with a colleague`, `comment on results` | No sharing, invite, org, role or permission model exists. `named_users` is a licence term, not a collaboration feature. |
| `Public links`, `embed a map`, `share a result with a client` | None exist. |
| `Scheduled monitoring`, `alerts when something changes`, `continuous change detection` | No scheduler, no cron, no recurring runs. |
| `Connect your database / S3 bucket`, `chat with your enterprise data` | No connectors. Ingestion is: a file attached to a message, a drawn AOI, a linked raster URL on a GoBox process, the provider catalogues. |
| `Edit and style your layers`, `full cartography control` | `sld` is passed straight through. There is no styling editor. |
| `Mobile app`, `works great on your phone` | Mobile is a reduced experience by design and there is no native app. |
| `Powered by GPT-4` or any named foundation model | The frontend never names a model. The case study names AWS Bedrock, AgentCore Runtime, Strands Agents and Claude; that is the only sourced phrasing, and it does not appear on this page. |
| `SOC 2`, `ISO 27001`, `ISO 42001`, `HIPAA`, `GDPR compliant`, `FedRAMP` | No certification claim is supported. Reproducing the visual grammar of compliance without the substance is the one error that would destroy credibility with defence and government buyers. |
| `Trusted by`, `Our customers`, `Powering teams at` | The partner strip is ecosystem partners, not customers. Header is `Built with leading organizations.` |
| Any customer count, usage figure, uptime number or ROI percentage | **GoPilot has zero published customer outcome metrics.** None. |
| An em dash in page copy | The brand uses none. Commas, full stops and middots. (Quoted agent output and the three SERP strings are the only exceptions.) |

### 26.2 Always do these

- Every testimonial, partner, award and metric on this page traces to something a specialist verified on `rasid.ai`, in `app.gopilot.earth`, in the `saas-ui` repository, or in the live API transcripts in `.research/`. **If you add anything, it must trace too.**
- The award is one string: `Winner, AWS and thriveGEO GenAI for Geospatial Challenge 2026`, linked to `thrivegeo.com`.
- `10,000+ datasets` always links to `https://rasid.ai/products#gopilot`.
- Pricing always carries the link to the live plan page.
- Quoted agent output is verbatim. If you shorten it, shorten by removing whole sentences, never by rewording.
- The three honesty disclosures in §3.2 ship. They are not optional and they are not boilerplate: on a page whose entire argument is provenance, labelling your own assets correctly is the proof that you label things.

### 26.3 What was stripped for lack of proof

| Stripped | Where it came from |
|---|---|
| Four worked-example scenarios with full run logs | Patterns research, presented as real telemetry |
| A third demo exchange and a second output filename | Demo motif report |
| Twelve GoBox solution names | Patterns research, presented as "the REAL names from the product" |
| Nine dataset chips (Sentinel-1, Sentinel-3, MODIS, SRTM, ESA WorldCover, GHSL, VIIRS, CHIRPS, OSM, Overture) | Patterns research |
| `A typical single-AOI flood analysis costs about 30-40 tokens` | Patterns research |
| `Runtime 2m 41s · 38 tokens · 4 tool calls` | Patterns research |
| `AWS Generative AI Challenge 2026 — Winner` as a fourth award wording | Live site inconsistency; collapsed to one string |
| Testimonial headshots | Patterns research |
| `Uploads are scoped to your workspace, exports are unrestricted` | Trust playbook |
| `a copyable MCP server config` | Patterns research and copy formulas |
| `Ask your first question in about ninety seconds` | Patterns research |
| `the first forty minutes` | Patterns research |
| `you can override it` (model selection) | SEO FAQ answer 3 |
| `re-run it later` (GoPilot chat) | SEO FAQ answer 2 |
| `write the results straight back into your existing project layers` | SEO FAQ answer 4 |
| `one pool spent across GoPilot analyses, GoBox solutions and MCP/API` | SEO FAQ answer 6 |
| `Imagery shown is procedurally generated for demonstration.` | Live site; would be **false** on this page |
| Three fake basemap-switcher buttons | Demo motif report |
| A 1 km scale bar | Demo motif report |
| An NDVI colour ramp on the field-delineation map | Demo motif report |

---

## 27. BUILD ORDER

Work in this sequence. Each step is independently verifiable, so a failure is cheap to locate.

1. **Tokens first.** Write `tailwind.config.ts` (§16) and `app/globals.css` (§17). Write a throwaway `app/page.tsx` containing one `btn btn-primary`, one `card`, one `.eyebrow` and one `.surface-canvas` div. Run `npm run dev` and confirm the brand green is `#008B6A`, the card border is warm `#E6E2E3` and the canvas shows its dot grid. **If the greys look cool, the `slate` override did not land. Stop and fix it.**
2. **Shell.** `app/layout.tsx` (§18), the skip link, `components/Nav.tsx` + `NavMobile.tsx` (§4), `components/Footer.tsx` (§15). Confirm the sticky nav does not cover an anchored section (that is what `--nav-h` and `scroll-padding-top` are for).
3. **Data modules.** All seven files in `lib/content/` (§25). Type them properly; they are the contract between sections.
4. **Static sections, top to bottom.** §6 through §15. Each one is a server component reading its data module. At this point the page is complete and shippable minus the demo.
5. **`Reveal.tsx`** (§3.1), wrapped around each section's inner div.
6. **Demo, last.** `fieldPaths.ts` and `demoScript.ts` first (pure data). Then `DemoMap.tsx` in its **final state only**, with no animation, and verify by eye that the ten crimson outlines land on the green pivot circles. **Do not build the state machine until that alignment is confirmed.** Then `DemoBlocks.tsx`, `useTypewriter.ts`, `DemoTranscript.tsx`, and finally `GoPilotDemo.tsx` with the reducer.
7. **SEO plumbing.** `sitemap.ts`, `robots.ts`, `site.webmanifest`, `JsonLd.tsx`.
8. **Gates.** `scripts/check-assets.mjs`, the `prebuild` script, the mapbox grep.
9. **Verify** with §28.

A deliberate consequence of this order: after step 4 you have a complete, honest, fast landing page. The demo is an upgrade, not a dependency. If it slips, the page still ships.

---

## 28. VERIFICATION

Run every one of these. Do not substitute "it looks right in devtools" for any of them: a tag that only appears in devtools was injected by client JS and crawlers that do not execute JS will never see it.

### 28.1 Build and inspect the real HTML

```bash
cd "C:/Users/LEGION/Desktop/gopilot_landing_page"
NEXT_PUBLIC_SITE_URL=https://gopilot.earth npx next build
node -e "const h=require('fs').readFileSync('out/index.html','utf8'); console.log(h.match(/<head>[\s\S]*?<\/head>/)[0])"
```

### 28.2 Assert the exact tags, do not eyeball

```bash
grep -oE '<title>[^<]*</title>' out/index.html          # must print exactly ONE line
grep -c 'rel="canonical"' out/index.html                # must print 1
grep -o 'rel="canonical" href="[^"]*"' out/index.html   # must be ABSOLUTE https://gopilot.earth/
grep -o '<h1' out/index.html | wc -l                    # must print 1
```

A second `<title>` means a nested metadata export is fighting the layout. A relative canonical means `metadataBase` was dropped.

Dump the heading outline and compare against §3.0. No skipped levels, no H2 followed by H4:

```bash
node -e "const h=require('fs').readFileSync('out/index.html','utf8'); for(const m of h.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)) console.log(' '.repeat(+m[1]*2)+'H'+m[1]+': '+m[2].replace(/<[^>]*>/g,'').trim())"
```

### 28.3 Static metadata routes actually emitted files

```bash
ls -l out/sitemap.xml out/robots.txt
grep -c '#' out/sitemap.xml                  # must be 0: no hash anchors in a sitemap
grep -o '<loc>[^<]*</loc>' out/sitemap.xml   # must be exactly https://gopilot.earth/
tail -1 out/robots.txt                       # must end: Sitemap: https://gopilot.earth/sitemap.xml
```

If either file is missing, the route used a request-scoped API and silently opted out of static export.

### 28.4 JSON-LD parses, and there are three blocks

```bash
node -e "const h=require('fs').readFileSync('out/index.html','utf8'); const m=[...h.matchAll(/<script type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/g)]; console.log('blocks:',m.length); m.forEach((x,i)=>{const d=JSON.parse(x[1]); console.log(i, d['@type'])})"
```

Must print `blocks: 3` and `SoftwareApplication`, `Organization`, `FAQPage`. A thrown `SyntaxError` means an unescaped `<` or apostrophe broke a block and Google is seeing nothing.

**FAQ parity check, mandatory.** The six JSON-LD answers must be byte-identical to the six rendered answers:

```bash
node -e "
const h=require('fs').readFileSync('out/index.html','utf8');
const ld=[...h.matchAll(/<script type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).find(d=>d['@type']==='FAQPage');
let bad=0;
for(const q of ld.mainEntity){
  const txt=q.acceptedAnswer.text;
  if(!h.includes(txt.replace(/&/g,'&amp;'))&&!h.includes(txt)){ console.error('NOT IN DOM:',q.name); bad++; }
}
console.log(bad?'FAIL':'FAQ parity OK');
process.exit(bad?1:0)"
```

### 28.5 Schema validators

Paste the deployed URL into both:

- `https://validator.schema.org/` — must be **0 errors**.
- `https://search.google.com/test/rich-results` — must detect `SoftwareApplication` with 3 offers, and report `FAQPage` as "detected but not eligible for rich results". **That is the correct outcome, not a bug.**

### 28.6 OG image is real and small

```bash
curl -sI https://gopilot.earth/og/gopilot-og.png | grep -iE 'HTTP/|content-type|content-length'
```

Must show `200`, `image/png`, and under 350000 bytes. Then force a fresh scrape in each client **before the first real share**:

- `https://www.linkedin.com/post-inspector/` — LinkedIn caches for 7 days. Inspect it first or you are stuck with a stale card.
- `https://cards-dev.twitter.com/validator`
- Paste the URL into a Slack DM to yourself.

A blank card means the file 404s or exceeds a size limit.

### 28.7 No forbidden dependency reached the bundle

```bash
grep -rl "mapbox-gl" .next/static/chunks/ ; echo "exit=$?"   # expect no files listed
grep -rl "recharts\|framer-motion\|gsap\|d3-" .next/static/chunks/ ; echo "exit=$?"
```

Then read the build table: **First Load JS for `/` must be under 100 KB.**

### 28.8 Claims audit against the guardrails

```bash
cd "C:/Users/LEGION/Desktop/gopilot_landing_page"
grep -rniE "gotoken|instant analysis|real-time|trusted by|soc 2|iso 2700|fedramp|hipaa|shapefile export|roll over|10x faster" app components lib
```

Expect zero hits. Then check the em-dash rule, excluding the demo script (quoted output) and `app/layout.tsx` (SERP strings):

```bash
grep -rn "—" app components lib | grep -v "demo/demoScript.ts" | grep -v "app/layout.tsx"
```

Expect zero hits.

### 28.9 Accessibility

- `npx @axe-core/cli https://gopilot.earth` — zero violations.
- Tab from the top: skip link, logo, four nav links, Sign in, primary CTA, then **Skip to result / Replay before the demo region**, then the hero CTAs. Every focused element shows a visible `#008B6A` ring.
- Turn on `prefers-reduced-motion` (Chrome DevTools, Rendering panel, "Emulate CSS prefers-reduced-motion"). Reload. **The demo must render fully finished on mount**: no typing, no draw-on, no bouncing dots, reasoning panels collapsed, caret steady, and the `Replay` control labelled `Play demo`.
- Disable JavaScript entirely. The demo must still render its finished state and the FAQ answers must still be readable. Every section's `.reveal` content must be visible (the reduced-motion and no-JS paths both force `opacity: 1`).
- Run VoiceOver or NVDA over the demo. You must hear the complete `sr-only` transcript, exactly once, with no partial sentences.
- Contrast spot-check with any WCAG tool: the H1's green line (large text, 3:1), every `text-brand-dark` small label (5.37:1), every `text-slate-500` body line (4.9:1). **No sentence a visitor must read may be `text-slate-400`.**

### 28.10 Visual and responsive

- 1440×900: the hero fits above the fold. The eyebrow, both H1 lines, the subhead, three chips, both CTAs, the microcopy, the award line and the whole demo card are visible without scrolling.
- 1024×768: the hero stacks nothing, but the H1 may wrap to three lines. Acceptable.
- 390×844 (iPhone 14): the demo is map-on-top, transcript-below; the hero CTA is full width; the secondary CTA is a text link beneath it; no horizontal scroll anywhere.
- Demo alignment: at every breakpoint the crimson outlines sit on green circular fields, never on bare sand. **If they drift, the `object-cover`/`slice` pairing was broken — check that the `img` has `object-center` and the `svg` has `preserveAspectRatio="xMidYMid slice"`.**
- Surface sequence down the page: canvas, white, slate-50, canvas, white, sand, white, slate-50, white, brand, brand-900. No two identical adjacent surfaces.

### 28.11 Core Web Vitals

```bash
npx lighthouse https://gopilot.earth --preset=desktop --view
npx lighthouse https://gopilot.earth --view            # mobile
```

Gates: LCP under 2.5s, CLS under 0.1, TBT under 200ms, SEO score 100, Accessibility 100.

### 28.12 Launch-day checks outside this repo

These are not optional. They are the reason this page can rank at all.

```bash
# 1. The cannibalisation fix landed on the parent site.
curl -s https://rasid.ai/ | grep -oE '<title>[^<]*</title>'
#    Must NO LONGER return "GoPilot by RASID: AI Geospatial Agent for Earth Data".

# 2. The parent site links to this page.
curl -s https://rasid.ai/products | grep -o 'gopilot.earth'
#    Must return at least one hit.

# 3. The app subdomain is not competing.
curl -s https://app.gopilot.earth/robots.txt | grep -E 'gopilot|try-gopilot|pricing'
curl -sI https://app.gopilot.earth/ | grep -i x-robots-tag
```

Also fix, in the product repo: the hardcoded `og:url` of `https://rasid.ai` in `C:/Users/LEGION/Desktop/saas-ui/index.html` line 34, and the cross-host `Sitemap: https://rasid.ai/sitemap.xml` in `C:/Users/LEGION/Desktop/saas-ui/public/robots.txt`. Both currently misattribute the app host to the marketing host.

Within 24 hours of launch: add `gopilot.earth` to Google Search Console as a **Domain** property via DNS TXT, submit `https://gopilot.earth/sitemap.xml`, then run URL Inspection, Test live URL, View crawled page, and confirm the rendered HTML contains the H1 and all three JSON-LD blocks. The Page indexing reason must read **"URL is on Google"**, not "Alternate page with proper canonical tag". The latter would mean Google chose `rasid.ai` over this page, which is the exact failure mode this whole strategy exists to prevent.

At 2 and 6 weeks, in an incognito window, record **which RASID property ranks** for: `site:gopilot.earth`, `GoPilot geospatial agent`, `geospatial AI agent`, `AI GIS assistant`, `QGIS AI plugin`. If `rasid.ai/` or `rasid.ai/case-studies/gopilot-ai-geospatial-agent` outranks this page for `geospatial AI agent`, the intent separation failed and the fix is differentiating **those** titles, not touching this page.

---

## 29. WHAT WAS NOT SOLVED, AND WHO OWNS IT

Flagged rather than hidden. None of these blocks the build.

| Open item | Owner | Note |
|---|---|---|
| `gopilot.earth` DNS and hosting | Infra | Until it exists, build with `NEXT_PUBLIC_SITE_URL` pointing at the staging origin. |
| Retitling `rasid.ai/` away from GoPilot keywords | Marketing | Must ship before or with this page, or the two properties cannibalise each other. §28.12. |
| `public/og/gopilot-og.png` | Design | The build gate fails without it. §24.2. |
| Seven partner logo files | Design or Marketing | Variant B ships without them. §6.3. |
| A public API documentation URL | Engineering | `Docs` nav item and the footer `API Documentation` link stay cut until one exists. |
| Confirmation of accepted upload formats beyond GeoJSON, GeoTIFF, KML and GPX | Backend | The page claims only the four. Zipped shapefile and GeoPackage support may exist server-side; nobody has confirmed it. |
| Whether `10,000+ datasets` and `hundreds of AI models` can be defended in a sales call | Leadership | Both are already published on every page of `rasid.ai`; this page does not escalate the claim. If either is withdrawn, remove the two stat tiles in §6.2 and the H2 in §9.1 becomes `One interface over the Earth observation archives.` |
| Analytics and GDPR consent posture | Leadership | Zero third-party JS at launch. If analytics is added, use a cookieless provider so RASID's current no-banner posture survives. |
| A 90-second product video | Marketing | Would become the hero's secondary CTA if it existed. The `/try-gopilot` link is the better asset in the meantime. |
| A maskable 512 icon | Design | Cosmetic. Android may crop the current one. |

---

## 30. THE TEST OF THIS PAGE

A GIS analyst lands here, reads for forty seconds, and can answer four questions without talking to anyone:

1. **What category is this?** `GEOSPATIAL AI AGENT · BY RASID`, above the H1.
2. **What do I get?** `GeoTIFF and GeoJSON layers you can open in QGIS`, in the subhead.
3. **Can I believe it?** They watched a real run name its scene, log sixteen tools, and admit a missing tool, in the hero.
4. **What does it cost to find out?** `Sign up free · 500 tokens. No credit card.`

If a change to this page makes any of those four harder to answer in forty seconds, the change is wrong.

---

## 31. AMENDMENT A, RELEASE NOTES

**Status:** this section AMENDS the contract above. Sections 0 to 30 described a single-page site, and the file manifest in §23 did not contain a `/releases` route. It does now. Everything else in this document stands.

### 31.1 Why this exists on the landing page and not in the product

The portal at `app.gopilot.earth` is entirely behind a login. Nothing in it can be crawled by a search engine or quoted by an answer engine, which means the product's own record of what it ships, the one page that proves the thing is alive and improving, was invisible to every acquisition channel this site is built to serve.

So the changelog is published here, as static indexable HTML, and the portal links out to it. The product keeps the *cards* in Settings > Releases because a signed-in user still wants to know what changed; clicking one opens this site in a new tab. There is deliberately no second copy of the release body inside the portal: a copy nobody can link to is the one that rots.

### 31.2 Routes added

| Route | Output | Purpose |
|---|---|---|
| `/releases/` | static | Changelog index. Newest release featured with its image, the rest in a grid. |
| `/releases/<id>/` | static, one per release via `generateStaticParams` | One release. Title, version, type, date, featured image, full body, prev/next, one CTA band. |

Both are composed the way §19 requires: `Nav`, `main`, `Footer`, and no `"use client"` at the route level.

### 31.3 PRODUCTION DATA, ALWAYS

The portal also runs a beta deployment. Its release table is a **different and shorter list**: 3 rows against production's 10 at the time of writing, with ids that happen to overlap today and need not tomorrow.

**Ruling:** this site reads `https://api.rasid.ai/api` and nothing else. `NEXT_PUBLIC_RELEASES_API` exists only so a staging build of *this site* can be pointed elsewhere; it is not a beta switch. A public changelog built from beta rows would announce features nobody outside the company can reach, which is the same class of error as §1.1 and §1.4: shipping a claim the product cannot honour.

### 31.4 The data is snapshotted at build time, not fetched in the pages

`scripts/fetch-releases.mjs` runs in `prebuild`, reads the API once, and writes `lib/content/releases.generated.json`. `lib/releases.ts` is the only reader. The file is gitignored, regenerated on every build, and its contents are printed to the build log.

This is not a preference. Two constraints rule out the obvious alternatives:

1. **An uncacheable fetch fails the build.** `output: 'export'` requires every `fetch` to be cacheable. `app/sitemap.ts` is `force-static` and needs the release list, so `cache: 'no-store'` there ends the export with `Route /sitemap.xml with dynamic = "error" couldn't be rendered statically`. Verified by hitting it.
2. **The cacheable default would serve a stale changelog.** `force-cache` writes into `.next/cache/fetch-cache` with no expiry, and the Netlify Next plugin restores `.next/cache` between deploys. A rebuild could then regenerate the changelog from a cached copy of the API and nobody would notice. For a changelog that is the entire bug.

A plain Node fetch in `prebuild` has no framework caching at all, so it sidesteps both and makes the build deterministic and inspectable.

### 31.5 The list endpoint is a summary. Hydrate every release.

`GET /releases/` returns `id, version, title, summary, release_type, is_featured, release_date, featured_image`.

It does **not** return `content`, `created_at` or `updated_at`.

Building the snapshot from the list alone therefore exports ten release pages with empty bodies, and leaves the sitemap with no real `lastModified`. The script reads the list for the set of ids, then fetches `GET /releases/<id>/` for each one. It throws if any release comes back without `content`, because a release page with an empty body gets indexed as thin content, and that is worse than a failed build.

### 31.6 URLs are keyed by the API numeric id

**Decision, taken by the product owner:** `/releases/10/`, not `/releases/5-0-0/`.

The known limitation, recorded here so nobody rediscovers it as a bug: **release ids are assigned per database.** This site generates its pages from production ids. A portal deployment whose release table has diverged from production links correctly only while the two agree. Specifically, a release that exists on beta and not on production has no page here, and its Settings card will 404.

The alternative considered and rejected was keying on `version`, which is stable across environments. If the two release tables ever diverge in practice, that is the fix to reach for.

### 31.7 SEO and GEO surface

Per release page:

- `<title>` is `<Title> (v<Version>) | GoPilot`, inheriting the §18 template. The title alone is not self-describing: "Workspace" means nothing in a tab or a result row, so the version carries it.
- `description` is the release's own `summary`. No hand-written duplicates to drift.
- `canonical` carries the trailing slash, per `trailingSlash: true`. Without it the canonical points at a 308.
- OpenGraph `type: article` with `publishedTime`, `modifiedTime` and the release `featured_image`. That image is an absolute URL on the API host; `metadataBase` only rewrites relative paths, so it passes through as is.
- Two JSON-LD blocks: `TechArticle` (not `BlogPosting`, these are versioned product docs) whose `about` points at the `SoftwareApplication` node §20 already declares and whose `isPartOf` points at the collection, plus a `BreadcrumbList`. Serialized with the same `<` escaping as §20, for the same reason.

The index carries a `CollectionPage` with an `ItemList` in descending order, so an answer engine can read the whole set in order without executing anything.

`app/sitemap.ts` became `async` and appends one entry per release, using each release's own `updated_at` as `lastModified` rather than the shared `BUILD_TIME` the static routes use: for these the real modification date is known, and it is the signal that tells a crawler which notes changed.

`components/Footer.tsx` gained a `Release notes` link under Product. Without an in-site link the changelog is an orphan that depends entirely on the sitemap to be found, and orphaned pages are discounted. That edit also required a one-line fix to `isSameBrand()`, which threw on a bare path and so treated a link to this very site as external and opened it in a new tab.

### 31.8 A new release does not appear until this site rebuilds

This follows directly from §31.4 and is the one operational fact to hold on to. Publishing a release in the RASID admin and deploying this site are two separate acts. The backend is frozen and cannot call a build hook, so the trigger is owned by the team, not by this repository. The options, for whoever wires it:

- a Netlify build hook fired when a release is published, for same-day publication;
- a Netlify scheduled build, so a release goes public within the period with nothing to remember;
- both, which is the only combination with no silent lag.

Until one exists, `/releases/` shows whatever was true at the last deploy.

### 31.9 Verification performed

- `npx tsc --noEmit` clean. `npm run build` exports 17 pages, including `/releases` and ten `/releases/[id]`.
- `out/releases/10/index.html` contains the real `<title>`, `description`, `canonical`, four `og:*` tags, and `TechArticle` plus `BreadcrumbList` JSON-LD, with the release body present in the static HTML. Checked by reading the exported file, not by trusting the framework.
- `out/sitemap.xml` lists 12 URLs: `/`, `/releases/`, and ten release pages, every one with a trailing slash.
- The index was rendered from the exported `out/` directory and reviewed.

### 31.10 The nav gains a fifth item, and the shared chrome stops assuming it is on the home page

**Nav item.** `NAV_LINKS` in `lib/content/nav.ts` gains `{ label: 'Releases', href: '/releases/' }`, after `Pricing`. §4 specified a four-item row and §1.19 refused a fifth, but the reason it gave was that `Docs` had no verified URL and would be a dead link. This fifth item is a real, generated page, so the reason does not apply. Still no mega-menu and no dropdowns. Both the desktop row and the mobile sheet read the same list, so they cannot drift.

**Every section target in the shared chrome is now root-relative.** `Nav`, `NavMobile` and `Footer` render on `/releases/` and `/releases/<id>/` as well as the home page. A bare `#pricing` on those pages points at an element that does not exist, so the link silently does nothing: the exported release page carried **twelve** such dead anchors before this fix. All of them are now `/#id`, which navigates home and scrolls from a sub-page and is still treated as a same-document fragment on the home page itself.

Affected: the four `NAV_LINKS` section targets, the `Nav` logo, and the footer's `GoPilot` and `Pricing` entries.

**Internal links go through `next/link`.** Once those hrefs became `/...`, Next's `no-html-link-for-pages` rule fails the build on a plain `<a>`. `Nav`, `NavMobile` and `Footer` now use `Link` for them. Note the footer's test is `href.startsWith('/')`, **not** `isSameBrand()`: that helper is also true for `rasid.ai`, which is a separate origin and must stay a plain anchor with `target="_blank"`.

**The skip link in §18 now targets `#main`.** It pointed at `#hero`, which exists only on the home page, so on a release page the first thing a keyboard user tabs to did nothing. Every page's `<main>` now carries `id="main"`. This was introduced by §31.2 adding pages that reuse the layout, and it is the kind of regression that no visual check catches.

### 31.11 Not done here

- No per-release OG image beyond the API `featured_image`. A release without one falls back to the site default from §18.
- No pagination on `/releases/`. Ten releases is one page; past roughly forty this needs revisiting.
- No RSS or Atom feed. Worth adding if the changelog becomes a subscribe-able surface.
