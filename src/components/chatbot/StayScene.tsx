/**
 * A bespoke "your stay" vignette for the profile card — a cosy Zenvana room
 * with a window onto the golden-hour Dehradun hills: a made bed with gold-
 * banded linen, a potted plant, and a warm sun over the ridgelines. Same
 * fixed-palette, hand-drawn style as the reply cards; sliced to fill the banner.
 */
export default function StayScene({ className }: { className?: string }) {
  const ink = "#12233b";
  const gold = "#c8a85a";
  const spring = "#b9cf3f";
  return (
    <svg
      viewBox="0 0 132 84"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="A cosy Zenvana room with a view of the hills"
    >
      <defs>
        <linearGradient id="ss-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#faf4e8" />
          <stop offset="1" stopColor="#f1e7d2" />
        </linearGradient>
        <linearGradient id="ss-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6e3ec" />
          <stop offset="0.55" stopColor="#f4dfa2" />
          <stop offset="1" stopColor="#f0ca8b" />
        </linearGradient>
        <clipPath id="ss-win">
          <rect x="80" y="14" width="40" height="44" rx="4" />
        </clipPath>
      </defs>

      {/* wall + floor */}
      <rect width="132" height="84" fill="url(#ss-wall)" />
      <rect x="0" y="66" width="132" height="18" fill="#e8d9bd" />
      <line x1="0" y1="66" x2="132" y2="66" stroke={ink} strokeWidth="0.8" strokeOpacity="0.18" />

      {/* window onto the hills */}
      <g clipPath="url(#ss-win)">
        <rect x="80" y="14" width="40" height="44" fill="url(#ss-sky)" />
        <circle cx="94" cy="30" r="6.5" fill="#f3e0a2" />
        <path d="M78 48 q12 -7 22 -3 q11 4 24 -3 L124 60 L78 60 Z" fill="#a9ba7b" />
        <path d="M78 53 q14 -5 24 -1 q12 3 24 -4 L124 60 L78 60 Z" fill="#8aa063" />
      </g>
      <rect x="80" y="14" width="40" height="44" rx="4" fill="none" stroke={ink} strokeWidth="2.4" />
      <line x1="100" y1="14" x2="100" y2="58" stroke={ink} strokeWidth="1.6" />
      <line x1="80" y1="36" x2="120" y2="36" stroke={ink} strokeWidth="1.6" />

      {/* potted plant */}
      <g transform="translate(66 48)">
        <path d="M0 18 h11 l-1.5 -9 h-8 z" fill="#c98a5a" stroke={ink} strokeWidth="1.4" />
        <path d="M5.5 9 q-7 -3 -9 -13 q7 2 9 13 z" fill={spring} />
        <path d="M5.5 9 q7 -3 9 -13 q-7 2 -9 13 z" fill="#9bb06a" />
        <path d="M5.5 9 q0 -11 0 -17 q3 7 0 17 z" fill={spring} />
      </g>

      {/* bed */}
      <g>
        <rect x="6" y="30" width="15" height="36" rx="4" fill={ink} />
        <rect x="8.5" y="33" width="10" height="15" rx="3" fill="#1c3b60" />
        <rect x="6" y="52" width="56" height="14" rx="3" fill="#fffdf7" stroke={ink} strokeWidth="2" />
        <rect x="11" y="43" width="18" height="11" rx="4.5" fill="#fffdf7" stroke={ink} strokeWidth="1.8" />
        <rect x="24" y="44" width="17" height="10" rx="4.5" fill="#f6efe0" stroke={ink} strokeWidth="1.6" />
        <rect x="42" y="55" width="20" height="9" rx="2" fill="#ece0c3" />
        <line x1="42" y1="59.5" x2="62" y2="59.5" stroke={gold} strokeWidth="1.8" />
      </g>

      {/* a little warmth: sconce glow on the wall */}
      <circle cx="40" cy="26" r="9" fill="#f0dc93" opacity="0.35" />
      <circle cx="40" cy="26" r="2.2" fill={gold} />
    </svg>
  );
}
