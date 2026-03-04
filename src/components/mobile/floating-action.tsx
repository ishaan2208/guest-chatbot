import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Phone, Bell, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface FloatingAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
}

interface FloatingActionButtonProps {
  actions?: FloatingAction[];
  primaryAction?: FloatingAction;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
  size?: 'default' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
}

export function FloatingActionButton({
  actions = [],
  primaryAction,
  position = 'bottom-right',
  className,
  size = 'default',
  variant = 'primary',
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Default primary action if none provided
  const defaultPrimaryAction: FloatingAction = {
    id: 'message',
    label: 'Send Message',
    icon: <MessageSquare className="w-5 h-5" />,
    onClick: () => {
      if (actions.length > 0) {
        setIsExpanded(!isExpanded);
      }
    },
  };

  const mainAction = primaryAction || defaultPrimaryAction;

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-center': 'bottom-20 left-1/2 transform -translate-x-1/2',
  };

  // Size classes
  const sizeClasses = {
    default: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-background text-foreground border border-border shadow-lg hover:shadow-xl',
    primary: 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl',
  };

  const handleMainActionClick = () => {
    if (actions.length > 0) {
      setIsExpanded(!isExpanded);
    } else {
      mainAction.onClick();
    }
  };

  return (
    <div className={cn(
      "fixed z-40",
      positionClasses[position],
      className
    )}>
      {/* Action menu */}
      <AnimatePresence>
        {isExpanded && actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-end gap-3"
              >
                {/* Action label */}
                <motion.div
                  className={cn(
                    "bg-background/90 backdrop-blur-sm",
                    "border border-border rounded-lg",
                    "px-3 py-2 shadow-md",
                    "text-sm font-medium whitespace-nowrap"
                  )}
                >
                  {action.label}
                </motion.div>

                {/* Action button */}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    action.onClick();
                    setIsExpanded(false);
                  }}
                  disabled={action.disabled}
                  className={cn(
                    "w-12 h-12 rounded-full shadow-md",
                    action.color && `bg-${action.color} hover:bg-${action.color}/90`
                  )}
                >
                  {action.icon}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <Button
          onClick={handleMainActionClick}
          className={cn(
            sizeClasses[size],
            variantClasses[variant],
            "rounded-full p-0 flex items-center justify-center",
            "transition-all duration-200",
            "active:scale-95"
          )}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {isExpanded && actions.length > 0 ? (
              <X className="w-5 h-5" />
            ) : (
              mainAction.icon
            )}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}

// Specialized FAB components
export function QuickServiceFAB() {
  const quickActions: FloatingAction[] = [
    {
      id: 'towels',
      label: 'Request Towels',
      icon: <div className="w-5 h-5 bg-blue-500 rounded" />,
      onClick: () => {
        // Handle towels request
      },
    },
    {
      id: 'cleaning',
      label: 'Room Cleaning',
      icon: <div className="w-5 h-5 bg-green-500 rounded" />,
      onClick: () => {
        // Handle cleaning request
      },
    },
    {
      id: 'water',
      label: 'Water Refill',
      icon: <div className="w-5 h-5 bg-cyan-500 rounded" />,
      onClick: () => {
        // Handle water request
      },
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: <Phone className="w-5 h-5 text-red-500" />,
      onClick: () => {
        // Handle emergency call
      },
      color: 'red-500',
    },
  ];

  return (
    <FloatingActionButton
      actions={quickActions}
      primaryAction={{
        id: 'services',
        label: 'Quick Services',
        icon: <Plus className="w-5 h-5" />,
        onClick: () => {},
      }}
    />
  );
}

export function NotificationFAB({ 
  notificationCount = 0,
  onClick 
}: { 
  notificationCount?: number;
  onClick: () => void;
}) {
  return (
    <div className="fixed bottom-20 right-4 z-40">
      <motion.div
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="relative"
      >
        <Button
          onClick={onClick}
          size="icon"
          variant="outline"
          className={cn(
            "w-12 h-12 rounded-full shadow-lg",
            "bg-background/90 backdrop-blur-sm",
            "border border-border"
          )}
        >
          <Bell className="w-5 h-5" />
        </Button>

        {/* Notification badge */}
        {notificationCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-1 -right-1",
              "min-w-[18px] h-[18px] px-1",
              "bg-red-500 text-white text-xs font-medium",
              "rounded-full flex items-center justify-center",
              "border-2 border-background"
            )}
          >
            {notificationCount > 99 ? '99+' : notificationCount}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export function CallHotelFAB({ onCall }: { onCall: () => void }) {
  return (
    <FloatingActionButton
      primaryAction={{
        id: 'call',
        label: 'Call Hotel',
        icon: <Phone className="w-5 h-5" />,
        onClick: onCall,
      }}
      position="bottom-left"
      variant="secondary"
    />
  );
}