/**
 * Geometry for the 360° showroom turntable. Items are spread evenly around a
 * FULL circle so opposite sides of the ring show different pieces (never a
 * mirror of the front). Card back-faces are hidden, so a card that rotates
 * away simply disappears while a different one comes around into view.
 */

/** Angle (degrees) of item `index` of `total`, spread evenly around 360°. */
export function angleFor(index: number, total: number): number {
  if (total <= 1) return 0;
  return (360 * index) / total;
}

export type CardTransform = { angle: number; rotateY: number; translateZ: number };

/** Full transform for a card given the current container rotation + radius. */
export function transformFor(
  index: number,
  total: number,
  rotation: number,
  radius: number,
): CardTransform {
  const angle = angleFor(index, total);
  return { angle, rotateY: angle + rotation, translateZ: radius };
}
