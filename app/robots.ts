import type { MetadataRoute } from 'next'

/* Same reason as app/sitemap.ts: a metadata route must opt into static
   generation by hand under `output: 'export'`, or the build refuses it and
   robots.txt never reaches the origin root. */
export const dynamic = 'force-static'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gopilot.earth'
).replace(/\/+$/, '')

/* The default `*` rule below already allows everything, so this list is
   redundant to a strict parser. It is here on purpose: several of these
   operators look for an explicit opt-in grant, and being quoted by AI answer
   engines is a primary acquisition channel for a product whose pitch is "an AI
   agent". It also documents intent for whoever edits this next.

   Policy mirrors the already-deployed https://rasid.ai/robots.txt. Allowing one
   host while blocking the other would be an invisible, accidental policy split. */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Next's build artefact directory. Nothing user-facing lives there and
        // it burns crawl budget on hashed JS chunks.
        disallow: ['/_next/static/chunks/'],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Canonical host declaration. Yandex honours it; other crawlers ignore it
    // harmlessly. rasid.ai/robots.txt already uses the same directive.
    host: SITE_URL,
  }
}
