# Woodzy — E-commerce Platform Design Spec

**Date:** 2026-06-07
**Status:** Approved (brainstorm) → ready for implementation plan
**Owner:** Mayank (building for client: Woodzy furniture store, Deoghar, Jharkhand)

---

## 1. Summary

Woodzy is a furniture & luxury-goods store launching in Deoghar, Jharkhand. This is its
direct-to-consumer web platform: a cinematic, premium storefront with a full browse → cart →
checkout flow. Until the Razorpay gateway is onboarded, **checkout routes the order to the
owner's WhatsApp as an itemized quote** (and saves the order). The online-payment layer is fully
architected but **disabled (grey)** behind a feature flag, ready to flip live later.

Brand essence: *Warm Woods, Cozy Living.* — natural, warmth, quality, timeless.

## 2. Goals & non-goals

**Goals**
- A landing experience that is astonishingly catchy: a wooden-briefcase-opening intro that hands
  off into a glossy interactive 360° furniture showroom.
- Complete commerce layers: catalog, product detail, cart, checkout.
- WhatsApp-quote checkout now; Razorpay architected but greyed, flip-to-live with no rework.
- Owner can run the shop himself (manage products + see orders) once Supabase is connected.
- Storefront runs **fully on local seed data** so it deploys and looks real before any DB exists.

**Non-goals (v1)**
- Customer accounts/login (guest checkout only).
- Live online payments (stubbed, off).
- Marketplace integrations (Amazon/Flipkart are separate channels, not in this webapp).
- Pan-India delivery messaging now (scoped to Bihar/Jharkhand/West Bengal; toggle-able via config).

## 3. Stack & deployment

- **Next.js (App Router) + TypeScript**, **Tailwind CSS**, **framer-motion**, **lucide-react**, **zod**.
- **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) — auth, Postgres, Storage. Connected later.
- Deploy: **Vercel**. Repo: **fresh `git init` inside the Woodzy folder** (the folder currently
  inherits a git repo rooted at the home dir `C:/Users/test`; Woodzy must be its own isolated repo).
- Flow: build → push to GitHub → Vercel → connect Supabase.

## 4. Brand system (design tokens)

| Token | Hex | Use |
|---|---|---|
| `--wood-darkest` | `#4B2E14` | headings, footer, primary text |
| `--wood-dark` | `#6B3E1D` | secondary surfaces, hovers |
| `--amber` | `#C47A2C` | **primary CTA / accent** |
| `--sand` | `#E7DBC1` | cards, surfaces |
| `--cream` | `#F6F2E9` | page background |

- **Type:** *Fraunces* (display serif, headings) + *Inter* (body). Loaded via `next/font`.
- **Logo:** recreated as scalable **SVG** (wood-grain square + white **W** + WOODZY wordmark +
  tagline). Original raster drop-slot at `/public/brand/woodzy-logo.png` (used for favicon/OG where
  raster is preferred). Wood-grain brand pattern as subtle section texture.
- **Tagline:** *Warm Woods, Cozy Living.*

## 5. The showpiece — intro + hero

### 5a. Intro (`LandingIntro` + `BriefcaseOpen`)
- Plays **once per session** (`sessionStorage` gate), **respects `prefers-reduced-motion`** (skips).
- Beats: (01) dark stage, closed walnut briefcase → (02) lid swings up / tray drops, warm light
  spills → (03) **W** mark rises blur→crisp with tagline → (04) camera pulls back into the turntable.
- framer-motion; auto-dismiss ~2.7s or on click/tap. Pattern adapted from roopnow's `BriefcaseOpen`.

### 5b. Hero — live 360° turntable (`ShowroomTurntable`)
- Real product images on cards arranged in a **CSS-3D semicircle** on a glossy reflective floor.
- Auto-rotates slowly; **grab-and-spin** via drag/swipe (pointer + touch).
- Click a piece → flies forward → "View product" → links to `/product/[slug]`.
- **No Three.js** — CSS 3D transforms (`rotateY` + `translateZ` on an arc, container rotation).
- Reduced-motion / low-power fallback: static fanned arc, no auto-rotate.
- Headline *Warm Woods, Cozy Living* + **Explore the Collection** CTA.

## 6. Site map (App Router)

| Route | Purpose |
|---|---|
| `/` | Home: intro + turntable hero + sections (below) |
| `/shop` | All products; filters: category, material, price |
| `/category/[slug]` | Category listing |
| `/product/[slug]` | Product detail: gallery, price, materials, dimensions, add-to-cart |
| `/cart` | Cart page (also a slide-over drawer site-wide) |
| `/checkout` | Address form → save order + WhatsApp quote; payment step (grey) |
| `/collections` | Curated edits ("Living room", "Bedroom", etc.) |
| `/our-story` | Brand story (Deoghar workshop, Bihar–Jharkhand heartland) |
| `/showroom` | Visit info, contact, map, hours |
| `/admin` | Owner: product/category CRUD + orders inbox (Supabase-auth gated) |

