import { describe, it, expect } from "vitest";
import { angleFor, transformFor } from "./turntable";

describe("turntable geometry", () => {
  it("spreads items across a semicircle", () => {
    expect(angleFor(0, 5)).toBeCloseTo(-90);
    expect(angleFor(2, 5)).toBeCloseTo(0);
    expect(angleFor(4, 5)).toBeCloseTo(90);
  });

  it("handles a single item", () => {
    expect(angleFor(0, 1)).toBe(0);
  });

  it("offsets rotateY by the current rotation", () => {
    const t = transformFor(0, 5, 30, 300);
    expect(t.angle).toBeCloseTo(-90);
    expect(t.rotateY).toBeCloseTo(-60);
    expect(t.translateZ).toBe(300);
  });
});
