import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGuestServiceMenu } from "@/constants/guetsService";
import type { GuestServiceItem } from "@/constants/guetsService";

interface ItemMenuProps {
  categoryIndex: number;
  onBack: () => void;
  onItemClick: (item: GuestServiceItem) => void;
}

const ItemMenu: FC<ItemMenuProps> = ({
  categoryIndex,
  onBack,
  onItemClick,
}) => {
  const guestServiceMenu = useGuestServiceMenu();
  const { category, items } = guestServiceMenu[categoryIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold text-gray-700">{category}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item.type}
            variant="outline"
            size="sm"
            onClick={() => onItemClick(item)}
            className="flex-shrink-0 text-white"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ItemMenu;
