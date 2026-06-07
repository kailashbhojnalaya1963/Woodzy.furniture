import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import type { Category } from "@/types/catalog";
import { SITE } from "@/config/site";

/** Inline Instagram glyph (lucide-react removed brand icons). */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="text-sm">
      <h4 className="font-display text-amber-brand mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sand/80 hover:text-cream transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ categories }: { categories: Category[] }) {
  const regions = SITE.serviceRegions.join(", ");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 wood-grain text-cream">
      <div className="bg-wood-darkest/85">
        <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <Logo variant="full" size={40} light />
            <p className="text-sand/80 text-sm max-w-xs">
              Handcrafted wooden furniture for warm, cozy living. Delivery &amp; installation
              across {regions}.
            </p>
            <a
              href={`https://instagram.com/${SITE.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sand hover:text-amber-brand text-sm"
            >
              <InstagramIcon className="size-4" />@{SITE.instagram}
            </a>
          </div>

          <FooterCol
            title="Shop"
            links={categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name }))}
          />
          <FooterCol
            title="Explore"
            links={[
              { href: "/shop", label: "All furniture" },
              { href: "/collections", label: "Collections" },
              { href: "/our-story", label: "Our Story" },
              { href: "/showroom", label: "Visit Showroom" },
            ]}
          />

          <div className="space-y-2 text-sm">
            <h4 className="font-display text-amber-brand mb-3">Visit us</h4>
            <p className="text-sand/80">{SITE.showroom.city}</p>
            <p className="text-sand/80">{SITE.showroom.hours}</p>
            <p className="text-sand/60 mt-4 flex items-center gap-2">
              <span className="size-2 rounded-full bg-sand/40" />
              Online payments — coming soon
            </p>
          </div>
        </div>

        <div className="border-t border-cream/10">
          <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-sand/60 flex flex-col sm:flex-row gap-2 justify-between">
            <span>© {year} Woodzy. All rights reserved.</span>
            <span>{SITE.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
