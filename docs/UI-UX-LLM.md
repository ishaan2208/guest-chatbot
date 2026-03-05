# Guest Chatbot — UI/UX Documentation for LLMs

This document describes how the **Zenvana Guest Chatbot** app handles user experience and brand so that an LLM can reason about behavior, copy, and design consistently. The product aims for a **quiet luxury concierge** feel: calm, discreet, premium, and trustworthy.

---

## Design Principles

- **Calm:** Fewer bright gradients; more whitespace; larger, calmer typography; subtle dividers; softer animation. The UI should lower cognitive load.
- **Discreet:** No visible system labels for recommendation mode (“Magical mode” is never shown). Smart recommendations surface naturally without explanation.
- **Premium:** Restrained shadows and borders; warm white / soft stone / muted slate base; purple only as a brand accent (CTA, avatar, selected state).
- **Trustworthy:** Operational clarity — every service action can show expectations (ETA, chargeable, availability, handler). History is a status-based timeline, not a log dump.

---

## Anti-patterns (avoid)

- **Slang or chat tropes:** Avoid “Got it.”, “On it!”, “We’ll process it shortly.” Prefer “Certainly.”, “Right away.”, “We’ve shared this with our team.”
- **Support-center tone:** No “Online” dot, no green “available” badge in the main header; no “Magical mode” or “contextual recommendations active” labels.
- **Long replies:** Keep bot messages concise; use the pattern: Acknowledge → Confirm → Expectation → One next step.
- **Playful over-animation:** No competing orbital/sweep/bokeh/grain at once. Motion is for orientation and reassurance only.
- **Crowded pills on Home:** Home uses 2–4 service tiles, not many pill buttons. Pills are for navigation only: “Browse Services”, “Home”, “Go Back”, “Speak with the front desk”.

---

## Microcopy Guidelines

- **Confirmations:** Acknowledge → Confirm action → Set expectation → Offer one relevant next step. Example: “Certainly. Fresh towels have been requested for Room 101. They should arrive shortly. Would you also like water bottles?”
- **Fallback confirmation:** “Certainly. We’ve shared this with our team and will follow up shortly. Is there anything else?”
- **Chargeable disclosure:** “Added to room bill” or “Chargeable — added to room bill.”
- **Apologies:** Brief, warm: “We apologise for the delay. Our team is on it.”
- **Session expiry:** “Your session has expired. Please sign in again.” Then redirect to login.
- **Navigation:** “Browse Services” or “How may we assist?” (not “Explore Services”); “Speak with the front desk” (not “Didn’t find what I need”).

---

## Premium State Rules

- **Waiting:** Show typing indicator only; no extra decorative motion. No “Magical mode” or recommendation labels.
- **Delayed service:** Use a reassuring one-line message; avoid panic or over-explanation.
- **Offline:** Show “Connection Lost” until back online; non-dismissible but calm. No juggling or spectacle.
- **Late-night:** Optional quieter or shorter copy where applicable.
- **Repeat guest:** Recommendations (time-of-day, favorites) surface in featured tiles without any visible “recommendation mode” label (invisible intelligence).

---

## 1. Brand & Visual Identity

### 1.1 Brand Name and Voice
- **Product name:** Zenvana (hotel/guest services platform).
- **Chatbot name:** **Zenvana Concierge** — always referred to as the in-room concierge.
- **Tone:** Helpful, warm, concise, poised. Uses time-based greetings (“Good morning/afternoon/evening”), first names when available, and refined confirmations (“Certainly.”, “Right away.”).
- **Fallback:** When guest name is unknown, use “Guest” (capitalized). Property-specific details (e.g. reception number, Wi‑Fi password) are injected from booking/property data.

### 1.2 Logo and Header
- **Logo:** `/Zenvana logo.svg` — used on Login and in marketing-style areas.
- **Header (chat):** “Zenvana Concierge” in title case (not uppercase), with a subtitle e.g. “At your service” (muted, smaller). No BadgeCheck or “Online” row. Refresh is a small icon button (e.g. near logout), not a full header click. Logout clears session keys and redirects to `/login`.

### 1.3 Color System (quiet luxury)
- **Base:** Warm white, soft stone, or muted slate for background/foreground/muted. Primary is an accent only, not the dominant surface.
- **Primary palette:** Purple/violet/fuchsia (indigo → purple → fuchsia). Used for primary CTA, bot avatar accent, and selected state — one small branded detail per screen.
- **CSS variables:** `--primary`, `--primary-foreground`, `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--destructive`, `--border`, etc. Light and dark themes in `:root` and `.dark`.
- **Guest messages:** Gradient bubble (violet/fuchsia family) as accent; can be slightly muted. Bot messages: white (light) / slate-800 (dark), subtle shadow.
- **Notifications:** success (emerald), error (destructive), warning (amber), info (primary).

