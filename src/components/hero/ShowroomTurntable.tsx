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
  const ringRef = useRef<HTMLDivElement>(null);

  const rotation = useRef(0);
  const radiusRef = useRef(320);
  const dragging = useRef(false);
  const movedDist = useRef(0);
  const lastX = useRef(0);
  const paused = useRef(false);

  const [radius, setRadius] = useState(320);
  const [reduced, setReduced] = useState(false);
  const total = items.length;

  const applyTransform = () => {
    if (ringRef.current) {
      ringRef.current.style.transform = `translateZ(-${radiusRef.current}px) rotateY(${rotation.current}deg)`;
    }
  };

  // responsive radius
  useEffect(() => {
    const update = () => {
      const w = stageRef.current?.clientWidth ?? 800;
      const r = Math.max(190, Math.min(440, w * 0.36));
      radiusRef.current = r;
      setRadius(r);
      applyTransform();
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
  }, [reduced]);

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
    rotation.current += dx * 0.32;
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
          <Link key={p.id} href={`/product/${p.slug}`} className="block group">
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
        className="relative mx-auto h-[330px] sm:h-[400px] touch-none"
        style={{ perspective: "1200px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        <div
          ref={ringRef}
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(-${radius}px) rotateY(0deg)`,
            WebkitBoxReflect:
              "below 10px linear-gradient(transparent, transparent 55%, rgba(0,0,0,0.22))",
          }}
        >
          {items.map((p, i) => {
            const angle = angleFor(i, total);
            return (
              <button
                key={p.id}
                type="button"
                className="absolute left-1/2 top-1/2 w-36 sm:w-44 cursor-pointer outline-none"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
                onClick={() => {
                  if (movedDist.current < 6) router.push(`/product/${p.slug}`);
                }}
                aria-label={`${p.name} — ${priceLabel(p)}`}
              >
                <Card product={p} />
              </button>
            );
          })}
        </div>
      </div>

      {/* glossy floor platform */}
      <div
        className="mx-auto -mt-6 h-10 w-3/4 max-w-2xl rounded-[100%] blur-md"
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
          sizes="180px"
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
