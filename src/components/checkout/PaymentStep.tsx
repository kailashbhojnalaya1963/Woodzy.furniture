import { Lock } from "lucide-react";
import { SITE } from "@/config/site";

/**
 * Online-payment step. Architected but disabled (grey) until Razorpay is live.
 * When SITE.paymentsEnabled flips true, swap the disabled button for the
 * Razorpay checkout handler that calls /api/payments/create-order.
 */
export function PaymentStep() {
  if (SITE.paymentsEnabled) return null;

  return (
    <div className="mt-4 rounded-xl border border-wood-dark/15 bg-sand/30 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-wood-dark/70">
        <Lock className="size-4" /> Pay online
      </div>
      <button
        type="button"
        disabled
        className="mt-2 w-full rounded-full bg-wood-dark/25 text-cream/80 py-2.5 cursor-not-allowed"
      >
        Pay online — coming soon
      </button>
      <p className="text-xs text-wood-dark/50 mt-2">
        Card &amp; UPI payments are launching soon. For now, send your order on WhatsApp and we&apos;ll
        confirm the final price &amp; delivery with you.
      </p>
    </div>
  );
}
