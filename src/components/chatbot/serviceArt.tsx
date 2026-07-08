import type { ReactNode } from "react";

/**
 * Bespoke, hand-drawn illustrations — one distinct scene per service, so a
 * towel request and a housekeeping request read as different *pictures*, not
 * the same card with a swapped icon. Each is a self-contained SVG with its own
 * soft fixed-palette panel (theme-independent, like framed artwork), so it
 * stays crisp and legible on both the light and dark chat surfaces.
 *
 * Palette (fixed on purpose):
 *   ink #12233b · gold #c8a85a · spring #b9cf3f · blue #6f93b8 · rose #c98a86
 */

const ink = "#12233b";
const gold = "#c8a85a";
const spring = "#b9cf3f";
const blue = "#6f93b8";

/** Shared frame: rounded panel background + centered scene. */
function Frame({
  from,
  to,
  children,
  id,
}: {
  from: string;
  to: string;
  children: ReactNode;
  id: string;
}) {
  return (
    <svg
      viewBox="0 0 132 84"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="132" height="84" fill={`url(#${id})`} />
      {children}
    </svg>
  );
}

const strokeProps = {
  fill: "none",
  stroke: ink,
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** A little four-point sparkle. */
function Sparkle({ x, y, s = 5, c = gold }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <path
      d={`M${x} ${y - s} Q${x + s * 0.24} ${y - s * 0.24} ${x + s} ${y} Q${x + s * 0.24} ${y + s * 0.24} ${x} ${y + s} Q${x - s * 0.24} ${y + s * 0.24} ${x - s} ${y} Q${x - s * 0.24} ${y - s * 0.24} ${x} ${y - s} Z`}
      fill={c}
    />
  );
}

/* ── Towels — a folded stack with a rolled towel + a sprig ──────────────── */
function TowelsArt() {
  return (
    <Frame id="art-towels" from="#faf7ec" to="#f0ead6">
      {/* stacked folded towels */}
      <g>
        <rect x="30" y="52" width="58" height="12" rx="4" fill="#fffdf7" stroke={ink} strokeWidth="2" />
        <rect x="33" y="42" width="52" height="12" rx="4" fill="#f6f1e2" stroke={ink} strokeWidth="2" />
        <rect x="36" y="32" width="46" height="12" rx="4" fill="#fffdf7" stroke={ink} strokeWidth="2" />
        {/* gold bands */}
        <line x1="30" y1="60" x2="88" y2="60" stroke={gold} strokeWidth="2.2" />
        <line x1="33" y1="50" x2="85" y2="50" stroke={gold} strokeWidth="2.2" />
        <line x1="36" y1="40" x2="82" y2="40" stroke={gold} strokeWidth="2.2" />
      </g>
      {/* rolled towel */}
      <g transform="translate(96 40)">
        <ellipse cx="0" cy="14" rx="13" ry="13" fill="#fffdf7" stroke={ink} strokeWidth="2" />
        <circle cx="0" cy="14" r="5.5" fill="none" stroke={gold} strokeWidth="2" />
        <path d="M-2 10 Q0 14 2 12" fill="none" stroke={ink} strokeWidth="1.6" />
      </g>
      {/* sprig */}
      <g transform="translate(58 22)">
        <path d="M0 10 C0 4 3 0 6 -2" {...strokeProps} strokeWidth="2" />
        <path d="M2 4 C-2 3 -4 5 -4 8 C-1 8 1 7 2 4Z" fill={spring} />
        <path d="M5 0 C3 -3 5 -6 8 -6 C8 -3 7 -1 5 0Z" fill={spring} />
      </g>
    </Frame>
  );
}

