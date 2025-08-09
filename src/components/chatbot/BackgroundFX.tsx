export default function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* ===== Base wash (violet + fuchsia + amber), mobile-tuned ===== */}
      <div
        className="absolute inset-0 opacity-90
          [background-image:
            radial-gradient(360px_260px_at_20%_-8%,rgba(168,85,247,0.35),transparent 60%),
            radial-gradient(360px_260px_at_80%_-4%,rgba(236,72,153,0.28),transparent 60%),
            radial-gradient(420px_360px_at_50%_104%,rgba(251,191,36,0.22),transparent 66%),
            radial-gradient(380px_320px_at_50%_56%,rgba(168,85,247,0.16),transparent 70%),
            linear-gradient(135deg,rgba(255,255,255,0.045),transparent 80%)
          ]
          sm:[background-image:
            radial-gradient(520px_360px_at_18%_-10%,rgba(168,85,247,0.35),transparent 60%),
            radial-gradient(520px_360px_at_82%_-6%,rgba(236,72,153,0.28),transparent 60%),
            radial-gradient(560px_460px_at_50%_106%,rgba(251,191,36,0.22),transparent 66%),
            radial-gradient(520px_420px_at_50%_58%,rgba(168,85,247,0.16),transparent 70%),
            linear-gradient(135deg,rgba(255,255,255,0.05),transparent 80%)
          ]
          dark:[background-image:
            radial-gradient(360px_260px_at_20%_-8%,rgba(168,85,247,0.25),transparent 60%),
            radial-gradient(360px_260px_at_80%_-4%,rgba(236,72,153,0.22),transparent 60%),
            radial-gradient(420px_360px_at_50%_104%,rgba(251,191,36,0.14),transparent 66%),
            radial-gradient(380px_320px_at_50%_56%,rgba(168,85,247,0.12),transparent 70%),
            linear-gradient(135deg,rgba(255,255,255,0.03),transparent 80%)
          ]
          animate-[parallaxDrift_36s_ease-in-out_infinite]"
      />

      {/* ===== Vignette to focus center content ===== */}
      <div
        className="absolute inset-0 pointer-events-none
          [mask-image:radial-gradient(80%_60%_at_50%_40%,black,transparent)]
          dark:[mask-image:radial-gradient(75%_55%_at_50%_40%,black,transparent)]"
      />

      {/* ===== Light sweep (very subtle on mobile) ===== */}
      <div
        className="absolute -inset-[15%] rotate-12 mix-blend-soft-light opacity-35
          [background-image:linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)]
          [mask-image:radial-gradient(65%_140%_at_50%_50%,black,transparent)]
          animate-[sweep_28s_cubic-bezier(.6,.02,.2,1)_infinite]"
      />

      {/* ===== Orbital blobs — mobile radius first, upscale at sm+ ===== */}
      <div className="absolute left-1/2 top-1/2 h-0 w-0 animate-[orbitCW_64s_linear_infinite]">
        <div
          className="h-40 w-40 sm:h-56 sm:w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/32 blur-3xl transform-gpu"
          style={{ transform: "translateX(120px) translateY(-70px)" }}
        />
      </div>

      <div className="absolute left-1/2 top-1/2 h-0 w-0 animate-[orbitCCW_82s_linear_infinite]">
        <div
          className="h-44 w-44 sm:h-64 sm:w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/30 blur-3xl transform-gpu"
          style={{ transform: "translateX(-140px) translateY(90px)" }}
        />
      </div>

      <div className="absolute left-1/2 top-1/2 h-0 w-0 animate-[orbitCW_96s_linear_infinite]">
        <div
          className="h-36 w-36 sm:h-48 sm:w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200/26 to-amber-400/26 blur-3xl transform-gpu"
          style={{ transform: "translateX(80px) translateY(40px)" }}
        />
      </div>

      {/* ===== Sparse bokeh twinkles (mobile-safe) ===== */}
      <div
        className="absolute inset-0 mix-blend-screen opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 22%, rgba(255,255,255,0.18) 0 1px, transparent 2px)," +
            "radial-gradient(circle at 78% 30%, rgba(255,255,255,0.14) 0 1px, transparent 2px)," +
            "radial-gradient(circle at 32% 75%, rgba(255,255,255,0.12) 0 1px, transparent 2px)",
          backgroundSize: "100% 100%",
        }}
      />
      <div className="absolute inset-0 animate-[bokehTwinkle_6s_ease-in-out_infinite] opacity-30" />

      {/* ===== Micro-grid + gentle grain (smaller tiles on mobile) ===== */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.055]
          [background-size:28px_28px]
          sm:[background-size:40px_40px]
          [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_1px)]
          dark:opacity-[0.04]"
      />
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light
          [background-image:url('data:image/svg+xml;utf8,\
            <svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22>\
              <filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter>\
              <rect width=%22100%%22 height=%22100%%22 filter=%22url(%23n)%22/></svg>')]
          animate-[grainShift_10s_steps(5)_infinite]"
      />

      {/* ===== Keyframes ===== */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-[parallaxDrift_36s_ease-in-out_infinite],
          .animate-[sweep_28s_cubic-bezier(.6,.02,.2,1)_infinite],
          .animate-[orbitCW_64s_linear_infinite],
          .animate-[orbitCCW_82s_linear_infinite],
          .animate-[orbitCW_96s_linear_infinite],
          .animate-[grainShift_10s_steps(5)_infinite],
          .animate-[bokehTwinkle_6s_ease-in-out_infinite] { animation: none !important; }
        }

        /* Very gentle z-breathe + hue (longer for phones) */
        @keyframes parallaxDrift {
          0%   { transform: translate3d(0,0,0) scale(1); filter: hue-rotate(0deg); }
          50%  { transform: translate3d(0,-0.4%,0) scale(1.008); filter: hue-rotate(5deg); }
          100% { transform: translate3d(0,0,0) scale(1); filter: hue-rotate(0deg); }
        }

        /* Sweep kept subtle to avoid UI glare */
        @keyframes sweep {
          0%   { transform: translate3d(-60%,0,0) rotate(12deg); opacity: .18; }
          50%  { transform: translate3d(60%,0,0) rotate(12deg);  opacity: .32; }
          100% { transform: translate3d(-60%,0,0) rotate(12deg); opacity: .18; }
        }

        /* Orbits: slower, wider on desktop; small radii on phones via child inline transforms */
        @keyframes orbitCW {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbitCCW {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to   { transform: translate(-50%, -50%) rotate(0deg); }
        }

        /* Grain jitter */
        @keyframes grainShift {
          0%   { transform: translate3d(0,0,0); }
          20%  { transform: translate3d(-1%, 1%, 0); }
          40%  { transform: translate3d(1%, -1%, 0); }
          60%  { transform: translate3d(1%, 1%, 0); }
          80%  { transform: translate3d(-1%, 0, 0); }
          100% { transform: translate3d(0,0,0); }
        }

        /* Sparse twinkle (opacity-only to keep it cheap) */
        @keyframes bokehTwinkle {
          0%, 100% { opacity: .12; }
          50%      { opacity: .28; }
        }

        /* iOS viewport quirk fix: prefer small viewport units if available */
        @supports (height: 100svh) {
          .h-dvh { height: 100svh; }
        }

        /* Mobile fine-tune: slightly faster sweep for narrow screens to avoid visible pause */
        @media (max-width: 640px) {
          .animate-[sweep_28s_cubic-bezier(.6,.02,.2,1)_infinite] {
            animation-duration: 22s;
          }
        }
      `}</style>
    </div>
  );
}
