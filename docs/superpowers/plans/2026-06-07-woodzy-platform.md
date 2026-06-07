# Woodzy Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Woodzy furniture storefront — a cinematic Next.js site with a briefcase-open intro → 360° turntable hero, full browse→cart→checkout, WhatsApp-quote ordering, a stubbed (grey) Razorpay layer, and an owner admin — running fully on local seed data before Supabase is connected.

**Architecture:** Next.js App Router (TS) renders the storefront. A data-access layer (`src/lib/catalog.ts`) returns Supabase data when env keys exist, else a bundled seed catalog — so the site deploys with zero DB. Cart is a persisted Zustand store. Checkout saves an order (best-effort, skipped without Supabase) and opens WhatsApp with an itemized quote. Razorpay is fully wired but inert behind `PAYMENTS_ENABLED`. Admin (Supabase-Auth) activates when keys are added.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · framer-motion · Zustand · @supabase/ssr + @supabase/supabase-js · zod · lucide-react.

**Verification note:** Logic units (config helpers, data fallback, cart math, WhatsApp builder, price/format utils, zod schemas) are built test-first with Vitest. Visual units (intro, turntable, pages) are verified by running `npm run dev` and checking the route in a browser; each such task lists exactly what to confirm.

---

## File Structure

```
woodzy/
├─ public/brand/            # logo raster drop-slot, wood-grain svg, og image
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx, page.tsx, globals.css, not-found.tsx
│  │  ├─ shop/page.tsx
│  │  ├─ category/[slug]/page.tsx
│  │  ├─ product/[slug]/page.tsx
│  │  ├─ cart/page.tsx
│  │  ├─ checkout/page.tsx
│  │  ├─ collections/page.tsx
│  │  ├─ our-story/page.tsx
│  │  ├─ showroom/page.tsx
│  │  ├─ admin/...           # owner area (conditional)
│  │  └─ api/payments/create-order/route.ts
│  ├─ components/
│  │  ├─ brand/Logo.tsx
│  │  ├─ intro/BriefcaseOpen.tsx, LandingIntro.tsx
│  │  ├─ hero/ShowroomTurntable.tsx
│  │  ├─ layout/Navbar.tsx, Footer.tsx, MegaMenu.tsx, MobileNav.tsx
│  │  ├─ cart/CartDrawer.tsx, CartButton.tsx
│  │  ├─ catalog/ProductCard.tsx, CategoryCard.tsx, ProductGallery.tsx, Filters.tsx
│  │  └─ home/*.tsx          # section components
│  ├─ store/cart.ts
│  ├─ lib/
│  │  ├─ catalog.ts          # data-access (supabase-or-seed)
│  │  ├─ whatsapp.ts         # quote message + wa.me url
│  │  ├─ format.ts           # formatINR etc.
│  │  ├─ schemas.ts          # zod
│  │  ├─ utils.ts            # cn()
│  │  └─ supabase/{client,server}.ts
│  ├─ data/seed/{categories,products}.ts
│  ├─ types/catalog.ts
│  └─ config/site.ts
├─ supabase/schema.sql
└─ (configs: tailwind, tsconfig, next.config, vitest)
```

---

## Phase 0 — Scaffold & foundation

### Task 1: Scaffold Next.js + deps + Tailwind theme

**Files:** Create the app in the existing `Woodzy/` folder (already a git repo with `docs/`).

- [ ] **Step 1: Scaffold in a temp dir, then move in** (create-next-app refuses a non-empty dir)

```bash
cd "/c/Users/test/OneDrive/Desktop"
npx create-next-app@latest woodzy-tmp --ts --tailwind --app --src-dir --eslint --import-alias "@/*" --no-turbopack --use-npm
# move everything (incl. dotfiles) into the existing repo, then remove temp
cp -r woodzy-tmp/. "Woodzy/"
rm -rf woodzy-tmp
cd "Woodzy"
# keep our .gitignore (has /.superpowers); merge next's entries if missing
```

- [ ] **Step 2: Install runtime + test deps**

