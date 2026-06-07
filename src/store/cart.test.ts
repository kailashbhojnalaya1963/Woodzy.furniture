import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "./cart";

const item = { productId: "p1", name: "Sofa", price: 100, image: "x", slug: "sofa" };

beforeEach(() => useCart.getState().clear());

describe("cart store", () => {
  it("adds and merges quantities", () => {
    useCart.getState().add(item);
    useCart.getState().add(item);
    expect(useCart.getState().count()).toBe(2);
    expect(useCart.getState().subtotal()).toBe(200);
  });

  it("updates quantity", () => {
    useCart.getState().add(item);
    useCart.getState().updateQty("p1", 5);
    expect(useCart.getState().subtotal()).toBe(500);
  });

  it("removes a line", () => {
    useCart.getState().add(item);
    useCart.getState().remove("p1");
    expect(useCart.getState().count()).toBe(0);
  });

  it("removes a line when quantity drops to zero", () => {
    useCart.getState().add(item);
    useCart.getState().updateQty("p1", 0);
    expect(useCart.getState().count()).toBe(0);
  });
});
