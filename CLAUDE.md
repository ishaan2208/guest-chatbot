# guest-chatbot

Guest-facing hotel concierge chatbot (branded "Zenvana"). Its one job: let an in-house guest request services (towels, housekeeping, maintenance, room service, etc.) and reliably open a backend ticket for each request.

## Architecture & intent

React 18 + TypeScript + Vite 7 SPA, styled with Tailwind v4 + shadcn/ui, animated with Framer Motion. It is a frontend for `api.staysystems.in` — it owns no business logic beyond driving the conversation and firing ticket requests.

- **Deliberately menu-driven, no LLM.** All interaction is `QuickReply` chips walking a menu tree (home → category → item); there is no free-text input and bot replies are pre-written strings. The entire service catalog lives in `src/constants/guestService.ts`. Add or change services there, not by adding NLP.
- **Two state layers, kept separate on purpose.** Recoil holds the authenticated `Booking` (`src/store/*.recoil.ts`); Zustand holds guest profile/personalization and UI state (`src/stores/*`). Note the sibling folders `src/store/` (Recoil) vs `src/stores/` (Zustand) — do not merge or conflate them.
- **Ticket creation is the critical path.** Picking an item runs `item.action()` → `createTicketFromItem()` (`src/lib/api.ts`) → `POST /chatbot/reply` with `{ type, isPaid, details, idempotencyKey, context }`. The `idempotencyKey` prevents duplicate tickets — keep it.
- **PWA**: Workbox service worker registered at startup (`src/services/pwa.ts`).
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
