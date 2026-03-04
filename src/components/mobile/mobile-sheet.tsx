import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  snapPoints?: number[]; // Percentage values for snap points
  defaultSnap?: number;
  fullHeight?: boolean;
  showHandle?: boolean;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
}

export function MobileSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  snapPoints = [90], // Default to 90% height
  defaultSnap = snapPoints[0],
  fullHeight = false,
  showHandle = true,
  showCloseButton = true,
  closeOnBackdrop = true,
}: MobileSheetProps) {
  const [currentSnap] = React.useState(defaultSnap);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Handle drag to close
  const handleDrag = (info: PanInfo) => {
    const { offset, velocity } = info;
    const threshold = 150; // Pixels to drag down before closing
    const velocityThreshold = 300;

    if (offset.y > threshold || velocity.y > velocityThreshold) {
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  // Calculate sheet height based on snap point
  const getSheetHeight = () => {
    if (fullHeight) return '100%';
    return `${currentSnap}%`;
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sheetVariants = {
    hidden: {
      y: '100%',
      transition: { type: 'tween' as const, duration: 0.3 },
    },
    visible: {
      y: 0,
      transition: { type: 'spring' as const, stiffness: 400, damping: 40 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={(_, info) => handleDrag(info)}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-background rounded-t-xl shadow-xl",
              "max-h-screen overflow-hidden",
              className
            )}
            style={{ height: getSheetHeight() }}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 pb-4">
                {title && (
                  <h2 className="text-lg font-semibold text-foreground">
                    {title}
                  </h2>
                )}
                
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="touch-sm"
                    onClick={onClose}
                    className="ml-auto"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={cn(
              "flex-1 overflow-auto",
              "px-4 pb-safe-bottom",
              // Add top padding if no header
              !title && !showCloseButton && "pt-4"
            )}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Specialized sheet variants
export function ServiceHistorySheet({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Service History"
      snapPoints={[75, 90]}
      defaultSnap={75}
    >
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Your recent service requests will appear here.
        </p>
        {/* Service history content */}
      </div>
    </MobileSheet>
  );
}

export function ProfileSheet({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Guest Profile"
      snapPoints={[80]}
    >
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Preferences</h3>
          <p className="text-muted-foreground">
            Manage your stay preferences and settings.
          </p>
        </div>
        {/* Profile content */}
      </div>
    </MobileSheet>
  );
}

export function NotificationSheet({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      snapPoints={[60, 90]}
      defaultSnap={60}
    >
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Stay updated with your service requests.
        </p>
        {/* Notifications content */}
      </div>
    </MobileSheet>
  );
}