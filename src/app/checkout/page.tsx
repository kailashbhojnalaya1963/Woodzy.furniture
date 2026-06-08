"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import { checkoutSchema } from "@/lib/schemas";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { formatINR } from "@/lib/format";
import { SITE } from "@/config/site";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { saveOrder } from "./actions";
import { cn } from "@/lib/utils";

type FormState = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const EMPTY: FormState = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  addressLine: "",
  locality: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCart((s) => s.lines);
  const subtotal = useCart((s) => s.lines.reduce((n, l) => n + l.price * l.qty, 0));
  const clear = useCart((s) => s.clear);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doneUrl, setDoneUrl] = useState<string | null>(null);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      ...form,
      customerEmail: form.customerEmail || undefined,
      notes: form.notes || undefined,
      items: lines.map((l) => ({ productId: l.productId, name: l.name, qty: l.qty, price: l.price })),
      subtotal,
    };
    const parsed = checkoutSchema.safeParse(order);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    const url = buildWhatsappUrl(parsed.data);
    // open in the click gesture so popup blockers allow it
    window.open(url, "_blank", "noopener");
    // best-effort save (no-op until Supabase is connected)
    void saveOrder(parsed.data);
    clear();
    setDoneUrl(url);
  };

  // success view
  if (doneUrl) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-amber-brand/20 text-amber-brand">
          <Check className="size-7" />
        </div>
        <h1 className="font-display text-3xl text-wood-darkest">Quote request sent!</h1>
        <p className="mt-3 text-wood-dark/70">
          We&apos;ve opened WhatsApp with your itemised order. Send the message and we&apos;ll confirm the
          final price &amp; delivery shortly.
        </p>
        <a
          href={doneUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-brand text-wood-darkest font-semibold px-6 py-3 hover:brightness-105 transition"
        >
          <MessageCircle className="size-5" /> Open WhatsApp again
        </a>
        <div className="mt-4">
          <Link href="/shop" className="text-sm text-wood-dark hover:text-amber-brand">
            Continue shopping →
          </Link>
        </div>
      </div>
    );
  }

  // empty cart
  if (mounted && lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-3xl text-wood-darkest">Your cart is empty</h1>
        <p className="mt-3 text-wood-dark/70">Add a few pieces before checking out.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-amber-brand text-wood-darkest font-semibold px-6 py-3"
        >
          Browse furniture
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-4xl text-wood-darkest mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
        {/* details */}
        <div className="space-y-4">
          <h2 className="font-display text-xl text-wood-darkest">Your details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" error={errors.customerName}>
              <input className="wz-input" value={form.customerName} onChange={(e) => set("customerName", e.target.value)} />
            </Field>
            <Field label="Mobile number" error={errors.customerPhone}>
              <input className="wz-input" inputMode="numeric" maxLength={10} value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} placeholder="10-digit" />
            </Field>
          </div>
          <Field label="Email (optional)" error={errors.customerEmail}>
            <input className="wz-input" type="email" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} />
          </Field>

          <h2 className="font-display text-xl text-wood-darkest pt-2">Delivery address</h2>
          <Field label="Address" error={errors.addressLine}>
            <input className="wz-input" value={form.addressLine} onChange={(e) => set("addressLine", e.target.value)} placeholder="House no., street" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Locality / area" error={errors.locality}>
              <input className="wz-input" value={form.locality} onChange={(e) => set("locality", e.target.value)} />
            </Field>
            <Field label="City" error={errors.city}>
              <input className="wz-input" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="State" error={errors.state}>
              <select className="wz-input" value={form.state} onChange={(e) => set("state", e.target.value)}>
                <option value="">Select state</option>
                {SITE.serviceRegions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="PIN code" error={errors.pincode}>
              <input className="wz-input" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
            </Field>
          </div>
          <Field label="Notes (optional)" error={errors.notes}>
            <textarea className="wz-input min-h-20" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any preferences, delivery instructions…" />
          </Field>
          <p className="text-xs text-wood-dark/50">
            We deliver across {SITE.serviceRegions.join(", ")}. Final price &amp; delivery are confirmed
            on WhatsApp.
          </p>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-20 h-fit rounded-2xl border border-wood-dark/10 bg-cream p-5">
          <h2 className="font-display text-xl text-wood-darkest mb-3">Order summary</h2>
          <ul className="space-y-2 text-sm max-h-64 overflow-auto">
            {lines.map((l) => (
              <li key={l.productId} className="flex justify-between gap-3">
                <span className="text-wood-dark/80 line-clamp-1">
                  {l.name} <span className="text-wood-dark/40">×{l.qty}</span>
                </span>
                <span className="whitespace-nowrap">{formatINR(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold border-t border-wood-dark/10 mt-3 pt-3">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>

          <button
            type="submit"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-amber-brand text-wood-darkest font-semibold py-3 hover:brightness-105 transition"
          >
            <MessageCircle className="size-5" /> Send quote on WhatsApp
          </button>

          <PaymentStep />
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-wood-dark/70">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className={cn("text-xs text-red-700 mt-1 block")}>{error}</span>}
    </label>
  );
}
