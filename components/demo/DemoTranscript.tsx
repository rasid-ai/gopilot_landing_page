/* ---------------------------------------------------------------------------
 * components/demo/DemoTranscript.tsx
 *
 * The chat half of the demo: panel header, turn list, message header
 * (reasoning + tools), result chips, composer.
 *
 * There are NO avatars, no "GoPilot" name label and no icon badge, because the
 * real ChatMessage.tsx renders none. A robot avatar would instantly make this
 * look like a different product. Assistant turns are full-width unbubbled
 * prose; user turns are a right-aligned pill, and the asymmetric `rounded-br-sm`
 * on a `rounded-2xl` bubble is the signature.
 *
 * Presentational only. Every piece of state is computed by GoPilotDemo and
 * handed down, so this file holds no hooks and no timers.
 * ------------------------------------------------------------------------- */

import type { ReactNode, RefObject } from 'react'
import {
  Brain,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  Loader2,
  Send,
  Upload,
  Wrench,
} from 'lucide-react'
import DemoBlocks from './DemoBlocks'
import { DEMO_TURNS, type DemoTurn } from './demoScript'

/** Where the live assistant turn is in its own lifecycle. `dots` is the
 *  pre-reasoning placeholder; `settle` is the resting state the product lands
 *  in when a turn completes and both panels collapse. */
export type TurnStage = 'dots' | 'reasoning' | 'tools' | 'answer' | 'artifact' | 'settle'

export type LiveTurn = {
  index: number
  stage: TurnStage
  thinkingChars: number
  toolsUpto: number
  answerRevealed: number
  phrase: string
  /** The 300ms mint -> brand flip on the file chip. Fires one frame after the
   *  chip mounts so the transition has somewhere to travel from. */
  chipsActive: boolean
}

export type ComposerState = {
  /** The prompt typed so far. Empty while idle or waiting. */
  text: string
  /** Non-null replaces the text with muted placeholder copy. */
  placeholder: string | null
  caret: boolean
  sending: boolean
  /** Send button at full strength: the product enables it the moment the
   *  textarea is non-empty. */
  armed: boolean
}

type Toggles = Record<number, boolean | undefined>

type Props = {
  /** How many turns are in the transcript. */
  visible: number
  live: LiveTurn | null
  composer: ComposerState
  openThinking: Toggles
  openTools: Toggles
  onToggleThinking: (id: number, next: boolean) => void
  onToggleTools: (id: number, next: boolean) => void
  scrollRef: RefObject<HTMLDivElement | null>
  /** Replay / Skip. Rendered in the panel header so they are the first
   *  focusable elements in the whole demo. */
  controls: ReactNode
}

const ALL = Number.POSITIVE_INFINITY