### 1.4 Background and Atmosphere
- **BackgroundFX:** One subtle base wash (e.g. soft stone/slate with a hint of primary at very low opacity). One slow ambient drift only. No competing orbital blobs, sweep, bokeh twinkles, micro-grid, or grain (or barely visible if kept). Dark mode: same, lower opacity.
- **Motion:** Used for orientation, reassurance, and polish only — e.g. page fade, message entrance, typing indicator, one ambient drift. All decorative motion disabled when `prefers-reduced-motion: reduce` is set.

### 1.5 Surfaces and Cards
- **Chat card:** Rounded-2xl, restrained border and shadow (e.g. `border-border`, `shadow-sm`), subtle backdrop blur. Max width ~md, centered.
- **Profile / History cards:** Same treatment — rounded-2xl, border, subtle blur, consistent with chat.

---

## 2. Application Structure and Routes

### 2.1 Route Map
- **`/login`** — Sign-in (phone number or QR via `?roomId=…`).
- **`/room`** — Room selection when booking has multiple rooms; single-room bookings may auto-redirect to `/room/chatbot`.
- **`/room/chatbot`** — Main chatbot (index tab).
- **`/room/chatbot/history`** — Service request history.
- **`/room/chatbot/profile`** — Guest profile (name, room, phone, check-in/out).

### 2.2 Auth and Session
- **AuthLayout** wraps all routes. If no valid session (bookingId + phoneNumber), redirects to `/login`. If session exists and user is on `/login`, redirects to `/room` or `/room/chatbot` when room is already chosen.
- **Session:** Stored via `guestStorage.setSession()` — bookingId, phoneNumber; 24h expiry. Optional: roomNumber, guestName, checkInDate, checkOutDate. Room id for “current room” is in `localStorage` as `roomNumberId`.
- **Logout:** Clears `bookingId`, `phoneNumber`, `roomNumberId` from localStorage and navigates to `/login`.

### 2.3 Layout Shell (ChatbotLayout)
- **Always present on `/room/chatbot/*`:** Header, BackgroundFX, main content area (max-w-5xl, with top padding for fixed header).
- **Desktop:** SidebarNav, SidebarToggle.
- **Mobile:** BottomNav only (Home, History, Profile).
- **Responsive breakpoint:** “Mobile” is determined by `useUIState().isMobile` (e.g. width < 768px). Screen size is tracked (sm/md/lg/xl/2xl).

---

## 3. User Flows

### 3.1 Login
- **Phone:** Form with phone number (10–12 digits, digits only). Submit calls `/chatbot/login`; response includes booking id and guest data. Session is stored, then redirect to `/room` (or `/room/chatbot` if room already chosen). Success uses a short celebration; errors show inline and optional shake.
- **QR (roomId in URL):** On load, if `?roomId=…` is present, call `/chatbot/guest-by-room?roomId=…`. Store session and room id, show “Welcome to Zenvana!” and redirect to `/room`. On 404, show message suggesting phone sign-in and optional notification.
- **Returning session:** If session exists on load, “Welcome back!” and redirect.

### 3.2 Room Selection (Room.page)
- Shown when path is `/room` and booking has multiple rooms (or no room selected yet).
- **Content:** “Welcome to Your Stay!”, contextual greeting, property card (name, address, nights, guests), list of rooms (room number, plan, occupancy, amenities, check-in/out). Single room can auto-redirect to chatbot after a short delay.
- **Selection:** User taps a room → store `roomNumberId`, update profile with room number, trigger celebration (“Welcome to Room X!”), then navigate to `/room/chatbot`.
- **Loading:** “Preparing your stay…” with a simple animated icon.
- **Error:** On fetch failure (e.g. 404), show error message, clear session and redirect to login after delay; show “Session Expired” notification.

### 3.3 Chatbot Conversation (GuestChatBot)
- **Entry:** First message is a contextual greeting (time + name or “Guest”) and “I’m your Zenvana concierge. Quick actions below, or browse categories 👇”. Home shows 2–4 **service tiles** (icon, title, description, optional metadata) plus nav pills.
- **Navigation model:**  
  - **Home** → 2–4 featured service tiles + nav pills (“Browse Services” or “How may we assist?”).  
  - **Browse Services** → list of categories (Housekeeping & Essentials, Maintenance, Food & Room Service, Reception & Communication) + “Home” + “Speak with the front desk”.  
  - **Category** → list of items in that category (as pills) + “Go Back” + “Speak with the front desk”.
