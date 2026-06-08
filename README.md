# Woodzy

Storefront for **Woodzy** — a furniture & luxury-goods store in Deoghar, Jharkhand.
*Warm Woods, Cozy Living.*

A cinematic Next.js storefront: a briefcase-opening intro → an interactive 360° turntable hero,
full browse → cart → checkout, **WhatsApp-quote ordering**, a stubbed (grey) Razorpay layer, and an
owner admin. It runs **fully on a local seed catalog** so it works before Supabase is connected.

## Tech

Next.js 16 (App Router, TS) · Tailwind v4 · framer-motion · Zustand · Supabase (`@supabase/ssr`) ·
zod · Vitest.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # unit tests (Vitest)
npm run build    # production build
```

## Configuration

Everything owner-toggleable lives in [`src/config/site.ts`](src/config/site.ts):

| Setting | Purpose |
|---|---|
| `whatsappNumber` | wa.me number quotes are sent to (currently `916291663674`) |
| `serviceRegions` | delivery regions — drives copy + the checkout state dropdown |
| `paymentsEnabled` | keep `false` to show Razorpay as "coming soon" (grey); `true` to go live |
| `showPrices` | show ₹ prices |
| `showroom` | Deoghar address / hours |

Environment variables: copy [`.env.example`](.env.example) → `.env.local`.

## How data works

The storefront reads through [`src/lib/catalog.ts`](src/lib/catalog.ts):
- **No Supabase env** → serves the bundled **seed catalog** ([`src/data/seed/`](src/data/seed)).
- **Supabase connected** → serves live DB data and enables the owner admin at `/admin`.

So the site deploys and looks complete with zero backend; Supabase is additive.

## Going live — checklist

1. **Logo:** drop the official artwork at `public/brand/woodzy-logo.png` (see
   [`public/brand/README.md`](public/brand/README.md)).
2. **Deploy:** push to GitHub → import to Vercel (root = this folder).
3. **Supabase:**
   - Create a project; run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
   - Create the owner login under **Authentication → Users**.
   - In **Vercel → Settings → Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL`,
     `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, then **redeploy**
     (these are inlined at build time, so a rebuild is required).
   - Manage products/categories and watch orders at `/admin`.
4. **Payments (when ready):** set `paymentsEnabled = true`, add `RAZORPAY_KEY_ID` /
   `RAZORPAY_KEY_SECRET`, `npm i razorpay`, and finish the order-creation block in
   [`src/app/api/payments/create-order/route.ts`](src/app/api/payments/create-order/route.ts).

## Notes

- Seed product imagery is from Unsplash (placeholders); replace via the admin once live.
- This folder is its own git repo (the home directory is an unrelated accidental repo —
  always run git from inside this folder).
