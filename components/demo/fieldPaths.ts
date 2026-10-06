/* ---------------------------------------------------------------------------
 * components/demo/fieldPaths.ts
 *
 * The ten largest field polygons from a REAL GoPilot run: 324 features
 * delineated by `ksa_delineate_fields_goserver` over the Sakaka agricultural
 * belt, Al Jawf Province, Saudi Arabia, on Sentinel-2 L2A scene
 * `S2A_37RFP_20260927_1_L2A`. Projected to the captured basemap's pixel space
 * in .research/aligned_paths.json and copied here verbatim.
 *
 * `viewBox` is `0 0 640 400`, matching /demo/sakaka-aoi.jpg exactly. The @2x
 * twin is the same scene at the same framing, so these coordinates serve both:
 * never scale them for the retina asset.
 *
 * `cx`/`cy` are shoelace polygon centroids, precomputed so the build never
 * calls getTotalLength() and never measures the DOM.
 * ------------------------------------------------------------------------- */

export type FieldPath = { id: number; areaHa: number; d: string; cx: number; cy: number }

export const FIELD_VIEWBOX = '0 0 640 400'

/** Read straight out of the SLD the backend returned for this layer. */
export const FIELD_FILL = '#e6194b'
export const FIELD_STROKE = '#232323'

export const FIELD_PATHS: FieldPath[] = [
  { id: 294, areaHa: 24.6, cx: 279.9, cy: 376.4, d: 'M251.1 364.3L248.9 386.4L253.3 395.2L266.6 406.3L297.6 404.1L310.9 386.4L308.6 362.1L302.0 353.2L284.3 344.4L260.0 351.0L251.1 364.3Z' },
  { id: 286, areaHa: 20.1, cx: 240.3, cy:  27.3, d: 'M211.3 20.3L213.5 39.1L229.0 52.4L268.8 50.2L268.8 23.6L251.1 1.5L245.5 -0.7L226.8 1.5L215.7 8.1L211.3 20.3Z' },
  { id: 292, areaHa: 19.9, cx: 184.4, cy: 374.8, d: 'M147.1 355.4L147.1 369.8L153.8 384.2L164.8 393.0L178.1 397.4L201.3 395.2L209.1 390.8L217.9 379.7L222.4 364.3L220.1 355.4L187.0 359.8L157.8 357.6L152.7 353.2L147.1 355.4Z' },
  { id: 291, areaHa: 18.1, cx: 333.8, cy: 356.3, d: 'M310.9 366.5L317.5 382.0L326.3 390.8L336.3 393.0L339.4 386.9L344.0 386.4L344.1 376.9L355.1 355.4L355.1 325.6L337.4 324.5L326.3 328.9L315.3 342.2L310.9 366.5Z' },
  { id: 288, areaHa: 17.7, cx: 323.8, cy: 201.7, d: 'M297.6 194.0L299.8 213.9L313.1 227.1L335.2 227.1L348.5 216.1L348.5 191.7L335.2 176.3L321.9 174.0L304.2 182.9L297.6 194.0Z' },
  { id: 287, areaHa: 16.8, cx: 445.6, cy:  42.7, d: 'M419.3 39.1L423.7 56.8L437.0 67.9L461.3 66.8L470.1 52.4L467.9 28.0L459.1 19.2L448.0 17.0L433.6 19.2L423.7 28.0L419.3 39.1Z' },
  { id: 168, areaHa: 15.7, cx: 521.4, cy:  48.9, d: 'M485.6 32.5L485.6 43.5L503.3 56.8L505.5 65.7L518.8 65.7L529.9 74.5L536.5 74.5L536.5 70.1L543.2 65.7L552.0 48.0L552.0 43.5L547.6 41.3L549.8 34.7L540.9 32.5L485.6 32.5Z' },
  { id: 293, areaHa: 11.0, cx: 235.2, cy: 377.7, d: 'M213.5 382.0L215.7 393.0L226.8 397.4L253.3 395.2L253.3 362.1L224.6 353.2L220.0 374.0L213.5 382.0Z' },
  { id: 289, areaHa:  9.2, cx: 299.0, cy: 333.4, d: 'M275.5 322.2L275.5 337.7L288.7 348.8L313.1 346.6L324.1 333.3L321.9 322.2L304.2 320.0L275.5 322.2Z' },
  { id: 290, areaHa:  7.7, cx: 243.6, cy: 343.4, d: 'M224.6 339.9L231.2 357.6L255.5 359.8L260.0 353.2L260.0 335.5L251.1 326.7L231.2 328.9L224.6 339.9Z' },
]
