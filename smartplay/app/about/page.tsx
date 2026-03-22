import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicHeader } from "@/components/marketing/public-header";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="section-shell py-20">
        <SectionHeading
          eyebrow="About"
          title="Youth-athlete development should not depend on elite access"
          description="SmartPlay exists to make serious training structure available to student-athletes, families, coaches, schools, and nonprofits without forcing them into disconnected premium tools."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card className="bg-white/70 dark:bg-white/5">
            <h3 className="font-display text-2xl font-semibold">Data-backed</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Every dashboard and AI insight is grounded in logged sessions, wellness, nutrition, and progress trends.
            </p>
          </Card>
          <Card className="bg-white/70 dark:bg-white/5">
            <h3 className="font-display text-2xl font-semibold">Soccer-first</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              The workflows map to soccer development: technical reps, match load, sprint exposure, and film review.
            </p>
          </Card>
          <Card className="bg-white/70 dark:bg-white/5">
            <h3 className="font-display text-2xl font-semibold">Access-aware</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Budget meals, equipment-light drills, and home-ready planning are core product decisions, not afterthoughts.
            </p>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