**Homepage section order:** Nav → Hero (turntable) → Shop by Category → New Arrivals →
Why Woodzy (4 pillars: Natural/Warmth/Quality/Timeless) → Materials (Walnut/Oak/Leather/Linen/Stone)
→ Brand Story strip → Trust strip (delivery/installation/warranty/WhatsApp) → Footer.

**Categories (seed, editable in admin):** Sofas · Beds · Dining · Tables · Storage · Decor.

## 7. Data model (Supabase) + seed fallback

A **data-access layer** reads from Supabase when env keys are present, otherwise from a bundled
**seed catalog** (`/src/data/seed/*`). Storefront is fully functional on seed data with no DB.

- **categories** — `id, slug, name, image, sort_order`
- **products** — `id, slug, name, category_slug, price (int, ₹), currency, short_desc, long_desc,
  materials[], dimensions, finish, images[] (Supabase Storage URLs), in_stock, is_featured,
  price_on_request, created_at`
- **orders** — `id, created_at, customer_name, customer_phone, customer_email, address_line,
  locality, city, state, pincode, items (jsonb: [{product_id, name, qty, price}]), subtotal,
  status (new|contacted|confirmed|delivered|cancelled), channel ('whatsapp'), notes`

**RLS:** `products`/`categories` public **read**; `orders` public **insert** (guest checkout) but
owner-only **read**; all other writes owner-only (Supabase Auth single owner user).

## 8. Cart → checkout → WhatsApp (+ saved order)

- Guest cart in **localStorage** (Zustand store with persist middleware). Cart drawer + `/cart` page.
- Checkout form (zod-validated): name, phone, email (optional), address line, locality, city,
  **state** (from `SERVICE_REGIONS`), pincode, notes.
- On submit:
  1. Best-effort **save order** to Supabase (no-op/skip if not connected — never blocks).
  2. Open **WhatsApp** (`https://wa.me/916291663674?text=...`) prefilled with an itemized quote:
     each item (name × qty @ ₹price), subtotal, customer name + full address + notes.
- Confirmation screen: "Your quote request has been sent on WhatsApp — we'll confirm shortly."

## 9. Razorpay — architected, disabled (grey)

- Checkout shows a **payment step** with a disabled **"Pay online (coming soon)"** button when
  `PAYMENTS_ENABLED=false`; WhatsApp quote is the active CTA.
- Plumbing present but inert: `/api/payments/create-order` route (Razorpay order creation) +
  amount calculation + client handler — guarded by the flag and env keys.
- Going live = set `PAYMENTS_ENABLED=true` + add `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`. No rework.

## 10. Owner admin (`/admin`)

- Supabase-Auth login (single owner). Available once Supabase is connected.
- **Products:** list, create, edit, **upload photos** (Supabase Storage), set price/stock/feature.
- **Categories:** manage + sort.
- **Orders inbox:** incoming quotes, update status (new → contacted → confirmed → delivered).

## 11. Configuration (single `src/config/site.ts`)

All owner-toggle-able in one place:
- `WHATSAPP_NUMBER = "916291663674"`
- `SERVICE_REGIONS = ["Bihar", "Jharkhand", "West Bengal"]` — drives delivery copy + checkout state list
- `PAYMENTS_ENABLED = false`
- `SHOW_PRICES = true`
- Brand constants (name, tagline, socials `@woodzy.furniture`, showroom address/hours).

Env (`.env.example` committed; real `.env.local` later): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

## 12. Imagery & assets

- Starter catalog seeded with **curated premium furniture photos** (warm-wood tone; free sources
  e.g. Unsplash/Pexels) so the site looks real on day one. Owner swaps real product photos via admin.
- Brand assets in `/public/brand/` (logo SVG + raster drop-slot, wood-grain pattern, OG image).
- All seed images referenced by stable URLs; document sources in `/src/data/seed/README`.

## 13. Build sequence (high level)

1. Scaffold Next.js + Tailwind + tokens + fonts + brand SVG/logo + git init.
2. Layout shell: nav (mega-menu), footer, cart drawer scaffold, config file.
3. Intro (`BriefcaseOpen`/`LandingIntro`) + hero `ShowroomTurntable`.
4. Data layer + seed catalog; `/shop`, `/category/[slug]`, `/product/[slug]`.
5. Cart state + `/cart` + `/checkout` → WhatsApp quote + order-save; Razorpay stub (grey).
6. Content pages: `/collections`, `/our-story`, `/showroom`; homepage sections.
7. Supabase integration (conditional) + `/admin` (products, categories, orders).
8. Responsive pass, accessibility (reduced-motion, focus, alt text), SEO/OG, deploy to Vercel.

## 14. Open items (non-blocking)

- Official raster logo file dropped at `/public/brand/woodzy-logo.png` by owner.
- Supabase project + keys (added after first deploy).
- Real product catalog content (replaces seed) via admin once live.
- Showroom address / hours / map coordinates for `/showroom`.
