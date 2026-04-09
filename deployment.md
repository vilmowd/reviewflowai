# ReviewFlow AI Deployment Guide (Vercel)

## 1) Prerequisites

- A Vercel account connected to your Git provider.
- A Postgres database (Supabase recommended).
- A Stripe account with:
  - Product/Price for Pro plan (`$29/month`)
  - Webhook endpoint support.

## 2) Environment Variables

Set these in Vercel Project -> Settings -> Environment Variables:

- `DATABASE_URL`  
  Supabase Postgres connection string.

- `NEXT_PUBLIC_APP_URL`  
  Your production URL (example: `https://reviewflow-ai.vercel.app`).

- `STRIPE_SECRET_KEY`  
  Stripe secret key for server-side checkout creation.

- `STRIPE_PRO_PRICE_ID`  
  Stripe recurring price ID for Pro subscription.

- `STRIPE_WEBHOOK_SECRET`  
  Signing secret from Stripe webhook endpoint.

- `AUTH_SECRET`  
  Long random string used to sign secure session JWT cookies.

## 3) Database Setup (Prisma)

From local machine (or CI job) run:

```bash
npx prisma generate
npx prisma migrate deploy
```

For first deploy, create migrations locally first (if not created yet):

```bash
npx prisma migrate dev --name init
```

Commit the generated migration files under `prisma/migrations`.

## 4) Deploy to Vercel

1. Push code to your repository.
2. In Vercel, click **New Project** and import repository.
3. Framework preset: **Next.js**.
4. Add environment variables from section 2.
5. Deploy.

Recommended Build Command:

```bash
npm run build
```

Recommended Install Command:

```bash
npm install
```

## 5) Configure Stripe Webhook

In Stripe Dashboard:

1. Create endpoint:
   - URL: `https://<your-domain>/api/stripe/webhook`
2. Subscribe to event:
   - `checkout.session.completed`
3. Copy webhook signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel.

For local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 6) Post-Deploy Validation Checklist

- Landing page loads and includes "Local Business Review Management" text.
- Dashboard loads with no server errors.
- Business creation works for first business on Free plan.
- Second business on Free plan is blocked and upgrade CTA appears.
- Stripe checkout opens and webhook promotes user to Pro.
- Public route `/{business_id}` loads on mobile.
- "Good" redirects to Google URL.
- "Bad" submits feedback and stores in database.
- QR code download works and scans to the correct survey URL.

## 7) Security Notes

- Authentication uses secure, signed, HTTP-only session cookies.
- CSRF protection is enforced on state-changing authenticated endpoints.
- Rate limiting is enabled for auth, feedback, business mutations, and Stripe checkout.
- Add transactional email provider for Pro email alerts.
- Add CSP/security headers and request logging with trace IDs.
