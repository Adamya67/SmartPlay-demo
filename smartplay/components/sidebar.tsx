"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarRange,
  Flag,
  HeartPulse,
  LayoutDashboard,
  MessageSquareMore,
  Salad,
  Settings,
  ShieldCheck,
  Trophy,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { AppRole } from "@/types/domain";

const iconMap = {
  Dashboard: LayoutDashboard,
  Sessions: Activity,
  Analytics: Trophy,
  Goals: Flag,
  Nutrition: Salad,
  Wellness: HeartPulse,
  Mental: MessageSquareMore,
  Videos: Video,
  Calendar: CalendarRange,
  Profile: ShieldCheck,
  Settings: Settings,
  Overview: LayoutDashboard,
  Team: ShieldCheck,
  Plans: Flag,
  Reviews: Video,
  Athlete: ShieldCheck,
  Admin: ShieldCheck,
} as const;

export function Sidebar({
  role,
  links,
}: {
  role: AppRole;
  links: Array<{ label: string; href: string }>;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950/70 p-5 lg:flex">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-lime-400 text-lg font-black text-slate-950">
          SP
        </div>
        <div>
          <div className="font-display text-xl font-semibold text-white">SmartPlay</div>
          <div className="text-xs uppercase tracking-[0.24em] text-lime-200">Athlete OS</div>
        </div>
      </Link>

      <div className="mt-8 flex items-center gap-2">
        <Badge>{role}</Badge>
        <Badge variant="secondary">Demo-ready</Badge>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {links.map((link) => {
          const Icon = iconMap[link.label as keyof typeof iconMap] ?? LayoutDashboard;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white",
                active && "bg-lime-400 text-slate-950 hover:bg-lime-400 hover:text-slate-950",
              )}
            >
              <Icon className="size-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-white/10 bg-gradient-to-br from-white/6 to-white/0 p-5">
        <div className="text-xs uppercase tracking-[0.24em] text-lime-200">
          Equity-first
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Equipment-light drills, affordable meal ideas, and home-session planning are built into the workflow.
        </p>
      </div>
    </aside>
  );
}
