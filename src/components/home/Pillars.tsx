import { Leaf, House, Award, Hourglass } from "lucide-react";

const PILLARS = [
  { icon: Leaf, title: "Natural", desc: "Solid, responsibly-sourced wood — never veneer pretending to be more." },
  { icon: House, title: "Warmth", desc: "Pieces that make a house feel lived-in and loved." },
  { icon: Award, title: "Quality", desc: "Real joinery, built to be handed down — not thrown away." },
  { icon: Hourglass, title: "Timeless", desc: "Designs that outlast trends and seasons." },
];

export function Pillars() {
  return (
    <section className="bg-sand/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-3xl text-center text-wood-darkest mb-10">
          Crafted to last a lifetime
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((p) => (
            <div key={p.title} className="text-center">
              <div className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-cream text-amber-brand ring-1 ring-amber-brand/20">
                <p.icon className="size-7" />
              </div>
              <h3 className="font-display text-xl text-wood-darkest">{p.title}</h3>
              <p className="text-sm text-wood-dark/70 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
