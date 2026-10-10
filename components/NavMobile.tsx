'use client'

import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/content/nav'
import { SITE } from '@/lib/content/site'

/** Tabbable descendants, in DOM order, excluding anything `inert` hides. */
const FOCUSABLE = 'a[href], button:not([disabled])'

export default function NavMobile() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // Move focus into the panel on open and hand it back to the trigger on close.
  // The trigger is the element the user acted on, so it is the only correct
  // return target; letting focus fall to <body> would reset tab position to the
  // top of the document.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    } else if (wasOpen.current) {
      wasOpen.current = false
      triggerRef.current?.focus()
    }
  }, [open])

  // Escape closes, and Tab cycles inside the panel. Bound on the document
  // rather than the panel so Escape still works if focus has drifted.
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      // Wrap at both ends, and pull focus back in if it has escaped the panel.
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // The sheet is a fixed overlay, so the page behind it must not scroll.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        title={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="nav-sheet"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Kept mounted so the scrim fade and panel slide actually transition.
          `inert` is what makes that safe: while closed, the sheet's links are
          out of the tab order and out of the accessibility tree. */}
      <div
        id="nav-sheet"
        inert={!open}
        className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`}
      >
        <div
          onClick={close}
          className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal={open ? true : undefined}
          aria-label="Main menu"
          className={`absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col gap-1 bg-white p-5 shadow-2xl transition-transform duration-200 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-lg px-2 py-2.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-dark"
            >
              {link.label}
            </Link>
          ))}

          <div className="my-3 border-t border-slate-200" />

          {/* One call to action here too, matching the desktop header: a sheet
              that offers "Sign in" and "Sign up" side by side asks a first-time
              visitor to self-classify before they know what the product does.
              Returning users get the footer's Sign in link. */}
          <a
            href={SITE.ctaPrimaryHref}
            onClick={close}
            className="btn btn-primary w-full justify-center"
          >
            <span className="whitespace-nowrap">{SITE.ctaPrimaryLabel}</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </>
  )
}
