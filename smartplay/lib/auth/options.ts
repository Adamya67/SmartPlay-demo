import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";

import {
  ensureGoogleUser,
  ensureUserBillingState,
  findUserByEmail,
  findUserById,
  getMembershipSnapshot,
} from "@/lib/data/service";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(rawCredentials) {
      const parsed = credentialsSchema.safeParse(rawCredentials);

      if (!parsed.success) {
        return null;
      }

      const user = await findUserByEmail(parsed.data.email);

      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(
        parsed.data.password,
        user.passwordHash,
      );

      if (!isValid) {
        return null;
      }

      const billingReadyUser = await ensureUserBillingState(user);
      await ensureGoogleUser({
        email: user.email,
        name: user.name,
        image: user.image ?? null,
      });
      const membership = await getMembershipSnapshot(billingReadyUser.id);

      return {
        id: billingReadyUser.id,
        email: billingReadyUser.email,
        name: billingReadyUser.name,
        image: billingReadyUser.image ?? undefined,
        role: billingReadyUser.role,
        onboardingCompleted: billingReadyUser.onboardingCompleted,
        billingStatus: membership.status,
        subscriptionPlan: membership.plan,
        trialEndsAt: membership.trialEndsAt,
        hasAthleteAccess: membership.hasAccess,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email ?? profile?.email;

      if (!email) {
        return false;
      }

      const appUser = await ensureGoogleUser({
        email,
        name: user.name ?? profile?.name ?? null,
        image: user.image ?? null,
      });

      user.id = appUser.id;
      user.email = appUser.email;
      user.name = appUser.name;
      user.image = appUser.image ?? user.image;
      user.role = appUser.role;
      user.onboardingCompleted = appUser.onboardingCompleted;
      const membership = await getMembershipSnapshot(appUser.id);
      user.billingStatus = membership.status;
      user.subscriptionPlan = membership.plan;
      user.trialEndsAt = membership.trialEndsAt;
      user.hasAthleteAccess = membership.hasAccess;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
        token.billingStatus = user.billingStatus;
        token.subscriptionPlan = user.subscriptionPlan;
        token.trialEndsAt = user.trialEndsAt;
        token.hasAthleteAccess = user.hasAthleteAccess;
        return token;
      }

      const appUser = token.id
        ? await findUserById(token.id)
        : token.email
          ? await findUserByEmail(token.email)
          : null;

      if (appUser) {
        const billingReadyUser = await ensureUserBillingState(appUser);
        const membership = await getMembershipSnapshot(billingReadyUser.id);
        token.id = billingReadyUser.id;
        token.role = billingReadyUser.role;
        token.onboardingCompleted = billingReadyUser.onboardingCompleted;
        token.billingStatus = membership.status;
        token.subscriptionPlan = membership.plan;
        token.trialEndsAt = membership.trialEndsAt;
        token.hasAthleteAccess = membership.hasAccess;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = (token.role as typeof session.user.role) ?? "athlete";
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
        session.user.billingStatus = token.billingStatus ?? "trialing";
        session.user.subscriptionPlan = token.subscriptionPlan ?? null;
        session.user.trialEndsAt = token.trialEndsAt ?? null;
        session.user.hasAthleteAccess = token.hasAthleteAccess ?? true;
      }

      return session;
    },
  },
};