/* ── Housekeeping / cleaning — spray bottle + sparkles ──────────────────── */
function CleaningArt() {
  return (
    <Frame id="art-clean" from="#f1f6ea" to="#e4efd6">
      {/* spray bottle */}
      <g transform="translate(46 20)">
        <rect x="-14" y="16" width="30" height="34" rx="7" fill={ink} />
        <rect x="-10" y="26" width="22" height="12" rx="3" fill={spring} />
        {/* neck + head */}
        <rect x="-6" y="8" width="12" height="10" rx="2" fill={ink} />
        <path d="M-6 8 L-6 2 L10 2 L10 6 L2 8" fill={ink} />
        {/* trigger */}
        <path d="M-6 12 L-16 16 L-16 20 L-6 18" fill={ink} />
        {/* nozzle tip */}
        <rect x="9" y="1" width="6" height="4" rx="1.5" fill={gold} />
      </g>
      {/* spray mist */}
      <g fill={blue} opacity="0.85">
        <circle cx="74" cy="20" r="2" />
        <circle cx="84" cy="16" r="1.6" />
        <circle cx="82" cy="26" r="1.6" />
        <circle cx="92" cy="22" r="2.2" />
      </g>
      <Sparkle x={100} y={34} s={6} />
      <Sparkle x={112} y={50} s={4.5} c={spring} />
      <Sparkle x={90} y={46} s={3.5} />
      {/* surface shine */}
      <path d="M20 66 Q66 60 112 66" fill="none" stroke={gold} strokeWidth="2" opacity="0.6" />
    </Frame>
  );
}

/* ── Water — bottle + glass with a waterline ────────────────────────────── */
function WaterArt() {
  return (
    <Frame id="art-water" from="#eef4f8" to="#dce9f1">
      {/* bottle */}
      <g transform="translate(46 14)">
        <rect x="-3" y="-6" width="14" height="7" rx="2" fill={ink} />
        <path d="M-6 1 Q-8 6 -8 12 L-8 52 Q-8 58 -2 58 L10 58 Q16 58 16 52 L16 12 Q16 6 14 1 Z" fill="#fbfdff" stroke={ink} strokeWidth="2.2" />
        <path d="M-8 30 L16 30 L16 52 Q16 58 10 58 L-2 58 Q-8 58 -8 52 Z" fill={blue} opacity="0.5" />
        <line x1="-8" y1="20" x2="16" y2="20" stroke={ink} strokeWidth="1.4" opacity="0.5" />
      </g>
      {/* glass */}
      <g transform="translate(80 28)">
        <path d="M0 0 L26 0 L23 44 L3 44 Z" fill="#fbfdff" stroke={ink} strokeWidth="2.2" />
        <path d="M1.5 22 L24.5 22 L23 44 L3 44 Z" fill={blue} opacity="0.55" />
        <path d="M1.5 22 Q13 18 24.5 22" fill="none" stroke={blue} strokeWidth="2" />
      </g>
      {/* droplets */}
      <path d="M112 20 q3 4 0 6 a3 3 0 1 1 0 -6Z" fill={blue} />
      <path d="M120 34 q2.4 3 0 4.6 a2.3 2.3 0 1 1 0 -4.6Z" fill={blue} opacity="0.8" />
    </Frame>
  );
}

/* ── Dining — a room-service cloche with steam ──────────────────────────── */
function DiningArt() {
  return (
    <Frame id="art-dining" from="#faf6ea" to="#f1e9d3">
      {/* steam */}
      <g fill="none" stroke={gold} strokeWidth="2.2" opacity="0.75" strokeLinecap="round">
        <path d="M54 18 q-5 -6 0 -12 q5 -6 0 -12" />
        <path d="M66 16 q-5 -6 0 -12 q5 -6 0 -11" />
        <path d="M78 18 q-5 -6 0 -12 q5 -6 0 -12" />
      </g>
      {/* cloche dome */}
      <path d="M34 56 A32 30 0 0 1 98 56 Z" fill={ink} />
      <path d="M40 56 A26 24 0 0 1 92 56" fill="none" stroke={gold} strokeWidth="2" opacity="0.5" />
      <circle cx="66" cy="24" r="4.5" fill={gold} />
      {/* plate */}
      <ellipse cx="66" cy="58" rx="42" ry="7" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <ellipse cx="66" cy="58" rx="34" ry="4.5" fill="none" stroke={gold} strokeWidth="1.6" opacity="0.6" />
    </Frame>
  );
}