- **Actions:** User taps a tile or service → guest message is added, typing indicator shown, then backend/action runs. Bot reply follows Acknowledge → Confirm → Expectation → Next step; fallback: “Certainly. We’ve shared this with our team and will follow up shortly. Is there anything else?” Service is recorded in guest profile history (with optional status, dueAt).
- **Chargeable items:** Label may include “💰” or “(₹)”. Same flow; reply confirms paid item to room.
- **Pull-to-refresh:** Refreshes content and sends a short confirmation (e.g. “Refreshed. Here are your latest options.”).
- **Back:** Swipe right (when in a category) or back behavior returns to categories or home; bot sends a short confirmation.
- **Recommendations:** Time- and history-based recommendations surface in the featured tiles on Home. No visible label or “Magical mode” footer (invisible intelligence).

### 3.4 Profile and History
- **Profile:** Displays guest name, room number, phone, check-in, check-out from guest profile store. Same card style as elsewhere.
- **Service History:** Status-based **timeline**: each request is a card with title, “Requested at &lt;time&gt;”, status (“In progress” / “Completed” / “Housekeeping is on the way”), and optional “Expected by &lt;time&gt;” when dueAt is present. Empty state: “No service requests yet this stay.” or “Your recent service requests will appear here.” Same card styling.

---

## 4. Chat UI Components

### 4.1 Messages (Bubble)
- **Bot:** Left-aligned; bot Avatar + bubble (white/slate-800); left tail.
- **Guest:** Right-aligned; bubble (gradient violet/fuchsia) + guest Avatar; right tail.
- **Typing:** Bot avatar + compact bubble with TypingIndicator (three dots, animated). No tail.
- **Animation:** Messages enter with slight fade + y. Typing indicator uses staggered dot animation (respects reduced motion).

### 4.2 Avatars (ChatAvatar)
- **Bot:** Gradient `from-indigo-600 via-purple-600 to-fuchsia-600`, Bot icon. Aria: “Zenvana Concierge”.
- **Guest:** Muted/slate chip; initials from name or User icon. Optional green “online” dot.
- **Sizes:** sm/md/lg map to 8/9/10 (h/w). Optional ring.

### 4.3 Service Tiles and Quick Replies
- **Home:** 2–4 **service tiles** (icon, title, one-line description, optional metadata e.g. “Usually 10–15 min”, “Added to room bill”). On tap, same action as item select. Below tiles, **nav pills only:** “Browse Services” or “How may we assist?”, “Home”, “Go Back”, “Speak with the front desk”.
- **Categories / category view:** Horizontal wrap of pill buttons: rounded-xl, border, white/slate background, icon + label. Chargeable items can show “💰”. Hover scale, active scale down; touch-manipulation for mobile. Pills used for category items and navigation only.

### 4.4 Typing Indicator
- Three dots in a small bubble, staggered opacity/scale animation. Accessible: role="status", aria-live="polite", aria-label="Typing". Reduced motion: animation disabled, fixed opacity.

### 4.5 Scroll Behavior
- Chat area scrolls to bottom when messages or quick replies change (smooth scroll to an anchor at the end).

---

## 5. Global UI State (useUIState)

- **Theme:** light | dark | system. Persisted in localStorage. System follows `prefers-color-scheme`. Actual class applied on `document.documentElement`: `dark` for dark.
- **Reduced motion:** From state or `prefers-reduced-motion: reduce`; used to simplify or disable animations.
- **Notifications:** List of { id, title, message, type, duration?, actions? }. Shown in NotificationToaster (top-right). Auto-dismiss after duration (0 = persistent). Offline shows “Connection Lost” until back online.
- **Loading:** isLoading + loadingMessage for global loading feedback.
- **Bottom sheet / Sidebar:** Open state and active sheet or panel.
- **Device:** isMobile, screenSize, isOnline.
- **Accessibility:** fontSize (sm/base/lg/xl applied to root), highContrast (class on root), keyboardNavigation, screenReader.
- **Interactions:** lastInteraction, hapticEnabled, soundEnabled.

---

## 6. Conversation State (useConversation)

- **Messages:** Array of { id, sender, text, timestamp, type?, metadata? }. Types include text, quick_reply, service_card, celebration, system.
- **Quick replies:** Current set of { label, action, icon?, variant? }.
- **Typing:** isTyping for bot.
- **Navigation stack:** conversationHistory for back; currentCategory, currentService.
- **Service requests:** activeRequests (id, type, status, timestamp, estimatedCompletion?).
- **Persistence:** Conversations saved to storage by conversationId; loaded on load. Service history is also reflected in guest profile.

---

## 7. Guest Profile (useGuestProfile)

