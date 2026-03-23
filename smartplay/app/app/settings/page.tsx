import {
  openBillingPortalAction,
  startLocalPlayerMembershipAction,
  startPlayerMembershipAction,
} from "@/app/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { finalizeCheckoutSession } from "@/lib/billing/service";
import { getAthleteWorkspace, getMembershipSnapshot, getParentWorkspace } from "@/lib/data/service";
import { Switch } from "@/components/ui/switch";
import { formatLongDate } from "@/lib/utils/format";

type PreferenceItem = {
  label?: string;
  title?: string;
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ billing?: string; session_id?: string }>;
}) {
  const session = await requireSession();
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  const params = (await searchParams) ?? {};
  if (
    session.user.role === "athlete" &&
    params.billing === "success" &&
    params.session_id
  ) {
    await finalizeCheckoutSession(params.session_id, session.user.id);
  }
  const settings =
    session.user.role === "athlete"
      ? (await getAthleteWorkspace(session.user.id)).settings.notificationPreferences
      : session.user.role === "parent"
        ? (await getParentWorkspace(session.user.id)).notifications
        : [
            { label: "Coach alerts", enabled: true },
            { label: "Roster updates", enabled: true },
            { label: "System summaries", enabled: true },
          ];
  const membership =
    session.user.role === "athlete"
      ? await getMembershipSnapshot(session.user.id)
      : null;

  return (
    <div className="grid gap-6">
      {membership ? (
        <Card className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="font-display text-xl font-semibold text-white">
                Player Membership
              </div>
              <div className="mt-2 text-sm text-slate-300">{membership.detail}</div>
            </div>
            <div className="rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-sm font-medium text-lime-100">
              {membership.status === "active"
                ? "Active"
                : membership.status === "trialing"
                  ? "14-day trial"
                  : "Billing required"}
            </div>
          </div>

          {params.billing === "required" ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-50">
              Your athlete trial has ended. Start the $12/month Player Membership to
              continue using SmartPlay.
            </div>
          ) : null}
          {params.billing === "success" ? (
            <div className="rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4 text-sm text-lime-50">
              Payment received. Your Player Membership is now active.
            </div>
          ) : null}
          {params.billing === "canceled" ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              Checkout was canceled. Your athlete trial remains available until it ends.
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Current status
              </div>
              <div className="mt-2 font-display text-2xl text-white">
                {membership.headline}
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Membership price
              </div>
              <div className="mt-2 font-display text-2xl text-white">
                {membership.subscriptionPriceLabel}
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Billing timeline
              </div>
              <div className="mt-2 text-sm text-slate-200">
                {membership.status === "active" && membership.subscriptionRenewsAt
                  ? `Renews ${formatLongDate(membership.subscriptionRenewsAt)}`
                  : membership.trialEndsAt
                    ? `Trial ends ${formatLongDate(membership.trialEndsAt)}`
                    : "Not started"}
              </div>
            </div>
          </div>

          {membership.status !== "active" ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              {stripeConfigured ? (
                <form action={startPlayerMembershipAction}>
                  <Button type="submit">Enter card details</Button>
                </form>
              ) : (
                <form action={startLocalPlayerMembershipAction}>
                  <Button type="submit">
                    Activate locally
                  </Button>
                </form>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                Coach and team pricing still stay estimate-only on the marketing site.
                The only live paid plan right now is the athlete Player Membership.
              </div>
              {stripeConfigured ? (
                <form action={openBillingPortalAction}>
                  <Button type="submit" variant="secondary">
                    Manage billing
                  </Button>
                </form>
              ) : null}
            </div>
          )}
        </Card>
      ) : (
        <Card className="space-y-4">
          <div className="font-display text-xl font-semibold text-white">Billing</div>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
            Coach, parent, and admin access remain non-billable while SmartPlay is
            launching athlete memberships first.
          </div>
        </Card>
      )}

      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Notification preferences</div>
        {Array.isArray(settings)
          ? settings.map((item: PreferenceItem, index: number) => (
              <div key={index} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="text-sm text-slate-200">{item.label ?? item.title}</div>
                <Switch defaultChecked />
              </div>
            ))
          : null}
      </Card>
      <Card className="space-y-4">
        <div className="font-display text-xl font-semibold text-white">Theme + privacy</div>
        <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
          Theme toggle is available in the top nav. Profile sharing stays athlete-controlled and role-aware.
        </div>
      </Card>
    </div>
  );
}
