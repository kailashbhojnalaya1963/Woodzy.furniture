import type { Metadata } from "next";
import { MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Visit Showroom",
  description: "Visit the Woodzy showroom in Deoghar. Delivery & installation across the region.",
};

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="grid size-10 place-items-center rounded-full bg-sand text-wood-dark shrink-0">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-medium text-wood-darkest">{title}</p>
        <p className="text-sm text-wood-dark/70">{children}</p>
      </div>
    </div>
  );
}

export default function ShowroomPage() {
  const wa = `https://wa.me/${SITE.whatsappNumber}`;
  const tel = `tel:+${SITE.whatsappNumber}`;
  const regions = SITE.serviceRegions.join(", ");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-10">
        <p className="uppercase tracking-[0.3em] text-amber-brand text-xs mb-2">Visit us</p>
        <h1 className="font-display text-4xl text-wood-darkest">The Woodzy Showroom</h1>
        <p className="mt-3 text-wood-dark/70 max-w-2xl mx-auto">
          Come feel the wood and try the pieces in person. Delivery &amp; installation across {regions}.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden ring-1 ring-wood-dark/10 min-h-[320px]">
          <iframe
            title="Woodzy showroom location — Deoghar"
            src="https://www.google.com/maps?q=Deoghar,Jharkhand&output=embed"
            className="w-full h-full min-h-[320px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="space-y-5">
          <InfoRow icon={MapPin} title="Showroom">
            {SITE.showroom.city}
            {SITE.showroom.address ? (
              <>
                <br />
                {SITE.showroom.address}
              </>
            ) : (
              <>
                <br />
                Exact address &amp; directions on WhatsApp.
              </>
            )}
          </InfoRow>
          <InfoRow icon={Clock} title="Open">
            {SITE.showroom.hours}
          </InfoRow>
          <InfoRow icon={MessageCircle} title="WhatsApp / Call">
            +91 62916 63674
          </InfoRow>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-amber-brand text-wood-darkest font-semibold px-6 py-3 inline-flex items-center gap-2 hover:brightness-105 transition"
            >
              <MessageCircle className="size-5" /> Chat on WhatsApp
            </a>
            <a
              href={tel}
              className="rounded-full border border-wood-dark/30 px-6 py-3 inline-flex items-center gap-2 hover:bg-sand transition"
            >
              <Phone className="size-5" /> Call us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
