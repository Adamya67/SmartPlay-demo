# SmartPlay

SmartPlay is a production-minded MVP+ for an AI-powered youth soccer performance platform. It includes a polished marketing site, role-based product experiences for athletes, coaches, parents, and admins, a Prisma/PostgreSQL schema, demo-first local persistence, Auth.js credentials login, local uploads, and an AI service layer with live-model fallback support.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Framer Motion
- Recharts
- React Hook Form + Zod
- TanStack Query
- NextAuth/Auth.js credentials auth with optional Google provider
- Prisma ORM
- PostgreSQL
- Local upload storage with a cloud-ready abstraction

## What’s Included

- Marketing pages: `/`, `/features`, `/pricing`, `/about`, `/contact`
- Auth + multi-step onboarding: `/login`, `/signup`
- Athlete app: `/app/dashboard`, `/app/sessions`, `/app/sessions/new`, `/app/analytics`, `/app/goals`, `/app/nutrition`, `/app/wellness`, `/app/mental`, `/app/videos`, `/app/calendar`, `/app/profile`, `/app/settings`
- Coach app: `/app/coach`, `/app/coach/team`, `/app/coach/athletes/[id]`, `/app/coach/plans`, `/app/coach/reviews`
- Parent app: `/app/parent`, `/app/parent/athlete/[id]`
- Admin view: `/app/admin`
- Public recruiting profile: `/athlete/[slug]`
- Demo-first data fallback that works without Postgres
- Prisma schema + seed script for normalized Postgres data

## Demo Credentials

All demo accounts use the same password: `SmartPlay123!`

- Athlete: `athlete.maya@smartplay.dev`
- Coach: `coach.lena@smartplay.dev`
- Parent: `parent.nicole@smartplay.dev`
- Admin: `admin@smartplay.dev`

## Local Setup

### 1. Node

Use Node 20+.

If Node is not on your shell `PATH` on this machine, this project was validated with:

