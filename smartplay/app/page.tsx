import { HomeSections } from "@/components/marketing/home-sections";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicHeader } from "@/components/marketing/public-header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>
        <MarketingHero />
        <HomeSections />
      </main>
      <PublicFooter />
    </div>
  );
}
