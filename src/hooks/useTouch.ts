import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useGesture } from '@use-gesture/react';
import { useUIState } from '../stores/ui';

export interface SwipeDirection {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export interface TouchHandlers {
  onSwipe?: (direction: keyof SwipeDirection, velocity: number) => void;
  onPinch?: (scale: number, velocity: number) => void;
  onTap?: (position: { x: number; y: number }) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
  onDrag?: (offset: { x: number; y: number }) => void;
  onPullToRefresh?: () => void;
}

export interface TouchOptions {
  swipeThreshold?: number;
  longPressThreshold?: number;
  enablePullToRefresh?: boolean;
  pullToRefreshThreshold?: number;
}

/**
 * Advanced touch handling hook with gesture recognition
 */
export function useTouch(
  elementRef: RefObject<HTMLElement | null>,
  handlers: TouchHandlers = {},
  options: TouchOptions = {}
) {
  const { hapticEnabled } = useUIState();
  const {
    swipeThreshold = 50,
    longPressThreshold = 500,
    enablePullToRefresh = false,
    pullToRefreshThreshold = 100,
  } = options;

  const [isGesturing, setIsGesturing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Haptic feedback helper
  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticEnabled || typeof window === 'undefined' || !('vibrate' in navigator)) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };

    navigator.vibrate(patterns[type]);
  };

  // Gesture handlers using @use-gesture/react
  const bind = useGesture(
    {
      onDrag: ({ down, movement: [mx, my], velocity: [vx, vy], cancel }) => {
        setIsGesturing(down);

        if (handlers.onDrag) {
          handlers.onDrag({ x: mx, y: my });
        }

        // Pull to refresh
        if (enablePullToRefresh && my > pullToRefreshThreshold && my > Math.abs(mx)) {
          hapticFeedback('medium');
          handlers.onPullToRefresh?.();
          cancel();
        }

        // Swipe detection on release
        if (!down && (Math.abs(mx) > swipeThreshold || Math.abs(my) > swipeThreshold)) {
          const absX = Math.abs(mx);
          const absY = Math.abs(my);

          let direction: keyof SwipeDirection;
          let velocity: number;

          if (absX > absY) {
            direction = mx > 0 ? 'right' : 'left';
            velocity = Math.abs(vx);
          } else {
            direction = my > 0 ? 'down' : 'up';
            velocity = Math.abs(vy);
          }

          hapticFeedback('light');
          handlers.onSwipe?.(direction, velocity);
        }
      },

      onPinch: ({ movement: [scale], velocity: [velocityScale] }) => {
        setIsGesturing(true);
        handlers.onPinch?.(scale, velocityScale);
      },

      onPointerUp: ({ event }) => {
        const pointerEvent = event as PointerEvent;
        handlers.onTap?.({ x: pointerEvent.clientX, y: pointerEvent.clientY });
      },

      onTouchStart: ({ event }) => {
        // Long press detection
        if (handlers.onLongPress) {
          longPressTimer.current = setTimeout(() => {
            if (event instanceof TouchEvent) {
              const touch = event.touches[0];
              hapticFeedback('heavy');
              handlers.onLongPress?.({ x: touch.clientX, y: touch.clientY });
            }
          }, longPressThreshold);
        }
      },

      onTouchEnd: () => {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        setIsGesturing(false);
      },
    },
    {
      drag: {
        threshold: 10,
        filterTaps: true,
      },
      pinch: {
        threshold: 0.1,
      },
    }
  );

  // Apply gesture handlers to element
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const gestureProps = bind();
    const getEventName = (reactEventName: string) =>
      reactEventName.replace('on', '').toLowerCase();
    const getListenerOptions = (eventName: string): AddEventListenerOptions | boolean => {
      // Use passive listeners for scroll-blocking events to avoid Chrome violations.
      if (eventName === 'wheel' || eventName === 'touchstart' || eventName === 'touchmove') {
        return { passive: true };
      }
      return false;
    };

    // Apply event listeners
    Object.entries(gestureProps).forEach(([reactEventName, handler]) => {
      if (handler) {
        const eventName = getEventName(reactEventName);
        const options = getListenerOptions(eventName);
        element.addEventListener(eventName, handler as unknown as EventListener, options);
      }
    });

    return () => {
      Object.entries(gestureProps).forEach(([reactEventName, handler]) => {
        if (handler) {
          const eventName = getEventName(reactEventName);
          const options = getListenerOptions(eventName);
          element.removeEventListener(eventName, handler as unknown as EventListener, options);
        }
      });
    };
  }, [bind, elementRef]);

  return {
    isGesturing,
    hapticFeedback,
    bind,
  };
}

/**
 * Hook for swipe-to-navigate between pages
 */
export function useSwipeNavigation(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useTouch(containerRef, {
    onSwipe: (direction, velocity) => {
      if (velocity > 0.5) { // Only respond to fast swipes
        if (direction === 'left' && onSwipeLeft) {
          onSwipeLeft();
        } else if (direction === 'right' && onSwipeRight) {
          onSwipeRight();
        }
      }
    },
  }, { swipeThreshold: threshold });

  return containerRef;
}

/**
 * Hook for pull-to-refresh functionality
 */
export function usePullToRefresh(onRefresh: () => void | Promise<void>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useTouch(containerRef, {
    onPullToRefresh: async () => {
      if (isRefreshing) return;

      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    },
  }, {
    enablePullToRefresh: true,
    pullToRefreshThreshold: 100
  });

  return {
    containerRef,
    isRefreshing,
  };
}

/**
 * Hook for detecting touch device capabilities
 */
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [maxTouchPoints, setMaxTouchPoints] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const touchPoints = navigator.maxTouchPoints || 0;

    setIsTouchDevice(hasTouch);
    setMaxTouchPoints(touchPoints);
  }, []);

  return {
    isTouchDevice,
    maxTouchPoints,
    supportsMultiTouch: maxTouchPoints > 1,
  };
}

/**
 * Hook for managing focus states on touch devices
 */
export function useTouchFocus() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const { isTouchDevice } = useTouchDevice();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocusVisible(true);
      }
    };

    const handlePointerDown = () => {
      if (isTouchDevice) {
        setIsFocusVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isTouchDevice]);

  return {
    isFocusVisible,
    focusProps: {
      'data-focus-visible': isFocusVisible,
    },
  };
}

/**
 * Hook for managing keyboard on mobile devices
 */
export function useVirtualKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('visualViewport' in window)) return;

    const viewport = window.visualViewport!;

    const handleViewportChange = () => {
      const windowHeight = window.innerHeight;
      const viewportHeight = viewport.height;
      const heightDifference = windowHeight - viewportHeight;

      setKeyboardHeight(heightDifference);
      setIsKeyboardOpen(heightDifference > 150); // Threshold for keyboard detection
    };

    viewport.addEventListener('resize', handleViewportChange);

    return () => {
      viewport.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardOpen,
  };
}