/**
 * A fun little Zenvana concierge — a friendly bellhop face on a midnight disc
 * with a gold-brimmed cap. Gives the header a warm personality where the plain
 * logo icon used to sit. Pure SVG, brand palette, no image load.
 */
export default function ConciergeAvatar({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Zenvana concierge"
    >
      <defs>
        <radialGradient id="ca-bg" cx="50%" cy="26%" r="80%">
          <stop offset="0" stopColor="#254a78" />
          <stop offset="0.6" stopColor="#123256" />
          <stop offset="1" stopColor="#081b34" />
        </radialGradient>
      </defs>

      {/* disc */}
      <circle cx="24" cy="24" r="23" fill="url(#ca-bg)" />
      <circle cx="24" cy="24" r="23" fill="none" stroke="#c8a85a" strokeWidth="1.5" strokeOpacity="0.55" />
      <circle cx="18" cy="15" r="7" fill="#ffffff" opacity="0.06" />

      {/* shoulders / collar peeking at the base */}
      <path d="M9 47 C11 39 17 35 24 35 C31 35 37 39 39 47 Z" fill="#12233b" />
      <path d="M24 35 l-3 6 3 3 3 -3 Z" fill="#c8a85a" opacity="0.9" />

      {/* face */}
      <circle cx="24" cy="26" r="11.5" fill="#f5ecd6" />
      {/* cheeks */}
      <circle cx="16.5" cy="28.5" r="2.1" fill="#e0a97e" opacity="0.55" />
      <circle cx="31.5" cy="28.5" r="2.1" fill="#e0a97e" opacity="0.55" />
      {/* eyes */}
      <circle cx="20" cy="25.5" r="1.7" fill="#12233b" />
      <circle cx="28" cy="25.5" r="1.7" fill="#12233b" />
      <circle cx="20.6" cy="24.9" r="0.5" fill="#fff" />
      <circle cx="28.6" cy="24.9" r="0.5" fill="#fff" />
      {/* smile */}
      <path d="M20 30 Q24 33.4 28 30" fill="none" stroke="#12233b" strokeWidth="1.7" strokeLinecap="round" />

      {/* bellhop cap */}
      <path d="M12.5 20 C13.5 11 34.5 11 35.5 20 Z" fill="#12233b" />
      <rect x="11.5" y="18.5" width="25" height="4.2" rx="2.1" fill="#c8a85a" />
      <circle cx="24" cy="10.4" r="2.1" fill="#e8d693" />
    </svg>
  );
}
