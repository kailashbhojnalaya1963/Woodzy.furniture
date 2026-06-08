"use client";

import { useEffect, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/supabase/env";
import { Logo } from "@/components/brand/Logo";
import { OrdersPanel } from "./OrdersPanel";
import { ProductsPanel } from "./ProductsPanel";
import { CategoriesPanel } from "./CategoriesPanel";
import { cn } from "@/lib/utils";

type Tab = "orders" | "products" | "categories";

export function AdminApp() {
  const [sb] = useState<SupabaseClient | null>(() => getBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => {
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  if (!hasSupabase() || !sb) {
    return (
      <Centered>
        <Logo variant="stacked" size={56} />
        <h1 className="font-display text-2xl text-wood-darkest mt-4">Admin is almost ready</h1>
        <p className="text-wood-dark/70 mt-2 max-w-md text-center">
          Connect a Supabase project (add the keys to <code>.env.local</code>) and run{" "}
          <code>supabase/schema.sql</code> to enable product management and the orders inbox.
        </p>
      </Centered>
    );
  }

  if (loading) {
    return (
      <Centered>
        <p className="text-wood-dark/60">Loading…</p>
      </Centered>
    );
  }

  if (!session) return <LoginForm sb={sb} />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Logo variant="mark" size={36} />
          <h1 className="font-display text-2xl text-wood-darkest">Woodzy admin</h1>
        </div>
        <button
          onClick={() => sb.auth.signOut()}
          className="text-sm text-wood-dark/70 hover:text-amber-brand"
        >
          Sign out
        </button>
      </div>

      <div className="flex gap-2 border-b border-wood-dark/10 mb-6">
        {(["orders", "products", "categories"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm capitalize border-b-2 -mb-px transition",
              tab === t
                ? "border-amber-brand text-wood-darkest font-medium"
                : "border-transparent text-wood-dark/60 hover:text-wood-darkest",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" && <OrdersPanel sb={sb} />}
      {tab === "products" && <ProductsPanel sb={sb} />}
      {tab === "categories" && <CategoriesPanel sb={sb} />}
    </div>
  );
}

function LoginForm({ sb }: { sb: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  };

  return (
    <Centered>
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <div className="text-center mb-2">
          <Logo variant="stacked" size={52} />
          <h1 className="font-display text-xl text-wood-darkest mt-3">Owner sign in</h1>
        </div>
        <input
          className="wz-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="wz-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-amber-brand text-wood-darkest font-semibold py-2.5 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
}
