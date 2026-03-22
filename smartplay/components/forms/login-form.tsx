"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setLoading(true);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid credentials.");
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="bg-white/80 dark:bg-white/5">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...form.register("password")}
            />
          </div>
          <Button disabled={loading} type="submit">
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Log in
          </Button>
          {googleEnabled ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => signIn("google", { callbackUrl: "/app" })}
            >
              Continue with Google
            </Button>
          ) : null}
        </form>
      </Card>

      <Card className="bg-slate-950 text-white">
        <div className="text-xs uppercase tracking-[0.24em] text-lime-200">
          Secure access
        </div>
        <div className="mt-5 space-y-4 text-sm text-slate-300">
          <p>
            Sign in with the credentials created during signup or provided by your
            coach, club, or organization.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            Athlete, coach, parent, and admin experiences are permission-aware and
            open only after authentication.
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            Need access? Create an account or request an invite from your SmartPlay
            team lead.
          </div>
        </div>
      </Card>
    </div>
  );
}
