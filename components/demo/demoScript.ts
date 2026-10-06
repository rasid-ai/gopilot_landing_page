/* ---------------------------------------------------------------------------
 * components/demo/demoScript.ts
 *
 * One real GoPilot session, transcribed. Every string below traces to a live
 * API capture in .research/:
 *
 *   user prompt 1   prompt-suggestion id 5, GET /api/llm/prompt-suggestions/
 *   user prompt 2   .research/turn2.json, the real message sent in session 1300
 *   reasoning       condensed from the real thinking_content arrays
 *   tool rows       the real deduped tool_calls_content ids (16, then 25)
 *   answer bodies   condensed from the real content fields, with every number,
 *                   scene id, filename and quoted sentence unaltered
 *
 * Quoted agent output is verbatim, INCLUDING its em dashes and its `~` and `≈`
 * characters. The brand's no-em-dash rule governs copy we write, not machine
 * output we quote: altering quoted output on a page whose entire argument is
 * auditability would be self-defeating.
 *
 * No JSX in this file. It is data plus the two pure functions that keep the
 * typewriter's character counter and the block renderer's reveal budget
 * expressed in the same units.
 * ------------------------------------------------------------------------- */

export type DemoBlock =
  | { t: 'p'; s: string }                       // s may contain **bold** and `code`
  | { t: 'h2'; s: string }
  | { t: 'h3'; s: string }
  | { t: 'kv'; k: string; s: string }           // "**AOI:** 30x30 km ..." lines
  | { t: 'table'; headers: string[]; rows: string[][] }
  | { t: 'code'; lang: 'csv'; s: string }
  | { t: 'dl'; label: string }                  // the "### Download" link item

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

/* ---------------------------------------------------------------------------
 * TIMELINE CONSTANTS
 * Lifted from the product's own streaming budget so the demo's cadence is the
 * product's cadence rather than a designer's guess.
 * ------------------------------------------------------------------------- */

export const FRAME_MS = 33     // ~30fps. The product's own choice: "smooth for text,
                               // and half the markdown re-parses of a 60fps reveal."
export const PROMPT_CPS = 55
export const REASON_CPS = 320
export const PROSE_CPS = 380
export const SENDING_MS = 260
export const THINKING_MS = 900
export const TOOL_ROW_MS = 160
export const ARTIFACT_MS = 520
export const SETTLE_MS = 700
export const BEAT_MS = 1400    // between exchanges
export const PHRASE_MS = 3000  // thinking-phrase rotation, the product's real interval

/** The transcript follows its own growth only while the reader is this close to
 *  the bottom, and bails the instant they scroll up. Ported from the product. */
export const STICK_THRESHOLD = 140

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
    // Turn 4 carries NO file chip on purpose: the real answer re-presented the
    // same file (id 3671, identical name and byte count) rather than producing a
    // new artefact, so a second chip would imply a second deliverable. The `dl`
    // block stays because it is literally what the answer contained.
    chips: [],
  },
]

/* ---------------------------------------------------------------------------
 * REVEAL BUDGET
 * DemoBlocks spends a character budget block by block. The typewriter walks a
 * string. These two functions keep both expressed in the same units so the
 * caret can never run ahead of, or lag behind, the blocks it is revealing.
 * ------------------------------------------------------------------------- */

/** A table row and the "Download" link are not text, so they cost a flat
 *  budget rather than a character count. */
export const TABLE_ROW_COST = 40
export const DL_COST = 120

export function blockCost(b: DemoBlock): number {
  switch (b.t) {
    case 'kv':
      return b.k.length + b.s.length
    case 'table':
      // +1 for the header row, which must be paid before any body row appears.
      return TABLE_ROW_COST * (b.rows.length + 1)
    case 'dl':
      return DL_COST
    default:
      return b.s.length
  }
}

/** The character stream the typewriter types for one assistant answer.
 *  Prose blocks contribute their real characters, so the dangling-marker guard
 *  in useTypewriter has real `*` and `` ` `` markers to look at; table and link
 *  blocks contribute blank padding of exactly their reveal cost. */
export function streamText(blocks: DemoBlock[]): string {
  return blocks
    .map((b) => {
      if (b.t === 'kv') return b.k + b.s
      if (b.t === 'table' || b.t === 'dl') return ' '.repeat(blockCost(b))
      return b.s
    })
    .join('')
}

/** Precomputed per turn id, so the typewriter's reset key is a stable string
 *  identity rather than a value recreated on every render. */
export const ANSWER_STREAMS: Record<number, string> = Object.fromEntries(
  DEMO_TURNS.filter((t) => t.blocks).map((t) => [t.id, streamText(t.blocks as DemoBlock[])]),
)

export const TOTAL_TURNS = DEMO_TURNS.length
