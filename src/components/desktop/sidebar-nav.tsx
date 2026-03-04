import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  MessageSquare,
  Clock,
  User,
  Settings,
  Phone,
  Bell,
  X,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useConversation } from '../../stores/conversation';
import { useGuestProfile } from '../../stores/guestProfile';
import { useUIState } from '../../stores/ui';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
  disabled?: boolean;
  children?: NavItem[];
}

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
  const { sidebarOpen, setSidebarOpen, notifications } = useUIState();
  const { 
    goHome, 
    getActiveServiceCount,
    currentCategory,
    currentService,
    canGoBack,
    popFromHistory
  } = useConversation();
  
  const { isReturningGuest, requestHistory, guestName } = useGuestProfile();

  const activeRequests = getActiveServiceCount();
  const notificationCount = notifications.length;

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      onClick: () => {
        goHome();
      }
    },
    {
      id: 'services',
      label: 'Guest Services',
      icon: <MessageSquare className="w-5 h-5" />,
      onClick: () => {
        // Navigate to services
      },
      badge: activeRequests > 0 ? activeRequests : undefined,
    },
    {
      id: 'history',
      label: 'Service History',
      icon: <Clock className="w-5 h-5" />,
      onClick: () => {
        // Open service history
      },
      badge: isReturningGuest && requestHistory.length > 0 ? requestHistory.length : undefined,
    },
    {
      id: 'profile',
      label: 'Profile & Settings',
      icon: <User className="w-5 h-5" />,
      onClick: () => {
        // Open profile
      }
    },
    {
      id: 'contact',
      label: 'Contact Hotel',
      icon: <Phone className="w-5 h-5" />,
      onClick: () => {
        // Initiate call or contact
      }
    }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
    closed: {
      x: -280,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50",
          "w-[280px] bg-background/95 backdrop-blur-md",
          "border-r border-border shadow-xl",
          "lg:relative lg:translate-x-0",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Z</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Zenvana</h2>
              <p className="text-xs text-muted-foreground">Guest Services</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Guest info */}
        {guestName && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  {guestName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">Welcome back, {guestName}</p>
                <p className="text-xs text-muted-foreground">
                  {isReturningGuest ? 'Returning Guest' : 'First Visit'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                onClick={() => {
                  item.onClick();
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              />
            ))}
          </div>
        </nav>

        {/* Quick actions */}
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                // Open notifications
              }}
            >
              <Bell className="w-4 h-4" />
              Notifications
              {notificationCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                // Open settings
              }}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Breadcrumb navigation */}
        {(currentCategory || currentService) && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button
                onClick={goHome}
                className="hover:text-foreground transition-colors"
              >
                Home
              </button>
              
              {currentCategory && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span>{currentCategory}</span>
                </>
              )}
              
              {currentService && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span>{currentService}</span>
                </>
              )}
              
              {canGoBack() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => popFromHistory()}
                  className="ml-auto"
                >
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Back
                </Button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  onClick: () => void;
}

function SidebarNavItem({ item, onClick }: SidebarNavItemProps) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={item.disabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
        "text-left transition-colors duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      <div className="flex-shrink-0 relative">
        {item.icon}
        
        {/* Badge */}
        {item.badge && item.badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center"
          >
            {item.badge > 99 ? '99+' : item.badge}
          </motion.div>
        )}
      </div>
      
      <span className="flex-1 font-medium">{item.label}</span>
    </motion.button>
  );
}

// Sidebar toggle button for desktop
export function SidebarToggle() {
  const { sidebarOpen, toggleSidebar } = useUIState();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 lg:hidden"
    >
      <motion.div
        animate={{ rotate: sidebarOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Menu className="w-5 h-5" />
      </motion.div>
    </Button>
  );
}