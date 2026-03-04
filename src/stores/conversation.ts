import { create } from 'zustand';
import { guestStorage } from '../services/storage';

export interface Message {
  id: string;
  sender: 'bot' | 'guest';
  text: string;
  timestamp: number;
  type?: 'text' | 'quick_reply' | 'service_card' | 'celebration' | 'system';
  metadata?: {
    serviceType?: string;
    ticketId?: number;
    status?: string;
    options?: any[];
    celebrationType?: 'confetti' | 'success' | 'milestone';
  };
}

export interface QuickReply {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

interface ConversationState {
  // Current conversation
  messages: Message[];
  quickReplies: QuickReply[];
  isTyping: boolean;
  conversationId: string;
  
  // Context and navigation
  currentCategory: string | null;
  currentService: string | null;
  conversationHistory: string[]; // Stack for back navigation
  
  // Service request tracking
  activeRequests: Array<{
    id: string;
    type: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    timestamp: number;
    estimatedCompletion?: number;
  }>;
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setQuickReplies: (replies: QuickReply[]) => void;
  clearQuickReplies: () => void;
  setTyping: (typing: boolean) => void;
  
  // Navigation
  setCurrentCategory: (category: string | null) => void;
  setCurrentService: (service: string | null) => void;
  pushToHistory: (state: string) => void;
  popFromHistory: () => string | undefined;
  goHome: () => void;
  
  // Service requests
  addServiceRequest: (type: string, id: string) => void;
  updateServiceRequest: (id: string, updates: any) => void;
  removeServiceRequest: (id: string) => void;
  
  // Conversation management
  startNewConversation: () => void;
  loadConversation: (id?: string) => void;
  saveConversation: () => void;
  clearConversation: () => void;
  
  // Bot helpers
  sendBotMessage: (text: string, options?: Partial<Message>) => void;
  sendSystemMessage: (text: string) => void;
  sendCelebration: (type: 'confetti' | 'success' | 'milestone', text: string) => void;
  
  // Computed
  getRecentServiceRequests: () => Message[];
  getActiveServiceCount: () => number;
  canGoBack: () => boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useConversation = create<ConversationState>((set, get) => ({
  messages: [],
  quickReplies: [],
  isTyping: false,
  conversationId: generateId(),
  currentCategory: null,
  currentService: null,
  conversationHistory: [],
  activeRequests: [],

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    // Auto-save conversation
    get().saveConversation();
  },

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }));
    get().saveConversation();
  },

  setQuickReplies: (replies) => {
    set({ quickReplies: replies });
  },

  clearQuickReplies: () => {
    set({ quickReplies: [] });
  },

  setTyping: (typing) => {
    set({ isTyping: typing });
  },

  setCurrentCategory: (category) => {
    set({ currentCategory: category });
  },

  setCurrentService: (service) => {
    set({ currentService: service });
  },

  pushToHistory: (state) => {
    set((prev) => ({
      conversationHistory: [...prev.conversationHistory, state],
    }));
  },

  popFromHistory: () => {
    const { conversationHistory } = get();
    if (conversationHistory.length === 0) return undefined;
    
    const lastState = conversationHistory[conversationHistory.length - 1];
    set((state) => ({
      conversationHistory: state.conversationHistory.slice(0, -1),
    }));
    
    return lastState;
  },

  goHome: () => {
    set({
      currentCategory: null,
      currentService: null,
      conversationHistory: [],
    });
    get().clearQuickReplies();
  },

  addServiceRequest: (type, id) => {
    set((state) => ({
      activeRequests: [
        ...state.activeRequests,
        {
          id,
          type,
          status: 'pending',
          timestamp: Date.now(),
        },
      ],
    }));
  },

  updateServiceRequest: (id, updates) => {
    set((state) => ({
      activeRequests: state.activeRequests.map(req =>
        req.id === id ? { ...req, ...updates } : req
      ),
    }));
  },

  removeServiceRequest: (id) => {
    set((state) => ({
      activeRequests: state.activeRequests.filter(req => req.id !== id),
    }));
  },

  startNewConversation: () => {
    const newId = generateId();
    set({
      messages: [],
      quickReplies: [],
      isTyping: false,
      conversationId: newId,
      currentCategory: null,
      currentService: null,
      conversationHistory: [],
      activeRequests: [],
    });
  },

  loadConversation: (id) => {
    const conversationId = id || get().conversationId;
    const messages = guestStorage.getConversation(conversationId) ?? [];
    
    if (messages.length > 0) {
      set({
        messages: messages as Message[],
        conversationId,
      });
    }
  },

  saveConversation: () => {
    const { messages, conversationId } = get();
    if (messages.length > 0) {
      guestStorage.setConversation(conversationId, messages);
    }
  },

  clearConversation: () => {
    set({
      messages: [],
      quickReplies: [],
      isTyping: false,
      currentCategory: null,
      currentService: null,
      conversationHistory: [],
      activeRequests: [],
    });
  },

  sendBotMessage: (text, options = {}) => {
    // Add typing indicator first
    get().setTyping(true);
    
    setTimeout(() => {
      get().addMessage({
        sender: 'bot',
        text,
        ...options,
      });
      get().setTyping(false);
    }, Math.random() * 1000 + 500); // Realistic typing delay
  },

  sendSystemMessage: (text) => {
    get().addMessage({
      sender: 'bot',
      text,
      type: 'system',
    });
  },

  sendCelebration: (type, text) => {
    get().addMessage({
      sender: 'bot',
      text,
      type: 'celebration',
      metadata: {
        celebrationType: type,
      },
    });
  },

  getRecentServiceRequests: () => {
    const { messages } = get();
    return messages
      .filter(msg => msg.metadata?.serviceType)
      .slice(-5); // Last 5 service requests
  },

  getActiveServiceCount: () => {
    const { activeRequests } = get();
    return activeRequests.filter(req => 
      req.status === 'pending' || req.status === 'in_progress'
    ).length;
  },

  canGoBack: () => {
    const { conversationHistory } = get();
    return conversationHistory.length > 0;
  },
}));