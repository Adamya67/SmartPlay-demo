import Stripe from "stripe";

import {
  attachStripeCustomerToUser,
  ensureUserBillingState,
  findUserById,
  findUserByStripeCustomerId,
  getMembershipSnapshot,
  syncCheckoutCompletion,
  syncStripeSubscriptionState,
} from "@/lib/data/service";
import {
  getBillingBaseUrl,
  getStripe,
  getStripePriceId,
  getStripeWebhookSecret,
  isStripeConfigured,
} from "@/lib/billing/stripe";

function toIsoFromUnixTimestamp(value?: number | null) {
  return value ? new Date(value * 1000).toISOString() : null;
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const firstItem = subscription.items.data[0];
  return toIsoFromUnixTimestamp(firstItem?.current_period_end ?? null);
}

async function getOrCreateStripeCustomer(userId: string) {
  const user = await ensureUserBillingState(userId);

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
      role: user.role,
    },
  });

  await attachStripeCustomerToUser(user.id, customer.id);
  return customer.id;
}

function getCheckoutLineItem(): Stripe.Checkout.SessionCreateParams.LineItem {
  const priceId = getStripePriceId();

  if (priceId) {
    return {
      price: priceId,
      quantity: 1,
    };
  }

  return {
    price_data: {
      currency: "usd",
      unit_amount: 1200,
      recurring: {
        interval: "month",
      },
      product_data: {
        name: "SmartPlay Player Membership",
        description: "Athlete membership with connected performance, wellness, nutrition, and video tools.",
      },
    },
    quantity: 1,
  };
}

async function syncSubscriptionObject(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const userId =
    subscription.metadata.userId ||
    (await findUserByStripeCustomerId(customerId))?.id;

  if (!userId) {
    return null;
  }

  return syncStripeSubscriptionState({
    userId,
    customerId,
    subscriptionId: subscription.id,
    currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
    stripeStatus: subscription.status,
  });
}

async function syncCheckoutSession(session: Stripe.Checkout.Session, expectedUserId?: string) {
  const userId = session.client_reference_id || session.metadata?.userId;

  if (!userId || (expectedUserId && userId !== expectedUserId)) {
    throw new Error("Checkout session does not belong to this user.");
  }

  const stripe = getStripe();
  const subscription =
    typeof session.subscription === "string"
      ? await stripe.subscriptions.retrieve(session.subscription)
      : session.subscription;

  if (!subscription) {
    throw new Error("Stripe subscription was not created.");
  }

  await syncCheckoutCompletion({
    userId,
    customerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null,
    subscriptionId: subscription.id,
    currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
    paymentStatus: session.payment_status ?? null,
  });

  return getMembershipSnapshot(userId);
}

export async function createPlayerCheckoutSession(userId: string) {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }

  const user = await ensureUserBillingState(userId);

  if (user.role !== "athlete") {
    throw new Error("Only athlete accounts can start Player Membership.");
  }

  const membership = await getMembershipSnapshot(user.id);
  if (membership.status === "active") {
    return `${getBillingBaseUrl()}/app/settings`;
  }

  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(user.id);
  const baseUrl = getBillingBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    success_url: `${baseUrl}/app/settings?billing=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/app/settings?billing=canceled`,
    allow_promotion_codes: true,
    line_items: [getCheckoutLineItem()],
    metadata: {
      userId: user.id,
      plan: "player_monthly",
    },
    subscription_data: {
      metadata: {
        userId: user.id,
        plan: "player_monthly",
      },
    },
  });

  if (!session.url) {
    throw new Error("Stripe checkout session did not return a URL.");
  }

  return session.url;
}

export async function createBillingPortalUrl(userId: string) {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }

  const user = await findUserById(userId);
  if (!user?.stripeCustomerId) {
    throw new Error("No Stripe customer is attached to this account yet.");
  }

  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getBillingBaseUrl()}/app/settings`,
  });

  return portal.url;
}

export async function finalizeCheckoutSession(sessionId: string, expectedUserId: string) {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  return syncCheckoutSession(session, expectedUserId);
}

export async function processStripeWebhook(payload: string, signature: string) {
  const webhookSecret = getStripeWebhookSecret();
  if (!webhookSecret) {
    throw new Error("Stripe webhook secret is not configured.");
  }

  const stripe = getStripe();
  const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription") {
        await syncCheckoutSession(session);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscriptionObject(event.data.object as Stripe.Subscription);
      break;
    }
    default:
      break;
  }

  return event;
}
