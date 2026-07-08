import type { FC } from "react";

/** Three quiet dots; the bubble around it is provided by Bubble. */
const TypingIndicator: FC = () => (
  <span
    role="status"
    aria-live="polite"
    aria-label="Concierge is typing"
    className="inline-flex items-center gap-1 px-0.5 py-1 text-muted-foreground"
  >
    <span className="typing-dot h-1.5 w-1.5" />
    <span className="typing-dot h-1.5 w-1.5" />
    <span className="typing-dot h-1.5 w-1.5" />
  </span>
);

export default TypingIndicator;
