/* ---------------------------------------------------------------------------
 * components/demo/DemoBlocks.tsx
 *
 * Progressive reveal of an assistant answer without a markdown parser.
 * react-markdown plus remark-gfm is ~40 KB gzipped and re-parses the whole
 * string on every typed frame; the demo's answers are a known, fixed set of
 * seven block shapes, so a switch is both smaller and faster.
 *
 * Class strings are lifted verbatim from the product's markdownComponents() so
 * a GoPilot table on this page is byte-identical to a GoPilot table in the app.
 * The mint `bg-brand-light` table header is the single strongest visual tell
 * that a table came from GoPilot.
 *
 * No dangerouslySetInnerHTML anywhere in the demo tree.
 * ------------------------------------------------------------------------- */

import type { ReactNode } from 'react'
import { ArrowDownToLine, Download } from 'lucide-react'
import { blockCost, DL_COST, TABLE_ROW_COST, type DemoBlock } from './demoScript'

/* The entire inline grammar. Bold and code, nothing else: the real answers
   contain nothing else, and a wider grammar is a wider attack surface on a
   string we are claiming is verbatim. */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`)/g

function inline(s: string): ReactNode[] {
  return s
    .split(INLINE)
    .filter((part) => part.length > 0)
    .map((part, i) => {
      if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-800">
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-brand-dark"
          >
            {part.slice(1, -1)}
          </code>
        )
      }
      return part
    })
}

/** How many whole lines of a fenced block fit in `remaining` characters.
 *  Code reveals line by line: a half-written CSV row reads as corrupt data,
 *  where a half-written sentence just reads as typing. */
function visibleLines(s: string, remaining: number): string[] {
  const lines = s.split('\n')
  if (remaining >= s.length) return lines
  const out: string[] = []
  let spent = 0
  for (const line of lines) {
    const cost = line.length + 1
    if (spent + cost > remaining) break
    spent += cost
    out.push(line)
  }
  return out
}

function Block({ b, remaining }: { b: DemoBlock; remaining: number }) {
  switch (b.t) {
    case 'p':
      return (
        <p className="mb-2 text-sm leading-relaxed text-slate-700 last:mb-0">
          {inline(b.s.slice(0, remaining))}
        </p>
      )

    /* These two are the agent's own markdown headings inside a depicted answer,
       not sections of this document. Rendered as real <h2>/<h3> they entered the
       page outline ahead of every actual section — a crawler read the page's
       first topic as "Results — Al Jawf Province", and heading-navigation
       dropped a screen-reader user into the middle of a simulated conversation.
       So: <p> with role="presentation" styling parity. Identical pixels, no
       outline pollution. The transcript stays reachable as ordinary text. */
    case 'h2':
      return (
        <p className="mt-3 mb-1.5 text-sm font-semibold text-slate-800 first:mt-0">
          {inline(b.s.slice(0, remaining))}
        </p>
      )

    case 'h3':
      return (
        <p className="mt-3 mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-800 first:mt-0">
          {/* The real answer's heading was "### ⬇️ Download". The design system
              bans emoji as iconography, so the glyph becomes a lucide icon.
              This is the only substitution made to quoted output in the build,
              and it is purely a glyph swap: the words are untouched. */}
          <ArrowDownToLine className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {inline(b.s.slice(0, remaining))}
        </p>
      )

    case 'kv': {
      const keyShown = b.k.slice(0, remaining)
      const valShown = remaining > b.k.length ? b.s.slice(0, remaining - b.k.length) : ''
      return (
        <p className="mb-1.5 text-sm leading-relaxed text-slate-700">
          <strong className="font-semibold text-slate-800">{keyShown}</strong>
          {valShown ? ' ' : null}
          {inline(valShown)}
        </p>
      )
    }

    case 'table': {
      // Nothing renders until the header row is paid for; after that the body
      // rows arrive one at a time.
      if (remaining < TABLE_ROW_COST) return null
      const shown = Math.min(b.rows.length, Math.floor(remaining / TABLE_ROW_COST) - 1)
      return (
        <div className="my-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-brand-light">
              <tr>
                {b.headers.map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-slate-200 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-brand-dark"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {b.rows.slice(0, Math.max(0, shown)).map((row, ri) => (
                // Striping keys off the row index, not off how many are
                // visible, so a row never changes colour as the next arrives.
                <tr key={ri} className="even:bg-slate-50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case 'code': {
      const lines = visibleLines(b.s, remaining)
      if (lines.length === 0) return null
      return (
        <pre
          data-lang={b.lang}
          className="my-3 overflow-x-auto rounded-xl bg-slate-800 px-4 py-3 font-mono text-[10px] leading-relaxed text-slate-100"
        >
          <code>{lines.join('\n')}</code>
        </pre>
      )
    }

    case 'dl':
      // All-or-nothing: a link whose label is half-typed invites a misclick.
      if (remaining < DL_COST) return null
      return (
        // Deliberately an <a> with no href. It is a picture of the product's
        // download link, inside an aria-hidden subtree, and public/demo/ holds
        // no .geojson to serve: an href here would be a 404, and a focusable
        // control that does nothing is worse than a picture of one. Without
        // href an <a> is neither focusable nor a link to AT, so the markup
        // stays the product's markup and claims nothing it cannot deliver.
        <a
          className="inline-flex items-center gap-1.5 text-sm text-brand transition-colors hover:text-brand-dark hover:underline"
        >
          <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {b.label}
        </a>
      )
  }
}

/**
 * `revealed` is a character budget, spent block by block in order. Pass
 * Number.POSITIVE_INFINITY for a finished turn.
 */
export default function DemoBlocks({
  blocks,
  revealed,
}: {
  blocks: DemoBlock[]
  revealed: number
}) {
  let budget = revealed
  const out: ReactNode[] = []

  for (let i = 0; i < blocks.length; i++) {
    if (budget <= 0) break
    const b = blocks[i]
    out.push(<Block key={i} b={b} remaining={budget} />)
    budget -= blockCost(b)
  }

  return <>{out}</>
}
