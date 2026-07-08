# guest-chatbot

Guest-facing hotel concierge chatbot (branded "Zenvana"). Its one job: let an in-house guest request services (towels, housekeeping, maintenance, room service, etc.) and reliably open a backend ticket for each request.

## Architecture & intent

React 18 + TypeScript + Vite 7 SPA, styled with Tailwind v4 + shadcn/ui. Motion is CSS-only (one-shot keyframes, compositor-friendly) — framer-motion was removed for low-end phone performance; keep the chat path free of per-message JS animation. Aesthetic depth is intentional and cheap: `AmbientBackground` (drifting glows/beams/grain, all transform/opacity, softness from gradient stops not blur filters) runs app-wide; a boot splash inlined in `index.html` paints the brand before the bundle loads (removed by `main.tsx` on mount). Visual system (Zenvana brand: midnight `#001F3F`, praxeti `#F6F7ED`, spring `#DBE64C`, gold `#C8A85A`; Fraunces display + Inter UI, self-hosted) is documented in `DESIGN.md` / `PRODUCT.md` — change tokens in `src/index.css`, not per-component. It is a frontend for `api.staysystems.in` — it owns no business logic beyond driving the conversation and firing ticket requests.

- **Deliberately menu-driven, no LLM.** All interaction is `QuickReply` chips walking a menu tree (home → category → item); there is no free-text input and bot replies are pre-written strings. The entire service catalog lives in `src/constants/guestService.ts`. Add or change services there, not by adding NLP.
- **Rich bot messages** carry an optional structured, JSON-serializable payload on the `Message` (`wifi` / `ticket` / `contact`), rendered by `Bubble`, forwarded by `ChatWindow`, and persisted+revalidated in `loadChatFromStorage`. Three illustrated card types form the system: `WifiCard` (hotel-keycard for credentials), `ServiceTicketCard` (a request "docket" receipt — status, room, ETA, handled-by, gold ZENVANA seal), and `ContactCard` (tap-to-call reception/emergency). All are emitted presentationally from `GuestChatBot.handleItem` by routing on `item.type`/`item.kind` — icons pass as a serializable `iconKey` (looked up in `ITEM_ICON`), never a ReactNode. When adding a card: define its payload type, render it in `Bubble`, forward it in `ChatWindow`, validate it in `loadChatFromStorage`. Keep all of this in the UI layer; never push it into the `guestService` catalog or ticket logic.
- **Two state layers, kept separate on purpose.** Recoil holds the authenticated `Booking` (`src/store/*.recoil.ts`); Zustand holds guest profile/personalization and UI state (`src/stores/*`). Note the sibling folders `src/store/` (Recoil) vs `src/stores/` (Zustand) — do not merge or conflate them.
- **Ticket creation is the critical path.** Picking an item runs `item.action()` → `createTicketFromItem()` (`src/lib/api.ts`) → `POST /chatbot/reply` with `{ type, isPaid, details, idempotencyKey, context }`. The `idempotencyKey` prevents duplicate tickets — keep it.
- **PWA**: custom service worker (`public/sw.js`) registered at startup (`src/services/pwa.ts`) — production builds only; dev skips it so HMR never fights the cache-first shell. Bump `CACHE_NAME` when changing cached shell assets.
- Path alias `@/` → `src/`.

## Boundaries

- **A ticket may only be created for an active in-house guest.** `assertActiveInhouseStay()` (`src/lib/sessionGuard.ts`) hits `GET /chatbot/booking` before every ticket and force-signs-out if the room is no longer INHOUSE. Do not bypass, cache away, or weaken this check.
- **Preserve idempotency** on ticket creation; never drop the `idempotencyKey`.
- **Chargeable items** (`isChargeable: true`) must carry `isPaid: true` in the payload and stay visibly flagged (💰) in the UI. Keep the two in sync.
- API base URL is **hardcoded** in `src/lib/axios.config.ts` (no `VITE_*` env, no `import.meta.env`). To retarget staging/local, edit it there — don't scatter new base URLs.
- localStorage is the session store. Respect existing keys: `bookingId`, `roomNumberId`, `phoneNumber`, `zenvana-theme`, `zenvana_hard_signout_at`, `zenvana_booking_cache:*`, `guest-chatbot-history-<bookingId>` (history capped at 200 messages).

## Verify your work

```bash
pnpm dev        # dev server on :3011
pnpm lint       # eslint .
pnpm build      # tsc -b && vite build → dist/
```

Done means: `pnpm build` passes (typecheck is part of it) and `pnpm lint` is clean. For behavior changes, manually run the flow — login (phone or QR) → pick a category → pick an item → confirm a ticket POSTs with a valid `idempotencyKey` and the in-house guard still fires.

Part of the `staysystems` umbrella (independent git repo; pnpm@10 + Turbo workspace). Standalone frontend — consumes no other workspace packages. Run with pnpm@10 despite `packageManager: pnpm@9` in package.json.
