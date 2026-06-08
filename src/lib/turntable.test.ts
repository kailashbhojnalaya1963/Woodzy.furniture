import { describe, it, expect } from "vitest";
import { angleFor, transformFor } from "./turntable";

describe("turntable geometry", () => {
  it("spreads items evenly around a full circle", () => {
    expect(angleFor(0, 4)).toBeCloseTo(0);
    expect(angleFor(1, 4)).toBeCloseTo(90);
    expect(angleFor(2, 4)).toBeCloseTo(180);
    expect(angleFor(3, 4)).toBeCloseTo(270);
  });

  it("places opposite items half a turn apart", () => {
    // item 0 faces front, item N/2 faces directly away — different pieces
    expect(angleFor(3, 6)).toBeCloseTo(180);
  });

  it("handles a single item", () => {
    expect(angleFor(0, 1)).toBe(0);
  });

  it("offsets rotateY by the current rotation", () => {
    const t = transformFor(1, 4, 30, 300);
    expect(t.angle).toBeCloseTo(90);
    expect(t.rotateY).toBeCloseTo(120);
    expect(t.translateZ).toBe(300);
  });
});
