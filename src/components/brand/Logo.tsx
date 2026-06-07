import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "mark" | "full" | "stacked";
  className?: string;
  /** size of the square mark in px */
  size?: number;
  /** render wordmark/tagline in light colours (for dark backgrounds) */
  light?: boolean;
};

/**
 * Woodzy logo, recreated as an inline SVG so it stays crisp at any size.
 * The owner can drop the official raster at /public/brand/woodzy-logo.png;
 * favicon/OG use that file, while in-app chrome uses this vector mark.
 */
export function Logo({ variant = "full", className, size = 44, light = false }: LogoProps) {
  const wordColor = light ? "text-cream" : "text-wood-darkest";
  const tagColor = light ? "text-sand" : "text-amber-brand";

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Woodzy"
      className="shrink-0"
    >
      <defs>
        <clipPath id="wz-square">
          <rect x="20" y="10" width="60" height="80" rx="3" />
        </clipPath>
      </defs>
      {/* outer frame */}
      <rect
        x="20"
        y="10"
        width="60"
        height="80"
        rx="3"
        fill="none"
        stroke="#6b3e1d"
        strokeWidth="4"
      />
      <g clipPath="url(#wz-square)">
        {/* dark base */}
        <rect x="20" y="10" width="60" height="80" fill="#4b2e14" />
        {/* amber wood-grain upper block */}
        <rect x="20" y="10" width="60" height="40" fill="#c47a2c" />
        {/* grain lines */}
        <g stroke="#5a3413" strokeWidth="1.4" fill="none" opacity="0.65">
          <path d="M20 20 q15 -6 30 0 t30 0" />
          <path d="M20 28 q18 -7 34 0 t26 2" />
          <path d="M20 36 q14 -5 28 1 t32 -1" />
          <ellipse cx="40" cy="30" rx="6" ry="9" />
          <ellipse cx="40" cy="30" rx="3" ry="5" />
        </g>
      </g>
      {/* white W */}
      <path
        d="M30 30 L40 72 L50 46 L60 72 L70 30"
        fill="none"
        stroke="#ffffff"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "mark") {
    return <span className={cn("inline-flex", className)}>{mark}</span>;
  }

  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center gap-1", className)}>
        {mark}
        <span className={cn("font-sans font-extrabold tracking-[0.2em]", wordColor)}>
          WOODZY
        </span>
        <span className={cn("text-[0.7rem] tracking-wide", tagColor)}>{`Warm Woods, Cozy Living.`}</span>
      </span>
    );
  }

  // full (horizontal)
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      <span className="flex flex-col leading-none">
        <span className={cn("font-sans font-extrabold tracking-[0.18em] text-lg", wordColor)}>
          WOODZY
        </span>
        <span className={cn("text-[0.62rem] tracking-wide mt-0.5", tagColor)}>
          Warm Woods, Cozy Living.
        </span>
      </span>
    </span>
  );
}
