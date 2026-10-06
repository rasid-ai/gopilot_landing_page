/* ---------------------------------------------------------------------------
 * components/demo/useTypewriter.ts
 *
 * A port of the product's own useTypewriter.ts, minus the EMA arrival-gap
 * logic: there is no network here, so there is no gap to measure. What is kept
 * is the frame budget (FRAME_MS) and the dangling-marker guard, because those
 * are what make the reveal look like the product's reveal.
 *
 * Both hooks run on one shared requestAnimationFrame driver and the demo only
 * ever has one of them active at a time, so the whole demo is a single rAF
 * loop. rAF rather than setInterval on purpose: rAF auto-suspends in a
 * background tab, which is exactly the behaviour a marketing page wants.
 * ------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from 'react'
import { FRAME_MS } from './demoScript'

const MARKERS = '*_`~'

/** Pull the cut back off up to 3 trailing markdown markers so a lone `*`
 *  never flashes. Ported verbatim from the product's useTypewriter.ts. */
export function trimDanglingMarkers(text: string, end: number): number {
  const floor = Math.max(0, end - 3)
  let i = end
  while (i > floor && MARKERS.includes(text[i - 1])) i--
  return i
}

/**
 * The shared driver. Calls `onFrame(dtMs)` at most once per FRAME_MS while
 * `active` and not `paused`, and cancels on unmount or deactivation. The
 * callback is held in a ref so a new closure each render does not tear down
 * and rebuild the loop: a leaked or restarted rAF on a landing page is a real
 * battery and INP cost.
 */
function useFrameLoop(active: boolean, paused: boolean, onFrame: (dtMs: number) => void) {
  const cb = useRef(onFrame)
  cb.current = onFrame

  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    if (!active) return

    let raf = 0
    let last = -1
    let acc = 0

    const step = (t: number) => {
      raf = requestAnimationFrame(step)
      if (last < 0) {
        last = t
        return
      }
      const dt = t - last
      last = t
      // While off-screen we keep the clock moving but spend nothing, so the
      // demo resumes where it stopped instead of jumping forward.
      if (pausedRef.current) return
      acc += dt
      if (acc < FRAME_MS) return
      const spend = acc
      acc = 0
      cb.current(spend)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active])
}

export type TypewriterState = { chars: number; isTyping: boolean }

/**
 * Advances a fractional character counter at `cps`, slices on whole
 * characters, and keeps the cut monotonic so the text can never un-reveal.
 *
 * `token` identifies the current phase instance. When it changes the counter
 * resets during render rather than in an effect, so the first frame of a new
 * phase already shows zero characters instead of the previous phase's tail.
 */
export function useTypewriter(
  token: string,
  text: string,
  cps: number,
  active: boolean,
  paused: boolean,
): TypewriterState {
  const [cursor, setCursor] = useState<{ token: string; chars: number }>({ token, chars: 0 })
  const exact = useRef(0)

  if (cursor.token !== token) {
    setCursor({ token, chars: 0 })
    exact.current = 0
  }
  const chars = cursor.token === token ? cursor.chars : 0

  const running = active && chars < text.length

  useFrameLoop(running, paused, (dt) => {
    exact.current = Math.min(text.length, exact.current + (cps * dt) / 1000)
    const next = Math.floor(exact.current)
    const cut = next >= text.length ? text.length : trimDanglingMarkers(text, next)
    setCursor((prev) =>
      prev.token === token && prev.chars >= cut ? prev : { token, chars: Math.max(prev.chars, cut) },
    )
  })

  return { chars, isTyping: running }
}

export type TimerState = { elapsed: number; done: boolean }

/**
 * The same driver, counting milliseconds instead of characters. Used for the
 * phases that are a pause rather than a reveal (sending, thinking, artifact,
 * settle, the beat between exchanges) and for the tool cascade, whose row
 * count is just `elapsed / TOOL_ROW_MS`.
 */
export function useTimer(token: string, totalMs: number, active: boolean, paused: boolean): TimerState {
  const [clock, setClock] = useState<{ token: string; elapsed: number }>({ token, elapsed: 0 })

  if (clock.token !== token) setClock({ token, elapsed: 0 })
  const elapsed = clock.token === token ? clock.elapsed : 0

  const running = active && elapsed < totalMs

  useFrameLoop(running, paused, (dt) => {
    setClock((prev) =>
      prev.token === token
        ? { token, elapsed: Math.min(totalMs, prev.elapsed + dt) }
        : { token, elapsed: Math.min(totalMs, dt) },
    )
  })

  return { elapsed, done: active && elapsed >= totalMs }
}
