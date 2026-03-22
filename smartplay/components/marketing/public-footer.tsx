import Link from "next/link";

import { siteNavigation } from "@/lib/constants";

export function PublicFooter() {
  return (
    <footer className="border-t border-black/5 py-12 dark:border-white/5">
      <div className="section-shell grid gap-8 md:grid-cols-[1.4fr_repeat(2,1fr)]">
        <div>
          <div className="font-display text-2xl font-semibold">SmartPlay</div>
          <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
            Bring pro-level development to every athlete with connected performance, wellness, nutrition, and mindset tools.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Explore</div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
            {siteNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
