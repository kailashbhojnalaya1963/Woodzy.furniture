import { SITE } from "@/config/site";
import { formatINR } from "./format";
import type { Order } from "@/types/catalog";

/** Human-readable, itemised quote request for the owner's WhatsApp. */
export function buildQuoteMessage(order: Order): string {
  const lines = order.items
    .map((it) => `• ${it.name} x${it.qty} — ${formatINR(it.price * it.qty)}`)
    .join("\n");
  const address = `${order.addressLine}, ${order.locality}, ${order.city}, ${order.state} - ${order.pincode}`;

  return [
    "*New quote request — Woodzy*",
    "",
    lines,
    "",
    `Subtotal: ${formatINR(order.subtotal)}`,
    "",
    `*Customer:* ${order.customerName}`,
    `*Phone:* ${order.customerPhone}`,
    order.customerEmail ? `*Email:* ${order.customerEmail}` : null,
    `*Deliver to:* ${address}`,
    order.notes ? `*Notes:* ${order.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** wa.me deep link to the owner's number, with the quote URL-encoded. */
export function buildWhatsappUrl(order: Order): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(buildQuoteMessage(order))}`;
}