/* ── Maintenance — crossed wrench + screwdriver over a gear ─────────────── */
function MaintenanceArt() {
  return (
    <Frame id="art-fix" from="#eef1f4" to="#dde3ea">
      {/* gear */}
      <g transform="translate(66 42)" fill={gold} opacity="0.9">
        <path d="M0 -22 L4 -22 L5 -15 L11 -12 L16 -17 L20 -13 L15 -8 L18 -2 L25 -1 L25 3 L18 4 L15 10 L20 15 L16 19 L11 14 L5 17 L4 24 L0 24 L-1 17 L-7 14 L-12 19 L-16 15 L-11 10 L-14 4 L-21 3 L-21 -1 L-14 -2 L-11 -8 L-16 -13 L-12 -17 L-7 -12 L-1 -15 Z" />
        <circle cx="2" cy="1" r="9" fill="#eef1f4" />
      </g>
      {/* wrench */}
      <g transform="rotate(38 66 42)">
        <path d="M40 40 h34 a5 5 0 0 1 0 10 h-34 Z" fill={ink} />
        <path d="M40 38 a10 10 0 1 0 0 14 l0 -4 a6 6 0 1 1 0 -6 Z" fill={ink} />
      </g>
      {/* screwdriver */}
      <g transform="rotate(-38 66 42)">
        <rect x="58" y="22" width="8" height="20" rx="3" fill={spring} />
        <rect x="59.5" y="42" width="5" height="24" fill="#cfd6de" stroke={ink} strokeWidth="1.4" />
        <rect x="60" y="64" width="4" height="4" fill={ink} />
      </g>
    </Frame>
  );
}

/* ── Amenities — a pump bottle + soap bar + tube ────────────────────────── */
function AmenitiesArt() {
  return (
    <Frame id="art-amen" from="#f6f2f5" to="#eae2ea">
      {/* pump bottle */}
      <g transform="translate(40 16)">
        <rect x="0" y="18" width="20" height="46" rx="6" fill="#fbfdff" stroke={ink} strokeWidth="2.2" />
        <rect x="4" y="34" width="12" height="16" rx="2" fill={gold} opacity="0.35" />
        <rect x="7" y="8" width="6" height="12" fill={ink} />
        <path d="M10 8 L10 3 L20 3" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* soap bar */}
      <g transform="translate(72 44)">
        <rect x="0" y="0" width="34" height="20" rx="8" fill={spring} stroke={ink} strokeWidth="2.2" />
        <path d="M6 8 Q17 3 28 8" fill="none" stroke="#fffdf7" strokeWidth="2" opacity="0.8" />
      </g>
      {/* bubbles */}
      <circle cx="98" cy="30" r="4" fill="none" stroke={ink} strokeWidth="1.8" />
      <circle cx="108" cy="38" r="2.6" fill="none" stroke={ink} strokeWidth="1.6" />
    </Frame>
  );
}

/* ── Bedding — a plump pillow + folded blanket ──────────────────────────── */
function BeddingArt() {
  return (
    <Frame id="art-bed" from="#faf7ee" to="#efe8d7">
      {/* blanket stack */}
      <g>
        <rect x="66" y="46" width="46" height="16" rx="5" fill="#f4eede" stroke={ink} strokeWidth="2" />
        <rect x="70" y="34" width="40" height="14" rx="5" fill="#fffdf7" stroke={ink} strokeWidth="2" />
        <line x1="66" y1="54" x2="112" y2="54" stroke={gold} strokeWidth="2" />
        <line x1="70" y1="41" x2="110" y2="41" stroke={gold} strokeWidth="2" />
      </g>
      {/* pillow */}
      <g transform="translate(20 26)">
        <path d="M4 6 Q2 2 8 2 L44 2 Q50 2 48 8 L48 34 Q50 40 44 40 L8 40 Q2 40 4 34 Z" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
        <path d="M14 10 Q26 20 14 32" fill="none" stroke={ink} strokeWidth="1.6" opacity="0.4" />
      </g>
    </Frame>
  );
}

