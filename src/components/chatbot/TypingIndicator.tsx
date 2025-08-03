import type { FC } from "react";

const TypingIndicator: FC = () => (
  <div className="flex gap-1 py-2 pl-10">
    {Array.from({ length: 3 }).map((_, i) => (
      <span
        key={i}
        className="h-3 w-3 animate-pulse rounded-full bg-gray-400"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

export default TypingIndicator;
