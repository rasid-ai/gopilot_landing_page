import { Check } from 'lucide-react'

import Reveal from '@/components/Reveal'
import {
  DATASET_CHIPS,
  DATASET_CHIP_HREF,
  MODEL_ROWS,
} from '@/lib/content/datasets'

/**
 * §9 Data and models. Server component.
 *
 * The chip and model inventories are the complete verified set (§1.5): eleven
 * chips and nine models, in the live site's own order. Nothing is added here,
 * which is why both lists are read from `lib/content/datasets.ts` rather than
 * typed inline.
 *
 * `10,000+ datasets` in the H2 is a link because §1.6 has no `/datasets` page
 * to point at: the claim lands in the real product inventory instead of sitting
 * there as an unverifiable count. The underline is on the numeral only so the
 * heading keeps its `text-slate-900` weight.
 */
export default function DataAndModels() {
  return (
    <section id="datasets" aria-labelledby="datasets-heading" className="section bg-white">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow">Coverage</p>
          <h2
            id="datasets-heading"
            className="mt-3 font-display text-display-sm font-bold text-slate-900 md:text-display-md"
          >
            One interface over{' '}
            <a
              href={DATASET_CHIP_HREF}
              className="underline decoration-brand/40 decoration-2 underline-offset-4 transition-colors hover:decoration-brand"
            >
              10,000+ datasets
            </a>
            .
          </h2>
          <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-slate-600">
            GoPilot searches, filters and fuses Earth observation archives so you never open another
            catalogue UI. Data sources include Sentinel-2 optical imagery, high-resolution optical
            imagery, DEM elevation, ERA5 climate reanalysis, and foundation-model embeddings such as
            Clay and AlphaEarth.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)] lg:gap-12">
            <div>
              <p className="eyebrow">Datasets and providers</p>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {DATASET_CHIPS.map((chip) => (
                  <li key={chip.label}>
                    <a
                      href={DATASET_CHIP_HREF}
                      className={`flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-dark${
                        chip.dashed ? ' border-dashed' : ''
                      }`}
                    >
                      <chip.icon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                      <span className="truncate">{chip.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow">AI models</p>
              <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                {MODEL_ROWS.map((row) => (
                  <li key={row} className="flex items-center gap-2.5 py-2.5">
                    <Check className="h-3.5 w-3.5 shrink-0 text-state-success" aria-hidden="true" />
                    <span className="text-sm text-slate-700">{row}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                Plus spectral indices (NDVI, NDWI, NBR), multi-date change detection, phenology, band
                math and raster algebra, thresholding and reclassification, and the vector toolkit:
                buffer in true metres with auto-UTM, intersect, union, difference, dissolve, spatial
                join and geodesic area columns.
              </p>
              {/* Verbatim from the RASID case study, and a load-bearing
                  differentiator: it must survive copy editing. */}
              <p className="mt-4 text-xs text-slate-500">
                The agent does not replace specialised geospatial models; it orchestrates them.
              </p>
            </div>
          </div>

          {/* §9.3. Only the two formats the worker actually produces are named.
              There is no format-conversion feature, so no shapefile, KML,
              GeoPackage or PDF. */}
          <p className="mt-10 rounded-lg border border-brand/20 bg-brand-soft px-4 py-3 text-sm leading-relaxed text-brand-dark">
            Outputs come back as the file the worker produced. GoPilot can return maps, quantitative
            results and downloadable raster and vector layers, in formats such as GeoTIFF and
            GeoJSON, so results drop into standard GIS workflows.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
