import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { useGuestServiceMenu } from "@/constants/guestService";

interface CategoryMenuProps {
  onSelect: (categoryIndex: number) => void;
}

const CategoryMenu: FC<CategoryMenuProps> = ({ onSelect }) => {
  const guestServiceMenu = useGuestServiceMenu();

  return (
    <div className="space-y-3">
      {guestServiceMenu.map(({ category }, idx) => (
        <Button
          key={category}
          variant="secondary"
          size="sm"
          className="w-fit justify-start text-white"
          onClick={() => onSelect(idx)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryMenu;
