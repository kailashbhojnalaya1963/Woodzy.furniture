# Woodzy brand assets

- `woodzy-logo.jpeg` — official logo (white background). Used for the **favicon**,
  apple-touch-icon and **Open Graph / social share** image (set in `src/app/layout.tsx`).
- `woodzy-logo.png` — **transparent-background** version, generated from the JPEG by
  `scripts/make-transparent-logo.cjs` (edge flood-fill keeps the white "W" intact). Used as the
  **header logo** in the navbar + mobile menu, which sit on the cream surface.
- `wood-grain.svg` — subtle section texture (used by the `.wood-grain` CSS class).

The dark footer and the briefcase intro use the vector mark in
`src/components/brand/Logo.tsx` (light variant), because the logo's dark wordmark would disappear
on the dark wood backgrounds. To show the real lockup there too, add an **inverted/white logo**
file and we can swap it in.

To regenerate the transparent PNG after replacing the JPEG: `node scripts/make-transparent-logo.cjs`.
