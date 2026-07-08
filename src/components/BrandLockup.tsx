import { cn } from "@/lib/utils";

interface BrandLockupProps {
  /** Wordmark cap height in px */
  size?: number;
  /** Wrap the wordmark in the dark brand disc (the full logo lockup) */
  withDisc?: boolean;
  /** Breathing gold glow behind the wordmark */
  glow?: boolean;
  className?: string;
}

/**
 * The Zenvana wordmark — "ZENVANA" set in the display serif, tracked wide,
 * in brand gold. Recreated as live text (crisp, scalable, a few bytes)
 * instead of the 620KB rastered logo SVG.
 */
export default function BrandLockup({
  size = 22,
  withDisc = false,
  glow = false,
  className,
}: BrandLockupProps) {
  const wordmark = (
    <span className="relative inline-flex items-center justify-center">
      {glow && (
        <span
          aria-hidden="true"
          className="lockup-glow pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 120% at 50% 50%, var(--gold), transparent 70%)",
            filter: "blur(14px)",
            opacity: 0.6,
          }}
        />
      )}
      <span
        className="font-display font-semibold leading-none text-gold"
        style={{ fontSize: size, letterSpacing: "0.2em", textIndent: "0.2em" }}
      >
        ZENVANA
      </span>
    </span>
  );

  if (!withDisc) return <span className={cn("inline-flex", className)}>{wordmark}</span>;

  const discSize = size * 6.4;
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full",
        className
      )}
      style={{
        width: discSize,
        height: discSize,
        background:
          "radial-gradient(120% 120% at 50% 18%, oklch(0.28 0.05 258), oklch(0.12 0.03 262))",
        boxShadow:
          "inset 0 1px 0 oklch(1 0 0 / 8%), 0 20px 44px -22px oklch(0.12 0.03 262 / 90%)",
      }}
      aria-label="Zenvana"
    >
      {wordmark}
    </span>
  );
}
