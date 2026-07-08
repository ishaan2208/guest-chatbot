import { Phone, Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

export interface ContactInfo {
  /** Card title, e.g. "Front Desk" */
  title: string;
  /** Dialable number, e.g. "100" */
  number: string;
  /** Small note under the number, e.g. "Available 24 hours" */
  note?: string;
  /** "urgent" warms the accent for emergency contacts */
  tone?: "default" | "urgent";
}

/**
 * A tap-to-call contact card for reception / emergency replies. Presents the
 * number as the hero figure with a one-tap `tel:` button, sealed with the
 * gold ZENVANA wordmark — a directory card, not a wall of text.
 */
export default function ContactCard({
  title,
  number,
  note,
  tone = "default",
}: ContactInfo) {
  const urgent = tone === "urgent";
  const Icon = urgent ? Siren : Phone;

  return (
    <div className="relative w-full overflow-hidden rounded-[1.15rem] border border-border/70 bg-card p-3.5 shadow-(--shadow-bubble)">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            urgent ? "bg-destructive/12 text-destructive" : "bg-secondary text-foreground"
          )}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-foreground">
            {title}
          </p>
          {note && (
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{note}</p>
          )}
        </div>
      </div>

      <p className="mt-3 font-display text-[26px] leading-none tracking-[0.02em] text-foreground tabular-nums">
        {number}
      </p>

      <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <Logo size={20} />
        <a
          href={`tel:${number}`}
          aria-label={`Call ${title} at ${number}`}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-[transform,opacity] duration-150 ease-out touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.95]",
            urgent
              ? "bg-destructive text-white"
              : "bg-primary text-primary-foreground"
          )}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call now
        </a>
      </div>
    </div>
  );
}
