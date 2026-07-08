import { cn } from "@/lib/utils";

interface LogoProps {
  /** Rendered size in px (square). */
  size?: number;
  /** Add a soft gold glow halo behind the mark. */
  glow?: boolean;
  className?: string;
}

/**
 * The real Zenvana mark — the gold lotus + "ZENVANA" wordmark on its dark disc,
 * from `public/Zenvana logo.svg`. Loaded as an <img> so it decodes once and is
 * cached by the browser / service worker, then reused everywhere.
 */
export default function Logo({ size = 48, glow = false, className }: LogoProps) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="lockup-glow pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(60% 60% at 50% 50%, var(--gold), transparent 70%)",
            filter: "blur(16px)",
            opacity: 0.5,
          }}
        />
      )}
      <img
        src="/zenvana-logo.svg"
        alt="Zenvana"
        width={size}
        height={size}
        decoding="async"
        className="relative h-full w-full object-contain"
      />
    </span>
  );
}
