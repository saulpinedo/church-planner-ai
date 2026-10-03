import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MinistryStrip } from "@/components/landing/ministry-strip";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealSection } from "@/components/reveal-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Hero />
          <RevealSection>
            <MinistryStrip />
          </RevealSection>
          <RevealSection delay={100}>
            <HowItWorks />
          </RevealSection>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}