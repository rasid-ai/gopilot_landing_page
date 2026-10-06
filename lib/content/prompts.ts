import {
  Building2,
  Flame,
  Layers,
  Leaf,
  ScanSearch,
  Sprout,
  type LucideIcon,
} from 'lucide-react'

/**
 * The six starter prompts GoPilot ships to new users.
 *
 * Every `prompt` string was fetched live from the public
 * `GET /api/llm/prompt-suggestions/` endpoint. Not one word is invented, and no
 * run log is attached to any of them: verified output exists for exactly one of
 * the six, and that one is already running in the hero demo.
 *
 * Every `mechanism` line is assembled only from capabilities named on
 * `rasid.ai/products` (buffer in true metres with auto-UTM, spatial join,
 * open-vocabulary scene parsing, NDVI/NDWI/NBR, multi-date change detection,
 * thresholding and reclassification, Esri annual LULC at 10 m) plus the hero
 * run's own verified numbers. Nothing here is a guess.
 *
 * `icon` holds the lucide component itself, so the consumer renders
 * `<p.icon className="h-3.5 w-3.5" />` directly.
 */

export type Prompt = {
  prompt: string
  domain: string
  icon: LucideIcon
  mechanism: string
}

export const PROMPTS: readonly Prompt[] = [
  {
    prompt: 'Show me all the buildings within 2km of the Eiffel Tower',
    domain: 'Urban',
    icon: Building2,
    mechanism: 'Buffer in true metres, auto-UTM, then a spatial join against building footprints.',
  },
  {
    prompt: 'Scene parse the 500-meter proximity around Burj Khalifa',
    domain: 'Urban',
    icon: ScanSearch,
    mechanism: 'Open-vocabulary scene parsing over high-resolution optical imagery.',
  },
  {
    prompt: 'How much greener is Central Park in July than in January',
    domain: 'Vegetation',
    icon: Leaf,
    mechanism: 'Two Sentinel-2 scenes, cloud-masked, NDVI on both, differenced.',
  },
  {
    prompt: 'Apply burn scar analysis on the 2023 Maui wildfire zone',
    domain: 'Wildfire',
    icon: Flame,
    mechanism: 'NBR before and after, thresholded into a burn-severity raster.',
  },
  {
    prompt: 'Can you delineate a couple of the circular fields in the Al Jouf Province KSA',
    domain: 'Agriculture',
    icon: Sprout,
    mechanism: 'The run playing in the hero. 324 field polygons, 2,097.9 ha, one prompt.',
  },
  {
    prompt: 'Show me land cover classification for Lake Tahoe',
    domain: 'Land cover',
    icon: Layers,
    mechanism: 'Esri annual land use and land cover at 10 m, clipped to your area.',
  },
]

/**
 * The three prompts shown as hero chips: Eiffel Tower, Central Park, Maui.
 *
 * The Al Jouf prompt (index 4) is deliberately held back — it is the demo's own
 * prompt, running beside these chips, and repeating it would read as a loop.
 * Burj Khalifa (index 1) is held back because two Urban chips in a row wastes
 * the fold's only chance to show breadth.
 */
export const HERO_PROMPT_IDS = [0, 2, 3] as const
