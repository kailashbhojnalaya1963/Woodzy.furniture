/** Format a rupee amount with Indian digit grouping, e.g. 150000 → "₹1,50,000". */
export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

/** Price label for a product — respects the "price on request" flag. */
export function priceLabel(p: { price: number; priceOnRequest: boolean }): string {
  return p.priceOnRequest ? "Price on request" : formatINR(p.price);
}