/* ── Keycard — a card with a gold chip + contactless arcs ───────────────── */
function KeycardArt() {
  return (
    <Frame id="art-key" from="#e9edf3" to="#d7dee9">
      <g transform="rotate(-8 66 42)">
        <rect x="34" y="22" width="64" height="42" rx="7" fill={ink} />
        <rect x="42" y="34" width="12" height="10" rx="2.5" fill={gold} />
        <path d="M50 34 v10 M42 39 h12" stroke={ink} strokeWidth="1.2" />
        {/* contactless arcs */}
        <g fill="none" stroke={spring} strokeWidth="2.4" strokeLinecap="round">
          <path d="M66 34 q6 8 0 16" />
          <path d="M74 30 q10 12 0 24" />
        </g>
        <text x="42" y="58" fill={gold} fontSize="7" fontFamily="Fraunces, serif" letterSpacing="2">ZENVANA</text>
      </g>
    </Frame>
  );
}

/* ── Checkout — a rolling suitcase with a tag ───────────────────────────── */
function LuggageArt() {
  return (
    <Frame id="art-bag" from="#f7f4ec" to="#ece4d3">
      {/* handle */}
      <path d="M50 22 v-8 a16 8 0 0 1 32 0 v8" {...strokeProps} />
      {/* body */}
      <rect x="42" y="22" width="48" height="42" rx="8" fill={ink} />
      <rect x="42" y="22" width="48" height="42" rx="8" fill="none" stroke={gold} strokeWidth="2" opacity="0.4" />
      <line x1="58" y1="22" x2="58" y2="64" stroke={gold} strokeWidth="2.4" />
      <line x1="74" y1="22" x2="74" y2="64" stroke={spring} strokeWidth="2.4" />
      {/* wheels */}
      <circle cx="52" cy="70" r="4" fill={ink} />
      <circle cx="80" cy="70" r="4" fill={ink} />
      {/* tag */}
      <g transform="translate(96 30)">
        <path d="M0 0 l8 4 l-2 12 l-8 -2 Z" fill={gold} />
      </g>
    </Frame>
  );
}

/* ── Concierge bell — the graceful catch-all ────────────────────────────── */
function BellArt() {
  return (
    <Frame id="art-bell" from="#faf6ea" to="#f1e9d3">
      {/* ding sparkles */}
      <Sparkle x={96} y={26} s={5} />
      <Sparkle x={104} y={40} s={3.5} c={spring} />
      {/* bell */}
      <circle cx="60" cy="18" r="4" fill={gold} />
      <path d="M34 54 A26 30 0 0 1 86 54 Z" fill={ink} />
      <path d="M40 54 A20 22 0 0 1 80 54" fill="none" stroke={gold} strokeWidth="2" opacity="0.5" />
      {/* base */}
      <rect x="30" y="54" width="60" height="8" rx="4" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <ellipse cx="60" cy="66" rx="34" ry="4" fill={ink} opacity="0.12" />
    </Frame>
  );
}

const rose = "#c98a86";

/* ── TV not working — a flat screen with a play glyph ───────────────────── */
function TvArt() {
  return (
    <Frame id="art-tv" from="#eef1f6" to="#dde4ec">
      <rect x="30" y="18" width="72" height="42" rx="4" fill={ink} />
      <rect x="34" y="22" width="64" height="34" rx="2" fill="#1c3b60" />
      <path d="M60 31 L76 40 L60 49 Z" fill={gold} />
      <rect x="60" y="60" width="12" height="6" fill={ink} />
      <rect x="48" y="66" width="36" height="3" rx="1.5" fill={ink} />
      <Sparkle x={98} y={26} s={4} c={spring} />
    </Frame>
  );
}

/* ── AC not cooling — a split unit shedding snowflakes ──────────────────── */
function AcArt() {
  return (
    <Frame id="art-ac" from="#eaf2f6" to="#d6e6ee">
      <rect x="24" y="22" width="84" height="24" rx="6" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <line x1="28" y1="40" x2="104" y2="40" stroke={ink} strokeWidth="1.3" opacity="0.4" />
      <rect x="70" y="42" width="20" height="3" rx="1.5" fill={blue} />
      <g stroke={blue} strokeWidth="1.6" strokeLinecap="round">
        <g transform="translate(52 60)"><path d="M0 -6 V6 M-5 -3 L5 3 M-5 3 L5 -3" /></g>
        <g transform="translate(74 66) scale(0.78)"><path d="M0 -6 V6 M-5 -3 L5 3 M-5 3 L5 -3" /></g>
      </g>
    </Frame>
  );
}

