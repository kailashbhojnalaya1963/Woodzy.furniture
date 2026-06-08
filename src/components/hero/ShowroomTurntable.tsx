"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/catalog";
import { angleFor } from "@/lib/turntable";
import { priceLabel } from "@/lib/format";

export function ShowroomTurntable({ items }: { items: Product[] }) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const rotation = useRef(0);
  const radiusRef = useRef(320);
  const dragging = useRef(false);
  const movedDist = useRef(0);
  const lastX = useRef(0);
  const paused = useRef(false);

  const [reduced, setReduced] = useState(false);
  const total = items.length;

  // Position every card on a curved arc, always facing the viewer (no 3D flip,
  // so a piece is never shown mirrored). Side pieces shrink + fade out.
  const applyTransform = () => {
    const R = radiusRef.current;
    const rot = rotation.current;
    for (let i = 0; i < total; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const a = ((angleFor(i, total) + rot) * Math.PI) / 180;
      const z = Math.cos(a); // depth: 1 = front, -1 = back
      const x = Math.sin(a) * R; // horizontal offset
      const scale = 0.58 + ((z + 1) / 2) * 0.56;
      const ty = (1 - z) * 5;
      const opacity = z < -0.1 ? 0 : Math.min(1, (z + 0.1) / 0.55);
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${ty}px, 0) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(1000 + Math.round(z * 1000));
      el.style.pointerEvents = opacity < 0.2 ? "none" : "auto";
    }
  };

  // responsive radius
  useEffect(() => {
    const update = () => {
      const w = stageRef.current?.clientWidth ?? 800;
      radiusRef.current = Math.max(150, Math.min(380, w * 0.34));
      applyTransform();
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // auto-rotate
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const tick = () => {
      if (!paused.current && !dragging.current) {
        rotation.current += 0.12;
        applyTransform();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, total]);

  const onPointerDown = (e: ReactPointerEvent) => {
    dragging.current = true;
    movedDist.current = 0;
    lastX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    movedDist.current += Math.abs(dx);
    rotation.current += dx * 0.35;
    applyTransform();
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  // Reduced motion: a calm static grid instead of a spinning stage.
  if (reduced) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {items.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className="block">
            <Card product={p} />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="relative select-none">
      <div
        ref={stageRef}
        className="relative mx-auto h-[300px] sm:h-[380px] touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {items.map((p, i) => (
          <button
            key={p.id}
            type="button"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 w-32 sm:w-40 cursor-pointer outline-none will-change-transform"
            style={{ opacity: 0 }}
            onClick={() => {
              if (movedDist.current < 6) router.push(`/product/${p.slug}`);
            }}
            aria-label={`${p.name} — ${priceLabel(p)}`}
          >
            <Card product={p} />
          </button>
        ))}
      </div>

      {/* soft floor shadow (not a reflection) */}
      <div
        className="mx-auto -mt-4 h-8 w-2/3 max-w-xl rounded-[100%] blur-md"
        style={{ background: "radial-gradient(ellipse at center, #00000055, transparent 70%)" }}
      />
      <p className="text-center text-sand/60 text-xs mt-2 tracking-wide">
        Drag to spin the showroom · tap a piece to view
      </p>
    </div>
  );
}

function Card({ product }: { product: Product }) {
  return (
    <div className="rounded-xl overflow-hidden bg-cream shadow-2xl ring-1 ring-wood-dark/10">
      <div className="relative aspect-[4/5]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="160px"
          className="object-cover"
          draggable={false}
        />
      </div>
      <div className="p-2 text-center">
        <div className="text-xs font-medium text-wood-darkest truncate">{product.name}</div>
        <div className="text-xs text-amber-brand font-semibold">{priceLabel(product)}</div>
      </div>
    </div>
  );
}
