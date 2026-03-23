import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { hasRouteAccess } from "@/lib/auth/permissions";
import type { AppRole } from "@/types/domain";

export default withAuth(
  (request) => {
    const token = request.nextauth.token;
    const role = token?.role as AppRole | undefined;
    const pathname = request.nextUrl.pathname;

    if (!role || !hasRouteAccess(role, pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
      role === "athlete" &&
      token?.hasAthleteAccess === false &&
      pathname !== "/app/settings"
    ) {
      return NextResponse.redirect(new URL("/app/settings?billing=required", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!req.nextUrl.pathname.startsWith("/app")) {
          return true;
        }

        return Boolean(token);
      },
    },
  },
);

export const config = {
  matcher: ["/app/:path*"],
};
