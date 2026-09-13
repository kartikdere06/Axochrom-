# Axochrome — E-commerce store

A full-stack store for Axochrome (premium canvas tote bags) built with:

- **Next.js 14** (App Router) — storefront, admin panel, and API routes in one project
- **Prisma + SQLite** for local development (one-line switch to Postgres for production)
- **Stripe Checkout** for payments
- **Customer accounts** (register/login/order history) and a **password-protected admin panel**
- **Tailwind CSS** with a custom dark/green theme matching your logo

## 1. Install and set up the database

```bash
npm install
cp .env.example .env       # then fill in SESSION_SECRET and Stripe keys (see below)
npx prisma generate
npx prisma db push          # creates the SQLite database file from the schema
npm run db:seed             # adds demo products + an admin login
```

> **Note:** `npx prisma generate` and `db push` need normal internet access to
> Prisma's CDN. This works out of the box on your laptop or any standard
> hosting/deploy environment — it just isn't reachable from the sandbox this
> was built in, so that step couldn't be verified end-to-end here. If you hit
> a `binaries.prisma.sh` connection error somewhere unusual, check that
> outbound HTTPS isn't blocked in that environment.

## 2. Run it locally

```bash
npm run dev
```

Visit:
- `http://localhost:3000` — storefront
- `http://localhost:3000/admin/login` — admin panel (`admin@axochrome.com` / `axochrome-admin` from the seed script — **change this password before going live**)
- `http://localhost:3000/account/register` — customer account sign-up

## 3. Stripe setup (for real payments)

1. Create a [Stripe account](https://dashboard.stripe.com) if you don't have one.
2. Get your **test** secret key from the [API keys page](https://dashboard.stripe.com/test/apikeys) and put it in `.env` as `STRIPE_SECRET_KEY`.
3. For local webhook testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   This prints a webhook signing secret — put it in `.env` as `STRIPE_WEBHOOK_SECRET`.
4. Test the flow with Stripe's test card: `4242 4242 4242 4242`, any future expiry, any CVC.
5. When you're ready to go live, switch to your **live** keys and create a live webhook endpoint pointing at `https://yourdomain.com/api/webhook` in the Stripe dashboard (select the `checkout.session.completed` event).

## 4. Switching to Postgres for production

SQLite is great for development but isn't suited to most hosting platforms. To switch:

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "sqlite"     // change to "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Get a Postgres database — [Neon](https://neon.tech) and [Supabase](https://supabase.com) both have easy free tiers that pair well with Vercel.
3. Update `DATABASE_URL` in your environment to the Postgres connection string.
4. Run `npx prisma db push` again against the new database, then `npm run db:seed` if you want the demo data (or skip seeding and add real products via the admin panel).

## 5. Deploying

This is a standard Next.js app, so it deploys cleanly to **Vercel** (recommended — click "New Project," import this repo, add your environment variables, and set the Postgres `DATABASE_URL`). Any other Node.js host works too.

## What's included

**Storefront**
- Home page, product grid with category filters, product detail pages with variant/option selection
- Custom print request — customers can request custom printing on any tote, with notes visible to you in the admin orders page
- Cart with quantity controls, persisted in the browser
- Stripe Checkout integration with server-side price/stock validation (cart prices are never trusted from the browser)
- Customer accounts: register, login, order history

**Admin panel** (`/admin`)
- Dashboard with product count, order count, and revenue
- Product list, add/edit forms, delete
- Orders list showing customer name, email, phone, items, and any custom print requests

## Known limitations / next steps

- Editing **variants** (colors/sizes/stock) on an existing product currently requires `npm run db:studio` (a visual database editor Prisma provides) rather than the admin UI — creating a *new* product with variants is fully supported in the UI.
- No email notifications yet (order confirmation emails, shipping updates) — Stripe will still show the customer a receipt automatically if you enable that in your Stripe dashboard settings.
- No image upload — product images are set via URL. Consider adding a media host (e.g., Cloudinary, Vercel Blob) if you want to upload photos directly from the admin panel.
- Shipping address collection isn't wired into Stripe Checkout yet — add `shipping_address_collection` to the checkout session in `app/api/checkout/route.ts` if you want Stripe to collect it directly.
