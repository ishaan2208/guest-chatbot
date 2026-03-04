"use client";

export function AnimatedBackdrop() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Soft blob accents - respect prefers-reduced-motion */}
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl motion-safe:backdrop-drift-slow" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet-500/5 blur-3xl motion-safe:backdrop-drift-slower" />
      <div
        className="absolute right-1/2 top-1/2 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-fuchsia-500/3 blur-3xl motion-safe:backdrop-drift-medium"
        style={{ animationDirection: "reverse" }}
      />

      {/* Subtle noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
