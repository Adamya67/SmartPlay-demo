import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/options";
import { getRoleHome } from "@/lib/auth/permissions";
import type { AppRole } from "@/types/domain";

export async function getServerAuthSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(roles: AppRole[]) {
  const session = await requireSession();

  if (!roles.includes(session.user.role)) {
    redirect(getRoleHome(session.user.role));
  }

  return session;
}
