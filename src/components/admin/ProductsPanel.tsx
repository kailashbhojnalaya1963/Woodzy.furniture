"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import { formatINR } from "@/lib/format";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  price: number;
  short_desc: string;
  long_desc: string;
  materials: string[];
  dimensions: string;
  finish: string;
  images: string[];
  in_stock: boolean;
  is_featured: boolean;
  price_on_request: boolean;
};
type Cat = { slug: string; name: string };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const EMPTY: ProductRow = {
  id: "", slug: "", name: "", category_slug: "", price: 0, short_desc: "", long_desc: "",
  materials: [], dimensions: "", finish: "", images: [], in_stock: true, is_featured: false,
  price_on_request: false,
};

export function ProductsPanel({ sb }: { sb: SupabaseClient }) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [materialsText, setMaterialsText] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      sb.from("products").select("*").order("created_at", { ascending: false }),
      sb.from("categories").select("slug,name").order("sort_order"),
    ]);
    setProducts((p as ProductRow[]) ?? []);
    setCats((c as Cat[]) ?? []);
    setLoading(false);
  }, [sb]);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setEditing({ ...EMPTY, category_slug: cats[0]?.slug ?? "" });
    setMaterialsText("");
  };
  const startEdit = (p: ProductRow) => {
    setEditing(p);
    setMaterialsText(p.materials.join(", "));
  };

  const onUpload = async (files: FileList | null) => {
    if (!files || !editing) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error } = await sb.storage.from("product-images").upload(path, file);
      if (!error) {
        const { data } = sb.storage.from("product-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    setEditing((e) => (e ? { ...e, images: [...e.images, ...urls] } : e));
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    let slug = editing.slug || slugify(editing.name);
    // a brand-new product must not overwrite an existing one via a colliding slug
    if (!editing.id) {
      const taken = new Set(products.map((p) => p.slug));
      if (taken.has(slug)) {
        let n = 2;
        while (taken.has(`${slug}-${n}`)) n++;
        slug = `${slug}-${n}`;
      }
    }
    await sb.from("products").upsert(
      {
        slug,
        name: editing.name,
        category_slug: editing.category_slug,
        price: Number(editing.price),
        short_desc: editing.short_desc,
        long_desc: editing.long_desc,
        materials: materialsText.split(",").map((s) => s.trim()).filter(Boolean),
        dimensions: editing.dimensions,
        finish: editing.finish,
        images: editing.images,
        in_stock: editing.in_stock,
        is_featured: editing.is_featured,
        price_on_request: editing.price_on_request,
      },
      { onConflict: "slug" },
    );
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await sb.from("products").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-wood-dark/60 text-sm">{products.length} products</p>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-1 rounded-full bg-wood-darkest text-cream text-sm px-4 py-2"
        >
          <Plus className="size-4" /> Add product
        </button>
      </div>

      {loading ? (
        <p className="text-wood-dark/60">Loading…</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-wood-dark/10 p-2">
              <span className="relative size-12 rounded-lg overflow-hidden bg-sand shrink-0">
                {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{p.name}</p>
                <p className="text-xs text-wood-dark/50">
                  {p.category_slug} · {formatINR(p.price)}
                  {p.is_featured ? " · ★" : ""}
                </p>
              </div>
              <button onClick={() => startEdit(p)} aria-label="Edit" className="p-2 text-wood-dark/50 hover:text-amber-brand">
                <Pencil className="size-4" />
              </button>
              <button onClick={() => del(p.id)} aria-label="Delete" className="p-2 text-wood-dark/50 hover:text-red-700">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-wood-darkest/40 p-4" onClick={() => setEditing(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
            className="w-full max-w-lg max-h-[90vh] overflow-auto bg-cream rounded-2xl p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display text-lg">{editing.id ? "Edit" : "New"} product</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <input className="wz-input" placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <select className="wz-input" value={editing.category_slug} onChange={(e) => setEditing({ ...editing, category_slug: e.target.value })}>
                {cats.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input className="wz-input" type="number" placeholder="Price (₹)" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
            </div>
            <input className="wz-input" placeholder="Short description" value={editing.short_desc} onChange={(e) => setEditing({ ...editing, short_desc: e.target.value })} />
            <textarea className="wz-input min-h-20" placeholder="Long description" value={editing.long_desc} onChange={(e) => setEditing({ ...editing, long_desc: e.target.value })} />
            <input className="wz-input" placeholder="Materials (comma separated)" value={materialsText} onChange={(e) => setMaterialsText(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input className="wz-input" placeholder="Dimensions" value={editing.dimensions} onChange={(e) => setEditing({ ...editing, dimensions: e.target.value })} />
              <input className="wz-input" placeholder="Finish" value={editing.finish} onChange={(e) => setEditing({ ...editing, finish: e.target.value })} />
            </div>
            <div>
              <span className="text-sm text-wood-dark/70">Images</span>
              <div className="flex gap-2 flex-wrap mt-1">
                {editing.images.map((img, i) => (
                  <span key={i} className="relative size-14 rounded overflow-hidden bg-sand">
                    <Image src={img} alt="" fill sizes="56px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, images: editing.images.filter((_, j) => j !== i) })}
                      aria-label="Remove image"
                      className="absolute top-0 right-0 bg-wood-darkest/70 text-cream p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input type="file" accept="image/*" multiple onChange={(e) => onUpload(e.target.files)} className="mt-2 text-sm" />
              {uploading && <p className="text-xs text-wood-dark/50">Uploading…</p>}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editing.in_stock} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} />
                In stock
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editing.price_on_request} onChange={(e) => setEditing({ ...editing, price_on_request: e.target.checked })} />
                Price on request
              </label>
            </div>
            <button type="submit" className="w-full rounded-full bg-amber-brand text-wood-darkest font-semibold py-2.5">
              Save product
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
