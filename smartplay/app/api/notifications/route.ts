import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth/session";
import { getNotificationsForUser } from "@/lib/data/service";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await getNotificationsForUser(session.user.id);
  return NextResponse.json({ notifications });
}