```bash
npm i framer-motion zustand @supabase/ssr @supabase/supabase-js zod lucide-react clsx tailwind-merge
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Add Vitest config** — Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, include: ["src/**/*.test.{ts,tsx}"] },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 4: Tailwind brand theme** — In `tailwind.config.ts` extend colors + fonts:

```ts
extend: {
  colors: {
    wood: { darkest: "#4B2E14", dark: "#6B3E1D" },
    amber: { brand: "#C47A2C" },
    sand: "#E7DBC1",
    cream: "#F6F2E9",
  },
  fontFamily: { display: ["var(--font-fraunces)"], sans: ["var(--font-inter)"] },
}
```

- [ ] **Step 5: Verify dev server boots**

Run: `npm run dev` → open http://localhost:3000 → expect the default Next page. Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js app with brand Tailwind theme"
```

---

### Task 2: Site config (single source of toggles)

**Files:** Create `src/config/site.ts`, Test `src/config/site.test.ts`.

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { SITE, isServiceState } from "./site";

describe("site config", () => {
  it("has the owner whatsapp number with country code", () => {
    expect(SITE.whatsappNumber).toBe("916291663674");
  });
  it("ships only to configured regions", () => {
    expect(isServiceState("Bihar")).toBe(true);
    expect(isServiceState("Kerala")).toBe(false);
  });
  it("keeps online payments off by default", () => {
    expect(SITE.paymentsEnabled).toBe(false);
  });
});
```

- [ ] **Step 2: Run → FAIL** (`npx vitest run src/config/site.test.ts`).

- [ ] **Step 3: Implement `src/config/site.ts`**

```ts
export const SITE = {
  name: "Woodzy",
  tagline: "Warm Woods, Cozy Living.",
  whatsappNumber: "916291663674", // +91 prepended for wa.me
  instagram: "woodzy.furniture",
  email: "hello@woodzy.com",
  serviceRegions: ["Bihar", "Jharkhand", "West Bengal"] as const,
  paymentsEnabled: false, // flip true + add Razorpay keys to go live
  showPrices: true,
  showroom: {
    city: "Deoghar, Jharkhand",
    address: "TBD — owner to provide",
    hours: "Mon–Sun, 10:00–20:00",
  },
} as const;

export type ServiceRegion = (typeof SITE.serviceRegions)[number];
export const isServiceState = (s: string): boolean =>
  (SITE.serviceRegions as readonly string[]).includes(s);
```

- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: site config with region/payment toggles"`

---

### Task 3: Brand logo + assets

**Files:** Create `src/components/brand/Logo.tsx`, `public/brand/README.md`, `public/brand/wood-grain.svg`.

- [ ] **Step 1: Build `Logo.tsx`** — an inline SVG recreation of the mark: rounded square with amber/`#C47A2C` wood-grain upper + `wood.darkest` lower, white **W**, optional wordmark + tagline. Props: `variant: "mark" | "full"`, `className`. Prefer `/brand/woodzy-logo.png` via `next/image` when present, else the SVG (use a simple try: render SVG by default; raster swap is a later manual step documented in README).

```tsx
export function Logo({ variant = "full", className }: { variant?: "mark" | "full"; className?: string }) {
  return (
    <span className={className} aria-label="Woodzy">
      <svg viewBox="0 0 120 120" /* square mark: border, grain upper, W */ >
        {/* ...paths using #C47A2C grain, #4B2E14 fill, white W... */}
      </svg>
      {variant === "full" && (
        <span className="font-display">
          <strong>WOODZY</strong><em>Warm Woods, Cozy Living.</em>
        </span>
      )}
    </span>
  );
}
```

- [ ] **Step 2: `public/brand/README.md`** — instruct owner: "Drop the official logo here as `woodzy-logo.png` (and `.svg` if available). Favicon/OG will use it."
- [ ] **Step 3: `wood-grain.svg`** — a tileable concentric-grain pattern in `#C47A2C` on transparent, for section textures.
- [ ] **Step 4: Verify** — temporarily render `<Logo/>` on the home page, `npm run dev`, confirm mark looks on-brand at 32px and 96px. Remove temp render.
- [ ] **Step 5: Commit** `git commit -am "feat: brand logo component + asset slots"`