/* ── Flush / plumbing — a faucet, a drip and a wrench ───────────────────── */
function PlumbingArt() {
  return (
    <Frame id="art-plumb" from="#eaf1f6" to="#d7e6ef">
      <path d="M46 24 h10 v6 h18 a7 7 0 0 1 7 7 v5" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="40" y="20" width="20" height="7" rx="3.5" fill={ink} />
      <path d="M87 46 q4 6 0 9 a4.5 4.5 0 1 1 0 -9Z" fill={blue} />
      <g transform="rotate(38 44 62)">
        <path d="M30 60 h20 a4 4 0 0 1 0 8 h-20 Z" fill={gold} />
        <path d="M30 58 a8 8 0 1 0 0 12 l0 -3 a5 5 0 1 1 0 -6 Z" fill={gold} />
      </g>
    </Frame>
  );
}

/* ── Lights — a glowing pendant bulb ────────────────────────────────────── */
function LightArt() {
  return (
    <Frame id="art-light" from="#faf6ea" to="#f0e7d0">
      <ellipse cx="66" cy="42" rx="26" ry="20" fill={gold} opacity="0.14" />
      <line x1="66" y1="8" x2="66" y2="24" stroke={ink} strokeWidth="2" />
      <circle cx="66" cy="40" r="15" fill="#f4e09a" stroke={ink} strokeWidth="2.2" />
      <path d="M60 52 h12 M61 56 h10" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <g stroke={gold} strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
        <path d="M42 40 h-7 M97 40 h7 M49 24 l-5 -5 M83 24 l5 -5" />
      </g>
    </Frame>
  );
}

/* ── Geyser — a water heater with a warm drip ───────────────────────────── */
function GeyserArt() {
  return (
    <Frame id="art-geyser" from="#faefe8" to="#f0ddd0">
      <rect x="46" y="14" width="40" height="48" rx="10" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <circle cx="66" cy="32" r="7" fill="none" stroke={ink} strokeWidth="2" />
      <rect x="59" y="50" width="14" height="4" rx="2" fill="#d9534f" />
      <path d="M56 66 q3 4 0 6 a3 3 0 1 1 0 -6Z" fill={blue} />
      <path d="M80 60 c5 4 4 11 -1 11 c-4 0 -6 -5 1 -11Z" fill="#e8955a" />
    </Frame>
  );
}

/* ── Power socket — a plug with a friendly spark ────────────────────────── */
function SocketArt() {
  return (
    <Frame id="art-socket" from="#eef1f5" to="#dde3ea">
      <rect x="40" y="24" width="34" height="40" rx="8" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <circle cx="52" cy="42" r="3" fill={ink} />
      <circle cx="62" cy="42" r="3" fill={ink} />
      <rect x="53" y="52" width="8" height="5" rx="1.5" fill={ink} />
      <g fill={gold}>
        <path d="M86 30 l-8 12 h6 l-6 12 14 -16 h-6 z" />
      </g>
    </Frame>
  );
}

/* ── Fridge / minibar — a two-door fridge with a snowflake ──────────────── */
function FridgeArt() {
  return (
    <Frame id="art-fridge" from="#eaf2f4" to="#d8e6ea">
      <rect x="48" y="14" width="36" height="56" rx="6" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <line x1="48" y1="34" x2="84" y2="34" stroke={ink} strokeWidth="1.8" />
      <rect x="52" y="20" width="3" height="8" rx="1.5" fill={ink} />
      <rect x="52" y="40" width="3" height="10" rx="1.5" fill={ink} />
      <g stroke={blue} strokeWidth="1.6" strokeLinecap="round" transform="translate(70 52)">
        <path d="M0 -6 V6 M-5 -3 L5 3 M-5 3 L5 -3" />
      </g>
    </Frame>
  );
}

