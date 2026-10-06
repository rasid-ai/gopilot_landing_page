/**
 * The three testimonials that ship, in order. All four verified quotes live on
 * `rasid.ai`; these three are ranked by the objection they answer, not by logo
 * size.
 *
 * Giulio Poggi leads and that position is non-negotiable: an independent
 * researcher vouching for the agent's reasoning and for its raster and vector
 * outputs is precisely the claim a GIS analyst is trying to verify.
 * Vendor-partner praise is not.
 *
 * `emphasis` is the exact substring of `quote` to wrap in
 * `<strong class="font-semibold text-slate-900">`, matching the live site's own
 * emphasis. It must remain a literal substring of `quote` — the renderer splits
 * on it, so a typo silently drops the emphasis instead of throwing.
 *
 * Initials badges, not headshots. No headshots exist and the live site uses
 * initials; a grey placeholder avatar reads as unfinished and contaminates the
 * credibility of the real proof around it.
 */

export type Testimonial = {
  initials: string
  name: string
  title: string
  quote: string
  emphasis: string
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    initials: 'GP',
    name: 'Giulio Poggi',
    title:
      'Post-doctoral researcher, Centre for Cultural Heritage Technology (CCHT), Istituto Italiano di Tecnologia',
    quote:
      "I was impressed by GoPilot's detailed reasoning and its ability to autonomously adapt its workflow to complex geospatial queries. It successfully produced the requested raster and vector outputs, and its capabilities stood out compared with other geospatial AI systems I have tested.",
    emphasis: 'stood out compared with other geospatial AI systems I have tested',
  },
  {
    initials: 'MP',
    name: 'Miriam Puertos',
    title: 'Partner Manager, AWS',
    quote:
      'What impressed me about RASID is their ability to bring together Earth observation, geospatial technologies, and AI into practical solutions. GoPilot is a strong example of this, combining advanced AI with geospatial data and tools to simplify complex analysis. It has been exciting to see the team develop this capability and we look forward to seeing what they build next.',
    emphasis: 'bring together Earth observation, geospatial technologies, and AI into practical solutions',
  },
  {
    initials: 'OR',
    name: 'Dr Osama Rayis',
    title:
      'Chair of Agripreneurship, Arab Organization for Agricultural Development (AOAD)',
    quote:
      'Using GoPilot gave me a different perspective on how geospatial analysis can be approached. I was particularly interested in exploring how it could be applied to different challenges across the Arab region, and I see significant potential for developing practical use cases around the needs of the region.',
    emphasis: 'significant potential for developing practical use cases around the needs of the region',
  },
]