---

## Phase 1 — Types, schemas, seed, data layer

### Task 4: Types + zod schemas

**Files:** Create `src/types/catalog.ts`, `src/lib/schemas.ts`, Test `src/lib/schemas.test.ts`.

- [ ] **Step 1: `src/types/catalog.ts`**

```ts
export type Category = { id: string; slug: string; name: string; image: string; sortOrder: number };
export type Product = {
  id: string; slug: string; name: string; categorySlug: string;
  price: number; currency: "INR"; shortDesc: string; longDesc: string;
  materials: string[]; dimensions: string; finish: string;
  images: string[]; inStock: boolean; isFeatured: boolean; priceOnRequest: boolean;
};
export type OrderItem = { productId: string; name: string; qty: number; price: number };
export type Order = {
  customerName: string; customerPhone: string; customerEmail?: string;
  addressLine: string; locality: string; city: string; state: string; pincode: string;
  items: OrderItem[]; subtotal: number; notes?: string;
};
```

- [ ] **Step 2: Write failing test for checkout schema** (valid passes, bad phone/pincode/empty cart fail).

```ts
import { describe, it, expect } from "vitest";
import { checkoutSchema } from "./schemas";
const base = { customerName: "Asha", customerPhone: "9876543210", addressLine: "12 Main",
  locality: "Tower Chowk", city: "Deoghar", state: "Jharkhand", pincode: "814112",
  items: [{ productId: "p1", name: "Sofa", qty: 1, price: 100 }], subtotal: 100 };
describe("checkoutSchema", () => {
  it("accepts a valid order", () => { expect(checkoutSchema.safeParse(base).success).toBe(true); });
  it("rejects a 9-digit phone", () => {
    expect(checkoutSchema.safeParse({ ...base, customerPhone: "98765" }).success).toBe(false); });
  it("rejects an empty cart", () => {
    expect(checkoutSchema.safeParse({ ...base, items: [] }).success).toBe(false); });
});
```

- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: Implement `src/lib/schemas.ts`**

```ts
import { z } from "zod";
export const orderItemSchema = z.object({
  productId: z.string(), name: z.string(), qty: z.number().int().positive(), price: z.number().nonnegative(),
});
export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  addressLine: z.string().min(4),
  locality: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, "6-digit PIN"),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
  subtotal: z.number().nonnegative(),
  notes: z.string().optional(),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
```

- [ ] **Step 5: Run → PASS. Commit** `git commit -am "feat: catalog types + checkout zod schema"`

---

### Task 5: Seed catalog

**Files:** Create `src/data/seed/categories.ts`, `src/data/seed/products.ts`, `src/data/seed/README.md`.

- [ ] **Step 1: Categories** — 6 entries (sofas, beds, dining, tables, storage, decor) with `sortOrder` and a warm-wood Unsplash image URL each (use `https://images.unsplash.com/...?auto=format&fit=crop&w=800&q=70`).
- [ ] **Step 2: Products** — 18–24 entries spread across categories. Each: realistic name (e.g. "Aravalli Walnut 3-Seater Sofa"), ₹ price, short/long desc, materials (Walnut/Oak/Teak/Leather/Linen), dimensions, finish, 2–3 Unsplash image URLs, `inStock: true`, set `isFeatured: true` on ~6, `priceOnRequest: false`. Slugs kebab-case and unique.
- [ ] **Step 3: README** — list image source (Unsplash) + note "placeholder imagery; owner replaces via admin."
- [ ] **Step 4: Sanity test** `src/data/seed/seed.test.ts`: every product `categorySlug` exists in categories; all slugs unique; ≥1 featured.
- [ ] **Step 5: Run → PASS. Commit** `git commit -am "feat: seed catalog (categories + products)"`

---

### Task 6: Supabase clients + data-access fallback

**Files:** Create `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/catalog.ts`, Test `src/lib/catalog.test.ts`.

