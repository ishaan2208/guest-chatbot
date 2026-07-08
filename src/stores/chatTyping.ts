import { create } from "zustand";

/**
 * Tiny shared flag so the header can show a WhatsApp-style "typing…" status
 * while the concierge composes, driven from the chat's local typing state.
 */
interface ChatTypingState {
  typing: boolean;
  setTyping: (typing: boolean) => void;
}

export const useChatTyping = create<ChatTypingState>((set) => ({
  typing: false,
  setTyping: (typing) => set({ typing }),
}));