export default function DemoTranscript({
  visible,
  live,
  composer,
  openThinking,
  openTools,
  onToggleThinking,
  onToggleTools,
  scrollRef,
  controls,
}: Props) {
  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2.5">
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
          Try GoPilot
        </h3>
        {controls}
      </div>

      {/* aria-hidden: a screen reader must never be fed a half-typed sentence.
          The complete transcript renders in a parallel sr-only tree in
          GoPilotDemo, which is the copy assistive technology actually reads. */}
      <div
        ref={scrollRef}
        aria-hidden="true"
        className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-slate-50/60"
      >
        {DEMO_TURNS.slice(0, visible).map((turn, i) => (
          <div key={turn.id} className="px-4 py-3">
            <div className="mx-auto max-w-panel">
              {turn.role === 'user' ? (
                <UserTurn turn={turn} />
              ) : (
                <AssistantTurn
                  turn={turn}
                  live={live && live.index === i ? live : null}
                  thinkingOverride={openThinking[turn.id]}
                  toolsOverride={openTools[turn.id]}
                  onToggleThinking={onToggleThinking}
                  onToggleTools={onToggleTools}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <Composer {...composer} />
    </>
  )
}

/* ------------------------------------------------------------------ user --- */

function UserTurn({ turn }: { turn: DemoTurn }) {
  return (
    <div className="bubble-in flex flex-col items-end gap-1">
      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-light px-4 py-2.5 text-slate-800">
        {/* Never markdown-rendered: what the analyst typed is what shows. */}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{turn.text}</p>
      </div>
      <span className="mr-1 text-[10px] text-slate-400">{turn.time}</span>
    </div>
  )
}

/* ------------------------------------------------------------- assistant --- */

function AssistantTurn({
  turn,
  live,
  thinkingOverride,
  toolsOverride,
  onToggleThinking,
  onToggleTools,
}: {
  turn: DemoTurn
  live: LiveTurn | null
  thinkingOverride: boolean | undefined
  toolsOverride: boolean | undefined
  onToggleThinking: (id: number, next: boolean) => void
  onToggleTools: (id: number, next: boolean) => void
}) {
  const stage: TurnStage = live ? live.stage : 'settle'

  if (stage === 'dots') {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:300ms]" />
        </span>
        <span className="text-xs italic text-slate-500">{live?.phrase}</span>
      </div>
    )
  }

  const streaming = stage !== 'settle'
  const thinkingChars = live ? live.thinkingChars : ALL
  const toolsUpto = live ? live.toolsUpto : (turn.tools?.length ?? 0)
  const answerRevealed = live ? live.answerRevealed : ALL
  const chipsShown = !live || stage === 'artifact' || stage === 'settle'
  const chipsActive = !live || live.chipsActive

  // The product's rule, verbatim: `open = manualOpen ?? !!streaming`.
  const thinkingOpen = thinkingOverride ?? streaming
  const toolsOpen = toolsOverride ?? streaming

  return (
    <div className="flex flex-col gap-1">
      {turn.thinking && turn.tools ? (
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ThinkingPanel
            id={turn.id}
            text={turn.thinking}
            chars={thinkingChars}
            open={thinkingOpen}
            streaming={stage === 'reasoning'}
            onToggle={onToggleThinking}
          />
          <ToolsPanel
            id={turn.id}
            tools={turn.tools}
            upto={toolsUpto}
            running={stage === 'tools'}
            open={toolsOpen}
            onToggle={onToggleTools}
          />
        </div>
      ) : null}

      {turn.blocks && answerRevealed > 0 ? (
        <div
          className={`space-y-3 break-words text-sm leading-relaxed text-slate-700${
            stage === 'answer' ? ' streaming-caret' : ''
          }`}
        >
          <DemoBlocks blocks={turn.blocks} revealed={answerRevealed} />
        </div>
      ) : null}

      {chipsShown && turn.chips?.length
        ? turn.chips.map((chip) => (
            <div key={chip.name} className="chip-in mt-2 flex flex-wrap items-center gap-2">
              <MapFileChip name={chip.name} active={chipsActive} />
              <span className="text-[11px] text-slate-500">{chip.size}</span>
            </div>
          ))
        : null}

      <span className="mt-1 text-[10px] text-slate-400">{turn.time}</span>
    </div>
  )
}

/* ----------------------------------------------------------- the panels --- */

function ThinkingPanel({
  id,
  text,
  chars,
  open,
  streaming,
  onToggle,
}: {
  id: number
  text: string
  chars: number
  open: boolean
  streaming: boolean
  onToggle: (id: number, next: boolean) => void
}) {
  const bodyId = `demo-reasoning-${id}`

  if (!open) {
    return (
      <div className="min-w-0">
        <button
          type="button"
          // tabIndex -1: this lives inside an aria-hidden subtree, so it must
          // not be a keyboard stop. It stays a real button so a mouse or touch
          // reader can still open the reasoning they just watched stream.
          tabIndex={-1}
          aria-expanded={false}
          aria-controls={bodyId}
          onClick={() => onToggle(id, true)}
          className="flex items-center gap-1 text-[11px] text-brand-highlight transition-colors hover:text-brand-dark"
        >
          <ChevronDown className="h-3 w-3 transition-transform" aria-hidden="true" />
          Show reasoning
        </button>
      </div>
    )
  }

  return (
    <div className="thinking-panel">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Brain className="h-3.5 w-3.5 shrink-0 text-brand-highlight" aria-hidden="true" />
        <span className="thinking-label">Thinking</span>
        {streaming ? (
          <span className="flex items-center gap-0.5" aria-hidden="true">
            <span className="h-1 w-1 animate-bounce rounded-full bg-brand-highlight [animation-delay:0ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-brand-highlight [animation-delay:150ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-brand-highlight [animation-delay:300ms]" />
          </span>
        ) : null}
        <button
          type="button"
          tabIndex={-1}
          aria-expanded={true}
          aria-controls={bodyId}
          onClick={() => onToggle(id, false)}
          className="ml-auto flex items-center gap-1 text-[11px] text-brand-highlight transition-colors hover:text-brand-dark"
        >
          <ChevronDown className="h-3 w-3 rotate-180 transition-transform" aria-hidden="true" />
          Hide reasoning
        </button>
      </div>
      <div id={bodyId} data-autoscroll="" className="thinking-body">
        {chars === ALL ? text : text.slice(0, chars)}
        {streaming ? <span className="streaming-caret-inline" /> : null}
      </div>
    </div>
  )
}

function ToolsPanel({
  id,
  tools,
  upto,
  running,
  open,
  onToggle,
}: {
  id: number
  tools: { id: number; name: string }[]
  upto: number
  running: boolean
  open: boolean
  onToggle: (id: number, next: boolean) => void
}) {
  const listId = `demo-tools-${id}`
  const shown = tools.slice(0, Math.max(0, Math.min(tools.length, upto)))

  return (
    <div className="tools-panel">
      <div className="flex items-center gap-1.5">
        <Wrench className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
        <span className="flex-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          Tools
        </span>
        <button
          type="button"
          tabIndex={-1}
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => onToggle(id, !open)}
          className="flex items-center gap-1 text-[11px] text-slate-400 transition-colors hover:text-brand-dark"
        >
          <ChevronDown
            className={`h-3 w-3 transition-transform${open ? ' rotate-180' : ''}`}
            aria-hidden="true"
          />
          <span className="sr-only">{open ? 'Hide tool calls' : 'Show tool calls'}</span>
        </button>
      </div>

      {open ? (
        <ul
          id={listId}
          data-autoscroll=""
          className="custom-scrollbar mt-1.5 max-h-[132px] space-y-1 overflow-y-auto"
        >
          {shown.map((tool, i) => {
            const isNewest = running && i === shown.length - 1
            return (
              <li
                key={tool.id}
                className="flex items-center gap-1.5 truncate text-[11px] text-slate-600"
              >
                {isNewest ? (
                  <Loader2 className="h-3 w-3 shrink-0 animate-spin text-slate-400" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-state-success" aria-hidden="true" />
                )}
                <span className="truncate font-mono">{tool.name}</span>
                {/* The status icon must never be the only signal. */}
                <span className="sr-only">{isNewest ? 'running' : 'completed'}</span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------- the chip --- */

/** The product's MapFileChip split control. These are <span>s, not <button>s:
 *  a focusable control that does nothing is worse than a picture of one. */
function MapFileChip({ name, active }: { name: string; active: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      <span
        className={`inline-flex items-center gap-1 rounded-l-lg px-3 py-1.5 text-xs font-medium shadow-sm transition-colors duration-300 ${
          active ? 'bg-brand text-white' : 'bg-brand-light text-brand-dark'
        }`}
      >
        {/* The Eye appearing and the map starting to draw are the same frame.
            That synchronised state change is the most product-true micro-moment
            available here, so it is deliberately not staggered. */}
        {active ? <Eye className="chip-eye h-3 w-3 shrink-0" aria-hidden="true" /> : null}
        {name}
      </span>
      <span
        className={`rounded-r-lg px-2 py-1.5 shadow-sm transition-colors duration-300 ${
          active ? 'bg-brand text-white' : 'bg-brand-light text-brand-dark'
        }`}
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </div>
  )
}

/* ------------------------------------------------------------ composer --- */

function Composer({ text, placeholder, caret, sending, armed }: ComposerState) {
  return (
    <div aria-hidden="true" className="border-t border-slate-200 bg-white px-3 py-2.5">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
        <span className="rounded-lg p-1.5 text-slate-400">
          <Upload className="h-4 w-4" aria-hidden="true" />
        </span>
        <span
          className={`min-w-0 flex-1 truncate py-1 text-sm leading-5 ${
            placeholder ? 'text-slate-400' : 'text-slate-800'
          }`}
        >
          {placeholder ?? text}
          {caret ? <span className="streaming-caret-inline" /> : null}
        </span>
        <span
          className={`shrink-0 rounded-full bg-brand p-2 text-white transition-opacity duration-200 ${
            armed ? '' : 'opacity-30'
          }`}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
      </div>
    </div>
  )
}
