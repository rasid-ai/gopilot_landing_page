import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

// [path, maxBytes | null]
const REQUIRED = [
  ['public/og/gopilot-og.png', 350_000],
  ['public/demo/sakaka-aoi.jpg', 200_000],
  ['public/demo/sakaka-aoi@2x.jpg', 400_000],
  // GoPilot's own marks. The nav, the footer and the GoServers integration card
  // render these; the generic RASID logos they replaced are gone, so nothing
  // here should be swapped back without also changing those three components.
  ['public/brand/gopilot-mark.svg', null],
  ['public/brand/gopilot-mark-reversed.svg', null],
  ['public/brand/goserver-mark.svg', null],
  ['public/favicon.ico', null],
  ['public/favicon-16x16.png', null],
  ['public/favicon-32x32.png', null],
  ['public/apple-touch-icon.png', null],
  ['public/android-chrome-192x192.png', null],
  ['public/android-chrome-512x512.png', null],
  ['public/site.webmanifest', null],
]

let failed = false
for (const [rel, max] of REQUIRED) {
  const abs = join(root, rel)
  if (!existsSync(abs)) {
    console.error(`MISSING ASSET: ${rel}`)
    failed = true
    continue
  }
  if (max !== null) {
    const { size } = statSync(abs)
    if (size > max) {
      console.error(`OVERSIZED ASSET: ${rel} is ${size} bytes, limit ${max}`)
      failed = true
    }
  }
}

if (failed) {
  console.error('\nAsset check failed. Fix the files above before building.')
  process.exit(1)
}
console.log('Asset check passed.')
