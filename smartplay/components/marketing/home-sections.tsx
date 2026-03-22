import { faqItems, marketingFeatures, pricingPlans, testimonials } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

export function HomeSections() {
  return (
    <>
      <section className="section-shell py-10">
        <SectionHeading
          eyebrow="Why SmartPlay"
          title="All-in-one athlete development built around real access constraints"
          description="The product feels premium because the decisions are product-level, not decoration-level. SmartPlay treats performance, recovery, nutrition, video, and mindset as one connected system."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {marketingFeatures.map((feature) => (
            <Card key={feature.title} className="bg-white/70 dark:bg-white/5">
              <Badge variant="secondary">{feature.title}</Badge>
              <CardTitle className="mt-5">{feature.title}</CardTitle>
              <CardDescription className="mt-3 text-base leading-7">
                {feature.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="Testimonials"
          title="Useful enough to win the trust of athletes, parents, and coaches"
          description="Every view is tuned to a real stakeholder, so the product feels cohesive instead of role-swapped."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-white/75 dark:bg-white/5">
              <CardTitle>{testimonial.quote}</CardTitle>
              <CardDescription className="mt-5">
                {testimonial.name} · {testimonial.role}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Flexible enough for individual athletes and access-driven programs"
          description="Use placeholder pricing now, but structure the value proposition like a real product company."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className="bg-slate-950 text-white">
              <div className="text-sm uppercase tracking-[0.22em] text-lime-200">{plan.name}</div>
              <div className="mt-4 font-display text-5xl font-semibold">{plan.price}</div>
              <CardDescription className="mt-4 text-slate-300">{plan.description}</CardDescription>
              <div className="mt-6 space-y-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <div key={feature}>{feature}</div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="secondary">Choose {plan.name}</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions people will ask in a demo"
          description="Straight answers that reinforce the product thesis: practical, data-driven, and accessible."
        />
        <div className="mt-10 grid gap-4">
          {faqItems.map((item) => (
            <Card key={item.question} className="bg-white/70 dark:bg-white/5">
              <CardTitle>{item.question}</CardTitle>
              <CardDescription className="mt-3 text-base leading-7">{item.answer}</CardDescription>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
