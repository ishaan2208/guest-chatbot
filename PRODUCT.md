# Product

## Register

product

## Users

In-house hotel guests at Zenvana boutique hotels (Dehradun), ages roughly 8 to 80, using their own phones — very often budget Android devices (₹8–15k) on hotel Wi-Fi. They open the app in their room, mid-stay, to get something done in under 15 seconds: towels, water, housekeeping, a maintenance fix, food. Many are first-time users who arrived via a QR code on the desk; there is no onboarding budget. The interface must feel like texting the front desk, not operating software.

## Product Purpose

A menu-driven concierge chat (no LLM, no free text). Every tap on a service chip opens a real ticket at the property via `POST /chatbot/reply`. Success = a guest gets from unlock-phone to confirmed request in a few taps, trusts that the hotel actually received it, and comes back next time they need something. The chat transcript doubles as a receipt trail.

## Brand Personality

Calm concierge. Three words: composed, warm, precise. It borrows the parent Zenvana brand (quiet boutique luxury: midnight blue, warm praxeti white, one spring-green accent, serif brand voice) and the Feasta food app's editorial discipline (one accent color, hairline borders, tabular numerals, bottom-anchored mobile patterns). Nothing blinks, floats, or celebrates; confidence is shown by restraint and instant response.

## Anti-references

- The generic "AI chatbot" look: violet-fuchsia gradient bubbles, glassmorphism stacks, animated blob backgrounds, sparkle icons, confetti. (This is what the previous UI was; it is the category reflex.)
- Toy-like hotel apps: emoji as icons, bouncing mascots, per-letter text animation.
- Enterprise dashboard chrome: sidebars, dense toolbars, settings sprawl.
- Anything that requires reading instructions or discovering hidden gestures as the only path.

## Design Principles

1. **The menu is the interface.** Chips are the keyboard. At every moment the screen answers "what can I tap next" without scrolling hunting or hidden gestures (gestures may accelerate, never gate).
2. **Concierge calm.** One accent used sparingly; generous space; motion only confirms state (message arrives, chip presses, tab changes) in 150–250ms.
3. **Fast on the cheapest phone.** Static backgrounds, compositor-only animation (transform/opacity), no backdrop-filter over scrolling content, no full-screen blur layers, assets measured in single-digit KB. First load must be light; repeat loads instant (PWA).
4. **Every age group.** Body text ≥ 15px, tap targets ≥ 48px, labels next to icons, AA contrast minimum (midnight on praxeti is 15:1), works one-handed with the thumb in the bottom half of the screen.
5. **Requests feel received.** Every ticket gets a visible receipt: confirmation bubble + ETA line. Trust is the product.

## Accessibility & Inclusion

WCAG 2.1 AA. Text contrast ≥ 4.5:1 (muted text included), `prefers-reduced-motion` honored everywhere (crossfade fallbacks), `focus-visible` rings on all interactive elements, touch targets ≥ 48×48px, `aria-live` for incoming bot messages, safe-area insets for standalone PWA. No information carried by color alone (chargeable = 💰 badge + text).
