import type { Product } from "@/types/catalog";

/** Unsplash helper — all IDs verified to return 200. */
const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

/**
 * Placeholder starter catalog so the storefront looks real before Supabase is
 * connected. The owner replaces these via the admin once live.
 */
export const seedProducts: Product[] = [
  // ----------------------------- Sofas -----------------------------
  {
    id: "p1", slug: "aravalli-walnut-3-seater-sofa", name: "Aravalli Walnut 3-Seater Sofa",
    categorySlug: "sofas", price: 54999, currency: "INR",
    shortDesc: "Solid walnut frame with deep cushioned seating.",
    longDesc:
      "Hand-built on a kiln-dried walnut frame, the Aravalli pairs a sculpted wooden base with high-resilience foam and feather-blend cushions. A timeless centrepiece for warm, cozy living rooms.",
    materials: ["Walnut", "Linen"], dimensions: 'W 84" × D 36" × H 32"', finish: "Natural matte",
    images: [u("1555041469-a586c61ea9bc"), u("1493663284031-b7e3aefcae8e")],
    inStock: true, isFeatured: true, priceOnRequest: false,
  },
  {
    id: "p2", slug: "kashmiri-teak-loveseat", name: "Kashmiri Teak 2-Seater Loveseat",
    categorySlug: "sofas", price: 38999, currency: "INR",
    shortDesc: "Compact teak loveseat for snug corners.",
    longDesc:
      "A two-seater in solid teak with hand-rubbed oil finish and removable linen cushions. Built for apartments and reading nooks that still want a touch of craft.",
    materials: ["Teak", "Linen"], dimensions: 'W 56" × D 34" × H 31"', finish: "Oiled teak",
    images: [u("1567538096630-e0c55bd6374c")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },
  {
    id: "p3", slug: "sundar-linen-sectional", name: "Sundar Linen Sectional Sofa",
    categorySlug: "sofas", price: 89999, currency: "INR",
    shortDesc: "L-shaped sectional with a sturdy hardwood base.",
    longDesc:
      "The Sundar sectional seats the whole family. A solid hardwood understructure carries plush, deep linen-wrapped cushions with a chaise that can sit on either side.",
    materials: ["Sheesham", "Linen"], dimensions: 'W 112" × D 64" × H 33"', finish: "Honey matte",
    images: [u("1550226891-ef816aed4a98"), u("1484101403633-562f891dc89a")],
    inStock: true, isFeatured: true, priceOnRequest: false,
  },
  {
    id: "p4", slug: "heritage-leather-recliner", name: "Heritage Leather Recliner",
    categorySlug: "sofas", price: 64999, currency: "INR",
    shortDesc: "Full-grain leather recliner on a walnut frame.",
    longDesc:
      "A single-seat recliner upholstered in full-grain leather that ages beautifully, mounted on a walnut frame with a smooth manual recline mechanism.",
    materials: ["Walnut", "Leather"], dimensions: 'W 34" × D 38" × H 40"', finish: "Tan leather",
    images: [u("1484101403633-562f891dc89a")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },

  // ----------------------------- Beds ------------------------------
  {
    id: "p5", slug: "sheesham-king-bed", name: "Sheesham King Bed",
    categorySlug: "beds", price: 72999, currency: "INR",
    shortDesc: "Solid sheesham king bed with a slatted headboard.",
    longDesc:
      "A grounding king-size bed in solid sheesham (Indian rosewood) with a panelled headboard and a low, modern profile. Engineered slats need no box spring.",
    materials: ["Sheesham"], dimensions: 'W 78" × L 84" × H 42"', finish: "Walnut stain",
    images: [u("1505693416388-ac5ce068fe85"), u("1522771739844-6a9f6d5f14af")],
    inStock: true, isFeatured: true, priceOnRequest: false,
  },
  {
    id: "p6", slug: "oakwood-queen-storage-bed", name: "Oakwood Queen Storage Bed",
    categorySlug: "beds", price: 58999, currency: "INR",
    shortDesc: "Queen bed with hydraulic under-storage.",
    longDesc:
      "Clever oak-veneer bed with a lift-up hydraulic base, turning the whole footprint into hidden storage — ideal for compact city bedrooms.",
    materials: ["Oak"], dimensions: 'W 66" × L 78" × H 40"', finish: "Natural oak",
    images: [u("1522771739844-6a9f6d5f14af")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },
  {
    id: "p7", slug: "minimalist-teak-platform-bed", name: "Minimalist Teak Platform Bed",
    categorySlug: "beds", price: 49999, currency: "INR",
    shortDesc: "Low teak platform bed, Japandi-inspired.",
    longDesc:
      "A calm, low-slung platform bed in teak with a floating-edge detail. Quiet lines for a restful, clutter-free bedroom.",
    materials: ["Teak"], dimensions: 'W 66" × L 78" × H 14"', finish: "Oiled teak",
    images: [u("1540518614846-7eded433c457")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },

  // ---------------------------- Dining -----------------------------
  {
    id: "p8", slug: "banaras-6-seater-dining-set", name: "Banaras 6-Seater Dining Set",
    categorySlug: "dining", price: 78000, currency: "INR",
    shortDesc: "Solid wood table with six cushioned chairs.",
    longDesc:
      "The Banaras set anchors family dinners — a thick solid-wood top on tapered legs, paired with six chairs upholstered in an easy-clean weave.",
    materials: ["Sheesham", "Fabric"], dimensions: 'Table: L 72" × W 38" × H 30"', finish: "Provincial teak",
    images: [u("1617806118233-18e1de247200"), u("1530018607912-eff2daa1bac4")],
    inStock: true, isFeatured: true, priceOnRequest: false,
  },
  {
    id: "p9", slug: "rosewood-4-seater-dining-table", name: "Rosewood 4-Seater Dining Table",
    categorySlug: "dining", price: 45999, currency: "INR",
    shortDesc: "Compact rosewood dining table for four.",
    longDesc:
      "A warm rosewood four-seater with a rounded-corner top and sturdy splayed legs. Right-sized for apartments without skimping on presence.",
    materials: ["Rosewood"], dimensions: 'L 54" × W 34" × H 30"', finish: "Deep walnut",
    images: [u("1530018607912-eff2daa1bac4")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },
  {
    id: "p10", slug: "cafe-round-dining-table", name: "Cafe Round Dining Table",
    categorySlug: "dining", price: 28999, currency: "INR",
    shortDesc: "Round two-seater bistro table.",
    longDesc:
      "A charming round-top café table in solid wood with a single turned pedestal — perfect for breakfast corners and balconies.",
    materials: ["Mango Wood"], dimensions: 'Ø 36" × H 30"', finish: "Honey matte",
    images: [u("1577140917170-285929fb55b7")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },

  // ---------------------------- Tables -----------------------------
  {
    id: "p11", slug: "walnut-coffee-table", name: "Walnut Coffee Table",
    categorySlug: "tables", price: 18999, currency: "INR",
    shortDesc: "Two-tier walnut coffee table with shelf.",
    longDesc:
      "A grounded walnut coffee table with a lower display shelf and softened edges — the warm heart of the living room.",
    materials: ["Walnut"], dimensions: 'L 44" × W 24" × H 18"', finish: "Natural matte",
    images: [u("1532372320572-cda25653a26d")],
    inStock: true, isFeatured: true, priceOnRequest: false,
  },
  {
    id: "p12", slug: "live-edge-console-table", name: "Live-Edge Console Table",
    categorySlug: "tables", price: 24999, currency: "INR",
    shortDesc: "Live-edge console on slim metal legs.",
    longDesc:
      "A single live-edge plank, finished to show its natural grain and contour, on slim black metal legs. A striking entryway or sofa-back console.",
    materials: ["Acacia", "Metal"], dimensions: 'L 48" × W 14" × H 30"', finish: "Natural live-edge",
    images: [u("1524758631624-e2822e304c36")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },
  {
    id: "p13", slug: "nesting-side-tables-set-of-2", name: "Nesting Side Tables (Set of 2)",
    categorySlug: "tables", price: 12999, currency: "INR",
    shortDesc: "Pair of stackable wooden side tables.",
    longDesc:
      "A versatile pair of nesting tables that tuck together or spread out as needed — solid tops with gently splayed legs.",
    materials: ["Mango Wood"], dimensions: 'Large: Ø 18" × H 22"', finish: "Two-tone walnut",
    images: [u("1532372320572-cda25653a26d")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },

  // ---------------------------- Storage ----------------------------
  {
    id: "p14", slug: "oak-4-door-wardrobe", name: "Oak 4-Door Wardrobe",
    categorySlug: "storage", price: 62500, currency: "INR",
    shortDesc: "Spacious four-door oak wardrobe.",
    longDesc:
      "A full-height four-door wardrobe in oak with a mix of hanging space, shelves and soft-close drawers. Quietly handsome, generously practical.",
    materials: ["Oak"], dimensions: 'W 72" × D 24" × H 84"', finish: "Natural oak",
    images: [u("1558997519-83ea9252edf8")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },
  {
    id: "p15", slug: "teak-bookshelf", name: "Teak Open Bookshelf",
    categorySlug: "storage", price: 21999, currency: "INR",
    shortDesc: "Five-tier open teak bookshelf.",
    longDesc:
      "An airy five-tier bookshelf in solid teak — open on both sides so it doubles as a gentle room divider.",
    materials: ["Teak"], dimensions: 'W 36" × D 14" × H 72"', finish: "Oiled teak",
    images: [u("1594620302200-9a762244a156")],
    inStock: true, isFeatured: true, priceOnRequest: false,
  },
  {
    id: "p16", slug: "sideboard-cabinet", name: "Sideboard Storage Cabinet",
    categorySlug: "storage", price: 34999, currency: "INR",
    shortDesc: "Low sideboard with doors and drawers.",
    longDesc:
      "A low sideboard for the dining or living room — wooden doors, felt-lined drawers and a top that's ready for lamps, plants and platters.",
    materials: ["Sheesham"], dimensions: 'W 60" × D 18" × H 30"', finish: "Walnut stain",
    images: [u("1558997519-83ea9252edf8")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },

  // ----------------------------- Decor -----------------------------
  {
    id: "p17", slug: "lounge-accent-chair", name: "Lounge Accent Chair",
    categorySlug: "decor", price: 19999, currency: "INR",
    shortDesc: "Curved-back accent chair with wooden arms.",
    longDesc:
      "A sculpted lounge chair with a curved upholstered back cradled by solid wooden arms — the kind of seat you sink into with a book.",
    materials: ["Ash Wood", "Fabric"], dimensions: 'W 30" × D 32" × H 30"', finish: "Natural ash",
    images: [u("1503602642458-232111445657"), u("1567016376408-0226e4d0c1ea")],
    inStock: true, isFeatured: true, priceOnRequest: false,
  },
  {
    id: "p18", slug: "rattan-armchair", name: "Rattan & Teak Armchair",
    categorySlug: "decor", price: 15999, currency: "INR",
    shortDesc: "Woven rattan seat on a teak frame.",
    longDesc:
      "Breezy and light, this armchair weaves natural rattan across a teak frame — a relaxed accent for sunrooms and balconies.",
    materials: ["Teak", "Rattan"], dimensions: 'W 27" × D 29" × H 32"', finish: "Natural rattan",
    images: [u("1567016376408-0226e4d0c1ea")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },
  {
    id: "p19", slug: "wooden-rocking-chair", name: "Classic Wooden Rocking Chair",
    categorySlug: "decor", price: 17999, currency: "INR",
    shortDesc: "Heirloom-style solid wood rocker.",
    longDesc:
      "A heirloom-style rocking chair in solid wood with a contoured seat and gentle curved runners — comfort that lasts generations.",
    materials: ["Sheesham"], dimensions: 'W 24" × D 38" × H 42"', finish: "Provincial teak",
    images: [u("1416879595882-3373a0480b5b")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },
  {
    id: "p20", slug: "carved-accent-stool", name: "Hand-Carved Accent Stool",
    categorySlug: "decor", price: 8999, currency: "INR",
    shortDesc: "Hand-carved solid wood stool / side perch.",
    longDesc:
      "A petite hand-carved stool that moonlights as a plant stand or side perch. Each piece carries the marks of the artisan's chisel.",
    materials: ["Mango Wood"], dimensions: 'Ø 14" × H 18"', finish: "Distressed natural",
    images: [u("1538688525198-9b88f6f53126")],
    inStock: true, isFeatured: false, priceOnRequest: false,
  },
];
