import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useUIState } from '../../stores/ui';

// Button interaction variants
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 15,
    },
  },
};

// Touch-optimized button variants
export const touchButtonVariants: Variants = {
  idle: {
    scale: 1,
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 20,
    },
  },
};

// Floating variants
export const floatingVariants: Variants = {
  idle: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2,
    },
  },
  hover: {
    y: -10,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

// Pulse animation
export const pulseVariants: Variants = {
  idle: {
    scale: 1,
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};

// Glow effect
export const glowVariants: Variants = {
  idle: {
    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)",
  },
  glow: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0.4)",
      "0 0 0 10px rgba(59, 130, 246, 0)",
      "0 0 0 0 rgba(59, 130, 246, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

// Interactive button component
interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'touch' | 'floating' | 'pulse' | 'glow';
  disabled?: boolean;
  className?: string;
}

export function InteractiveButton({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  className,
}: InteractiveButtonProps) {
  const { shouldReduceMotion, isTouchDevice } = useUIState();

  if (shouldReduceMotion()) {
    return (
      <button onClick={onClick} disabled={disabled} className={className}>
        {children}
      </button>
    );
  }

  const getVariants = () => {
    if (isTouchDevice()) return touchButtonVariants;
    
    switch (variant) {
      case 'touch':
        return touchButtonVariants;
      case 'floating':
        return floatingVariants;
      case 'pulse':
        return pulseVariants;
      case 'glow':
        return glowVariants;
      default:
        return buttonVariants;
    }
  };

  return (
    <motion.button
      variants={getVariants()}
      initial="idle"
      whileHover={!isTouchDevice() ? "hover" : undefined}
      whileTap="tap"
      animate={variant === 'pulse' ? 'pulse' : variant === 'glow' ? 'glow' : 'idle'}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// Card hover effects
export const cardVariants: Variants = {
  idle: {
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  },
  hover: {
    y: -5,
    rotateX: 5,
    rotateY: 5,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

// Interactive card component
interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  perspective?: number;
}

export function InteractiveCard({
  children,
  onClick,
  className,
  perspective = 1000,
}: InteractiveCardProps) {
  const { shouldReduceMotion, isTouchDevice } = useUIState();

  if (shouldReduceMotion() || isTouchDevice()) {
    return (
      <div onClick={onClick} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      style={{ perspective }}
      variants={cardVariants}
      initial="idle"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic button effect
export function MagneticButton({
  children,
  strength = 0.3,
  className,
  onClick,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}) {
  const { shouldReduceMotion } = useUIState();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  if (shouldReduceMotion()) {
    return (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        x.set((e.clientX - centerX) * strength);
        y.set((e.clientY - centerY) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// Text animation variants
export const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

// Animated text component
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ 
  text, 
  className,
  delay = 0 
}: AnimatedTextProps) {
  const { shouldReduceMotion } = useUIState();

  if (shouldReduceMotion()) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={textVariants}
          custom={index}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Loading dots animation
export function LoadingDots({ className }: { className?: string }) {
  const { shouldReduceMotion } = useUIState();

  if (shouldReduceMotion()) {
    return <span className={className}>...</span>;
  }

  return (
    <motion.div className={className} style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          style={{
            width: 4,
            height: 4,
            backgroundColor: 'currentColor',
            borderRadius: '50%',
          }}
        />
      ))}
    </motion.div>
  );
}

// Ripple effect
export function RippleEffect({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; key: number }>>([]);
  const { shouldReduceMotion } = useUIState();

  const handleClick = (e: React.MouseEvent) => {
    if (!shouldReduceMotion()) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { x, y, key: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.key !== newRipple.key));
      }, 600);
    }
    
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      style={{ position: 'relative' }}
    >
      {children}
      
      {!shouldReduceMotion() && ripples.map(ripple => (
        <motion.span
          key={ripple.key}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{
            x: ripple.x,
            y: ripple.y,
            width: 0,
            height: 0,
            opacity: 1,
          }}
          animate={{
            width: 200,
            height: 200,
            opacity: 0,
            x: ripple.x - 100,
            y: ripple.y - 100,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.button>
  );
}