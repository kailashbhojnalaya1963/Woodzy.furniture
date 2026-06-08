import { Truck, Wrench, ShieldCheck, MessageCircle } from "lucide-react";
import { SITE } from "@/config/site";

export function TrustStrip() {
  const items = [
    { icon: Truck, title: "Delivery across the region", desc: SITE.serviceRegions.join(", ") },
    { icon: Wrench, title: "Free installation", desc: "In Deoghar & nearby" },
    { icon: ShieldCheck, title: "Built to last", desc: "Solid-wood quality" },
    { icon: MessageCircle, title: "WhatsApp support", desc: "Real humans, quick replies" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((t) => (
          <div key={t.title} className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-full bg-sand text-wood-dark shrink-0">
              <t.icon className="size-5" />
            </div>
            <div>
              <p className="font-medium text-sm text-wood-darkest leading-tight">{t.title}</p>
              <p className="text-xs text-wood-dark/60">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
