import { redirect } from "next/navigation";

import { getRoleHome } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/session";

export default async function AppEntryPage() {
  const session = await requireSession();
  redirect(getRoleHome(session.user.role));
}