- [ ] **Step 1: Conditional Supabase clients** — each reads `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`; export `hasSupabase()` boolean; `getServerClient()` returns `null` when unset (never throws). Use `@supabase/ssr` `createBrowserClient`/`createServerClient`.

- [ ] **Step 2: Write failing test** — without env, the data layer returns seed data.

```ts
import { describe, it, expect } from "vitest";
import { getCategories, getProducts, getProductBySlug } from "./catalog";
describe("catalog data layer (no Supabase env)", () => {
  it("returns seed categories", async () => { expect((await getCategories()).length).toBeGreaterThan(0); });
  it("returns seed products", async () => { expect((await getProducts()).length).toBeGreaterThan(0); });
  it("finds a product by slug", async () => {
    const all = await getProducts();
    expect((await getProductBySlug(all[0].slug))?.id).toBe(all[0].id);
  });
});
```

- [ ] **Step 3: Run → FAIL.**
- [ ] **Step 4: Implement `src/lib/catalog.ts`** — each function: `if (!hasSupabase()) return <seed>;` else query Supabase and map rows → types. Functions: `getCategories()`, `getProducts(opts?: {category?, featured?})`, `getProductBySlug(slug)`, `getFeatured()`. Pure-seed path must be synchronous-safe (wrap in `Promise.resolve`).
- [ ] **Step 5: Run → PASS. Commit** `git commit -am "feat: supabase-or-seed data access layer"`

---

## Phase 2 — App shell

### Task 7: Root layout, fonts, globals, SEO

**Files:** Modify `src/app/layout.tsx`, `src/app/globals.css`. Create `src/lib/utils.ts` (`cn`).

- [ ] **Step 1: Fonts** — load Fraunces + Inter via `next/font/google`, expose `--font-fraunces`/`--font-inter` on `<html>`.
- [ ] **Step 2: globals.css** — CSS vars for brand colors, base `bg-cream text-wood-darkest`, selection color amber, smooth scroll, wood-grain utility class.
- [ ] **Step 3: Metadata** — title template `%s · Woodzy`, description, openGraph (use `/brand/og.png` placeholder), themeColor `#4B2E14`.
- [ ] **Step 4: `cn()` util** (clsx + tailwind-merge).
- [ ] **Step 5: Verify** `npm run dev` → fonts render, cream background. **Commit** `git commit -am "feat: root layout, fonts, brand globals, SEO defaults"`

---

### Task 8: Navbar + Footer + mobile nav

**Files:** Create `src/components/layout/{Navbar,Footer,MegaMenu,MobileNav}.tsx`. Modify `layout.tsx` to mount them.

- [ ] **Step 1: Navbar** — sticky, translucent-on-scroll; `<Logo variant="mark"/>` + wordmark; links Shop (hover MegaMenu of categories from `getCategories()`), Collections, Our Story, Showroom; search icon; `<CartButton/>`.
- [ ] **Step 2: MegaMenu** — category grid with thumbnails linking `/category/[slug]`.
- [ ] **Step 3: MobileNav** — hamburger → slide-over with the same links.
- [ ] **Step 4: Footer** — brand blurb + tagline, link columns, `@woodzy.furniture`, region line from `SITE.serviceRegions`, greyed "Online payments — coming soon".
- [ ] **Step 5: Verify** desktop + mobile widths in browser. **Commit** `git commit -am "feat: navbar, mega-menu, mobile nav, footer"`

---

### Task 9: Cart store (Zustand + persist)

**Files:** Create `src/store/cart.ts`, Test `src/store/cart.test.ts`.

