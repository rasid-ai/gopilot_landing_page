#!/usr/bin/env node
/**
 * Remove build output so the next `dev` or `build` starts from nothing.
 *
 * Exists because of one specific Windows failure: Next holds an exclusive
 * handle on `<distDir>/trace`, so a half-killed dev server leaves a directory
 * that cannot be reopened, and every subsequent command dies with
 *   EPERM: operation not permitted, open '.next\trace'
 * `distDir` in next.config.ts already keeps dev and build apart, which prevents
 * the common case. This is the recovery hatch for when a process was killed
 * mid-write and left a locked directory behind.
 *
 * Usage: npm run clean
 */
import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const targets = ['.next', '.next-dev', 'out']

let failed = false

for (const target of targets) {
  const path = join(root, target)
  try {
    await rm(path, { recursive: true, force: true, maxRetries: 3, retryDelay: 150 })
    console.log(`removed  ${target}`)
  } catch (err) {
    failed = true
    // EPERM/EBUSY here means a live process still owns the directory. Deleting
    // it is not possible and retrying will not help — the user has to stop the
    // process, so say which one and how rather than failing opaquely.
    console.error(`FAILED   ${target}  (${err.code ?? err.message})`)
    console.error(
      '\nA Next process is still holding this directory. Stop it, then re-run:\n' +
        '  Windows   powershell "Get-Process node | Stop-Process -Force"\n' +
        '  macOS/Linux   pkill -f "next (dev|build|start)"\n'
    )
  }
}

process.exit(failed ? 1 : 0)
