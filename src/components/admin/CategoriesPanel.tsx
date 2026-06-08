"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Trash2 } from "lucide-react";

type Cat = { id: string; slug: string; name: string; image: string; sort_order: number };

const EMPTY = { slug: "", name: "", image: "", sort_order: 0 };

export function CategoriesPanel({ sb }: { sb: SupabaseClient }) {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from("categories").select("*").order("sort_order");
    setCats((data as Cat[]) ?? []);
    setLoading(false);
  }, [sb]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.name) return;
    await sb
      .from("categories")
      .upsert(
        { slug: form.slug, name: form.name, image: form.image, sort_order: Number(form.sort_order) },
        { onConflict: "slug" },
      );
    setForm(EMPTY);
    load();
  };

  const del = async (slug: string) => {
    if (!confirm("Delete this category?")) return;
    await sb.from("categories").delete().eq("slug", slug);
    load();
  };

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-8">
      <div>
        {loading ? (
          <p className="text-wood-dark/60">Loading…</p>
        ) : (
          <ul className="divide-y divide-wood-dark/10">
            {cats.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2">
                <span>
                  <span className="font-medium">{c.name}</span>{" "}
                  <span className="text-xs text-wood-dark/40">/{c.slug}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-wood-dark/40">#{c.sort_order}</span>
                  <button onClick={() => del(c.slug)} aria-label="Delete" className="text-wood-dark/40 hover:text-red-700">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={save} className="space-y-2 rounded-xl border border-wood-dark/10 p-4 h-fit">
        <h3 className="font-medium">Add / update category</h3>
        <input className="wz-input" placeholder="Slug (e.g. sofas)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <input className="wz-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="wz-input" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input className="wz-input" type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        <button type="submit" className="w-full rounded-full bg-wood-darkest text-cream py-2 text-sm">
          Save category
        </button>
        <p className="text-xs text-wood-dark/40">Using an existing slug updates that category.</p>
      </form>
    </div>
  );
}
