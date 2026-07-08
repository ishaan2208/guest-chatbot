/**
 * App-wide ambient backdrop: soft drifting glows, slow light beams, and a
 * fine grain shimmer. Fixed and behind everything (`-z-10`), pointer-inert.
 *
 * Deliberately light: no blur filters (softness is baked into the gradient
 * stops), only `transform`/`opacity` animate, and it themes off CSS tokens.
 * All motion is frozen under `prefers-reduced-motion`.
 */
export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__beams" />
      <div className="ambient__blob ambient__blob--1" />
      <div className="ambient__blob ambient__blob--2" />
      <div className="ambient__blob ambient__blob--3" />
      <div className="ambient__grain" />
    </div>
  );
}
