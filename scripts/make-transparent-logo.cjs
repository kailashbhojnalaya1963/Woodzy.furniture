/**
 * Generate a transparent-background PNG from the white-background logo JPEG.
 * Uses an edge flood-fill (not a blanket white removal) so the OUTER white
 * background is knocked out while the white "W" and inner borders inside the
 * mark — which are enclosed by brown and never reached from the edges — stay
 * intact. Run: node scripts/make-transparent-logo.cjs
 */
const sharp = require("sharp");

(async () => {
  const SRC = "public/brand/woodzy-logo.jpeg";
  const OUT = "public/brand/woodzy-logo.png";
  const THRESH = 236; // treat r,g,b all >= this as "near white"

  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const nearWhite = (i) => data[i] >= THRESH && data[i + 1] >= THRESH && data[i + 2] >= THRESH;

  const visited = new Uint8Array(width * height);
  const stack = [];
  const seed = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    stack.push(p);
  };

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  let cleared = 0;
  while (stack.length) {
    const p = stack.pop();
    const i = p * channels;
    if (!nearWhite(i)) continue; // flood stops at the artwork
    data[i + 3] = 0;
    cleared++;
    const x = p % width;
    const y = (p - x) / width;
    seed(x + 1, y);
    seed(x - 1, y);
    seed(x, y + 1);
    seed(x, y - 1);
  }

  await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 10 }) // crop away the now-transparent margins
    .png()
    .toFile(OUT);
  console.log(`wrote ${OUT} — cleared ${cleared} of ${width * height} px (${((cleared / (width * height)) * 100).toFixed(1)}%)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
