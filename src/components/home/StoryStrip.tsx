import Link from "next/link";
import { SITE } from "@/config/site";

export function StoryStrip() {
  const regions = SITE.serviceRegions.join(", ");
  return (
    <section className="wood-grain text-cream">
      <div className="bg-wood-darkest/85">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="uppercase tracking-[0.25em] text-amber-brand text-xs mb-3">Our story</p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight">
            From the Deoghar workshop
            <br />
            to homes across the region
          </h2>
          <p className="mt-4 text-sand/80 max-w-2xl mx-auto">
            Rooted in the Bihar–Jharkhand heartland, Woodzy crafts furniture the slow way — solid
            wood, real joinery, finished by hand. Visit our Deoghar showroom, or let us deliver
            &amp; install across {regions}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link
              href="/our-story"
              className="rounded-full bg-amber-brand text-wood-darkest font-semibold px-6 py-3 hover:brightness-105 transition"
            >
              Read our story
            </Link>
            <Link
              href="/showroom"
              className="rounded-full border border-cream/30 px-6 py-3 hover:bg-cream/10 transition"
            >
              Visit showroom
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
