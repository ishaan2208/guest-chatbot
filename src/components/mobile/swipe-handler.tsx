import React from 'react';
import { useSwipeNavigation, usePullToRefresh } from '../../hooks/useTouch';
import { cn } from '../../lib/utils';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

interface SwipeHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onRefresh?: () => void | Promise<void>;
  showBackIndicator?: boolean;
  showForwardIndicator?: boolean;
  enablePullToRefresh?: boolean;
  className?: string;
}

export function SwipeHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onRefresh,
  showBackIndicator = false,
  showForwardIndicator = false,
  enablePullToRefresh = false,
  className,
}: SwipeHandlerProps) {
  const swipeRef = useSwipeNavigation(onSwipeLeft, onSwipeRight);
  const { containerRef: refreshRef, isRefreshing } = usePullToRefresh(
    onRefresh || (() => { })
  );

  // Use pull-to-refresh ref if enabled, otherwise use swipe ref
  const activeRef = enablePullToRefresh ? refreshRef : swipeRef;

  return (
    <div
      ref={activeRef}
      className={cn(
        "relative h-full w-full overflow-hidden",
        className
      )}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && isRefreshing && (
        <div className="animate-fade-in absolute inset-x-0 top-0 z-10 flex justify-center py-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-foreground shadow-(--shadow-bubble)">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Refreshing…</span>
          </div>
        </div>
      )}

      {/* Swipe indicators */}
      {showBackIndicator && onSwipeRight && (
        <SwipeIndicator
          icon={<ArrowLeft className="h-5 w-5" />}
          label="Back"
          side="left"
        />
      )}

      {showForwardIndicator && onSwipeLeft && (
        <SwipeIndicator
          icon={<ArrowRight className="h-5 w-5" />}
          label="Forward"
          side="right"
        />
      )}

      {/* Content */}
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
}

interface SwipeIndicatorProps {
  icon: React.ReactNode;
  label: string;
  side: 'left' | 'right';
}

function SwipeIndicator({ icon, label, side }: SwipeIndicatorProps) {
  return (
    <div
      className={cn(
        "animate-fade-in absolute top-1/2 z-10 -translate-y-1/2 opacity-60",
        "rounded-full border border-border bg-card",
        "flex items-center gap-2 px-3 py-2 shadow-(--shadow-bubble)",
        side === 'left' ? "left-4" : "right-4"
      )}
    >
      {icon}
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// Specialized swipe handlers for common patterns
export function ChatSwipeHandler({
  children,
  onBack,
  canGoBack = false,
  onRefresh,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  canGoBack?: boolean;
  onRefresh?: () => void | Promise<void>;
}) {
  return (
    <SwipeHandler
      onSwipeRight={canGoBack ? onBack : undefined}
      onRefresh={onRefresh}
      showBackIndicator={false}
      enablePullToRefresh={!!onRefresh}
    >
      {children}
    </SwipeHandler>
  );
}

export function ServiceCategorySwipeHandler({
  children,
  onBack,
  onNext,
  canGoBack = false,
  canGoForward = false,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}) {
  return (
    <SwipeHandler
      onSwipeRight={canGoBack ? onBack : undefined}
      onSwipeLeft={canGoForward ? onNext : undefined}
      showBackIndicator={canGoBack}
      showForwardIndicator={canGoForward}
    >
      {children}
    </SwipeHandler>
  );
}

export function PageSwipeHandler({
  children,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: {
  children: React.ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}) {
  return (
    <SwipeHandler
      onSwipeRight={hasPrevious ? onPrevious : undefined}
      onSwipeLeft={hasNext ? onNext : undefined}
      showBackIndicator={hasPrevious}
      showForwardIndicator={hasNext}
    >
      {children}
    </SwipeHandler>
  );
}