- **Identity:** guestName, phoneNumber, roomNumber, checkInDate, checkOutDate.
- **Preferences:** theme, language, notifications, soundEffects, hapticFeedback, reducedMotion; housekeepingTime, roomTemperature, dietaryRestrictions, specialRequests.
- **Behavioral:** favoriteServices, requestHistory (type, timestamp, completed, optional status, dueAt). Used for recommendations (invisible intelligence) and for the service timeline.
- **Session:** lastActive, visitCount, sessionStart.
- **Helpers:**  
  - `getContextualGreeting()` — time-based + “Welcome back” for returning guests, or “Welcome to Zenvana guest services.”  
  - `getRecommendedServices()` — combines favorites, time-of-day, and frequency; used for featured quick actions.  
  - `getOptimalServiceTime(serviceType)` — suggested time for a service type.  
- **Persistence:** Stored via guestStorage (encrypted profile, 30-day expiry). Synced across tabs when applicable.

---

## 8. Notifications and Feedback

### 8.1 NotificationToaster
- Fixed top-right, safe-area aware. Each item: icon by type (success/error/warning/info), title, message, dismiss button. Enter/exit with slide + opacity. Optional actions per notification.

### 8.2 Celebrations
- **Types:** confetti, success, milestone, achievement, surprise.
- **Usage:** Login success, QR success, room selection (“Welcome to Room X!”). When reduced motion is on, a simple success message replaces confetti.
- **Duration:** Configurable (e.g. 3000ms); onComplete clears the celebration.

### 8.3 Offline
- When the app goes offline, a non-dismissible “Connection Lost” warning is added. It is removed when back online.

---

## 9. Services and Categories (Guest Service Menu)

- **Categories:** Housekeeping & Essentials, Maintenance, Food & Room Service, Reception & Communication.
- **Item kinds:** FUNCTION (backend ticket), CHARGEABLE (paid), REDIRECT (e.g. open URL).
- **Personalization:** First name and room number (and optionally Wi‑Fi password, reception number) are injected into labels and replies from booking/property data.
- **Featured:** Items can be `featured`; contextual recommendations (time, favorites, history) also add to the featured set for Home tiles — no visible label.
- **API:** Service requests go through `createTicketFromItem` (POST `/chatbot/reply`) with type, isPaid, details, idempotency key, and context (propertyId, bookingId, roomId, guestId, channel: CHATBOT).

---

## 10. Accessibility and Responsiveness

- **Reduced motion:** All decorative and micro-interaction animations (BackgroundFX, typing dots, page transitions, stagger) are disabled or simplified when `shouldReduceMotion()` is true.
- **Theme:** Respects system preference when theme is “system”; user can override to light or dark.
- **Font size:** Root font size can be set to sm/base/lg/xl for readability.
- **High contrast:** Optional class on root for high-contrast mode.
- **Touch:** Large touch targets on mobile (e.g. quick reply buttons, bottom nav); `touch-manipulation` where appropriate.
- **Safe areas:** pt-safe-top, pb-safe-bottom for notches and home indicators.
- **Screen reader:** Chat avatar and typing indicator have appropriate aria labels and live regions.

---

## 11. Storage (guestStorage)

- **Prefix:** `zenvana_guest_`.
- **Session:** 24h expiry.
- **Profile:** Encrypted, sync across tabs, 30-day expiry.
- **Conversation:** Per conversationId, 7-day expiry.
- **Service requests cache:** 3h expiry.
- **Clear:** clearAll() used on logout or session expiry.

---

## 12. Summary for LLM Behavior

When generating or interpreting content for this app:

1. **Name the concierge** “Zenvana Concierge” and the product “Zenvana”.
2. **Use time-based greetings** and the guest’s first name when available; otherwise “Guest”.
3. **Keep replies short and poised** — use the pattern: Acknowledge → Confirm → Expectation → One next step (e.g. “Certainly. Towels requested for room 101. They should arrive shortly. Would you also like water?”).
4. **Respect theme and reduced motion** when suggesting or describing UI behavior.
5. **Navigation:** Home (service tiles + nav pills) ↔ Categories ↔ Category items; always offer “Home”, “Go Back” (when applicable), and “Speak with the front desk”.
6. **Chargeable items** are clearly marked (e.g. “(₹)” or “💰”) and confirmed as added to room bill.
7. **Errors and session expiry** lead to clear messages and redirect to login; offline shows a persistent “Connection Lost” warning (calm, no panic).
8. **Invisible intelligence:** Recommendations (time of day, favorites, past requests) surface in the home service tiles without any visible “recommendation mode” or “Magical mode” label.

This document reflects the implementation in the guest-chatbot codebase and is intended for LLM consumption to keep UX and brand consistent across features and copy.
