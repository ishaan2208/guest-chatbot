import { useState, useEffect } from 'react';
import { useUIState } from '../stores/ui';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface BreakpointConfig {
  sm: number;  // 640px
  md: number;  // 768px 
  lg: number;  // 1024px
  xl: number;  // 1280px
  '2xl': number; // 1536px
}

const breakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive() {
  const { setScreenSize, setIsMobile } = useUIState();
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });

      // Update global screen size
      let currentBreakpoint: Breakpoint = 'sm';
      if (width >= breakpoints['2xl']) currentBreakpoint = '2xl';
      else if (width >= breakpoints.xl) currentBreakpoint = 'xl';
      else if (width >= breakpoints.lg) currentBreakpoint = 'lg';
      else if (width >= breakpoints.md) currentBreakpoint = 'md';
      else currentBreakpoint = 'sm';

      setScreenSize(currentBreakpoint);
      setIsMobile(width < breakpoints.md);
    }

    handleResize(); // Set initial values
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize, setIsMobile]);

  // Helper functions
  const isAbove = (breakpoint: Breakpoint) => windowSize.width >= breakpoints[breakpoint];
  const isBelow = (breakpoint: Breakpoint) => windowSize.width < breakpoints[breakpoint];
  const isBetween = (min: Breakpoint, max: Breakpoint) => 
    windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max];
  
  const isMobile = windowSize.width < breakpoints.md;
  const isTablet = isBetween('md', 'lg');
  const isDesktop = windowSize.width >= breakpoints.lg;
  
  const getCurrentBreakpoint = (): Breakpoint => {
    if (windowSize.width >= breakpoints['2xl']) return '2xl';
    if (windowSize.width >= breakpoints.xl) return 'xl';
    if (windowSize.width >= breakpoints.lg) return 'lg';
    if (windowSize.width >= breakpoints.md) return 'md';
    return 'sm';
  };

  return {
    windowSize,
    breakpoints,
    isAbove,
    isBelow,
    isBetween,
    isMobile,
    isTablet, 
    isDesktop,
    getCurrentBreakpoint,
    
    // Convenience properties
    width: windowSize.width,
    height: windowSize.height,
    breakpoint: getCurrentBreakpoint(),
  };
}

/**
 * Hook for container-based responsive behavior
 * Useful for components that need to adapt based on their container size
 */
export function useContainerQuery(containerRef: React.RefObject<HTMLElement>) {
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  const getContainerBreakpoint = (): Breakpoint => {
    if (containerSize.width >= breakpoints['2xl']) return '2xl';
    if (containerSize.width >= breakpoints.xl) return 'xl';
    if (containerSize.width >= breakpoints.lg) return 'lg';
    if (containerSize.width >= breakpoints.md) return 'md';
    return 'sm';
  };

  return {
    containerSize,
    containerBreakpoint: getContainerBreakpoint(),
    isContainerAbove: (breakpoint: Breakpoint) => containerSize.width >= breakpoints[breakpoint],
    isContainerBelow: (breakpoint: Breakpoint) => containerSize.width < breakpoints[breakpoint],
  };
}

/**
 * Hook to get responsive values based on current breakpoint
 * Usage: const fontSize = useBreakpointValue({ sm: '14px', md: '16px', lg: '18px' })
 */
export function useBreakpointValue<T>(values: Partial<Record<Breakpoint, T>>): T | undefined {
  const { breakpoint } = useResponsive();
  
  // Find the best matching value for current breakpoint
  const breakpointOrder: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  // Look for exact match first
  if (values[breakpoint]) return values[breakpoint];
  
  // Look for largest breakpoint smaller than current
  for (let i = currentIndex - 1; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (values[bp]) return values[bp];
  }
  
  // Look for smallest breakpoint larger than current
  for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp]) return values[bp];
  }
  
  return undefined;
}

/**
 * Hook for CSS media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}