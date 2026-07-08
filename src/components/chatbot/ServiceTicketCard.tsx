import { Clock } from "lucide-react";
import Logo from "@/components/Logo";
import { SERVICE_ART, type ArtKey } from "./serviceArt";

export interface ServiceTicket {
  /** Which bespoke illustration to show (see serviceArt). */
  art: ArtKey;
  /** Docket title, e.g. "Fresh Towels" */
  title: string;
  /** Team on it, e.g. "Housekeeping" */
  handledBy?: string;
  /** Room number */
  room?: string;
  /** Human ETA, e.g. "Within 15 min" */
  eta?: string;
  /** Chargeable request — shows the gold "Added to bill" note */
  chargeable?: boolean;
  /** Complimentary — shows an explicit green "Complimentary" note */
  free?: boolean;
  /** When the request was logged (epoch ms) */
  at: number;
}

/**
 * An illustrated confirmation card. The bespoke scene (a different picture per
 * service) is the hero; a quiet info strip carries room / ETA, the handling
 * team and the real Zenvana lotus seal. The illustration settles in with a
 * subtle scale (a touch of parallax depth) as the card blooms.
 */
export default function ServiceTicketCard({
  art,
  title,
  handledBy,
  room,
  eta,
  chargeable,
  free,
}: ServiceTicket) {
  const Art = SERVICE_ART[art] ?? SERVICE_ART.bell;

  return (
    <div className="w-full overflow-hidden rounded-[1.25rem] border border-border/70 bg-card shadow-(--shadow-card)">
      {/* Illustration hero */}
      <div className="relative aspect-[132/84] w-full overflow-hidden">
        <div className="service-art-in h-full w-full">
          <Art />
        </div>
        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-[#12233b] shadow-sm">
          <span className="ticket-ping h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          Requested
        </span>
      </div>

      {/* Info strip */}
      <div className="px-3.5 pb-3 pt-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-[15px] font-semibold text-foreground">{title}</p>
          {room && (
            <p className="shrink-0 text-[13px] font-medium text-muted-foreground tabular-nums">
              Room {room}
            </p>
          )}
        </div>

        {eta && (
          <p className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-success tabular-nums">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            On its way · {eta}
          </p>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
          <span className="flex items-center gap-2">
            <Logo size={18} />
            <span className="text-[12px] text-muted-foreground">{handledBy ?? "Zenvana"}</span>
          </span>
          {free ? (
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
              Complimentary
            </span>
          ) : chargeable ? (
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-medium text-gold">
              Added to bill
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
