'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

/**
 * Scroll reveal (§3.1). One of only three client components on the page.
 *
 * `.reveal` is `opacity-0` in globals.css and `.reveal[data-revealed='true']`
 * runs `animate-fade-up`. Three non-obvious decisions shape this file:
 *
 * 1. **The hidden state never ships in the HTML.** The `reveal` class is added
 *    on the client, after hydration. A crawler that does not execute JS, or a
 *    browser with JS switched off, receives fully visible content. Content that
 *    is invisible in the served markup is an SEO and accessibility failure, and
 *    it is not worth a fade.
 * 2. **It is added in a layout effect, not an effect.** A passive `useEffect`
 *    runs after paint, so the browser would show the content, then hide it, then
 *    fade it back in. A layout effect commits before that first paint.
 * 3. **`prefers-reduced-motion` short-circuits the whole thing.** globals.css
 *    already neutralises `.reveal` under the media query, but skipping the class
 *    and the observer entirely means no wasted main-thread work either.
 */

/* `useLayoutEffect` warns when React renders on the server, and this page is
   statically exported, so every component prerenders at build time. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

type RevealProps = {
  children: ReactNode
  /** Wrapper element. Defaults to `div`; use `li`/`ul` where a div would be invalid HTML. */
  as?: ElementType
  className?: string
}

export default function Reveal({ children, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  // `armed` attaches `.reveal` (the hidden state); `revealed` plays the fade.
  const [armed, setArmed] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setArmed(true)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          // A section taller than the viewport can never reach a 0.15 ratio, and
          // a reveal that never fires leaves the section permanently at
          // opacity 0. For those, any intersection counts.
          const tallerThanViewport = entry.boundingClientRect.height > window.innerHeight * 0.85
          if (entry.intersectionRatio < 0.15 && !tallerThanViewport) continue

          setRevealed(true)
          observer.disconnect() // Fires once. It never re-animates on scroll-up.
          return
        }
      },
      // threshold 0 is listed as well so the tall-section branch above gets an
      // entry at all; 0.15 is the spec's trigger point.
      { threshold: [0, 0.15] },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={[armed ? 'reveal' : null, className].filter(Boolean).join(' ') || undefined}
      data-revealed={revealed ? 'true' : undefined}
    >
      {children}
    </Tag>
  )
}
