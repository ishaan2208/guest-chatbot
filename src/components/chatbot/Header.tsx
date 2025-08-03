import type { FC } from "react";
import { BadgeCheck } from "lucide-react";

const Header: FC = () => (
  <header className="flex items-center gap-2 border-b pb-2 mb-10">
    <BadgeCheck className="h-4 w-4 text-green-500" />
    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
      Zenvana
    </h2>
  </header>
);

export default Header;
