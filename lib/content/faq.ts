/**
 * The six FAQ pairs.
 *
 * This module is the SINGLE source for two consumers:
 *   1. `components/Faq.tsx` — six native `<details>` elements, with the answer
 *      text present in the static DOM whether open or closed.
 *   2. `components/JsonLd.tsx` — the `mainEntity` array on the `FAQPage` block.
 *
 * They must match CHARACTER FOR CHARACTER, which is why neither consumer may
 * retype a string. FAQPage markup whose text is not visible on the page is a
 * structured-data spam violation, so the two cannot be allowed to drift.
 *
 * Note for anyone reformatting this file: keep the plain ASCII apostrophe in
 * "RASID's". The same string is serialised into JSON-LD, and swapping in a
 * typographic quote changes the bytes a crawler compares against the rendered
 * DOM.
 *
 * Google removed FAQ rich results for non-government, non-health sites in
 * August 2023, so this markup will not produce accordion SERP snippets. It
 * ships because it costs about 2 KB and because these are the exact strings
 * ChatGPT, Perplexity and Google AI Overviews lift when asked about GoPilot.
 */

export type FaqItem = {
  q: string
  a: string
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    q: 'What is GoPilot?',
    a: "GoPilot is RASID's AI geospatial agent. You describe the analysis you want in plain language, and GoPilot interprets the request, plans the workflow, retrieves the relevant imagery and Earth observation data, selects and runs the appropriate AI models and geospatial operations such as segmentation, detection and change analysis, then returns the results as downloadable raster and vector layers alongside the numbers that matter. One platform, 10,000+ datasets, hundreds of AI models, one natural-language interface.",
  },
  {
    q: 'Is GoPilot real GIS, or an AI chat wrapper on a basemap?',
    a: 'Real GIS. The map is a live Mapbox canvas, not a picture, and the agent adds and removes layers on it while it works. The operations it calls are the ones you would run by hand: catalogue search across Sentinel-2 and Landsat, cloud and shadow masking, spectral indices, segmentation, change detection, geodesic area columns, spatial joins. Every output is a georeferenced file with a CRS, not a screenshot. What GoPilot removes is the catalogue hunting, the reprojection and the parameter fiddling in front of the analysis, not the analysis itself.',
  },
  {
    q: 'How is this different from just using QGIS or ArcGIS Pro?',
    a: 'It is not better than them. Desktop GIS is more powerful and more precise, and GoPilot exports into it on purpose. The difference is everything in front of the analysis: finding a clear scene, masking cloud, aligning projections, writing the same index expression again. GoPilot does that part while you watch and hands you the layer. There is a GoPilot plugin for QGIS and an add-in for ArcGIS Pro, so results come back into the tool you already work in.',
  },
  {
    q: 'What happens when GoPilot gets the analysis wrong?',
    a: 'You see it before it finishes. The reasoning panel and the tool list stream while the run is in progress, each tool marked in progress, succeeded or failed, so a wrong collection or a failed step is visible as it happens rather than after you have shipped the map. GoPilot also tells you when it cannot do something: when a tool it needs does not exist in its toolchain it says so in the answer instead of improvising. And because every result is a standard georeferenced file, you can open it in QGIS or ArcGIS Pro and check the numbers against your own data.',
  },
  {
    q: 'Can I use GoPilot inside QGIS or ArcGIS Pro?',
    a: 'Yes. The GoPilot plugin is published on the official QGIS plugin repository: open Plugins, Manage and Install Plugins, and search for GoPilot. For ArcGIS Pro, download the add-in and a RASID tab appears on the ribbon. Both authenticate with an API key you create yourself in Settings, Developer, API Keys. On the published plans the QGIS plugin is included from Pro at EUR 149 per month and the ArcGIS Pro add-in from Business at EUR 499 per month.',
  },
  {
    q: 'Is GoPilot free, and what is a token?',
    a: "Yes, there is a free plan: EUR 0 per month with 500 tokens, basic datasets and models, raster and vector export, session history and 1 GB of storage, and no credit card. Tokens pay for GoPilot's work. A turn costs what it costs, so a long analysis over large rasters uses more than a one-line question, and unused tokens expire when the period resets rather than rolling over. Tokens are used across GoPilot, GoBox, and RASID's MCP / API services. The paid plans are Pro at EUR 149 per month with 5,000 tokens, Business at EUR 499 per month with 25,000 tokens, and Enterprise with custom pricing.",
  },
]
