import { describe, it, expect } from "vitest";
import { buildQuoteMessage, buildWhatsappUrl } from "./whatsapp";
import type { Order } from "@/types/catalog";

const order: Order = {
  customerName: "Asha",
  customerPhone: "9876543210",
  addressLine: "12 Main Road",
  locality: "Tower Chowk",
  city: "Deoghar",
  state: "Jharkhand",
  pincode: "814112",
  items: [{ productId: "p1", name: "Aravalli Sofa", qty: 2, price: 54999 }],
  subtotal: 109998,
};

describe("whatsapp quote", () => {
  it("lists items with quantity and the formatted subtotal", () => {
    const m = buildQuoteMessage(order);
    expect(m).toContain("Aravalli Sofa");
    expect(m).toContain("x2");
    expect(m).toContain("₹1,09,998");
    expect(m).toContain("Asha");
    expect(m).toContain("Deoghar");
  });

  it("builds a url-encoded wa.me link to the owner number", () => {
    const url = buildWhatsappUrl(order);
    expect(url.startsWith("https://wa.me/916291663674?text=")).toBe(true);
    expect(url).not.toContain("\n"); // newlines must be encoded
    expect(url).toContain("%0A");
  });
});
