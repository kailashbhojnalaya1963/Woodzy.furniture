import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pillars } from "@/components/home/Pillars";
import { Materials } from "@/components/home/Materials";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Woodzy crafts solid-wood furniture the slow way — from a Deoghar workshop to homes across the region.",
};

export default function OurStoryPage() {
  const regions = SITE.serviceRegions.join(", ");

  return (
    <div>
      <section
        className="text-cream"
        style={{ background: "radial-gradient(circle at 50% 20%, #6B3E1D, #1c1006 70%)" }}
      >
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="uppercase tracking-[0.3em] text-amber-brand text-xs mb-3">Our story</p>
          <h1 className="font-display text-4xl sm:text-5xl">Warm woods, made the slow way</h1>
          <p className="mt-4 text-sand/80 max-w-2xl mx-auto">
            From a workshop in Deoghar to homes across {regions} — Woodzy builds furniture meant to be
            lived with and handed down.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-wood-dark/10">
          <Image
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=70"
            alt="A warmly furnished living room"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-display text-3xl text-wood-darkest">Crafted in the heartland</h2>
          <p className="mt-3 text-wood-dark/80 leading-relaxed">
            Woodzy began with a simple belief — that furniture should be honest. Solid wood, real
            joinery, and finishes done by hand. Rooted in the Bihar–Jharkhand heartland, our makers
            shape each piece to be warm to the touch and built to outlast trends.
          </p>
          <p className="mt-3 text-wood-dark/80 leading-relaxed">
            We&apos;d rather make fewer pieces, well. The kind you keep, repair, and pass on — not
            replace.
          </p>
        </div>
      </section>

      <Pillars />
      <Materials />

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl text-wood-darkest">Bring Woodzy home</h2>
        <p className="mt-2 text-wood-dark/70">
          Explore the collection, or visit our Deoghar showroom to feel the wood in person.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-amber-brand text-wood-darkest font-semibold px-6 py-3 hover:brightness-105 transition"
          >
            Explore the collection
          </Link>
          <Link
            href="/showroom"
            className="rounded-full border border-wood-dark/30 px-6 py-3 hover:bg-sand transition"
          >
            Visit showroom
          </Link>
        </div>
      </section>
    </div>
  );
}
