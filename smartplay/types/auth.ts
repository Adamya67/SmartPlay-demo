import type { DefaultSession, DefaultUser } from "next-auth";

import type { AppRole, SubscriptionPlan, SubscriptionStatus } from "@/types/domain";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AppRole;
      onboardingCompleted: boolean;
      billingStatus: SubscriptionStatus;
      subscriptionPlan?: SubscriptionPlan | null;
      trialEndsAt?: string | null;
      hasAthleteAccess: boolean;
    };
  }

  interface User extends DefaultUser {
    role: AppRole;
    onboardingCompleted: boolean;
    billingStatus?: SubscriptionStatus;
    subscriptionPlan?: SubscriptionPlan | null;
    trialEndsAt?: string | null;
    hasAthleteAccess?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AppRole;
    onboardingCompleted?: boolean;
    billingStatus?: SubscriptionStatus;
    subscriptionPlan?: SubscriptionPlan | null;
    trialEndsAt?: string | null;
    hasAthleteAccess?: boolean;
  }
}
