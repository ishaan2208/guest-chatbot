import { useState } from "react";
import { Wifi, Copy, Check } from "lucide-react";

export interface WifiCredential {
  network: string;
  password: string;
}

/** A little EMV-style chip, drawn in gold to sell the keycard feel. */
function Chip() {
  return (
    <span
      aria-hidden="true"
      className="relative block h-6 w-8 shrink-0 overflow-hidden rounded-[5px]"
      style={{
        background: "linear-gradient(135deg, #e8cd86 0%, #c8a85a 45%, #9c7f3e 100%)",
        boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.25)",
      }}
    >
      <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-black/25" />
      <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-black/25" />
      <span className="absolute left-1/2 top-1/2 h-3 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-black/25" />
    </span>
  );
}

/**
 * Premium hotel-keycard rendering of the guest Wi-Fi credentials, with
 * tap-to-copy (haptic + "Copied" flip) and a slow sheen sweep. Card face is
 * an intentional dark surface — one of the few places gradient depth earns
 * its place, echoing the gold-on-midnight Zenvana logo.
 */
export default function WifiCard({ network, password }: WifiCredential) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(password);
    } catch {
      // Older webviews: fall back to a hidden selection copy.
      const el = document.createElement("textarea");
      el.value = password;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch {
        /* give up silently */
      }
      document.body.removeChild(el);
    }
    if (typeof navigator !== "undefined") navigator.vibrate?.(12);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-[1.15rem] p-4 text-white shadow-(--shadow-card)"
      style={{
        background:
          "radial-gradient(130% 130% at 12% 8%, #223252 0%, #0f1a30 58%, #0b1424 100%)",
        boxShadow:
          "inset 0 0 0 1px rgb(200 168 90 / 0.28), 0 14px 32px -18px rgb(11 20 36 / 0.9)",
      }}
    >
      {/* sheen sweep */}
      <span
        aria-hidden="true"
        className="keycard-sheen pointer-events-none absolute -inset-y-8 left-0 w-1/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(255 255 255 / 0.14), transparent)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <Chip />
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
          <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
          Guest Wi-Fi
        </span>
      </div>

      <div className="relative mt-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">Network</p>
        <p className="mt-0.5 truncate text-[15px] font-medium text-white/90">{network}</p>
      </div>

      <div className="relative mt-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">Password</p>
        <p className="mt-0.5 break-all font-mono text-[19px] font-semibold leading-snug tracking-[0.06em] text-white">
          {password}
        </p>
      </div>

      <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span
          className="font-display text-[11px] font-semibold tracking-[0.2em] text-gold"
          style={{ textIndent: "0.2em" }}
        >
          ZENVANA
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Password copied" : "Copy Wi-Fi password"}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 text-[13px] font-semibold text-[#0f1a30] transition-[transform,opacity] duration-150 ease-out touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-safe:active:scale-[0.95]"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy password
            </>
          )}
        </button>
      </div>
    </div>
  );
}
