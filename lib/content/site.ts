/**
 * Site-wide constants. Every URL, label and identifier that appears in more
 * than one place lives here.
 *
 * `ctaPrimaryLabel` is used in four places (nav, hero, pricing Free card,
 * closing CTA) and must never be overridden inline. Label drift between those
 * four is the most invisible conversion leak on a SaaS page.
 */
export const SITE = {
  url: 'https://gopilot.earth',
  name: 'GoPilot',
  parent: 'RASID',
  email: 'info@rasid.ai',
  tagline: 'GoPilot is the interface to Earth.',
  /* CAREFUL: the space before the middot is a literal U+00A0 (non-breaking),
     not an ordinary space, and it is invisible in most editors. §4, §14 and
     §15 all spell this label `Sign up
     free&nbsp;· 500 tokens`: "free · 500" must never break across two lines
     inside the button. It lives here rather than in a component because §4
     requires the label to be byte-identical in the nav, the hero, the pricing
     Free card and the closing band, and a per-component `.replace()` is
     exactly how that guarantee rots.
     Anything deriving a substring from this must split on the middot, not on
     `' · '` with ordinary spaces. */
  ctaPrimaryLabel: 'Sign up free · 500 tokens',
  ctaPrimaryHref: 'https://app.gopilot.earth/auth?active_form=register',
  ctaSignInHref: 'https://app.gopilot.earth/auth?active_form=login',
  ctaTryHref: 'https://app.gopilot.earth/try-gopilot',
  ctaSalesHref: 'https://calendly.com/rasid/30mins',
  plansHref: 'https://app.gopilot.earth/pricing',
  apiKeysHref: 'https://app.gopilot.earth/api-keys',
  qgisHref: 'https://plugins.qgis.org/plugins/rasid_plugin/',
  arcgisHref: 'https://github.com/rasid-ai/arcgispro_addin_gopilot/releases/latest/download/RASID.esriAddinX',
  awardHref: 'https://thrivegeo.com/genai-geospatial-challenge/',
  awardLabel: 'Winner, AWS and thriveGEO GenAI for Geospatial Challenge 2026',
  linkedin: 'https://www.linkedin.com/company/rasid-ai/',
  youtube: 'https://www.youtube.com/@RASIDAI',
  termsHref: 'https://app.gopilot.earth/terms',
  privacyHref: 'https://app.gopilot.earth/privacy-policy',
} as const
