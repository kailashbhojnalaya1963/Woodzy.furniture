export type Category = {
  id: string;
  slug: string;
  name: string;
  image: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  currency: "INR";
  shortDesc: string;
  longDesc: string;
  materials: string[];
  dimensions: string;
  finish: string;
  images: string[];
  inStock: boolean;
  isFeatured: boolean;
  priceOnRequest: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  notes?: string;
};
