import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useUIState } from '../../stores/ui';

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// Mobile slide transitions
export const mobileSlideVariants: Variants = {
  initial: (direction: 'left' | 'right' = 'left') => ({
    x: direction === 'left' ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: 'left' | 'right' = 'left') => ({
    x: direction === 'left' ? '-100%' : '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  }),
};

// Fade transitions
export const fadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Scale transitions
export const scaleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.15,
    },
  },
};

// Bottom sheet transitions
export const bottomSheetVariants: Variants = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// Page transition wrapper component
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'slide' | 'fade' | 'scale';
  direction?: 'left' | 'right';
}

export function PageTransition({ 
  children, 
  className,
  variant = 'default',
  direction = 'left' 
}: PageTransitionProps) {
  const { shouldReduceMotion } = useUIState();

  const getVariants = () => {
    if (shouldReduceMotion()) return fadeVariants;
    
    switch (variant) {
      case 'slide':
        return mobileSlideVariants;
      case 'fade':
        return fadeVariants;
      case 'scale':
        return scaleVariants;
      default:
        return pageVariants;
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={direction}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Route transition wrapper
interface RouteTransitionProps {
  children: React.ReactNode;
  routeKey: string;
  className?: string;
}

export function RouteTransition({ 
  children, 
  routeKey, 
  className 
}: RouteTransitionProps) {
  const { isMobile, shouldReduceMotion } = useUIState();

  const variants = shouldReduceMotion() 
    ? fadeVariants 
    : isMobile 
      ? mobileSlideVariants 
      : pageVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered children animation
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Staggered list component
interface StaggeredListProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaggeredList({ 
  children, 
  className,
  delay = 0.1 
}: StaggeredListProps) {
  const { shouldReduceMotion } = useUIState();

  if (shouldReduceMotion()) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={staggerItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Loading transitions
export const loadingVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

// Loading overlay component
interface LoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  className?: string;
}

export function LoadingTransition({
  isLoading,
  children,
  loadingComponent,
  className,
}: LoadingTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={className}
        >
          {loadingComponent || <div>Loading...</div>}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}