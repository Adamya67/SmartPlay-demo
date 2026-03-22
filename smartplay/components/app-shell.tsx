"use client";

import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { roleNavigation } from "@/lib/constants";
import type { AppRole } from "@/types/domain";

export function AppShell({
  role,
  user,
  children,
}: {
  role: AppRole;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const titleMap: Record<string, { title: string; subtitle: string }> = {
    "/app/dashboard": {
      title: "Athlete Dashboard",
      subtitle: "Train smarter, not just harder.",
    },
    "/app/coach": {
      title: "Coach Command Center",
      subtitle: "See the roster clearly, coach proactively, and keep athletes progressing.",
    },
    "/app/parent": {
      title: "Parent Overview",
      subtitle: "Support consistency without turning progress into pressure.",
    },
    "/app/admin": {
      title: "Admin Snapshot",
      subtitle: "Track adoption, program health, and athlete support needs.",
    },
  };

  const titleEntry =
    Object.entries(titleMap).find(([path]) => pathname.startsWith(path))?.[1] ?? {
      title: "SmartPlay Workspace",
      subtitle: "Performance, wellness, and mindset in one place.",
    };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar role={role} links={roleNavigation[role]} />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopNav title={titleEntry.title} subtitle={titleEntry.subtitle} user={user} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
