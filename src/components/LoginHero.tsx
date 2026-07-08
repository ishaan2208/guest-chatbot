/**
 * Bespoke illustrated hero for the sign-in screen — a serene Dehradun-hills
 * boutique-hotel night: graded sky, a gold crescent moon, a scatter of stars,
 * layered ridgelines, pines, and the little hotel with warm gold-lit windows.
 * Drawn in the same fixed-palette, gold-accented style as the reply cards.
 * A couple of compositor-only twinkles keep it alive without taxing a low-end
 * phone; everything freezes under prefers-reduced-motion.
 */
export default function LoginHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 375 320"
      preserveAspectRatio="xMidYMin slice"
      className={className}
      role="img"
      aria-label="A boutique Zenvana hotel among the Dehradun hills at night"
    >
      <defs>
        <linearGradient id="lh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060d1c" />
          <stop offset="0.4" stopColor="#0e2144" />
          <stop offset="0.72" stopColor="#1c3a63" />
          <stop offset="1" stopColor="#12233f" />
        </linearGradient>
        <radialGradient id="lh-glow" cx="50%" cy="86%" r="66%">
          <stop offset="0" stopColor="#e8d693" stopOpacity="0.34" />
          <stop offset="0.5" stopColor="#c8a85a" stopOpacity="0.1" />
          <stop offset="1" stopColor="#c8a85a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lh-moon" cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#fbf3d6" />
          <stop offset="1" stopColor="#d9b866" />
        </radialGradient>
        <radialGradient id="lh-moonhalo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e8d693" stopOpacity="0.42" />
          <stop offset="1" stopColor="#e8d693" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lh-hill-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22456e" />
          <stop offset="1" stopColor="#183353" />
        </linearGradient>
        <linearGradient id="lh-hill-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15304f" />
          <stop offset="1" stopColor="#0f2440" />
        </linearGradient>
      </defs>

      <rect width="375" height="320" fill="url(#lh-sky)" />
      <rect width="375" height="320" fill="url(#lh-glow)" />

      {/* Moon + halo */}
      <circle cx="292" cy="62" r="52" fill="url(#lh-moonhalo)" className="lh-moon-halo" />
      <circle cx="292" cy="62" r="22" fill="url(#lh-moon)" />
      <circle cx="304" cy="56" r="19" fill="#0e2144" opacity="0.92" />

      {/* Stars + sparkles */}
      <g fill="#e8d693">
        <circle cx="56" cy="44" r="1.5" className="lh-tw lh-tw1" />
        <circle cx="120" cy="30" r="1.1" className="lh-tw lh-tw2" />
        <circle cx="200" cy="52" r="1.3" className="lh-tw lh-tw3" />
        <circle cx="150" cy="72" r="1" className="lh-tw lh-tw1" />
        <circle cx="336" cy="40" r="1.2" className="lh-tw lh-tw2" />
        <circle cx="40" cy="96" r="1" className="lh-tw lh-tw3" />
        <path d="M92 66 l1.3 3 3 1.3 -3 1.3 -1.3 3 -1.3 -3 -3 -1.3 3 -1.3Z" className="lh-tw lh-tw2" />
        <path d="M252 24 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1Z" className="lh-tw lh-tw3" />
      </g>

      {/* Ridgelines */}
      <path d="M0 176 C60 150 110 168 165 150 C220 132 280 156 375 138 L375 320 L0 320 Z" fill="url(#lh-hill-back)" />
      <path d="M0 214 C70 190 120 206 190 196 C260 186 320 204 375 194 L375 320 L0 320 Z" fill="url(#lh-hill-mid)" />

      {/* Pines */}
      <g stroke="#0a1f39" strokeWidth="1.5" fill="#0c2743">
        <g transform="translate(62 200)">
          <path d="M0 0 L7 16 L-7 16 Z" />
          <path d="M0 8 L9 26 L-9 26 Z" />
          <rect x="-1.4" y="26" width="2.8" height="6" fill="#0a1f39" />
        </g>
        <g transform="translate(306 218) scale(0.8)">
          <path d="M0 0 L7 16 L-7 16 Z" />
          <path d="M0 8 L9 26 L-9 26 Z" />
          <rect x="-1.4" y="26" width="2.8" height="6" fill="#0a1f39" />
        </g>
      </g>

      {/* Boutique hotel with warm gold windows */}
      <g transform="translate(160 162)">
        <ellipse cx="30" cy="30" rx="52" ry="26" fill="#e8d693" opacity="0.12" />
        <rect x="6" y="14" width="48" height="40" rx="2" fill="#0b2036" stroke="#e8d693" strokeWidth="1" strokeOpacity="0.55" />
        <path d="M2 15 L30 -2 L58 15 Z" fill="#0a1b30" stroke="#e8d693" strokeWidth="1" strokeOpacity="0.5" />
        <rect x="24" y="-16" width="12" height="18" rx="1.5" fill="#0b2036" stroke="#e8d693" strokeWidth="0.9" strokeOpacity="0.5" />
        <path d="M22 -14 L30 -24 L38 -14 Z" fill="#0a1b30" stroke="#e8d693" strokeWidth="0.9" strokeOpacity="0.5" />
        <g fill="#f0d98a" className="lh-window">
          <rect x="12" y="22" width="6" height="8" rx="1" />
          <rect x="24" y="22" width="6" height="8" rx="1" />
          <rect x="36" y="22" width="6" height="8" rx="1" />
          <rect x="12" y="36" width="6" height="8" rx="1" />
          <rect x="36" y="36" width="6" height="8" rx="1" />
          <rect x="27" y="-12" width="6" height="7" rx="1" />
        </g>
        <rect x="25" y="42" width="10" height="12" rx="1.5" fill="#e8c877" />
        <ellipse cx="30" cy="56" rx="12" ry="4" fill="#e8d693" opacity="0.18" />
      </g>

      {/* Front ridge + winding gold path */}
      <path d="M0 252 C80 232 150 246 210 238 C280 229 330 244 375 238 L375 320 L0 320 Z" fill="#0b1c34" />
      <path
        d="M190 180 C178 204 212 218 198 240 C188 256 216 268 202 320"
        fill="none"
        stroke="#c8a85a"
        strokeWidth="2.2"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
