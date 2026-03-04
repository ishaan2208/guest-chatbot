import type { FC, ReactNode } from "react";
import type { GuestServiceItem } from "@/constants/guestService";
import { ITEM_ICON } from "@/constants/icons";

interface ServiceTilesProps {
  items: GuestServiceItem[];
  onSelect: (item: GuestServiceItem) => void;
}

function metadataLine(item: GuestServiceItem): string | null {
  if (item.etaMinutes != null) return `Usually ${item.etaMinutes} min`;
  if (item.chargeableNote) return item.chargeableNote;
  if (item.availableUntil) return `Available until ${item.availableUntil}`;
  if (item.handledBy) return item.handledBy;
  return null;
}

const ServiceTiles: FC<ServiceTilesProps> = ({ items, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pb-3">
      {items.slice(0, 4).map((item, idx) => {
        const icon = ITEM_ICON[item.type] as ReactNode;
        const title = item.tileTitle ?? item.label;
        const meta = metadataLine(item);
        return (
          <button
            type="button"
            key={`${item.type}-${idx}`}
            onClick={() => onSelect(item)}
            className="flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card/80 p-4 text-left shadow-sm transition-colors hover:bg-muted/50 active:scale-[0.99] touch-manipulation"
          >
            <span className="flex items-center gap-2 text-foreground [&_svg]:h-5 [&_svg]:w-5 shrink-0">
              {icon}
              <span className="font-medium text-sm">{title}</span>
            </span>
            {item.description && (
              <span className="text-xs text-muted-foreground leading-snug">
                {item.description}
              </span>
            )}
            {meta && (
              <span className="text-[11px] text-muted-foreground/80">
                {meta}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ServiceTiles;