/* ── Fan — a little breeze machine ──────────────────────────────────────── */
function FanArt() {
  return (
    <Frame id="art-fan" from="#eef2f5" to="#dde5ea">
      <circle cx="66" cy="38" r="24" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <g fill={blue} opacity="0.85">
        <path d="M66 38 C58 24 74 22 66 38Z" />
        <path d="M66 38 C80 30 82 46 66 38Z" />
        <path d="M66 38 C74 52 58 54 66 38Z" />
        <path d="M66 38 C52 46 50 30 66 38Z" />
      </g>
      <circle cx="66" cy="38" r="4" fill={ink} />
      <rect x="63" y="62" width="6" height="8" fill={ink} />
      <rect x="52" y="70" width="28" height="3" rx="1.5" fill={ink} />
    </Frame>
  );
}

/* ── Soap ── */
function SoapArt() {
  return (
    <Frame id="art-soap" from="#f1f6ea" to="#e2eed4">
      <rect x="42" y="42" width="48" height="26" rx="11" fill={spring} stroke={ink} strokeWidth="2.2" />
      <path d="M50 52 Q66 45 82 52" fill="none" stroke="#fffdf7" strokeWidth="2.2" opacity="0.85" />
      <g fill="none" stroke={ink} strokeWidth="1.8">
        <circle cx="60" cy="28" r="5" />
        <circle cx="74" cy="22" r="3.4" />
        <circle cx="82" cy="32" r="2.6" />
      </g>
    </Frame>
  );
}

/* ── Slippers ── */
function SlippersArt() {
  return (
    <Frame id="art-slip" from="#faf6ee" to="#efe7d6">
      <g fill="#fffdf7" stroke={ink} strokeWidth="2.2">
        <path d="M34 44 q-8 0 -8 8 q0 8 10 8 q16 0 18 -8 q1 -8 -8 -8 Z" />
        <path d="M72 52 q-8 0 -8 8 q0 8 10 8 q16 0 18 -8 q1 -8 -8 -8 Z" />
      </g>
      <path d="M34 46 q10 -2 18 3" fill="none" stroke={gold} strokeWidth="2.4" />
      <path d="M72 54 q10 -2 18 3" fill="none" stroke={gold} strokeWidth="2.4" />
    </Frame>
  );
}

/* ── Dental kit ── */
function DentalArt() {
  return (
    <Frame id="art-dental" from="#eef4f6" to="#dbe9ee">
      <g transform="rotate(-24 60 42)">
        <rect x="40" y="40" width="44" height="6" rx="3" fill="#fffdf7" stroke={ink} strokeWidth="2" />
        <rect x="78" y="36" width="12" height="14" rx="2" fill="#fffdf7" stroke={ink} strokeWidth="2" />
        <g stroke={blue} strokeWidth="1.6" strokeLinecap="round"><path d="M80 38 v10 M84 38 v10 M88 38 v10" /></g>
      </g>
      <g transform="rotate(20 60 58)">
        <rect x="44" y="54" width="30" height="9" rx="4.5" fill={spring} stroke={ink} strokeWidth="2" />
        <path d="M74 56 q6 2 0 5Z" fill="#fffdf7" stroke={ink} strokeWidth="1.4" />
      </g>
    </Frame>
  );
}

/* ── Shaving kit ── */
function ShavingArt() {
  return (
    <Frame id="art-shave" from="#eef2f6" to="#dde4ec">
      <g transform="rotate(24 58 44)">
        <rect x="52" y="20" width="6" height="22" rx="3" fill={ink} />
        <rect x="46" y="42" width="18" height="8" rx="2" fill="#cfd6de" stroke={ink} strokeWidth="1.6" />
        <path d="M47 50 h16" stroke={ink} strokeWidth="1.4" />
      </g>
      <g transform="translate(84 34)">
        <ellipse cx="0" cy="-6" rx="9" ry="11" fill="#f4ead2" stroke={ink} strokeWidth="1.8" />
        <rect x="-6" y="4" width="12" height="16" rx="3" fill={gold} stroke={ink} strokeWidth="1.8" />
      </g>
    </Frame>
  );
}

