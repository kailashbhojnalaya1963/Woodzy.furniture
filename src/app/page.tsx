import Link from "next/link";
import { getFeatured, getProducts, getCategories } from "@/lib/catalog";
import { RevealStage } from "@/components/intro/RevealStage";
import { ShowroomTurntable } from "@/components/hero/ShowroomTurntable";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Pillars } from "@/components/home/Pillars";
import { Materials } from "@/components/home/Materials";
import { StoryStrip } from "@/components/home/StoryStrip";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SITE } from "@/config/site";

export default async function Home() {
  const [featured, all, categories] = await Promise.all([
    getFeatured(),
    getProducts(),
    getCategories(),
  ]);
  // Different pieces all around the ring: featured first, then fill with the rest.
  const showcase = [
    ...featured,
    ...all.filter((p) => !featured.some((f) => f.id === p.id)),
  ].slice(0, 14);
  const newArrivals = all.slice(0, 8);
  const regions = SITE.serviceRegions.join(", ");

  return (
    <RevealStage>
      <section
        className="relative overflow-hidden text-cream"
        style={{ background: "radial-gradient(circle at 50% 25%, #6B3E1D, #1c1006 70%)" }}
      >
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-16 text-center">
          <p className="uppercase tracking-[0.3em] text-amber-brand text-xs mb-3">
            Handcrafted wooden furniture
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.05]">
            Warm Woods,
            <br />
            <span className="text-amber-brand">Cozy Living.</span>
          </h1>
          <p className="mt-5 text-sand/80 max-w-xl mx-auto">
            Sofas, beds, dining &amp; more — built by hand to last a lifetime. Delivered &amp;
            installed across {regions}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link
              href="/shop"
              className="rounded-full bg-amber-brand text-wood-darkest font-semibold px-6 py-3 hover:brightness-105 transition"
            >
              Explore the Collection
            </Link>
            <Link
              href="/showroom"
              className="rounded-full border border-cream/30 px-6 py-3 hover:bg-cream/10 transition"
            >
              Visit Showroom
            </Link>
          </div>

          <div className="mt-10">
            <ShowroomTurntable items={showcase} />
          </div>
        </div>
      </section>

      <CategoryStrip categories={categories} />
      <NewArrivals products={newArrivals} />
      <Pillars />
      <Materials />
      <StoryStrip />
      <TrustStrip />
    </RevealStage>
  );
}
