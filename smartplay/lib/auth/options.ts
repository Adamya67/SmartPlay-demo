import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { ensureGoogleUser, findUserByEmail } from "@/lib/data/service";

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

      await ensureGoogleUser({
        email: user.email,
        name: user.name,
        image: user.image ?? null,
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image ?? undefined,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
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

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
        return token;
      }

      if (!token.id && token.email) {
        const appUser = await findUserByEmail(token.email);

        if (appUser) {
          token.id = appUser.id;
          token.role = appUser.role;
          token.onboardingCompleted = appUser.onboardingCompleted;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = (token.role as typeof session.user.role) ?? "athlete";
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
      }

      return session;
    },
  },
};
