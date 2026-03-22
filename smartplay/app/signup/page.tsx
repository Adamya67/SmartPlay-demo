import { PublicHeader } from "@/components/marketing/public-header";
import { SignupWizard } from "@/components/forms/signup-wizard";

export default function SignupPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="section-shell py-20">
        <div className="mb-10 max-w-3xl">
          <div className="text-xs uppercase tracking-[0.24em] text-lime-500 dark:text-lime-300">
            Onboarding
          </div>
          <h1 className="mt-3 font-display text-5xl font-semibold text-slate-950 dark:text-white">
            Build your SmartPlay profile
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Multi-step onboarding captures the context needed to personalize training, wellness, nutrition, and communication from day one.
          </p>
        </div>
        <SignupWizard />
      </main>
    </div>
  );
}