/* ── Care — a discreet complimentary pack with a soft heart-leaf ────────── */
function CareArt() {
  return (
    <Frame id="art-care" from="#f7f0f2" to="#ecdfe4">
      <rect x="44" y="26" width="44" height="34" rx="8" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <path d="M66 36 c-3 -5 -11 -3 -11 3 c0 5 7 9 11 12 c4 -3 11 -7 11 -12 c0 -6 -8 -8 -11 -3Z" fill={rose} />
      <path d="M76 30 q7 -3 10 2 q-6 3 -10 -2Z" fill={spring} />
      <line x1="50" y1="66" x2="82" y2="66" stroke={gold} strokeWidth="2" opacity="0.6" />
    </Frame>
  );
}

/* ── Iron ── */
function IronArt() {
  return (
    <Frame id="art-iron" from="#eef1f6" to="#dde4ec">
      <rect x="24" y="60" width="84" height="8" rx="4" fill="#fffdf7" stroke={ink} strokeWidth="2" />
      <path d="M38 52 h34 a10 10 0 0 1 -10 8 h-30 a6 6 0 0 1 6 -8Z" fill={ink} />
      <rect x="42" y="40" width="22" height="8" rx="4" fill={ink} />
      <path d="M46 40 q6 -8 14 0" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="52" cy="55" r="1.6" fill={gold} />
      <Sparkle x={92} y={40} s={4} c={spring} />
    </Frame>
  );
}

/* ── Kids meal ── */
function KidsMealArt() {
  return (
    <Frame id="art-kids" from="#faf3ea" to="#f2e6d3">
      <circle cx="66" cy="44" r="26" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <circle cx="66" cy="44" r="19" fill="none" stroke={gold} strokeWidth="1.4" opacity="0.6" />
      {/* a smiley made of food */}
      <circle cx="57" cy="38" r="3.4" fill="#e8955a" />
      <circle cx="75" cy="38" r="3.4" fill="#e8955a" />
      <path d="M55 50 q11 8 22 0" fill="none" stroke={spring} strokeWidth="3.4" strokeLinecap="round" />
      <Sparkle x={96} y={24} s={4} />
    </Frame>
  );
}

/* ── Jain / sattvic meal ── */
function JainMealArt() {
  return (
    <Frame id="art-jain" from="#f0f6e9" to="#e0eed2">
      <ellipse cx="66" cy="50" rx="30" ry="9" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <path d="M50 46 q16 -12 32 0" fill="none" stroke={ink} strokeWidth="2" />
      {/* leaf bowl */}
      <path d="M66 24 C54 30 54 42 66 46 C78 42 78 30 66 24Z" fill={spring} stroke={ink} strokeWidth="2" />
      <path d="M66 28 V44" stroke={ink} strokeWidth="1.4" opacity="0.5" />
    </Frame>
  );
}

/* ── Table booking — a set place with a candle ──────────────────────────── */
function TableArt() {
  return (
    <Frame id="art-table" from="#faf6ea" to="#f1e8d4">
      <ellipse cx="66" cy="52" rx="20" ry="7" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <line x1="42" y1="46" x2="42" y2="58" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <path d="M90 46 v12 M87 46 q3 2 3 5" stroke={ink} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* candle */}
      <rect x="63" y="30" width="6" height="14" rx="2" fill={gold} />
      <path d="M66 24 c3 3 0 6 0 6 c-3 0 -3 -4 0 -6Z" fill="#e8955a" />
    </Frame>
  );
}

/* ── Taxi ── */
function TaxiArt() {
  return (
    <Frame id="art-taxi" from="#faf3e6" to="#f1e6cf">
      <path d="M28 54 v-8 l10 -12 h34 l12 12 h8 a4 4 0 0 1 4 4 v6 Z" fill={gold} stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M42 34 h20 v10 h-28 Z" fill="#cfe3ef" stroke={ink} strokeWidth="1.6" />
      <rect x="46" y="26" width="20" height="6" rx="2" fill={ink} />
      <circle cx="46" cy="56" r="7" fill="#fffdf7" stroke={ink} strokeWidth="2.4" />
      <circle cx="86" cy="56" r="7" fill="#fffdf7" stroke={ink} strokeWidth="2.4" />
    </Frame>
  );
}

