/* ---------------------------------------------------------------------------
 * components/demo/DemoMap.tsx
 *
 * The map half of the demo. Zero network: a committed JPEG basemap with the
 * real delineated field polygons overlaid as inline SVG. No mapbox-gl, no
 * tile request, no token. The only occurrence of the string "mapbox" in the
 * output is the attribution below, which is required.
 *
 * THE CROP RULE, and why it is this rule. The map region's aspect ratio never
 * matches the image's 8:5, so something must be cropped. `object-cover
 * object-center` on the image and `preserveAspectRatio="xMidYMid slice"` on
 * the SVG implement the SAME crop by definition, so they agree at every
 * container size: the polygons sit on their fields with no magic numbers and
 * no runtime measurement. Change one and you must change the other.
 *
 * Under static export a plain <img> with srcSet beats next/image: next/image
 * degrades to an unoptimised <img> anyway and adds wrapper markup for nothing.
 * ------------------------------------------------------------------------- */

import { Eye } from 'lucide-react'
import { FIELD_FILL, FIELD_PATHS, FIELD_VIEWBOX } from './fieldPaths'
import type { MapStep } from './demoScript'

export default function DemoMap({
  mapStep,
  labels,
  className = '',
}: {
  mapStep: MapStep
  /** Hectare labels are set from a matchMedia effect in GoPilotDemo, not from
   *  CSS: ten haloed 9px labels are illegible below `sm` and should not be in
   *  the DOM there at all. */
  labels: boolean
  className?: string
}) {
  const showFields = mapStep >= 1
  const showLabels = mapStep >= 2 && labels

  return (
    <div className={`relative min-w-0 overflow-hidden bg-[#8E7A5F] ${className}`}>
      {/* The viewport settle. Mirrors the product's single
          fitBounds(..., { padding: 50, duration: 1000 }) when a result layer
          lands: scale(1.06) -> scale(1) over 1000ms. Nothing else moves, which
          is why the chrome below sits outside this wrapper. */}
      <div className="map-viewport absolute inset-0" data-map-step={mapStep}>
        <img
          src="/demo/sakaka-aoi.jpg"
          srcSet="/demo/sakaka-aoi.jpg 1x, /demo/sakaka-aoi@2x.jpg 2x"
          width={640}
          height={400}
          loading="eager"
          fetchPriority="low"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
          alt="Satellite view of irrigated farmland near Sakaka, Al Jawf Province, Saudi Arabia: pale desert sand crossed by tracks, with about a dozen dark-green circular centre-pivot fields."
        />

        {showFields ? (
          <svg
            viewBox={FIELD_VIEWBOX}
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-labelledby="aoiTitle aoiDesc"
          >
            <title id="aoiTitle">GoPilot field delineation overlay</title>
            <desc id="aoiDesc">
              Crimson outlines traced onto the satellite image, each marking a detected field
              boundary. The largest is 24.6 hectares.
            </desc>
            <defs>
              <filter id="fieldGlow">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>

            {FIELD_PATHS.map((f, i) => (
              <g key={f.id}>
                {/* pathLength="1000" normalises every path's length, so one
                    stroke-dashoffset 1000 -> 0 keyframe draws all ten
                    correctly with no getTotalLength() call and no
                    precomputed lengths. */}
                <path
                  d={f.d}
                  pathLength={1000}
                  fill="none"
                  stroke="#232323"
                  strokeWidth={2.75}
                  strokeOpacity={0.35}
                  strokeLinejoin="bevel"
                  vectorEffect="non-scaling-stroke"
                  className="field-stroke"
                  style={{ animationDelay: `${i * 70}ms` }}
                />
                {/* ONLY styling deviation from the real SLD the backend
                    returned: it fills solid #e6194b and the analyst drops the
                    layer opacity by hand. Here the fill rests at 0.22 so the
                    imagery still reads underneath and a visitor can see that
                    the outline follows a real pivot circle. */}
                <path
                  d={f.d}
                  pathLength={1000}
                  fill={FIELD_FILL}
                  fillOpacity={0}
                  stroke={FIELD_FILL}
                  strokeWidth={1.75}
                  strokeLinejoin="bevel"
                  vectorEffect="non-scaling-stroke"
                  className="field-path"
                  style={{ animationDelay: `${i * 70}ms` }}
                />
              </g>
            ))}

            {showLabels
              ? FIELD_PATHS.map((f, i) => (
                  <text
                    key={`l-${f.id}`}
                    x={f.cx}
                    y={f.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize={9}
                    fontWeight={600}
                    paintOrder="stroke"
                    stroke="#232323"
                    strokeWidth={2.5}
                    strokeOpacity={0.55}
                    className="field-label"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {f.areaHa.toFixed(1)} ha
                  </text>
                ))
              : null}
          </svg>
        ) : null}
      </div>

      {/* AOI frame: a plain div, NOT in the SVG, so it is always correct
          regardless of how the image is cropped. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-sm border-2 border-dashed border-brand/80"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-3 rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-medium text-brand-dark"
      >
        AOI · 30 × 30 km
      </span>

      {/* Layer list, top-right. Appears with the polygons, exactly as the
          product's layer rail gains a row when a worker returns a file. */}
      {showFields ? (
        <div
          aria-hidden="true"
          className="absolute right-3 top-3 hidden w-56 rounded-lg border border-slate-200 bg-white/90 p-2 text-[11px] backdrop-blur sm:block"
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#e6194b]" />
            <span className="min-w-0 flex-1 truncate font-mono text-slate-700">
              sakaka_fields_with_area.geojson_3670
            </span>
            <Eye className="h-3 w-3 shrink-0 text-brand" />
          </div>
        </div>
      ) : null}

      {/* Legend, bottom-right. The second line is a required provenance
          disclosure (§3.2): this is a real scene, and saying which one is the
          proof that we label things. */}
      {showFields ? (
        <div
          aria-hidden="true"
          className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-2.5 py-2 text-[11px] backdrop-blur"
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#e6194b]" />
            <span className="text-slate-700">field</span>
            <span className="text-slate-400">· 324 polygons</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">Sentinel-2 L2A · 2026-09-27 · 10 m</p>
        </div>
      ) : null}

      {/* Basemap attribution. Required, not decorative: the capture is a real
          third-party render and this is the licence term. */}
      <p aria-hidden="true" className="absolute bottom-0.5 right-1.5 text-[9px] text-white/60">
        © Mapbox © Maxar © OpenStreetMap
      </p>
    </div>
  )
}
