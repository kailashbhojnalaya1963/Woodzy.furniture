"use server";

import type { CheckoutInput } from "@/lib/schemas";
import { hasSupabase, SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";

/**
 * Best-effort order persistence. When Supabase isn't connected (or the insert
 * fails for any reason) this resolves to { saved: false } and never throws —
 * the WhatsApp quote is the source of truth until the DB is wired up.
 */
export async function saveOrder(order: CheckoutInput): Promise<{ saved: boolean }> {
  if (!hasSupabase()) return { saved: false };
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
    const { error } = await sb.from("orders").insert({
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail || null,
      address_line: order.addressLine,
      locality: order.locality,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      items: order.items,
      subtotal: order.subtotal,
      status: "new",
      channel: "whatsapp",
      notes: order.notes || null,
    });
    return { saved: !error };
  } catch {
    return { saved: false };
  }
}