- [ ] **Step 1: Write failing tests** — add increments qty for same product; subtotal = Σ price×qty; count = Σ qty; remove + updateQty + clear.

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "./cart";
const item = { productId: "p1", name: "Sofa", price: 100, image: "x", slug: "sofa" };
beforeEach(() => useCart.getState().clear());
describe("cart store", () => {
  it("adds and merges quantities", () => {
    useCart.getState().add(item); useCart.getState().add(item);
    expect(useCart.getState().count()).toBe(2);
    expect(useCart.getState().subtotal()).toBe(200);
  });
  it("updates and removes", () => {
    useCart.getState().add(item); useCart.getState().updateQty("p1", 5);
    expect(useCart.getState().subtotal()).toBe(500);
    useCart.getState().remove("p1"); expect(useCart.getState().count()).toBe(0);
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** `useCart` with `persist` (localStorage key `woodzy-cart`): state `lines: {…item, qty}[]`; actions `add/remove/updateQty/clear`; selectors `count()/subtotal()`.
- [ ] **Step 4: Run → PASS. Commit** `git commit -am "feat: persisted cart store"`

---

## Phase 3 — The showpiece

### Task 10: Briefcase intro

**Files:** Create `src/components/intro/BriefcaseOpen.tsx`, `src/components/intro/LandingIntro.tsx`. Mount `<LandingIntro/>` in `app/page.tsx`.

- [ ] **Step 1: `BriefcaseOpen`** — full-screen framer-motion overlay. Stages (mirror roopnow timings): backdrop+case fade-in 0–250ms; lid `y:[0,0,-135]` / tray `y:[0,0,135]` over 1.7s with warm radial glow; **W** logo blur→crisp + tagline 0.8–1.3s; auto-dismiss `autoDismissMs=2700` or on click; exit `opacity:0,y:80,scale:.96` 0.7s; `AnimatePresence onExitComplete={onDone}`. Walnut palette (`#6B3E1D`→`#1c1006`), brass clasp accent `#C47A2C`.
- [ ] **Step 2: `LandingIntro`** — `sessionStorage` key `woodzy_intro_seen`; skip if seen or `prefers-reduced-motion`; else render `<BriefcaseOpen onDone={…}/>`.
- [ ] **Step 3: Verify** — first load plays intro; reload in same tab → no replay; DevTools emulate reduced-motion → skipped; click dismisses early.
- [ ] **Step 4: Commit** `git commit -am "feat: wooden briefcase intro (once/session, reduced-motion aware)"`

---

### Task 11: 360° turntable hero

**Files:** Create `src/components/hero/ShowroomTurntable.tsx`, Test `src/components/hero/turntable.test.ts` (pure math helper). Use in home hero (Task 13).

- [ ] **Step 1: Extract math helper** `src/lib/turntable.ts` + failing test: `angleFor(index, total)` spreads N items across a 180° arc; `transformFor(index,total,rotation)` returns `{ rotateY, translateZ }`.

```ts
import { describe, it, expect } from "vitest";
import { angleFor } from "@/lib/turntable";
it("spreads items across a semicircle", () => {
  expect(angleFor(0, 5)).toBeCloseTo(-90);
  expect(angleFor(4, 5)).toBeCloseTo(90);
});
```

- [ ] **Step 2: Implement** `angleFor = (i,n)=> -90 + (180*i)/(n-1)`; `transformFor` maps angle+rotation → CSS 3D.
- [ ] **Step 3: Component** — `perspective` container; product cards (image + name + ₹) absolutely positioned via `rotateY(angle+rotation) translateZ(radius)`; glossy reflected floor (CSS gradient + mirrored copy, `mask`); slow auto-rotate via `requestAnimationFrame`; pointer/touch **drag to spin** (update rotation from deltaX); click a card → `router.push('/product/'+slug)`; pause auto-rotate on hover/drag. **Reduced-motion:** static fanned arc, no rAF.
- [ ] **Step 4: Run math test → PASS.** Verify in browser: drag spins smoothly, click navigates, mobile touch works.
- [ ] **Step 5: Commit** `git commit -am "feat: interactive 360 turntable hero"`

---

## Phase 4 — Catalog pages

### Task 12: Format util + cards

**Files:** Create `src/lib/format.ts`, Test `src/lib/format.test.ts`; `src/components/catalog/{ProductCard,CategoryCard}.tsx`.

- [ ] **Step 1: Failing test** for `formatINR`.

```ts
import { describe, it, expect } from "vitest";
import { formatINR } from "./format";
it("formats with the Indian grouping + ₹", () => {
  expect(formatINR(54999)).toBe("₹54,999");
  expect(formatINR(150000)).toBe("₹1,50,000");
});
```

- [ ] **Step 2: Implement** `formatINR = n => "₹" + n.toLocaleString("en-IN")`. Run → PASS.
- [ ] **Step 3: ProductCard** — image, name, `formatINR(price)` (or "Price on request" when `priceOnRequest`), wood hover lift, "Add to cart" (calls `useCart.add`) + link to detail.
- [ ] **Step 4: CategoryCard** — image + name → `/category/[slug]`.
- [ ] **Step 5: Commit** `git commit -am "feat: INR format + product/category cards"`

---

### Task 13: Home page sections

**Files:** Create `src/components/home/{Hero,CategoryStrip,NewArrivals,Pillars,Materials,StoryStrip,TrustStrip}.tsx`; assemble in `src/app/page.tsx`.

- [ ] **Step 1: Hero** — `<ShowroomTurntable items={featured}/>` + headline "Warm Woods, Cozy Living." + "Explore the Collection" CTA → `/shop`. Data via `getFeatured()`.
- [ ] **Step 2: Sections** — CategoryStrip (`getCategories`), NewArrivals (`getProducts` newest 8, ProductCard), Pillars (Natural/Warmth/Quality/Timeless icons), Materials (Walnut/Oak/Leather/Linen/Stone swatches), StoryStrip (Deoghar→region copy, NO pan-India claim), TrustStrip (delivery/installation/warranty/WhatsApp).
- [ ] **Step 3: Verify** full homepage scroll matches the approved wireframe order; intro→hero handoff smooth. **Commit** `git commit -am "feat: homepage sections"`

---

### Task 14: Shop + category listing

**Files:** Create `src/app/shop/page.tsx`, `src/app/category/[slug]/page.tsx`, `src/components/catalog/Filters.tsx`.

- [ ] **Step 1: `/shop`** — grid of all products; `Filters` (category, material, price range) via URL search params (server component reads `searchParams`).
- [ ] **Step 2: `/category/[slug]`** — `getProducts({category: slug})`; `generateStaticParams` from `getCategories`; `generateMetadata` per category; 404 via `notFound()` for unknown slug.
- [ ] **Step 3: Verify** filtering changes results; category pages render. **Commit** `git commit -am "feat: shop + category pages with filters"`

---

### Task 15: Product detail

**Files:** Create `src/app/product/[slug]/page.tsx`, `src/components/catalog/ProductGallery.tsx`.

- [ ] **Step 1: Page** — `getProductBySlug`; `notFound()` if missing; gallery, name, `formatINR`/POR, materials, dimensions, finish, long desc, qty stepper, **Add to cart** (opens CartDrawer), "Request on WhatsApp" quick link. `generateStaticParams` + `generateMetadata` (OG image = first product image).
- [ ] **Step 2: ProductGallery** — thumbnail rail + main image, keyboard accessible.
- [ ] **Step 3: Verify** add-to-cart updates count; gallery switches images. **Commit** `git commit -am "feat: product detail page"`

---

## Phase 5 — Cart & checkout

### Task 16: Cart drawer + cart page

**Files:** Create `src/components/cart/CartDrawer.tsx`, `src/components/cart/CartButton.tsx`, `src/app/cart/page.tsx`. Mount drawer in layout.

- [ ] **Step 1: CartButton** — cart icon with live `count()` badge; opens drawer (drawer open-state in a small Zustand/ui store or local context).
- [ ] **Step 2: CartDrawer** — slide-over: line items (image, name, qty stepper, line total), `subtotal()`, "Checkout" → `/checkout`, empty state.
- [ ] **Step 3: `/cart`** — full-page equivalent.
- [ ] **Step 4: Verify** add/remove/qty reflect everywhere; persists across reload. **Commit** `git commit -am "feat: cart drawer + cart page"`

---

### Task 17: WhatsApp quote builder

**Files:** Create `src/lib/whatsapp.ts`, Test `src/lib/whatsapp.test.ts`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from "vitest";
import { buildQuoteMessage, buildWhatsappUrl } from "./whatsapp";
const order = { customerName: "Asha", customerPhone: "9876543210", addressLine: "12 Main",
  locality: "Tower Chowk", city: "Deoghar", state: "Jharkhand", pincode: "814112",
  items: [{ productId: "p1", name: "Aravalli Sofa", qty: 2, price: 54999 }], subtotal: 109998 };
describe("whatsapp quote", () => {
  it("lists items, qty and subtotal", () => {
    const m = buildQuoteMessage(order);
    expect(m).toContain("Aravalli Sofa");
    expect(m).toContain("x2");
    expect(m).toContain("₹1,09,998");
    expect(m).toContain("Asha");
  });
  it("builds a wa.me url to the owner number, url-encoded", () => {
    const url = buildWhatsappUrl(order);
    expect(url.startsWith("https://wa.me/916291663674?text=")).toBe(true);
    expect(url).not.toContain("\n"); // encoded
  });
});
```

- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement** — `buildQuoteMessage(order)` returns a human-readable quote (greeting, itemized lines `• Name x{qty} — {formatINR(price*qty)}`, subtotal, customer + full address + notes); `buildWhatsappUrl(order) = "https://wa.me/" + SITE.whatsappNumber + "?text=" + encodeURIComponent(msg)`.
- [ ] **Step 4: Run → PASS. Commit** `git commit -am "feat: whatsapp quote message + url builder"`

---

### Task 18: Checkout (order save + WhatsApp + grey payment) + Razorpay stub

**Files:** Create `src/app/checkout/page.tsx`, `src/app/checkout/actions.ts` (server action), `src/app/api/payments/create-order/route.ts`, `src/components/checkout/PaymentStep.tsx`.

- [ ] **Step 1: Checkout form** — fields per `checkoutSchema`; `state` is a `<select>` of `SITE.serviceRegions`; client-validates with zod; shows order summary from cart.
- [ ] **Step 2: Submit flow** — on valid submit: call `saveOrder` server action → **best-effort** insert into Supabase `orders` (if `hasSupabase()`, else resolve no-op, never block/throw); then `window.location.href = buildWhatsappUrl(order)`; then route to a confirmation state ("Quote sent on WhatsApp — we'll confirm shortly") and `clear()` cart.
- [ ] **Step 3: PaymentStep (grey)** — when `SITE.paymentsEnabled === false`: render a disabled "Pay online — coming soon" button + helper text; WhatsApp quote is the primary CTA. When true (future): render Razorpay button calling the API route.
- [ ] **Step 4: Razorpay stub route** — `/api/payments/create-order`: if `!SITE.paymentsEnabled` or missing keys → `503 {error:"payments_disabled"}`; else create a Razorpay order from `{amount}` (code present, guarded). No keys committed.
- [ ] **Step 5: Verify** — invalid form blocks; valid submit opens WhatsApp with correct prefilled text; cart clears; payment button is visibly disabled. **Commit** `git commit -am "feat: checkout → whatsapp quote + saved order + grey razorpay layer"`

---

## Phase 6 — Content pages

### Task 19: Collections, Our Story, Showroom

**Files:** Create `src/app/collections/page.tsx`, `src/app/our-story/page.tsx`, `src/app/showroom/page.tsx`.

- [ ] **Step 1: Collections** — curated edits (e.g. "Living Room", "Bedroom") as filtered product groups.
- [ ] **Step 2: Our Story** — brand narrative (Deoghar workshop, Bihar–Jharkhand heartland, materials & craft), pillars, photo bands.
- [ ] **Step 3: Showroom** — `SITE.showroom` city/address/hours, WhatsApp/call CTAs, map embed placeholder, region-served line.
- [ ] **Step 4: Verify** routes render + linked from nav/footer. **Commit** `git commit -am "feat: collections, our-story, showroom pages"`

---

## Phase 7 — Supabase schema + owner admin (conditional)

### Task 20: Supabase schema + RLS

**Files:** Create `supabase/schema.sql`, `.env.example`.

- [ ] **Step 1: schema.sql** — `categories`, `products`, `orders` tables matching `src/types/catalog.ts`; `storage` bucket `product-images`; RLS: public `select` on products/categories; public `insert` on orders; `select`/all writes restricted to authenticated owner. Seed-insert categories.
- [ ] **Step 2: `.env.example`** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (all blank).
- [ ] **Step 3: Commit** `git commit -am "feat: supabase schema, RLS, env example"`

---

### Task 21: Admin area

**Files:** Create `src/app/admin/layout.tsx` (auth gate), `src/app/admin/page.tsx` (orders inbox), `src/app/admin/products/page.tsx` (+ form), `src/app/admin/categories/page.tsx`. Uses Supabase Auth + service client.

- [ ] **Step 1: Auth gate** — if `!hasSupabase()` show "Connect Supabase to enable admin"; else Supabase email login; redirect unauthenticated to login.
- [ ] **Step 2: Products** — list/create/edit (name, price, category, desc, materials, dimensions, stock, featured) + image upload to Storage bucket.
- [ ] **Step 3: Categories** — CRUD + sort.
- [ ] **Step 4: Orders inbox** — list orders, view detail, update `status`.
- [ ] **Step 5: Verify** — without env, gate message shows; with env, CRUD works (manual, post-connection). **Commit** `git commit -am "feat: owner admin (products, categories, orders) behind supabase gate"`

---

## Phase 8 — Polish, a11y, deploy prep

### Task 22: Responsive, accessibility, SEO

**Files:** Create `src/app/not-found.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, loading/error states; touch various components.

- [ ] **Step 1:** Responsive audit (320/768/1280): nav, hero turntable, grids, checkout.
- [ ] **Step 2:** A11y: image `alt` from product names, focus-visible rings, drawer/menu focus trap + Esc, `prefers-reduced-motion` honored (intro + turntable), color-contrast check on amber-on-cream.
- [ ] **Step 3:** SEO: per-page metadata, `sitemap.ts` from catalog, `robots.ts`, OG image.
- [ ] **Step 4:** 404 + route `loading.tsx` skeletons.
- [ ] **Step 5: Commit** `git commit -am "polish: responsive, a11y, SEO, 404/loading"`

---

### Task 23: README + final local verification

**Files:** Create `README.md`.

- [ ] **Step 1: README** — project overview, run steps, "going live" checklist (drop logo, connect Supabase + run `schema.sql`, set `PAYMENTS_ENABLED=true` + Razorpay keys), config toggles, deploy-to-Vercel notes.
- [ ] **Step 2: Full check** — `npm run test` (all green), `npm run build` (no type/build errors), `npm run dev` smoke test of every route + cart→checkout→WhatsApp.
- [ ] **Step 3: Commit** `git commit -am "docs: README + go-live checklist"`
- [ ] **Step 4: Await GitHub repo link from owner**, then add remote + push (do NOT push before the link is provided).

---

## Self-Review (against spec)

- **Spec §3 stack** → Task 1. **§4 brand tokens/logo/fonts** → Tasks 1,3,7. **§5 intro+turntable** → Tasks 10,11. **§6 site map** → Tasks 13–19,21. **§7 data model + seed fallback** → Tasks 4,5,6,20. **§8 cart→checkout→WhatsApp** → Tasks 9,16,17,18. **§9 Razorpay grey** → Task 18 (+API route). **§10 admin** → Task 21. **§11 config toggles** → Task 2. **§12 imagery** → Tasks 3,5. **§13 build sequence** → phase order matches. **§14 open items** → READMEs + Task 23 checklist. No spec section left without a task.
- **Placeholder scan:** code-bearing steps include real code; UI tasks carry explicit verify criteria. `public/brand/README` + showroom address are genuine owner-supplied externals, not plan placeholders.
- **Type consistency:** `Product`/`Category`/`Order`/`OrderItem` from Task 4 reused verbatim in seed (5), data layer (6), cart line shape (9), whatsapp builder (17), schema (20). `formatINR`, `buildQuoteMessage`/`buildWhatsappUrl`, `getProducts`/`getCategories`/`getProductBySlug`/`getFeatured`, `useCart` names consistent across tasks.
```
