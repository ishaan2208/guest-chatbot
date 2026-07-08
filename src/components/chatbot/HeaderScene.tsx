/**
 * A whisper of the Dehradun dawn behind the header — a soft gold glow rising
 * from the baseline and two delicate ridgelines, nothing more. No sun disc,
 * rays, stars or motion: the charm is the gold + the ridge silhouette, kept
 * quiet enough that the eye rests on "Zenvana" and the conversation, not here.
 * Matches the login flourish so the two screens rhyme.
 */
export default function HeaderScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 375 64"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hs-dawn" cx="50%" cy="108%" r="72%">
          <stop offset="0" stopColor="#e8d693" stopOpacity="0.22" />
          <stop offset="0.55" stopColor="#c8a85a" stopOpacity="0.06" />
          <stop offset="1" stopColor="#c8a85a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft dawn glow low on the bar */}
      <rect width="375" height="64" fill="url(#hs-dawn)" />

      {/* far ridge */}
      <path
        d="M-4 46 C90 36 150 47 214 42 C280 37 330 46 379 40"
        fill="none"
        stroke="#c8a85a"
        strokeOpacity="0.24"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* near ridge */}
      <path
        d="M-4 58 C100 49 168 58 236 53 C300 49 342 58 379 52"
        fill="none"
        stroke="#c8a85a"
        strokeOpacity="0.4"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
