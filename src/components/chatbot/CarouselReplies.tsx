import type { FC } from "react";
import { Button } from "@/components/ui/button";
import type { QuickReply } from "./QuickReplies";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface CarouselProps {
  replies: QuickReply[];
}

const CarouselReplies: FC<CarouselProps> = ({ replies }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-2">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-1 shadow"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-8 pb-2 scrollbar-none"
      >
        {replies.map(({ label, onClick }, i) => (
          <Button
            key={i}
            variant="outline"
            className="min-w-[120px] flex-shrink-0 rounded-xl border-gray-300 py-6 text-center text-xs font-medium shadow-sm hover:bg-gray-50"
            onClick={onClick}
          >
            {label}
          </Button>
        ))}
      </div>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-1 shadow"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CarouselReplies;
