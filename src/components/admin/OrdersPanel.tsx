"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { formatINR } from "@/lib/format";

const STATUSES = ["new", "contacted", "confirmed", "delivered", "cancelled"];

type OrderRow = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address_line: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  status: string;
  notes: string | null;
  items: { name: string; qty: number; price: number }[];
};

export function OrdersPanel({ sb }: { sb: SupabaseClient }) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as OrderRow[]) ?? []);
    setLoading(false);
  }, [sb]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    await sb.from("orders").update({ status }).eq("id", id);
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  if (loading) return <p className="text-wood-dark/60">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-wood-dark/60">No orders yet.</p>;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="rounded-xl border border-wood-dark/10 p-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <p className="font-medium">
                {o.customer_name} · {o.customer_phone}
              </p>
              <p className="text-sm text-wood-dark/60">
                {o.address_line}, {o.locality}, {o.city}, {o.state} - {o.pincode}
              </p>
              <p className="text-xs text-wood-dark/40 mt-0.5">
                {new Date(o.created_at).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-amber-brand">{formatINR(o.subtotal)}</p>
              <select
                value={o.status}
                onChange={(e) => setStatus(o.id, e.target.value)}
                className="mt-1 rounded border border-wood-dark/20 text-sm px-2 py-1 capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ul className="mt-2 text-sm text-wood-dark/70 border-t border-wood-dark/10 pt-2">
            {(o.items ?? []).map((it, i) => (
              <li key={i}>
                {it.name} ×{it.qty} — {formatINR(it.price * it.qty)}
              </li>
            ))}
          </ul>
          {o.notes && <p className="text-xs text-wood-dark/50 mt-1">Notes: {o.notes}</p>}
        </div>
      ))}
    </div>
  );
}
