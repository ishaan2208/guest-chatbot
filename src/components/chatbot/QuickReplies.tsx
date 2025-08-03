import type { FC } from "react";
import { Button } from "@/components/ui/button";

export type QuickReply = {
  label: string; // make flexible
  onClick: () => void;
};

interface QuickRepliesProps {
  replies: QuickReply[];
}

const QuickReplies: FC<QuickRepliesProps> = ({ replies }) => (
  <div className="flex flex-col flex-wrap gap-2 pt-1 mb-12">
    {replies.map(({ label, onClick }, idx) => (
      <Button
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm
             hover:bg-white/10 active:scale-[0.98] transition 
             shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
        variant={"outline"}
        key={idx}
        size="sm"
        onClick={onClick}
      >
        {label}
      </Button>
    ))}
  </div>
);

export default QuickReplies;
