import type { DefaultSession, DefaultUser } from "next-auth";

import type { AppRole } from "@/types/domain";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AppRole;
      onboardingCompleted: boolean;
    };
  }

  interface User extends DefaultUser {
    role: AppRole;
    onboardingCompleted: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AppRole;
    onboardingCompleted?: boolean;
  }
}
