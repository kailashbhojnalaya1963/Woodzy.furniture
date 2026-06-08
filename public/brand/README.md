# Woodzy brand assets

- `woodzy-logo.jpeg` — official logo (white background). Used for the **favicon**,
  apple-touch-icon and **Open Graph / social share** image (set in `src/app/layout.tsx`).
- `woodzy-logo.png` — **transparent-background** version, generated from the JPEG by
  `scripts/make-transparent-logo.cjs` (edge flood-fill keeps the white "W" intact). Kept available,
  but not currently wired into the UI.
- `wood-grain.svg` — subtle section texture (used by the `.wood-grain` CSS class).

The in-app logo (navbar, mobile menu, footer, briefcase intro) renders from the vector mark in
`src/components/brand/Logo.tsx`, which scales crisply and adapts to light/dark backgrounds.

To regenerate the transparent PNG after replacing the JPEG: `node scripts/make-transparent-logo.cjs`.
