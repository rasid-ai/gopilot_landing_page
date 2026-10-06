'use client'

/* ---------------------------------------------------------------------------
 * components/demo/GoPilotDemo.tsx
 *
 * The only client component in the demo tree, and the only client island above
 * the fold. Everything it renders is a plain presentational function.
 *
 * It replays ONE real GoPilot session as DOM rather than video: crisp at any
 * resolution, selectable, indexable as text, accessible, and roughly a hundred
 * times lighter than a screen recording. Four turns, run once, ~25s.
 *
 * Two DOM layers, one for eyes and one for assistive technology. The animated
 * transcript is aria-hidden (a screen reader must never be fed a half-typed
 * sentence, and aria-live on typing text produces a torrent of partial
 * announcements); beside it the COMPLETE transcript renders sr-only and fully
 * in the accessibility tree, plus one small, low-frequency live region.
 *
 * The reducer initialises at {k:'done'} on purpose. That makes the server-
 * rendered markup the animation's END, so the demo is complete and usable with
 * JavaScript off and before hydration; a client layout effect then rewinds it
 * to idle if motion is allowed, before the browser paints.
 * ------------------------------------------------------------------------- */

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { FastForward, RotateCcw } from 'lucide-react'
import DemoMap from './DemoMap'
import DemoTranscript, {
  type ComposerState,
  type LiveTurn,
  type TurnStage,
} from './DemoTranscript'
import { useTimer, useTypewriter } from './useTypewriter'
import {
  ANSWER_STREAMS,
  ARTIFACT_MS,
  BEAT_MS,
  DEMO_TURNS,
  PHRASE_MS,
  PROMPT_CPS,
  PROSE_CPS,
  REASON_CPS,
  SENDING_MS,
  SETTLE_MS,
  STICK_THRESHOLD,
  THINKING_MS,
  THINKING_PHRASES,
  TOOL_ROW_MS,
  TOTAL_TURNS,
  type DemoBlock,
  type MapStep,
} from './demoScript'

const ALL = Number.POSITIVE_INFINITY

/* ------------------------------------------------------------- the phase --- */

type Phase =
  | { k: 'idle' }
  | { k: 'typing-prompt'; turn: number }
  | { k: 'sending'; turn: number }
  | { k: 'thinking'; turn: number }
  | { k: 'reasoning'; turn: number }
  | { k: 'tools'; turn: number }
  | { k: 'answering'; turn: number }
  | { k: 'artifact'; turn: number }
  | { k: 'settle'; turn: number }
  | { k: 'beat'; turn: number }
  | { k: 'done' }

type Action =
  | { type: 'arm' }      // motion is allowed: rewind the SSR end-state to idle
  | { type: 'start' }    // first intersection
  | { type: 'advance' }
  | { type: 'skip' }
  | { type: 'restart' }

const DONE: Phase = { k: 'done' }

function reduce(p: Phase, a: Action): Phase {
  switch (a.type) {
    case 'arm':
      return p.k === 'done' ? { k: 'idle' } : p
    case 'start':
      return p.k === 'idle' ? { k: 'typing-prompt', turn: 0 } : p
    case 'skip':
      return DONE
    case 'restart':
      return { k: 'typing-prompt', turn: 0 }
    case 'advance':
      switch (p.k) {
        case 'typing-prompt':
          return { k: 'sending', turn: p.turn }
        case 'sending':
          return { k: 'thinking', turn: p.turn + 1 }
        case 'thinking':
          return { k: 'reasoning', turn: p.turn }
        case 'reasoning':
          return { k: 'tools', turn: p.turn }
        case 'tools':
          return { k: 'answering', turn: p.turn }
        case 'answering':
          return { k: 'artifact', turn: p.turn }
        case 'artifact':
          return { k: 'settle', turn: p.turn }
        case 'settle':
          return p.turn + 1 < TOTAL_TURNS ? { k: 'beat', turn: p.turn } : DONE
        case 'beat':
          return { k: 'typing-prompt', turn: p.turn + 1 }
        default:
          return p
      }
  }
}

