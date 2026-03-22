import { PublicFooter } from "@/components/marketing/public-footer";
import { PublicHeader } from "@/components/marketing/public-header";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="section-shell py-20">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to SmartPlay"
          description="Use this route for founder conversations, pilot programs, nonprofit partnerships, or school deployments."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="bg-slate-950 text-white">
            <div className="font-display text-3xl font-semibold">
              Let’s build the athlete development stack that should already exist.
            </div>
            <div className="mt-4 text-sm text-slate-300">founder@smartplay.app</div>
            <div className="mt-2 text-sm text-slate-400">
              Pilots for clubs, schools, and access-focused programs.
            </div>
          </Card>
          <Card className="bg-white/75 dark:bg-white/5">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell SmartPlay who you support and what you want to explore."
                />
              </div>
              <Button>Send inquiry</Button>
            </div>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
