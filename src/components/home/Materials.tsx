const MATERIALS = [
  { name: "Walnut", color: "#4b2e14" },
  { name: "Oak", color: "#8a5526" },
  { name: "Leather", color: "#6b3e1d" },
  { name: "Linen", color: "#c9a877" },
  { name: "Stone", color: "#9a9183" },
];

export function Materials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-8">
        <p className="uppercase tracking-[0.25em] text-amber-brand text-xs mb-1">Honest materials</p>
        <h2 className="font-display text-3xl text-wood-darkest">The materials we build in</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
        {MATERIALS.map((m) => (
          <div key={m.name} className="flex flex-col items-center gap-2">
            <span
              className="size-16 sm:size-20 rounded-2xl ring-1 ring-wood-dark/10 shadow-inner"
              style={{ background: m.color }}
            />
            <span className="text-sm text-wood-dark">{m.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
