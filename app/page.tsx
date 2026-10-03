import { Hero } from "@/components/landing/hero";
import { MinistryStrip } from "@/components/landing/ministry-strip";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="container">
          <Hero />
          <MinistryStrip />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}