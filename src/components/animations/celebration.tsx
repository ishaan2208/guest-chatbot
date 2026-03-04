import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { CheckCircle, Sparkles, Heart, Star, Trophy, Gift } from 'lucide-react';
import { useUIState } from '../../stores/ui';

// Celebration types
export type CelebrationType = 'confetti' | 'success' | 'milestone' | 'achievement' | 'surprise';

interface CelebrationProps {
  type: CelebrationType;
  isActive: boolean;
  onComplete?: () => void;
  message?: string;
  duration?: number;
  className?: string;
}

export function Celebration({
  type,
  isActive,
  onComplete,
  message,
  duration = 3000,
  className,
}: CelebrationProps) {
  const { shouldReduceMotion } = useUIState();
  const [windowDimensions, setWindowDimensions] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 300,
    height: typeof window !== 'undefined' ? window.innerHeight : 400,
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  React.useEffect(() => {
    if (isActive && duration > 0) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, duration, onComplete]);

  if (shouldReduceMotion() && isActive) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{message || 'Success!'}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Confetti */}
          {type === 'confetti' && (
            <Confetti
              width={windowDimensions.width}
              height={windowDimensions.height}
              recycle={false}
              numberOfPieces={150}
              gravity={0.3}
              style={{ position: 'fixed', top: 0, left: 0, zIndex: 50 }}
            />
          )}

          {/* Success celebration */}
          {type === 'success' && (
            <SuccessCelebration message={message} className={className} />
          )}

          {/* Milestone celebration */}
          {type === 'milestone' && (
            <MilestoneCelebration message={message} className={className} />
          )}

          {/* Achievement celebration */}
          {type === 'achievement' && (
            <AchievementCelebration message={message} className={className} />
          )}

          {/* Surprise celebration */}
          {type === 'surprise' && (
            <SurpriseCelebration message={message} className={className} />
          )}
        </>
      )}
    </AnimatePresence>
  );
}

// Success celebration component
function SuccessCelebration({ 
  message, 
  className 
}: { 
  message?: string; 
  className?: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${className}`}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        className="bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <CheckCircle className="w-8 h-8" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">Success!</h3>
            <p className="text-sm opacity-90">{message || 'Your request has been completed!'}</p>
          </div>
        </div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 bg-green-400 rounded-full"
        />
      ))}
    </motion.div>
  );
}

// Milestone celebration component
function MilestoneCelebration({ 
  message, 
  className 
}: { 
  message?: string; 
  className?: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Trophy className="w-8 h-8" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">Milestone Reached!</h3>
            <p className="text-sm opacity-90">{message || 'You\'re doing great!'}</p>
          </div>
        </div>
      </motion.div>

      {/* Sparkle effects */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360],
            x: Math.cos(i * 30 * Math.PI / 180) * 150,
            y: Math.sin(i * 30 * Math.PI / 180) * 150,
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.1,
            ease: "easeOut",
          }}
          className="absolute"
        >
          <Star className="w-4 h-4 text-yellow-400" />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Achievement celebration component
function AchievementCelebration({ 
  message, 
  className 
}: { 
  message?: string; 
  className?: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${className}`}
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.4)",
            "0 0 0 20px rgba(59, 130, 246, 0)",
            "0 0 0 0 rgba(59, 130, 246, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="bg-blue-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Gift className="w-8 h-8" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
            <p className="text-sm opacity-90">{message || 'Well done!'}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Surprise celebration component
function SurpriseCelebration({ 
  message, 
  className 
}: { 
  message?: string; 
  className?: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${className}`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 10,
          }
        }}
        className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">Surprise!</h3>
            <p className="text-sm opacity-90">{message || 'Something special happened!'}</p>
          </div>
        </div>
      </motion.div>

      {/* Hearts floating effect */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            y: 100,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [100, -100],
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            ease: "easeOut",
          }}
          className="absolute"
        >
          <Heart className="w-6 h-6 text-pink-400 fill-current" />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Quick celebration hook
export function useCelebration() {
  const [activeCelebrations, setActiveCelebrations] = React.useState<
    Array<{ id: string; type: CelebrationType; message?: string }>
  >([]);

  const celebrate = (type: CelebrationType, message?: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setActiveCelebrations(prev => [
      ...prev,
      { id, type, message }
    ]);

    setTimeout(() => {
      setActiveCelebrations(prev => prev.filter(c => c.id !== id));
    }, duration);
  };

  const celebrations = activeCelebrations.map(celebration => (
    <Celebration
      key={celebration.id}
      type={celebration.type}
      isActive={true}
      message={celebration.message}
      onComplete={() => {
        setActiveCelebrations(prev => 
          prev.filter(c => c.id !== celebration.id)
        );
      }}
    />
  ));

  return { celebrate, celebrations };
}