'use client'

import type { PostHog } from 'posthog-js'
import { useEffect } from 'react'

import { CTA_ATTR, trackSignupCtaClick, type CtaLocation } from '@/lib/analytics'
import { SITE } from '@/lib/content/site'

/**
 * PostHog, scoped to one metric: the signup conversion rate. See
 * `lib/analytics.ts` for the metric's definition and the full event list.
 *
 * This is the FOURTH client component on the site, and the only one added for
 * analytics. It renders `null`, so it contributes no markup, no layout and no
 * LCP candidate — it exists purely to own a `useEffect`. Every section of the
 * page stays a server component, and the CTAs stay plain `<a href>` elements
 * that work with JavaScript disabled, exactly as before.
 *
 * It is also a no-op when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is unset: local
 * dev, a fresh clone and any preview build without the env var all run with
 * zero analytics and zero errors, rather than throwing on a missing token.
 */

// `reactStrictMode` is on, so in dev this effect runs twice. PostHog warns on
// re-init; the flag keeps the dev console honest. Module scope, not a ref,
// because the component mounts once per document.
let initialized = false

export default function Analytics() {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
    if (!token) return

    let client: PostHog | null = null
    let unmounted = false

    /**
     * ONE delegated listener for every CTA on the site, present and future.
     *
     * Capture phase, so it still sees the click if something downstream calls
     * `stopPropagation`. Modified clicks (ctrl/cmd-click into a new tab) are
     * counted on purpose — that is a conversion, just a careful one.
     *
     * Two conditions must both hold, which is what keeps the metric meaning
     * what it says:
     *   - the anchor carries `data-cta`  → it is a CTA, and names its placement
     *   - its href is the signup URL     → it is THE signup CTA
     * So "Sign in", "Try with no account", the plans page and the sales call
     * are all ignored. Tagging a non-signup link with `data-cta` cannot
     * pollute the number; the Pro/Business/Enterprise cards are tagged and
     * correctly never fire.
     */
    const onClick = (event: MouseEvent) => {
      // Not loaded yet. See the note on the dynamic import below: this costs a
      // click in the first few hundred ms after hydration, which is the price
      // of keeping 101 KB out of first-load JS.
      if (!client) return

      if (!(event.target instanceof Element)) return

      const anchor = event.target.closest<HTMLAnchorElement>(`a[${CTA_ATTR}]`)
      if (!anchor) return

      // The literal attribute, not `anchor.href`: the DOM property is resolved
      // and normalised against the document, so comparing it to the raw
      // constant is a comparison that can drift. This one cannot.
      if (anchor.getAttribute('href') !== SITE.ctaPrimaryHref) return

      const location = anchor.getAttribute(CTA_ATTR) as CtaLocation | null
      if (!location) return

      trackSignupCtaClick(client, location, SITE.ctaPrimaryHref)
    }

    // Attached before the library resolves, so the listener is never the thing
    // that is late — only the client it needs.
    document.addEventListener('click', onClick, true)

    /* DYNAMIC import, deliberately. `posthog-js` is 101 KB gzipped. Imported
       statically it joins the home page's first-load JS and roughly doubles the
       script payload of a page whose whole architecture — three client
       components, a server-rendered demo, fonts self-hosted to avoid a network
       hop — exists to keep that number small. Loaded this way it is a separate
       chunk fetched after hydration, off the critical path entirely.

       The cost is the window between hydration and this promise resolving, in
       which a click is not counted. For a visitor who has to read the page
       before deciding to sign up, that window is not a realistic moment to
       click, and buffering would not help: the click navigates to another
       origin, so a queued event would never get the chance to flush. */
    void import('posthog-js').then(({ default: posthog }) => {
      if (unmounted) return

      if (!initialized) {
        initialized = true

        posthog.init(token, {
          // EU region, matching the rasid.ai project. The fallback is not a
          // guess: pointing at the US cloud with an EU token fails every
          // request, so a missing var should land on the host that works.
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
          defaults: '2026-05-30',

          /* Everything that would collect a third kind of data is off. The ask
             was one metric, and each of these is a different product: */
          autocapture: false, // would log every click and input on the page
          capture_pageleave: false, // bounce rate / time-on-page
          enable_heatmaps: false, // click maps
          disable_session_recording: true, // rrweb replay
          capture_exceptions: false, // error tracking
          // No person profiles for anonymous visitors. The funnel counts unique
          // `distinct_id`s either way, so this costs nothing and stores less.
          person_profiles: 'identified_only',

          /* Send each event as its own request instead of waiting for the batch
             flush. The CTA click immediately unloads this page for
             app.gopilot.earth, and an event still sitting in the queue is an
             event that may never go out — which would under-report the
             numerator of the only metric here. At two events per visit the
             extra request is free. */
          request_batching: false,

          loaded: (ph) => {
            // Lets one PostHog project hold both marketing sites: filter on
            // `app` to separate this from rasid.ai, which registers
            // `app: 'landing'`. `environment` filters local noise out.
            ph.register({ app: 'gopilot_landing', environment: process.env.NODE_ENV })
            if (process.env.NODE_ENV === 'development') ph.debug()
          },
        })
      }

      client = posthog
    })

    return () => {
      unmounted = true
      document.removeEventListener('click', onClick, true)
    }
  }, [])

  return null
}
