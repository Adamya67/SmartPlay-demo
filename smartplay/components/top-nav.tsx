import Link from "next/link";
import { Search } from "lucide-react";

import { NotificationsPopover } from "@/components/notifications-popover";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";

export function TopNav({
  title,
  subtitle,
  user,
}: {
  title: string;
  subtitle: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-lime-200">SmartPlay</div>
          <h1 className="mt-1 font-display text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input className="w-full pl-9 sm:w-64" placeholder="Search athletes, goals, clips" />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/app/sessions/new"
              className="rounded-full border border-lime-400/25 bg-lime-400/10 px-4 py-2 text-sm font-medium text-lime-100 transition hover:bg-lime-400/20"
            >
              Quick add
            </Link>
            <NotificationsPopover />
            <ThemeToggle />
            <UserNav
              name={user.name ?? "User"}
              email={user.email ?? "smartplay@local"}
              image={user.image}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
