import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import CredibilityStrip from '@/components/CredibilityStrip'
import RealPrompts from '@/components/RealPrompts'
import ShowsItsWork from '@/components/ShowsItsWork'
import DataAndModels from '@/components/DataAndModels'
import Integrations from '@/components/Integrations'
import Proof from '@/components/Proof'
import Pricing from '@/components/Pricing'
import Faq from '@/components/Faq'
import ClosingCta from '@/components/ClosingCta'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'

/* §19. Composition only — every section owns its own surface, padding and
   <Reveal>. Deliberately no "use client" here: the three client islands
   (NavMobile, Reveal, GoPilotDemo) are leaves, so hydration work is scheduled
   after the H1 paints rather than blocking it. */
export default function Home() {
  return (
    <>
      <JsonLd />
      <Nav />
      <main>
        <Hero />
        <CredibilityStrip />
        <RealPrompts />
        <ShowsItsWork />
        <DataAndModels />
        <Integrations />
        <Proof />
        <Pricing />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
