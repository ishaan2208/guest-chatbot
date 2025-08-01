import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { guestServiceMenu } from "@/constants/guetsService";

interface CategoryMenuProps {
  onSelect: (categoryIndex: number) => void;
}

const CategoryMenu: FC<CategoryMenuProps> = ({ onSelect }) => (
  <div className="space-y-3">
    {guestServiceMenu.map(({ category }, idx) => (
      <Button
        key={category}
        variant="secondary"
        size="sm"
        className="w-full justify-start text-white"
        onClick={() => onSelect(idx)}
      >
        {category}
      </Button>
    ))}
  </div>
);

export default CategoryMenu;
