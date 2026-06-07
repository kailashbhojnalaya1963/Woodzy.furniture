# Seed catalog

Placeholder catalog that powers the storefront **before Supabase is connected**, so the
site looks real on day one. Once Supabase is wired up and products are added via `/admin`,
the data layer (`src/lib/catalog.ts`) reads from the database instead and ignores this seed.

- **Images:** Unsplash (`images.unsplash.com`), `?auto=format&fit=crop&q=70`. All photo IDs were
  verified to return HTTP 200. They are placeholders — the owner replaces them with real product
  photos through the admin.
- **Prices:** indicative ₹ values for demo purposes.

To change the starter catalog before launch, edit `categories.ts` / `products.ts`.
