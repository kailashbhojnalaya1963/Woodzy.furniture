import type { Category } from "@/types/catalog";

/** Unsplash helper — all IDs verified to return 200. */
const u = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const seedCategories: Category[] = [
  { id: "c-sofas", slug: "sofas", name: "Sofas", image: u("1555041469-a586c61ea9bc"), sortOrder: 1 },
  { id: "c-beds", slug: "beds", name: "Beds", image: u("1505693416388-ac5ce068fe85"), sortOrder: 2 },
  { id: "c-dining", slug: "dining", name: "Dining", image: u("1617806118233-18e1de247200"), sortOrder: 3 },
  { id: "c-tables", slug: "tables", name: "Tables", image: u("1532372320572-cda25653a26d"), sortOrder: 4 },
  { id: "c-storage", slug: "storage", name: "Storage", image: u("1594620302200-9a762244a156"), sortOrder: 5 },
  { id: "c-decor", slug: "decor", name: "Decor", image: u("1503602642458-232111445657"), sortOrder: 6 },
];