/* ── Clearing plates ── */
function ClearingArt() {
  return (
    <Frame id="art-clear" from="#f1f6ea" to="#e3efd6">
      <ellipse cx="60" cy="52" rx="26" ry="8" fill="#fffdf7" stroke={ink} strokeWidth="2.2" />
      <ellipse cx="60" cy="50" rx="16" ry="4.5" fill="none" stroke={gold} strokeWidth="1.4" opacity="0.6" />
      <g transform="rotate(20 84 40)">
        <line x1="84" y1="26" x2="84" y2="46" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M80 26 v8 M84 26 v8 M88 26 v8" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <Sparkle x={40} y={30} s={4.5} />
      <Sparkle x={94} y={58} s={3.5} c={spring} />
    </Frame>
  );
}

export type ArtKey =
  | "towels" | "cleaning" | "water" | "dining" | "maintenance"
  | "amenities" | "bedding" | "keycard" | "luggage" | "bell"
  | "tv" | "climate" | "plumbing" | "light" | "geyser" | "socket"
  | "fridge" | "fan" | "soap" | "slippers" | "dental" | "shaving"
  | "care" | "iron" | "kidsmeal" | "jainmeal" | "table" | "taxi" | "clearing";

export const SERVICE_ART: Record<ArtKey, () => ReactNode> = {
  towels: TowelsArt,
  cleaning: CleaningArt,
  water: WaterArt,
  dining: DiningArt,
  maintenance: MaintenanceArt,
  amenities: AmenitiesArt,
  bedding: BeddingArt,
  keycard: KeycardArt,
  luggage: LuggageArt,
  bell: BellArt,
  tv: TvArt,
  climate: AcArt,
  plumbing: PlumbingArt,
  light: LightArt,
  geyser: GeyserArt,
  socket: SocketArt,
  fridge: FridgeArt,
  fan: FanArt,
  soap: SoapArt,
  slippers: SlippersArt,
  dental: DentalArt,
  shaving: ShavingArt,
  care: CareArt,
  iron: IronArt,
  kidsmeal: KidsMealArt,
  jainmeal: JainMealArt,
  table: TableArt,
  taxi: TaxiArt,
  clearing: ClearingArt,
};

/** Map a service `type` to the illustration that fits it best. */
export function artForType(type: string): ArtKey {
  switch (type) {
    case "EXTRA_TOWELS":
      return "towels";
    case "ROOM_CLEANING":
      return "cleaning";
    case "FOOD_CLEARANCE":
      return "clearing";
    case "WATER_REFILL":
      return "water";
    case "ORDER_FOOD":
      return "dining";
    case "KIDS_MEAL":
      return "kidsmeal";
    case "JAIN_MEAL":
      return "jainmeal";
    case "TABLE_BOOKING":
      return "table";
    case "TV_NOT_WORKING":
      return "tv";
    case "AC_NOT_WORKING":
      return "climate";
    case "FLUSH_NOT_WORKING":
      return "plumbing";
    case "LIGHT_ISSUE":
      return "light";
    case "GEYSER_ISSUE":
      return "geyser";
    case "SOCKET_ISSUE":
      return "socket";
    case "FRIDGE_ISSUE":
      return "fridge";
    case "FAN_ISSUE":
      return "fan";
    case "SOAP_REQUEST":
      return "soap";
    case "BODY_WASH":
      return "amenities";
    case "SLIPPER":
      return "slippers";
    case "DENTAL_KIT":
      return "dental";
    case "SHAVING_KIT":
      return "shaving";
    case "SANITARY_PADS":
      return "care";
    case "IRON_REQUEST":
      return "iron";
    case "EXTRA_BLANKET":
      return "bedding";
    case "LOST_KEYCARD":
      return "keycard";
    case "CHECKOUT_REQUEST":
      return "luggage";
    case "BOOK_TAXI":
      return "taxi";
    default:
      return "bell";
  }
}
