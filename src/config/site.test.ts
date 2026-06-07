import { describe, it, expect } from "vitest";
import { SITE, isServiceState } from "./site";

describe("site config", () => {
  it("has the owner whatsapp number with country code", () => {
    expect(SITE.whatsappNumber).toBe("916291663674");
  });

  it("ships only to configured regions", () => {
    expect(isServiceState("Bihar")).toBe(true);
    expect(isServiceState("Jharkhand")).toBe(true);
    expect(isServiceState("West Bengal")).toBe(true);
    expect(isServiceState("Kerala")).toBe(false);
  });

  it("keeps online payments off by default", () => {
    expect(SITE.paymentsEnabled).toBe(false);
  });
});