```bash
export PATH="$HOME/.local/node-v22.22.1-darwin-arm64/bin:$PATH"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Copy environment variables

```bash
cp .env.example .env.local
```

### 4. Run in demo mode

Demo mode is the default first-run path and does not require Postgres.

```bash
npm run dev
```

This will auto-generate `data/demo-db.json` on first access and use the demo accounts above.

## PostgreSQL Setup

If you want the app backed by Postgres instead of demo JSON storage:

1. Set `DATABASE_URL` in `.env.local`
2. Set `DEMO_MODE="false"` in `.env.local`
3. Generate the Prisma client:

```bash
npm run db:generate
```

4. Push the schema:

```bash
npm run db:push
```

5. Seed the database:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

## Hosted Beta Deployment

For a real athlete-facing hosted beta, use:

- PostgreSQL
- `DEMO_MODE="false"`
- a real `NEXTAUTH_SECRET`
- live OpenAI credentials
- either S3-compatible object storage or a persistent mounted volume if you keep `STORAGE_PROVIDER="local"`

Recommended deployment target today:

- Docker on a VM, Fly.io, Railway, Render, or another persistent Node host

Less ideal today:

- strict serverless hosting, because clip analysis still runs inline and uses `ffmpeg`

If you deploy with Docker:

```bash
docker build -t smartplay .
docker run --env-file .env.local -p 3000:3000 smartplay
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio
```

## Environment Variables

See `.env.example`.

Key values:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: app base URL
- `NEXTAUTH_SECRET`: session secret
- `NEXT_PUBLIC_APP_URL`: public app URL used for Stripe return redirects
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: optional Google login
- `OPENAI_API_KEY`: optional live AI provider key
- `OPENAI_MODEL`: live model name
- `OPENAI_TEXT_MODEL`: optional override for text coaching generations
- `OPENAI_VISION_MODEL`: optional override for video review generations
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for future client billing flows
- `STRIPE_SECRET_KEY`: Stripe secret key for checkout, portal, and webhook sync
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret for `/api/stripe/webhook`
- `STRIPE_PLAYER_MONTHLY_PRICE_ID`: optional recurring price ID for Stripe-hosted catalog pricing; if blank, the app creates inline `$12/month` checkout pricing
- `DEMO_MODE`: `"true"` for JSON demo storage, `"false"` for Postgres-backed mode
- `UPLOAD_DIR`: local upload root under `public/`
- `STORAGE_PROVIDER`: `"local"` or `"s3"`
- `STORAGE_BUCKET`: bucket name for S3-compatible storage
- `STORAGE_REGION`: storage region
- `STORAGE_ENDPOINT`: optional custom endpoint for R2, MinIO, Spaces, or similar
- `STORAGE_PUBLIC_BASE_URL`: public base URL for hosted media delivery
- `STORAGE_ACCESS_KEY_ID` / `STORAGE_SECRET_ACCESS_KEY`: storage credentials
- `STORAGE_FORCE_PATH_STYLE`: path-style URLs for some S3-compatible providers
- `STORAGE_DELIVERY_MODE`: `"proxy"` or `"public"` for S3-hosted media delivery
- `STORAGE_PREFIX`: prefix inside the storage bucket
- `MAX_UPLOAD_BYTES`: max accepted upload size in bytes
- `MAX_VIDEO_ANALYSIS_DURATION_SECONDS`: max inline AI-review duration

## Uploads

Uploads are saved through `app/api/upload/route.ts` and `lib/storage/index.ts`.

Video review uploads now support a proper first-pass soccer analysis flow:

- Local video or image upload
- Frame sampling with `ffmpeg` / `ffprobe`
- SmartPlay AI clip summaries, strengths, improvement areas, drills, and timestamped review moments
- Honest fallback analysis when `OPENAI_API_KEY` is missing
- Coach/admin review comments on clip detail pages

Notes:

- Uploads currently accept image and video files up to the configured `MAX_UPLOAD_BYTES`
- Hosted sync video review is intentionally capped by `MAX_VIDEO_ANALYSIS_DURATION_SECONDS`
- Live multimodal analysis requires `OPENAI_API_KEY`
- Without a live AI key, the app still returns a structured fallback review and clearly labels it as lower-confidence
- For private S3 buckets, use `STORAGE_DELIVERY_MODE="proxy"` so media is served through the app
- This is a coach-reviewable workflow, not full computer-vision event tracking yet

Buckets currently used:

- `videos`
- `logos`
- `highlights`
- `misc`

## Billing

SmartPlay now supports an athlete-first billing flow:

- 14-day free trial for athlete accounts
- `$12/month` Player Membership after the trial
- Stripe Checkout for card entry
- Stripe Customer Portal for active athlete billing management
- Stripe webhook sync at `/api/stripe/webhook`

For Stripe setup:

1. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
2. Set `NEXT_PUBLIC_APP_URL` to your deployed app URL
3. Add a Stripe webhook endpoint pointing to:

```text
https://your-domain.com/api/stripe/webhook
```

4. Copy the Stripe webhook signing secret into `STRIPE_WEBHOOK_SECRET`

Recommended Stripe events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Project Structure

```text
app/
components/
components/ui/
features/
lib/
lib/ai/
lib/auth/
lib/data/
lib/db/
lib/storage/
lib/utils/
prisma/
public/
styles/
types/
```

## Notes

- The app is intentionally demo-first. If Postgres is not configured, the product still runs end-to-end.
- The AI layer works with fallback heuristics when no API key is present and is structured for live-model integration when a key is supplied.
- Route protection uses the Next.js `proxy.ts` convention with role-aware access checks.
- Storage is provider-based. Local storage works for development and persistent-volume hosting; S3-compatible storage is recommended for hosted beta use.
- For athlete-facing deployment, prefer `DEMO_MODE="false"` and short review clips rather than full-match uploads.
