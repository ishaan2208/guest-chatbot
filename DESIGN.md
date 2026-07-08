# Design System — Zenvana Guest Concierge

Mobile-first chat UI for a menu-driven hotel concierge. Inherits the Zenvana brand (midnight + praxeti + spring) with Feasta's editorial discipline. Light theme is default (bright hotel rooms, all-ages legibility); dark theme follows system.

## Theme

- **Register:** product (design serves the task: request a service fast)
- **Default:** light. Praxeti-white canvas, midnight ink. Dark mode = warm ink canvas, praxeti text, spring accent.
- **Feel:** calm, composed, one accent. No gradients as decoration, no glass stacks, no animated backgrounds.

## Color Palette (OKLCH; hex anchors from the Zenvana brand)

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--background` | `oklch(0.9726 0.0132 111.3)` #F6F7ED praxeti | `oklch(0.17 0.028 262)` warm ink | page canvas |
| `--foreground` | `oklch(0.2381 0.0713 252)` #001F3F midnight | `oklch(0.955 0.011 111)` | primary text; 15.3:1 on praxeti |
| `--surface` / `--card` | `oklch(0.995 0.004 110)` near-white | `oklch(0.225 0.028 260)` | bot bubbles, cards |
| `--primary` | midnight | `oklch(0.8893 0.1718 113.4)` spring | CTAs, guest bubbles (light), active states |
| `--primary-foreground` | praxeti | ink | |
| `--accent` (spring) | `oklch(0.8893 0.1718 113.4)` #DBE64C | same | dots, badges, active indicators only — NEVER text on light (1.26:1) |
| `--success` | `oklch(0.5278 0.1262 156.7)` #00804C | `oklch(0.72 0.14 157)` | ETA text, confirmed states; 4.64:1 on praxeti |
| `--muted-foreground` | `oklch(0.45 0.045 255)` ≈#44506A | `oklch(0.72 0.02 255)` | 7.4:1 on praxeti |
| `--border` | `oklch(0.238 0.07 252 / 10%)` midnight 10% | `oklch(0.97 0.01 111 / 10%)` | hairlines |
| `--destructive` | `oklch(0.5683 0.135 36.2)` #B8553A ember | brightened | errors |

Rules: spring is a signal color (online dot, active tab, chargeable badge ring), never body text on light. One accent moment per screen.

## Typography

- **Display:** Fraunces 600 (self-hosted, latin subset) — wordmark "Zenvana", login greeting, page titles. Tracking −0.02em.
- **UI/body:** Inter variable (self-hosted, latin) — everything else. `font-feature-settings: "cv11"`; tabular numerals (`tnum`) for times, ETAs, room numbers.
- Scale (fixed rem, product register): 12 / 13 / 15 / 17 / 20 / 24 / 30. Body = 15–17px. Chat bubbles 15px/1.5.
- No all-caps body; small caps labels ≤ 3 words only.

## Radius

- `--radius: 1rem` (16px). Bubbles 1.25rem with one 0.375rem corner toward the sender. Chips/buttons `rounded-full`. Cards 1.25rem. Inputs 0.875rem.

## Shadows & Borders

- Shadows are navy-tinted and soft: `0 1px 2px rgba(0,31,63,.06), 0 8px 24px -12px rgba(0,31,63,.14)`. Bot bubbles get the small tier only.
- Hairline borders (10% ink) do most separation work; shadows are secondary.

## Motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint family, shared with both sibling apps).
- Durations: 150ms (press), 240ms (message/chip entrance), 350ms (dock swap).
- CSS-only on the chat path (compositor: transform + opacity). No framer-motion in the message loop.
- **Ambient depth is intentional, not decoration to strip.** The `AmbientBackground` (drifting glows + slow beams + grain shimmer) runs app-wide behind content. It is cheap on purpose: softness is baked into gradient stops (no blur filters), only `transform`/`opacity` animate, and it's one fixed layer that never repaints on scroll. The bar is "lighter on code, not on aesthetics" — keep the richness, keep the code clean.
- Press feedback: `active:scale-[0.97]`. Keycard has a slow sheen sweep; brand lockup has a gold glow breath.
- Every animation has a `prefers-reduced-motion` fallback (instant or crossfade); ambient + sheen + glow freeze entirely.
- Restored history renders static; only new messages animate.

## Brand & rich content

- **Logo lockup (`BrandLockup`):** the authentic Zenvana mark is "ZENVANA" in gold (`--gold`, #C8A85A) display serif, tracked 0.2em, on a midnight disc. Recreated as live text, not the 620KB rastered logo SVG. Used on the splash and login hero (`withDisc glow`).
- **Splash:** `Splash` (React, ambient + lockup, for booking-fetch / QR sign-in) and an instant boot splash inlined in `index.html` (system serif, painted before the bundle, removed by `main.tsx` on mount). Gold on midnight, matching the logo.
- **Rich messages:** bot messages can carry structured payloads, not just text. The flagship is the **Wi-Fi keycard** (`WifiCard`): a hotel-keycard illustration — gold EMV chip, "GUEST WI-FI", network, mono password, gold tap-to-copy (haptic + "Copied" flip), sheen sweep, gold ZENVANA lockup. Emitted from `GuestChatBot` on `WIFI_PASSWORD`; the `wifi` payload is persisted with the message. The card face is one of the few sanctioned uses of gradient depth (it reads as a physical card). This is the template for future rich replies.

## Components

- **Header:** solid background (no backdrop-filter), hairline bottom border. Brand mark (midnight circle, spring Z) + "Zenvana" in Fraunces + "Concierge · Room NNN" status with spring dot. Right: refresh + sign-out icon buttons (44px).
- **Bot bubble:** surface card, ink text, radius 20/20/20/6 (toward avatar), small shadow. Avatar only on first bubble of a group. Receipt row for SLA: hairline top border, clock glyph, "Within 15 min" in success green, tabular nums.
- **Guest bubble:** midnight (light) / spring-on-ink border (dark), right-aligned, radius 20/20/6/20. No avatar.
- **Quick-reply dock:** fixed composer zone above bottom nav, hairline top border, canvas background. Chips = rounded-full pills, 48px min height, icon + label, surface bg + hairline border; primary utilities (Home/Back/Help) as quieter ghost pills in a separate row. Chargeable items show a 💰 badge. Max-height 40dvh with internal scroll.
- **Bottom nav:** 3 tabs (Home / History / Profile), 64px + safe-area, solid bg, hairline top border. Active = primary color icon+label with a 4px spring dot under. CSS transitions only.
- **Cards (Room, Profile, History):** surface bg, hairline border, 1.25rem radius, small shadow. Room number displayed big in Fraunces + tabular nums.
- **Inputs:** 56px height on mobile, 0.875rem radius, surface bg, hairline border, midnight focus ring 2px.
- **Buttons:** primary = midnight pill (spring in dark), 52px, full width on mobile. Ghost = borderless muted.
- **Toasts:** top-right, surface bg, hairline border, ink text, small icon; CSS slide-in.

## Layout

- Single centered column `max-w-md` at every viewport (phone canvas on desktop too). Bottom nav on all sizes.
- Chat: header (fixed) / messages (scroll, `overscroll-contain`) / dock (fixed) / nav (fixed). Safe-area insets top+bottom.
- Spacing rhythm: 4px base; message gap 10px, group gap 20px, section gap 24–32px.

## Performance budget (₹8k Android)

- No `backdrop-filter` on the scroll path, no blur *filters*. The ambient background is fixed (never repaints on scroll), softness is gradient-stop based, and only `transform`/`opacity` animate — so depth is free.
- Fonts: 2 subset woff2 files (~80KB total, cached by SW). Logo is live text, not the 620KB rastered SVG. Favicon/app icon = `zen-mark.svg` (<1KB).
- Animations: transform/opacity only; chat list is plain DOM (no per-bubble JS animation objects). No framer-motion.
- Instant boot splash (inline in `index.html`) covers the bundle-load gap so the first paint is the brand, not white.
- Route-split History/Profile pages.
