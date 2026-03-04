// components/ui/background-beams.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = React.memo(function BackgroundBeams({
  className,
}: {
  className?: string;
}) {
  // IMPORTANT: unique IDs per component instance (prevents gradient/filter collisions)
  const uid = React.useId().replace(/:/g, "");
  const glowId = `${uid}-glow`;
  const softGlowId = `${uid}-softGlow`;
  const fogId = `${uid}-fog`;

  // minimal paths for a refined look (you can add more if you want)
  const paths = [
    "M-360 -210C-360 -210 -292 195 172 322C636 449 704 854 704 854",
    "M-320 -252C-320 -252 -252 153 212 280C676 407 744 812 744 812",
    "M-280 -294C-280 -294 -212 111 252 238C716 365 784 770 784 770",
    "M-240 -336C-240 -336 -172 69 292 196C756 323 824 728 824 728",
    "M-200 -378C-200 -378 -132 27 332 154C796 281 864 686 864 686",
    "M-160 -420C-160 -420 -92 -15 372 112C836 239 904 644 904 644",
  ];

  return (
    <div className={cn("absolute inset-0", className)} aria-hidden="true">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 696 316"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* base fog / haze (very subtle) */}
        <path
          d={paths[0]}
          stroke={`url(#${fogId})`}
          strokeOpacity="0.14"
          strokeWidth="2"
          filter={`url(#${softGlowId})`}
          vectorEffect="non-scaling-stroke"
        />

        {paths.map((d, i) => {
          const gradId = `${uid}-g${i}`;
          return (
            <motion.path
              key={i}
              d={d}
              stroke={`url(#${gradId})`}
              strokeOpacity="0.75"
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
              filter={`url(#${glowId})`}
            />
          );
        })}

        <defs>
          {/* Beam glow */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.1" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 8 -3
              "
              result="boost"
            />
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft fog glow */}
          <filter id={softGlowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated gradients (unique per instance) */}
          {paths.map((_, i) => {
            const gradId = `${uid}-g${i}`;
            return (
              <motion.linearGradient
                key={gradId}
                id={gradId}
                initial={{ x1: "0%", y1: "0%", x2: "0%", y2: "100%" }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["10%", "95%"],
                  y1: ["0%", "100%"],
                  y2: ["100%", "0%"],
                }}
                transition={{
                  duration: 18 + i * 1.1,
                  ease: [0.33, 0, 0.2, 1],
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.55,
                }}
              >
                {/* Works great with your page using mix-blend-screen on dark overlays */}
                <stop offset="0%" stopColor="#18CCFC" stopOpacity="0" />
                <stop offset="20%" stopColor="#18CCFC" stopOpacity="0.65" />
                <stop offset="55%" stopColor="#6344F5" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
              </motion.linearGradient>
            );
          })}

          {/* fog gradient */}
          <radialGradient id={fogId} cx="50%" cy="10%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
});