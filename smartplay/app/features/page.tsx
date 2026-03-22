import { HomeSections } from "@/components/marketing/home-sections";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicHeader } from "@/components/marketing/public-header";
import { SectionHeading } from "@/components/marketing/section-heading";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="section-shell py-20">
        <SectionHeading
          eyebrow="Features"
          title="Bring pro-level development to every athlete"
          description="SmartPlay combines training analytics, nutrition guidance, recovery intelligence, video review, goal systems, and coach communication in one connected product."
        />
        <HomeSections />
      </main>
      <PublicFooter />
    </div>
  );
}
