import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, User, Home } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGuestProfile } from '../../stores/guestProfile';
import { useUIState } from '../../stores/ui';

const CHATBOT_BASE = '/room/chatbot';

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReturningGuest, requestHistory } = useGuestProfile();
  const { notifications } = useUIState();

  const notificationCount = notifications.length;

  const pathname = location.pathname;
  const activeTab =
    pathname === CHATBOT_BASE || pathname === `${CHATBOT_BASE}/`
      ? 'home'
      : pathname === `${CHATBOT_BASE}/history`
        ? 'history'
        : pathname === `${CHATBOT_BASE}/profile`
          ? 'profile'
          : 'home';

  const navItems: NavItem[] = [
    {
      id: 'home',
      path: CHATBOT_BASE,
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'history',
      path: `${CHATBOT_BASE}/history`,
      label: 'History',
      icon: <Clock className="w-5 h-5" />,
      badge: isReturningGuest && requestHistory.length > 0 ? requestHistory.length : undefined,
    },
    {
      id: 'profile',
      path: `${CHATBOT_BASE}/profile`,
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        // Base styles
        "fixed bottom-0 left-0 right-0 z-50",
        // Background with blur effect
        "bg-background/80 backdrop-blur-lg",
        // Border and shadow
        "border-t border-border shadow-lg",
        // Safe area padding for mobile devices
        "pb-safe-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            onNavigate={() => navigate(item.path)}
          />
        ))}
      </div>
      
      {/* Notification indicator */}
      {notificationCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 right-4"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </motion.div>
      )}
    </motion.nav>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
}

function NavButton({ item, isActive, onNavigate }: NavButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onNavigate}
      disabled={item.disabled}
      className={cn(
        // Base button styles
        "relative flex flex-col items-center justify-center",
        "min-w-[60px] h-12 px-2 py-1",
        // Touch target sizing
        "touch-manipulation",
        // Transitions
        "transition-colors duration-200",
        // States
        isActive ? "text-primary" : "text-muted-foreground",
        item.disabled && "opacity-50 cursor-not-allowed",
        !item.disabled && "hover:text-foreground active:text-primary"
      )}
    >
      {/* Icon container with active indicator */}
      <div className="relative">
        <motion.div
          animate={{
            scale: isActive ? 1.1 : 1,
            color: isActive ? 'var(--primary)' : 'var(--muted-foreground)'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {item.icon}
        </motion.div>
        
        {/* Badge */}
        {item.badge && item.badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-2 -right-2",
              "min-w-[18px] h-[18px] px-1",
              "bg-red-500 text-white text-xs font-medium",
              "rounded-full flex items-center justify-center"
            )}
          >
            {item.badge > 99 ? '99+' : item.badge}
          </motion.div>
        )}

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="bottomNavIndicator"
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
      
      {/* Label */}
      <span className={cn(
        "text-xs font-medium mt-1 leading-none",
        "transition-colors duration-200"
      )}>
        {item.label}
      </span>
    </motion.button>
  );
}