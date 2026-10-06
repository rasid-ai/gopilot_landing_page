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
