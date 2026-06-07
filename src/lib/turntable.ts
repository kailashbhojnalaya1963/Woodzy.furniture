/**
 * Geometry for the 360° showroom turntable. Items are spread evenly across a
 * 180° semicircle so they fan out facing the viewer.
 */

/** Angle (degrees) of item `index` of `total`, spread across -90°..+90°. */
export function angleFor(index: number, total: number): number {
  if (total <= 1) return 0;
  return -90 + (180 * index) / (total - 1);
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
