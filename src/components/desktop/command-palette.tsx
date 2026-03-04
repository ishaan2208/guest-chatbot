import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  Clock,
  User,
  Phone,
  Bell,
  Waves,
  Droplets,
  Sparkles,
  Wrench,
  UtensilsCrossed,
  ArrowRight,
  Command
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIState } from '../../stores/ui';
import { useConversation } from '../../stores/conversation';
import { useGuestProfile } from '../../stores/guestProfile';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords: string[];
  shortcut?: string;
}

interface CommandPaletteProps {
  className?: string;
}

export function CommandPalette({ className }: CommandPaletteProps) {
  const { commandPaletteOpen, closeCommandPalette } = useUIState();
  const { goHome, sendBotMessage, addMessage } = useConversation();
  useGuestProfile();
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Define all available commands
  const allCommands: CommandItem[] = [
    // Navigation
    {
      id: 'home',
      label: 'Go Home',
      description: 'Return to the main screen',
      icon: <Home className="w-4 h-4" />,
      action: () => {
        goHome();
        closeCommandPalette();
      },
      category: 'Navigation',
      keywords: ['home', 'main', 'start'],
      shortcut: 'H'
    },

    // Quick Services
    {
      id: 'towels',
      label: 'Request Towels',
      description: 'Get fresh towels delivered to your room',
      icon: <Waves className="w-4 h-4" />,
      action: () => {
        addMessage({ sender: 'guest', text: 'I need fresh towels' });
        sendBotMessage('I\'ll arrange fresh towels for your room right away!');
        closeCommandPalette();
      },
      category: 'Services',
      keywords: ['towels', 'fresh', 'clean', 'bathroom'],
      shortcut: 'T'
    },
    {
      id: 'water',
      label: 'Request Water',
      description: 'Get water bottles delivered',
      icon: <Droplets className="w-4 h-4" />,
      action: () => {
        addMessage({ sender: 'guest', text: 'I need water bottles' });
        sendBotMessage('I\'ll send water bottles to your room immediately!');
        closeCommandPalette();
      },
      category: 'Services',
      keywords: ['water', 'bottles', 'drink', 'hydration'],
      shortcut: 'W'
    },
    {
      id: 'cleaning',
      label: 'Room Cleaning',
      description: 'Schedule room cleaning service',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => {
        addMessage({ sender: 'guest', text: 'I need room cleaning service' });
        sendBotMessage('I\'ll schedule cleaning for your room. What time works best for you?');
        closeCommandPalette();
      },
      category: 'Services',
      keywords: ['cleaning', 'housekeeping', 'tidy', 'clean'],
      shortcut: 'C'
    },
    {
      id: 'maintenance',
      label: 'Report Issue',
      description: 'Report a maintenance problem',
      icon: <Wrench className="w-4 h-4" />,
      action: () => {
        addMessage({ sender: 'guest', text: 'I need to report a maintenance issue' });
        sendBotMessage('I\'m here to help with any maintenance issues. What seems to be the problem?');
        closeCommandPalette();
      },
      category: 'Services',
      keywords: ['maintenance', 'repair', 'broken', 'issue', 'problem', 'fix'],
      shortcut: 'M'
    },
    {
      id: 'food',
      label: 'Food Service',
      description: 'Order room service or clear dishes',
      icon: <UtensilsCrossed className="w-4 h-4" />,
      action: () => {
        addMessage({ sender: 'guest', text: 'I need help with food service' });
        sendBotMessage('I can help you with room service orders or clearing dishes. What do you need?');
        closeCommandPalette();
      },
      category: 'Services',
      keywords: ['food', 'room service', 'meal', 'dishes', 'clear', 'dining'],
      shortcut: 'F'
    },

    // Contact & Support
    {
      id: 'call',
      label: 'Call Front Desk',
      description: 'Connect directly with hotel staff',
      icon: <Phone className="w-4 h-4" />,
      action: () => {
        // Simulate phone call
        closeCommandPalette();
      },
      category: 'Contact',
      keywords: ['call', 'phone', 'front desk', 'reception', 'help'],
    },

    // Account & Settings
    {
      id: 'profile',
      label: 'View Profile',
      description: 'Manage your guest profile and preferences',
      icon: <User className="w-4 h-4" />,
      action: () => {
        closeCommandPalette();
      },
      category: 'Account',
      keywords: ['profile', 'account', 'preferences', 'settings'],
    },
    {
      id: 'history',
      label: 'Service History',
      description: 'View your previous service requests',
      icon: <Clock className="w-4 h-4" />,
      action: () => {
        closeCommandPalette();
      },
      category: 'Account',
      keywords: ['history', 'previous', 'past', 'requests'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'View your notifications and updates',
      icon: <Bell className="w-4 h-4" />,
      action: () => {
        closeCommandPalette();
      },
      category: 'Account',
      keywords: ['notifications', 'alerts', 'updates', 'messages'],
    },
  ];

  // Filter commands based on search
  const filteredCommands = React.useMemo(() => {
    if (!search.trim()) return allCommands;

    const searchTerm = search.toLowerCase();
    return allCommands.filter(cmd =>
      cmd.label.toLowerCase().includes(searchTerm) ||
      cmd.description?.toLowerCase().includes(searchTerm) ||
      cmd.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
      cmd.category.toLowerCase().includes(searchTerm)
    );
  }, [search, allCommands]);

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!commandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCommandPalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredCommands, selectedIndex, closeCommandPalette]);

  // Focus input when opened
  React.useEffect(() => {
    if (commandPaletteOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsSmallScreen(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Never render command palette on phones/small screens.
  if (isSmallScreen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const paletteVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeCommandPalette}
          />

          {/* Command Palette */}
          <motion.div
            variants={paletteVariants as any}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
              "w-full max-w-2xl max-h-[80vh]",
              "bg-background/95 backdrop-blur-md",
              "border border-border rounded-xl shadow-2xl",
              "mx-4",
              className
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-3",
                    "bg-transparent border-0 outline-none",
                    "text-foreground placeholder:text-muted-foreground",
                    "text-lg"
                  )}
                />
              </div>

              {/* Keyboard hint */}
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">↑</kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">↓</kbd>
                  <span>navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
                  <span>select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                  <span>close</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {Object.keys(groupedCommands).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No commands found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, commands]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                      {category}
                    </div>

                    {commands.map((command) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <motion.button
                          key={command.id}
                          onClick={command.action}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3",
                            "text-left transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            isSelected && "bg-accent text-accent-foreground"
                          )}
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex-shrink-0">
                            {command.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{command.label}</span>
                              {command.shortcut && (
                                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                                  {command.shortcut}
                                </kbd>
                              )}
                            </div>
                            {command.description && (
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {command.description}
                              </p>
                            )}
                          </div>

                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Global keyboard shortcut handler
export function useCommandPalette() {
  const { openCommandPalette, closeCommandPalette } = useUIState();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openCommandPalette]);

  return { openCommandPalette, closeCommandPalette };
}

// Command palette trigger button
export function CommandPaletteTrigger() {
  const { openCommandPalette } = useUIState();

  return (
    <button
      onClick={openCommandPalette}
      className={cn(
        "flex items-center gap-2 px-3 py-2",
        "bg-muted/50 hover:bg-muted text-muted-foreground",
        "rounded-lg border border-border",
        "transition-colors duration-200",
        "text-sm"
      )}
    >
      <Search className="w-4 h-4" />
      <span>Search commands...</span>
      <div className="ml-auto flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">
          <Command className="w-3 h-3" />
        </kbd>
        <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">K</kbd>
      </div>
    </button>
  );
}