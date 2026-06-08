import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-6 text-center">
      <div className="flex flex-col items-center">
        <Logo variant="stacked" size={56} />
        <h1 className="font-display text-4xl text-wood-darkest mt-6">Page not found</h1>
        <p className="text-wood-dark/70 mt-2">This piece seems to have wandered off.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-amber-brand text-wood-darkest font-semibold px-6 py-3 hover:brightness-105 transition"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
