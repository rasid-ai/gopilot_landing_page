import {
  Braces,
  Building2,
  CloudSun,
  Globe,
  Layers,
  Map,
  Mountain,
  Plus,
  Satellite,
  type LucideIcon,
} from 'lucide-react'

/**
 * Coverage inventory for §9, verbatim from `rasid.ai/products` and in the live
 * site's order.
 *
 * `icon` holds the lucide component itself, not a name string, so the consuming
 * component renders `<chip.icon className="h-3.5 w-3.5" />` with no name->
 * component lookup table to drift out of sync.
 *
 * THESE ELEVEN ARE THE COMPLETE VERIFIED INVENTORY. Do not add Sentinel-1,
 * Sentinel-3, MODIS, SRTM, ESA WorldCover, GHSL, VIIRS, CHIRPS, OpenStreetMap
 * or Overture — none of them appears on any RASID surface that was checked.
 */

export type DatasetChip = {
  label: string
  icon: LucideIcon
  /**
   * The eleventh chip is the live site's own "… and more" entry. It takes
   * `border-dashed` so it reads as an open end rather than a named product.
   */
  dashed: boolean
}

export const DATASET_CHIPS: readonly DatasetChip[] = [
  { label: 'Sentinel-2 L1C / L2A', icon: Satellite, dashed: false },
  { label: 'Landsat 4–9 Collection 2', icon: Satellite, dashed: false },
  { label: 'Mapbox & Google tiles', icon: Map, dashed: false },
  { label: 'Copernicus DEM · 30 m', icon: Mountain, dashed: false },
  { label: 'ERA5 climate reanalysis', icon: CloudSun, dashed: false },
  { label: 'ESA CCI climate variables', icon: CloudSun, dashed: false },
  { label: 'AlphaEarth embeddings', icon: Braces, dashed: false },
  { label: 'Esri annual LULC · 10 m', icon: Layers, dashed: false },
  { label: 'Microsoft building footprints', icon: Building2, dashed: false },
  { label: 'ArcGIS Living Atlas · Source Cooperative', icon: Globe, dashed: false },
  { label: '… and more', icon: Plus, dashed: true },
]

/** Every chip links into the real product inventory rather than asserting itself. */
export const DATASET_CHIP_HREF = 'https://rasid.ai/products#gopilot'

/**
 * The nine named AI models, verbatim from `rasid.ai/products` and in that
 * page's order. Named models only — the spectral-index, change-detection and
 * vector-toolkit capabilities are prose in §9.2 because they are operations,
 * not models.
 */
export const MODEL_ROWS: readonly string[] = [
  'Scene parsing · open vocabulary',
  'Field delineation',
  'Solar panel segmentation',
  'Tree crown & palm detection',
  'Cloud & shadow detection',
  'Methane plume detection',
  'Banana TR4 disease detection',
  'Wheat crop classification',
  'DINOv3 embeddings + PCA',
]