const STAGE_OF: Partial<Record<Phase['k'], TurnStage>> = {
  thinking: 'dots',
  reasoning: 'reasoning',
  tools: 'tools',
  answering: 'answer',
  artifact: 'artifact',
  settle: 'settle',
}

/** useLayoutEffect warns during SSR; picking the hook once at module scope keeps
 *  the call order stable while still letting the client rewind before paint. */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const CONTROL_CLASS =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white p-2.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-brand hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:min-h-0 sm:px-2.5 sm:py-1'

export default function GoPilotDemo() {
  const [phase, dispatch] = useReducer(reduce, DONE)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [labels, setLabels] = useState(false)
  const [openThinking, setOpenThinking] = useState<Record<number, boolean | undefined>>({})
  const [openTools, setOpenTools] = useState<Record<number, boolean | undefined>>({})

  const figureRef = useRef<HTMLElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  /* --- what the current phase is counting ------------------------------- */

  const turnIndex = 'turn' in phase ? phase.turn : 0
  const turn = DEMO_TURNS[turnIndex]
  const token = `${phase.k}:${turnIndex}`

  const isTypingPhase =
    phase.k === 'typing-prompt' || phase.k === 'reasoning' || phase.k === 'answering'

  const typeText =
    phase.k === 'typing-prompt'
      ? (turn.text ?? '')
      : phase.k === 'reasoning'
        ? (turn.thinking ?? '')
        : phase.k === 'answering'
          ? (ANSWER_STREAMS[turn.id] ?? '')
          : ''

  const typeCps =
    phase.k === 'reasoning' ? REASON_CPS : phase.k === 'answering' ? PROSE_CPS : PROMPT_CPS

  const timerMs =
    phase.k === 'sending'
      ? SENDING_MS
      : phase.k === 'thinking'
        ? THINKING_MS
        : phase.k === 'tools'
          ? (turn.tools?.length ?? 0) * TOOL_ROW_MS
          : phase.k === 'artifact'
            ? ARTIFACT_MS
            : phase.k === 'settle'
              ? SETTLE_MS
              : phase.k === 'beat'
                ? BEAT_MS
                : 0

  const isTimerPhase = timerMs > 0

  const tw = useTypewriter(token, typeText, typeCps, isTypingPhase, paused)
  const tm = useTimer(token, timerMs, isTimerPhase, paused)

  const finished =
    (isTypingPhase && tw.chars >= typeText.length) || (isTimerPhase && tm.done)

  useEffect(() => {
    if (finished) dispatch({ type: 'advance' })
  }, [finished, token])

  /* --- environment ------------------------------------------------------ */

  useIsoLayoutEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const wideQuery = window.matchMedia('(min-width: 1024px)')

    setReduced(motionQuery.matches)
    setLabels(wideQuery.matches)

    // Ten haloed 9px hectare labels are illegible below `lg` and should not be
    // in the DOM there at all, so this is a media QUERY, not a CSS rule.
    const onWide = () => setLabels(wideQuery.matches)
    wideQuery.addEventListener('change', onWide)

    // Reduced motion keeps the SSR end-state: everything final, no typing.
    if (!motionQuery.matches) dispatch({ type: 'arm' })

    return () => wideQuery.removeEventListener('change', onWide)
  }, [])

  const isIdle = phase.k === 'idle'

  // Start on first intersection. A hero demo already half-played when the
  // visitor arrives has thrown away its own payload.
  //
  // `arm` has already rewound the server-rendered end state to blank, so from
  // here until something dispatches `start` the panel shows nothing. That makes
  // this effect load-bearing: if it never fires, the hero's most important
  // element is permanently empty. Two guards, because the rewind is not free:
  //
  //  1. A synchronous rect check. This demo sits in the hero, so for most
  //     visitors it is already on screen at mount and needs no observer at all.
  //     Measuring directly is deterministic, where waiting on an IO callback
  //     depends on a rendering lifecycle that headless browsers, screenshot
  //     services and preview crawlers do not always run.
  //  2. No IntersectionObserver at all (very old browsers) means start now
  //     rather than never.
  useEffect(() => {
    const el = figureRef.current
    if (!el || !isIdle) return

    const rect = el.getBoundingClientRect()
    const onScreen = rect.top < window.innerHeight && rect.bottom > 0
    if (onScreen || typeof IntersectionObserver === 'undefined') {
      dispatch({ type: 'start' })
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          dispatch({ type: 'start' })
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isIdle])

  // Pause while off-screen. The rAF loop keeps its clock but spends nothing.
  useEffect(() => {
    const el = figureRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => setPaused(!entries.some((e) => e.isIntersecting)),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* --- derived view state ----------------------------------------------- */

  const visible = useMemo<number>(() => {
    if (phase.k === 'idle') return 0
    if (phase.k === 'done') return TOTAL_TURNS
    if (phase.k === 'typing-prompt') return phase.turn
    return phase.turn + 1
  }, [phase])

  const stage = STAGE_OF[phase.k]
  const toolCount = turn.tools?.length ?? 0

  const live: LiveTurn | null = stage
    ? {
        index: turnIndex,
        stage,
        thinkingChars: phase.k === 'reasoning' ? tw.chars : ALL,
        toolsUpto:
          phase.k === 'reasoning'
            ? 0
            : phase.k === 'tools'
              ? Math.min(toolCount, Math.max(1, Math.ceil(tm.elapsed / TOOL_ROW_MS)))
              : toolCount,
        answerRevealed:
          phase.k === 'answering'
            ? tw.chars
            : phase.k === 'reasoning' || phase.k === 'tools'
              ? 0
              : ALL,
        // Derived from the frame clock rather than a second timer. At
        // THINKING_MS = 900 the phrase never actually reaches a rotation, which
        // is correct: the product only cycles on a genuinely slow answer.
        phrase: THINKING_PHRASES[Math.floor(tm.elapsed / PHRASE_MS) % THINKING_PHRASES.length],
        chipsActive: phase.k === 'settle' || (phase.k === 'artifact' && tm.elapsed > 120),
      }
    : null

  const composer = useMemo<ComposerState>(() => {
    if (phase.k === 'typing-prompt') {
      const typed = (DEMO_TURNS[phase.turn].text ?? '').slice(0, tw.chars)
      return {
        text: typed,
        placeholder: typed.length ? null : 'Type your prompt here...',
        caret: true,
        sending: false,
        armed: typed.length > 0,
      }
    }
    if (phase.k === 'sending') {
      return {
        text: '',
        placeholder: 'Waiting for response...',
        caret: false,
        sending: true,
        armed: true,
      }
    }
    const inFlight = stage !== undefined
    return {
      text: '',
      placeholder: inFlight ? 'Waiting for response...' : 'Type your prompt here...',
      caret: false,
      sending: false,
      armed: false,
    }
  }, [phase, tw.chars, stage])

  const mapStep = useMemo<MapStep>(() => {
    if (phase.k === 'done') return 2
    if (phase.k === 'idle') return 0
    // The map changes on the frame the artifact lands, not when the answer
    // starts, so the chip flip and the draw-on are the same beat.
    const landed = phase.k === 'artifact' || phase.k === 'settle' || phase.k === 'beat'
    const i = phase.turn
    if (i >= 3 && landed) return 2
    if (i >= 2) return 1
    if (i === 1 && landed) return 1
    return 0
  }, [phase])

  /* --- stick-to-bottom -------------------------------------------------- */

  const stickRef = useRef(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight <= STICK_THRESHOLD
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    // Follows its own growth only while the reader is still near the bottom,
    // and bails the instant they scroll up. The PAGE is never scrolled.
    if (!el || !stickRef.current) return
    el.scrollTop = el.scrollHeight
    el.querySelectorAll<HTMLElement>('[data-autoscroll]').forEach((inner) => {
      inner.scrollTop = inner.scrollHeight
    })
  }, [visible, live?.stage, live?.thinkingChars, live?.toolsUpto, live?.answerRevealed])

  /* --- the one live region ---------------------------------------------- */

  const [status, setStatus] = useState('')
  const queueRef = useRef<string[]>([])
  const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saidRef = useRef<Set<string>>(new Set())

  // Declared, not useCallback'd, so it can call itself without TypeScript
  // losing the return type. It only touches refs and a setState, both stable.
  function flushStatus() {
    const next = queueRef.current.shift()
    if (next === undefined) {
      announceTimer.current = null
      return
    }
    setStatus(next)
    announceTimer.current = setTimeout(flushStatus, 1200)
  }

  function announce(message: string) {
    if (saidRef.current.has(message)) return
    saidRef.current.add(message)
    queueRef.current.push(message)
    if (announceTimer.current === null) flushStatus()
  }

  useEffect(
    () => () => {
      if (announceTimer.current !== null) clearTimeout(announceTimer.current)
    },
    [],
  )

  useEffect(() => {
    // Six announcements, maximum, debounced to one per 1200ms. Only the first
    // exchange narrates: repeating the same four beats for turn 4 would double
    // the chatter without adding information.
    if (phase.k === 'typing-prompt' && phase.turn === 0) announce('Demo started.')
    if (phase.k === 'thinking' && phase.turn === 1) announce('GoPilot is thinking.')
    if (phase.k === 'answering' && phase.turn === 1) {
      announce(`GoPilot ran ${DEMO_TURNS[1].tools?.length ?? 0} tools.`)
    }
    if (phase.k === 'artifact' && phase.turn === 1) {
      announce('Answer complete. 324 fields delineated, 2,097.9 hectares.')
      announce('Map layer added: sakaka_fields_with_area.geojson.')
    }
    // Only if something actually played: under reduced motion the demo mounts
    // already complete, and announcing that on page load is noise.
    if (phase.k === 'done' && saidRef.current.has('Demo started.')) announce('Demo complete.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  /* --- controls --------------------------------------------------------- */

  function onReplay() {
    saidRef.current = new Set()
    queueRef.current = []
    setStatus('')
    setOpenThinking({})
    setOpenTools({})
    stickRef.current = true
    dispatch({ type: 'restart' })
  }

  const controls: ReactNode =
    phase.k === 'done' ? (
      <button type="button" onClick={onReplay} className={CONTROL_CLASS}>
        <RotateCcw className="h-3 w-3 shrink-0" aria-hidden="true" />
        {/* An explicit request overrides the motion preference: if you press
            play, you get the animation once. */}
        {reduced ? 'Play demo' : 'Replay'}
      </button>
    ) : (
      <button
        type="button"
        onClick={() => dispatch({ type: 'skip' })}
        className={CONTROL_CLASS}
      >
        <FastForward className="h-3 w-3 shrink-0" aria-hidden="true" />
        Skip to result
      </button>
    )

  /* --- render ----------------------------------------------------------- */

  return (
    <div className="relative">
      <figure ref={figureRef}>
        {/* A fully closed card: the hero now centres this inside the page
            container, so all four edges are visible and align with the nav and
            every section below. It previously carried
            `lg:rounded-r-none lg:border-r-0` to read as bleeding off the
            viewport, which only made sense while it sat in a column that ran to
            the right edge. Below `lg` the shape mirrors the product's mobile
            layout: a map with the chat sheet under it. */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-frame lg:h-[500px] xl:h-[540px]">
          <div className="flex h-full flex-col-reverse lg:flex-row">
            {/* Wider cap than before (340px): in a 1136px container the
                transcript has real room now, and the code and CSV blocks inside
                it were wrapping badly at the old width. */}
            <div className="flex h-[380px] w-full shrink-0 flex-col bg-white lg:h-full lg:w-[42%] lg:min-w-[320px] lg:max-w-[460px] lg:border-r lg:border-slate-200">
              <DemoTranscript
                visible={visible}
                live={live}
                composer={composer}
                openThinking={openThinking}
                openTools={openTools}
                // The override has to be told the state it is overriding: the
                // panel's default is `streaming`, which differs per turn, so the
                // toggle cannot infer "the opposite" from the record alone.
                onToggleThinking={(id, next) =>
                  setOpenThinking((prev) => ({ ...prev, [id]: next }))
                }
                onToggleTools={(id, next) => setOpenTools((prev) => ({ ...prev, [id]: next }))}
                scrollRef={scrollRef}
                controls={controls}
              />
            </div>

            <DemoMap
              mapStep={mapStep}
              labels={labels}
              className="h-[200px] shrink-0 lg:h-auto lg:flex-1"
            />
          </div>
        </div>

        {/* Required honesty disclosure. On a page whose entire argument is
            provenance, labelling our own assets correctly is the proof that we
            label things. Not optional, not boilerplate. */}
        <figcaption className="mt-3 text-[11px] leading-snug text-slate-500">
          Real GoPilot output. Sentinel-2 L2A scene S2A_37RFP_20260927_1_L2A, 2026-09-27, Al Jawf
          Province, Saudi Arabia. Transcript condensed; animation timing is illustrative.
        </figcaption>
      </figure>

      <SrTranscript />

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </div>
  )
}

/* --------------------------------------------------------------------------
 * The accessibility-tree copy: the COMPLETE transcript, always, never typed.
 * ----------------------------------------------------------------------- */

function stripMarkers(s: string): string {
  return s.replace(/\*\*/g, '').replace(/`/g, '')
}

function SrBlocks({ blocks }: { blocks: DemoBlock[] }) {
  // A table needs a caption. Rather than invent one, reuse the heading the
  // real answer put directly above it.
  let lastHeading = ''
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === 'h2' || b.t === 'h3') {
          lastHeading = stripMarkers(b.s)
          return <p key={i}>{lastHeading}</p>
        }
        if (b.t === 'p') return <p key={i}>{stripMarkers(b.s)}</p>
        if (b.t === 'kv') return <p key={i}>{`${stripMarkers(b.k)} ${stripMarkers(b.s)}`}</p>
        if (b.t === 'code') return <pre key={i}>{b.s}</pre>
        if (b.t === 'dl') return <p key={i}>{`Download: ${b.label}`}</p>
        const caption = lastHeading || b.headers.join(', ')
        return (
          <table key={i}>
            <caption>{caption}</caption>
            <thead>
              <tr>
                {b.headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
      })}
    </>
  )
}

function SrTranscript() {
  return (
    <div className="sr-only">
      <h3 id="demo-transcript-heading">
        Example GoPilot conversation: delineating centre-pivot fields in Al Jawf Province, Saudi
        Arabia
      </h3>
      <ol aria-labelledby="demo-transcript-heading">
        {DEMO_TURNS.map((t) => (
          <li key={t.id}>
            <span>{t.role === 'user' ? 'Analyst asked:' : 'GoPilot replied:'}</span>
            {t.text ? <p>{t.text}</p> : null}
            {t.thinking ? <p>Reasoning: {t.thinking}</p> : null}
            {t.tools ? <p>Tools used: {t.tools.map((x) => x.name).join(', ')}</p> : null}
            {t.blocks ? <SrBlocks blocks={t.blocks} /> : null}
            {t.chips?.length ? (
              <p>Result file: sakaka_fields_with_area.geojson, 275.6 KB, shown on map</p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
