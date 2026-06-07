import { describe, it, expect } from "vitest";
import { checkoutSchema } from "./schemas";

const base = {
  customerName: "Asha",
  customerPhone: "9876543210",
  addressLine: "12 Main Road",
  locality: "Tower Chowk",
  city: "Deoghar",
  state: "Jharkhand",
  pincode: "814112",
  items: [{ productId: "p1", name: "Sofa", qty: 1, price: 100 }],
  subtotal: 100,
};

describe("checkoutSchema", () => {
  it("accepts a valid order", () => {
    expect(checkoutSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a 9-digit phone", () => {
    expect(checkoutSchema.safeParse({ ...base, customerPhone: "98765" }).success).toBe(false);
  });

  it("rejects an empty cart", () => {
    expect(checkoutSchema.safeParse({ ...base, items: [] }).success).toBe(false);
  });

  it("rejects a bad pincode", () => {
    expect(checkoutSchema.safeParse({ ...base, pincode: "81A11" }).success).toBe(false);
  });
});
