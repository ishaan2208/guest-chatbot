import type { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type QuickReply = {
  label: string; // make flexible
  onClick: () => void;
  icon?: ReactNode;
};

interface QuickRepliesProps {
  replies: QuickReply[];
}

const QuickReplies: FC<QuickRepliesProps> = ({ replies }) => (
  <div className="flex flex-col flex-wrap gap-2 pt-1 mb-10 items-center">
    {replies.map(({ label, onClick, icon }, idx) => (
      <Button
        className="rounded-full border border-white/55 bg-white/50 px-4 py-2 text-sm
             hover:bg-white/10 active:scale-[0.98] transition 
             shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] w-fit "
        variant={"outline"}
        key={idx}
        size="sm"
        onClick={onClick}
      >
        {icon && <span className="text-current">{icon}</span>}
        {label}
      </Button>
    ))}
  </div>
);

export default QuickReplies;
