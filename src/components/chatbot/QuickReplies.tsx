import type { FC } from "react";
import { Button } from "@/components/ui/button";

export interface QuickReply {
  label: string | "Go back";
  onClick: () => void;
}

interface QuickRepliesProps {
  replies: QuickReply[];
}

const QuickReplies: FC<QuickRepliesProps> = ({ replies }) => (
  <div className="flex flex-col flex-wrap gap-2 pt-1">
    {replies.map(({ label, onClick }, idx) => (
      <Button
        className=" rounded-md"
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
