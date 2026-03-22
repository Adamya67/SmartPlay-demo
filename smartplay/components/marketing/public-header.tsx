import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteNavigation } from "@/lib/constants";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-background/80 backdrop-blur-xl dark:border-white/5">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-lime-300 dark:bg-lime-300 dark:text-slate-950">
            SP
          </div>
          <div>
            <div className="font-display text-xl font-semibold">SmartPlay</div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Athlete OS
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {siteNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
