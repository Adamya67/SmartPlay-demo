"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Trophy } from "lucide-react";

import { marketingStats } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MarketingHero() {
  return (
    <section className="section-shell py-16 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            <Sparkles className="size-4 text-lime-500" />
            Train smarter, not just harder
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance mt-6 font-display text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl"
          >
            Performance, wellness, and mindset in one place for the next generation of soccer athletes.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300"
          >
            SmartPlay helps athletes, coaches, and families connect training analytics, recovery, nutrition, goals, and AI coaching without expensive pro-club infrastructure.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="/signup">
                Start the athlete build
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {marketingStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-black/6 bg-white/60 p-4 shadow-sm dark:border-white/8 dark:bg-white/5"
              >
                <div className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -left-10 top-6 size-40 rounded-full bg-lime-400/20 blur-3xl" />
          <div className="absolute -right-10 bottom-6 size-40 rounded-full bg-sky-400/20 blur-3xl" />
          <Card className="relative overflow-hidden border-black/5 bg-slate-950 text-white dark:border-white/10">
            <div className="grid-fade absolute inset-0 opacity-50" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-lime-200">
                    SmartPlay AI Coach
                  </div>
                  <div className="mt-2 font-display text-2xl font-semibold">
                    Bring pro-level development to every athlete
                  </div>
                </div>
                <ShieldCheck className="size-8 text-lime-300" />
              </div>

              <Tabs defaultValue="athlete" className="space-y-5">
                <TabsList className="bg-white/10">
                  <TabsTrigger value="athlete">Athlete</TabsTrigger>
                  <TabsTrigger value="coach">Coach</TabsTrigger>
                  <TabsTrigger value="parent">Parent</TabsTrigger>
                </TabsList>

                <TabsContent value="athlete" className="space-y-4">
                  <Card className="border-white/8 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400">Weekly training load</div>
                        <div className="mt-2 text-4xl font-semibold">2,480</div>
                      </div>
                      <Trophy className="size-8 text-lime-300" />
                    </div>
                    <p className="mt-4 text-sm text-slate-300">
                      Your weak-foot reps are trending up. Schedule a lighter technical day tomorrow to protect recovery.
                    </p>
                  </Card>
                </TabsContent>

                <TabsContent value="coach" className="space-y-4">
                  <Card className="border-white/8 bg-white/5">
                    <div className="text-sm text-slate-400">Roster visibility</div>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3 text-sm">
                        3 readiness alerts require review
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3 text-sm">
                        2 new video submissions pending comments
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="parent" className="space-y-4">
                  <Card className="border-white/8 bg-white/5">
                    <div className="text-sm text-slate-400">Support without overload</div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      Track consistency, hydration patterns, and upcoming sessions while keeping the view supportive and permission-aware.
                    </p>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
