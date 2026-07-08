import type { FC, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIState } from "@/stores/ui";

export type QuickReply = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  /** One-line hint under the label, e.g. "Delivered shortly" */
  blurb?: string;
  /** "primary" = a service/category choice (default); "utility" = navigation */
  variant?: "primary" | "utility";
  /** Renders the gold ₹ chargeable marker on the card */
  chargeable?: boolean;
  /** Complimentary item — shows an explicit green "Free" badge */
  free?: boolean;
};

interface QuickRepliesProps {
  replies: QuickReply[];
}

/**
 * Hand-composed row rhythm (3-2-2-1 style) rather than a rigid 2-col grid, so
 * the menu reads as arranged-by-hand. Rows of 1 render as a wide hero tile,
 * rows of 2 as horizontal cards, rows of 3 as compact vertical cells. Keeps the
 * common menu sizes (4 categories, 6–8 home actions) looking intentional.
 */
function rowsFor(n: number): number[] {
  const map: Record<number, number[]> = {
    1: [1],
    2: [2],
    3: [3],
    4: [2, 2],
    5: [3, 2],
    6: [3, 2, 1],
    7: [3, 2, 2],
    8: [3, 2, 2, 1],
    9: [3, 2, 2, 2],
    10: [3, 2, 3, 2],
    11: [3, 2, 3, 2, 1],
    12: [3, 2, 3, 2, 2],
  };
  if (map[n]) return map[n];
  // Larger menus: cycle a 3-2-2 rhythm, clamping the final row.
  const rows: number[] = [];
  const cycle = [3, 2, 2];
  let i = 0;
  let r = 0;
  while (i < n) {
    const size = Math.min(cycle[r % cycle.length], n - i);
    rows.push(size);
    i += size;
    r += 1;
  }
  return rows;
}

const TileIcon: FC<{
  icon?: ReactNode;
  chargeable?: boolean;
  size: "sm" | "md";
}> = ({ icon, chargeable, size }) => (
  <span
    className={cn(
      "relative inline-flex shrink-0 items-center justify-center rounded-[0.55rem] border border-border/70 bg-secondary text-foreground",
      size === "md"
        ? "h-9 w-9 [&_svg]:h-[18px] [&_svg]:w-[18px]"
        : "h-8 w-8 [&_svg]:h-[17px] [&_svg]:w-[17px]"
    )}
  >
    {icon}
    {chargeable && (
      <span
        title="Chargeable"
        className="absolute -right-1 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full border border-card bg-gold px-0.5 text-[9px] font-bold leading-none text-[#0f1a30]"
      >
        ₹
      </span>
    )}
  </span>
);

const FreeBadge: FC = () => (
  <span className="shrink-0 rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-success">
    Free
  </span>
);

const cardBase =
  "group animate-chip-in border border-border/70 bg-card text-left shadow-(--shadow-bubble) transition-[border-color,transform,background-color,box-shadow] duration-200 ease-out touch-manipulation hover:border-foreground/20 hover:shadow-(--shadow-card) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.97]";

const QuickReplies: FC<QuickRepliesProps> = ({ replies }) => {
  const hapticEnabled = useUIState((s) => s.hapticEnabled);

  const tap = (fn: () => void) => () => {
    if (hapticEnabled && typeof navigator !== "undefined") navigator.vibrate?.(8);
    fn();
  };

  const primary = replies.filter((r) => (r.variant ?? "primary") === "primary");
  const utility = replies.filter((r) => r.variant === "utility");

  // Slice the primary tiles into hand-composed rows.
  const rows: QuickReply[][] = [];
  {
    const sizes = rowsFor(primary.length);
    let cursor = 0;
    for (const size of sizes) {
      rows.push(primary.slice(cursor, cursor + size));
      cursor += size;
    }
  }

  let tileIndex = -1;
  const delay = () => {
    tileIndex += 1;
    return `${Math.min(tileIndex * 26, 234)}ms`;
  };

  return (
    <div className="w-full pt-0.5">
      {primary.length > 0 && (
        <div className="space-y-2">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-2">
              {row.map(({ label, onClick, icon, chargeable, free, blurb }, i) => {
                const size = row.length;
                // Row of 3 → compact vertical cell.
                if (size === 3) {
                  return (
                    <button
                      type="button"
                      key={`${label}-${i}`}
                      onClick={tap(onClick)}
                      style={{ animationDelay: delay() }}
                      className={cn(
                        cardBase,
                        "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-[0.85rem] px-1.5 py-2.5 text-center motion-safe:hover:-translate-y-px"
                      )}
                    >
                      <TileIcon icon={icon} chargeable={chargeable} size="sm" />
                      <span className="line-clamp-2 text-[11.5px] font-semibold leading-[1.15] tracking-tight text-foreground">
                        {label}
                      </span>
                      {free && <FreeBadge />}
                    </button>
                  );
                }
                // Row of 1 → wide hero tile (with blurb); Row of 2 → half card.
                const wide = size === 1;
                return (
                  <button
                    type="button"
                    key={`${label}-${i}`}
                    onClick={tap(onClick)}
                    style={{ animationDelay: delay() }}
                    className={cn(
                      cardBase,
                      "flex flex-1 items-center rounded-[0.85rem] motion-safe:hover:-translate-y-px",
                      wide ? "gap-3 px-3 py-2.5" : "gap-2 px-2 py-1.5"
                    )}
                  >
                    <TileIcon
                      icon={icon}
                      chargeable={chargeable}
                      size={wide ? "md" : "sm"}
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="line-clamp-2 text-[12.5px] font-semibold leading-[1.15] tracking-tight text-foreground">
                        {label}
                      </span>
                      {wide && blurb && (
                        <span className="mt-0.5 line-clamp-1 text-[11.5px] font-medium leading-tight text-muted-foreground">
                          {blurb}
                        </span>
                      )}
                    </span>
                    {free && <FreeBadge />}
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {utility.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            primary.length > 0 && "mt-2.5 border-t border-border/60 pt-2.5"
          )}
        >
          {utility.map(({ label, onClick, icon }, idx) => (
            <button
              type="button"
              key={`${label}-${idx}`}
              onClick={tap(onClick)}
              style={{ animationDelay: `${Math.min((primary.length + idx) * 26, 234)}ms` }}
              className="group animate-chip-in inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1 text-[12px] font-medium text-muted-foreground shadow-(--shadow-bubble) transition-[color,border-color,transform] duration-150 ease-out touch-manipulation hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.97]"
            >
              {icon && <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span>}
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickReplies;
