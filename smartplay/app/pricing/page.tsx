import { pricingPlans } from "@/lib/constants";
import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicHeader } from "@/components/marketing/public-header";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="section-shell py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Affordable access to elite-style tools"
          description="Player Membership is live for athletes. Coach, team, and community pricing stay estimate-only while the athlete plan launches first."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className="bg-slate-950 text-white">
              <div className="text-sm uppercase tracking-[0.24em] text-lime-200">{plan.name}</div>
              <div className="mt-4 font-display text-5xl font-semibold">{plan.price}</div>
              <CardDescription className="mt-4 text-slate-300">
                {plan.description}
              </CardDescription>
              <div className="mt-6 space-y-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <div key={feature}>{feature}</div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="secondary">
                  {plan.name === "Athlete" ? "Start athlete access" : "Talk to SmartPlay"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
