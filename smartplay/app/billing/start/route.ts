import { NextResponse } from "next/server";

import { createPlayerCheckoutSession } from "@/lib/billing/service";
import { getRoleHome } from "@/lib/auth/permissions";
import { getServerAuthSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/signup?plan=player-membership", request.url));
  }

  if (session.user.role !== "athlete") {
    return NextResponse.redirect(
      new URL(`${getRoleHome(session.user.role)}?billing=athlete-only`, request.url),
    );
  }

  try {
    const checkoutUrl = await createPlayerCheckoutSession(session.user.id);
    return NextResponse.redirect(checkoutUrl);
  } catch {
    return NextResponse.redirect(new URL("/app/settings?billing=error", request.url));
  }
}
