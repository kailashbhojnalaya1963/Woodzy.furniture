/**
 * Single source of truth for owner-toggleable settings.
 * Flip these to change behaviour without touching feature code.
 */
export const SITE = {
  name: "Woodzy",
  tagline: "Warm Woods, Cozy Living.",
  /** +91 prepended for wa.me deep links (no leading + or spaces). */
  whatsappNumber: "916291663674",
  instagram: "woodzy.furniture",
  email: "hello@woodzy.com",
  /** Drives delivery copy and the checkout state dropdown. */
  serviceRegions: ["Bihar", "Jharkhand", "West Bengal"] as const,
  /** Razorpay stays off (grey) until onboarded. Flip true + add keys to go live. */
  paymentsEnabled: false,
  /** Show ₹ prices on products + cart. */
  showPrices: true,
  showroom: {
    city: "Deoghar, Jharkhand",
    // Leave blank until the owner shares the exact address; the showroom page
    // falls back to "directions on WhatsApp" when this is empty.
    address: "",
    hours: "Mon–Sun, 10:00 AM – 8:00 PM",
  },
} as const;

export type ServiceRegion = (typeof SITE.serviceRegions)[number];

/** True when the given state is within Woodzy's current delivery reach. */
export function isServiceState(state: string): boolean {
  return (SITE.serviceRegions as readonly string[]).includes(state);
}
