import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

/* Flat config, because ESLint 9 is flat-only. `eslint-config-next` still ships
   as eslintrc-style, so FlatCompat translates it.
   `core-web-vitals` over plain `next` on purpose: it promotes the performance
   rules to errors, and this is a landing page whose whole job is to load fast. */
const config = [
  {
    ignores: [
      '.next/**',
      '.next-dev/**',
      'out/**',
      'node_modules/**',
      'next-env.d.ts',
      'scripts/**', // plain Node/ESM utilities, not part of the app graph
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      /* The page is statically exported with `images.unoptimized`, so
         next/image gives no optimization here — it only wraps each tag in an
         extra span. Bare <img> is the correct choice, and every one of them
         carries explicit width/height plus a real or deliberately empty alt.
         Warn rather than error: left as a signal for anyone who later turns
         optimization back on, without failing the build today. */
      '@next/next/no-img-element': 'warn',
    },
  },
]

export default config
