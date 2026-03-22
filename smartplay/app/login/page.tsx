import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";
import { PublicHeader } from "@/components/marketing/public-header";

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="section-shell py-20">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-lime-500 dark:text-lime-300">
            Login
          </div>
          <h1 className="mt-3 font-display text-5xl font-semibold text-slate-950 dark:text-white">
            Step into SmartPlay
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Sign in to access your athlete, coach, parent, or admin workspace.
          </p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            No account yet? <Link className="underline" href="/signup">Create one here</Link>.
          </p>
        </div>
        <LoginForm googleEnabled={googleEnabled} />
      </main>
    </div>
  );
}
