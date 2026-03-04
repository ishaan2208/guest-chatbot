/**
 * Advanced Storage Service
 * Replaces raw localStorage with encrypted, structured storage with sync capabilities
 */

interface StorageOptions {
  encrypt?: boolean;
  syncAcrossTabs?: boolean;
  expiry?: number; // milliseconds
}

interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  expiry?: number;
  encrypted?: boolean;
}

class AdvancedStorage {
  private prefix = 'zenvana_guest_';
  private syncCallbacks: Map<string, Set<(value: any) => void>> = new Map();

  constructor() {
    // Listen for storage changes across tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange.bind(this));
    }
  }

  /**
   * Store data with optional encryption and expiry
   */
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    const fullKey = this.prefix + key;
    const now = Date.now();
    
    const item: StorageItem<T> = {
      data: (options.encrypt ? this.encrypt(value as unknown) : value) as T,
      timestamp: now,
      expiry: options.expiry ? now + options.expiry : undefined,
      encrypted: options.encrypt,
    };

    try {
      localStorage.setItem(fullKey, JSON.stringify(item));
      
      // Trigger sync callbacks if enabled
      if (options.syncAcrossTabs) {
        this.triggerSyncCallbacks(key, value);
      }
    } catch (error) {
      console.error('Storage write error:', error);
    }
  }

  /**
   * Get data with automatic decryption and expiry checking
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    const fullKey = this.prefix + key;
    
    try {
      const stored = localStorage.getItem(fullKey);
      if (!stored) return defaultValue;

      const item: StorageItem<T> = JSON.parse(stored);
      
      // Check expiry
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return defaultValue;
      }

      // Decrypt if needed
      const data = item.encrypted ? this.decrypt(item.data as unknown as string) : item.data;
      return (data !== undefined ? data : defaultValue) as T | undefined;
    } catch (error) {
      console.error('Storage read error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: string): void {
    const fullKey = this.prefix + key;
    localStorage.removeItem(fullKey);
  }

  /**
   * Clear all app storage
   */
  clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Get all keys for this app
   */
  keys(): string[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }

  /**
   * Subscribe to storage changes for a specific key
   */
  subscribe<T>(key: string, callback: (value: T | undefined) => void): () => void {
    if (!this.syncCallbacks.has(key)) {
      this.syncCallbacks.set(key, new Set());
    }
    
    this.syncCallbacks.get(key)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.syncCallbacks.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.syncCallbacks.delete(key);
        }
      }
    };
  }

  /**
   * Simple encryption (Base64 + obfuscation)
   * Note: This is not secure encryption, just obfuscation for sensitive UI data
   */
  private encrypt(data: any): string {
    try {
      const jsonStr = JSON.stringify(data);
      const base64 = btoa(jsonStr);
      // Simple rotation cipher
      return base64.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) + 3)
      ).join('');
    } catch {
      return '';
    }
  }

  /**
   * Decrypt data
   */
  private decrypt(encrypted: string): any {
    try {
      // Reverse rotation cipher
      const base64 = encrypted.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) - 3)
      ).join('');
      const jsonStr = atob(base64);
      return JSON.parse(jsonStr);
    } catch {
      return undefined;
    }
  }

  /**
   * Handle storage changes from other tabs
   */
  private handleStorageChange(event: StorageEvent): void {
    if (!event.key?.startsWith(this.prefix)) return;
    
    const key = event.key.replace(this.prefix, '');
    const value = event.newValue ? this.parseStorageValue(event.newValue) : undefined;
    
    this.triggerSyncCallbacks(key, value);
  }

  /**
   * Trigger callbacks for storage changes
   */
  private triggerSyncCallbacks(key: string, value: any): void {
    const callbacks = this.syncCallbacks.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error('Storage callback error:', error);
        }
      });
    }
  }

  /**
   * Parse storage value from raw localStorage
   */
  private parseStorageValue(rawValue: string): any {
    try {
      const item: StorageItem = JSON.parse(rawValue);
      return item.encrypted ? this.decrypt(item.data) : item.data;
    } catch {
      return undefined;
    }
  }
}

// Create singleton instance
export const storage = new AdvancedStorage();

// Convenience methods for common operations
export const guestStorage = {
  // Guest session data
  setSession(data: any) {
    storage.set('session', data, { expiry: 24 * 60 * 60 * 1000 }); // 24 hours
  },
  
  getSession() {
    return storage.get('session');
  },

  // Guest preferences
  setPreferences(prefs: any) {
    storage.set('preferences', prefs, { encrypt: true, syncAcrossTabs: true });
  },
  
  getPreferences(defaults = {}) {
    return storage.get('preferences', defaults);
  },

  // Conversation history
  setConversation(conversationId: string, messages: any[]) {
    storage.set(`conversation_${conversationId}`, messages, { 
      expiry: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  },
  
  getConversation(conversationId: string): unknown[] {
    return (storage.get(`conversation_${conversationId}`, []) as unknown[]) ?? [];
  },

  // Service requests cache
  setServiceRequests(requests: any[]) {
    storage.set('service_requests', requests, { 
      expiry: 3 * 60 * 60 * 1000 // 3 hours
    });
  },
  
  getServiceRequests() {
    return storage.get('service_requests', []);
  },

  // Guest profile data
  setProfile(profile: any) {
    storage.set('guest_profile', profile, { 
      encrypt: true, 
      syncAcrossTabs: true,
      expiry: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  },
  
  getProfile() {
    return storage.get('guest_profile');
  },

  // Clear all guest data
  clearAll() {
    storage.clear();
  },

  // Subscribe to changes
  subscribe: storage.subscribe.bind(storage),
};