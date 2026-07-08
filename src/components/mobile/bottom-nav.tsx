import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, UserCircle2, MessagesSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGuestProfile } from '../../stores/guestProfile';

const CHATBOT_BASE = '/room/chatbot';

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export function BottomNav({ className }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReturningGuest, requestHistory } = useGuestProfile();

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
    { id: 'home', path: CHATBOT_BASE, label: 'Chat', icon: <MessagesSquare className="h-[19px] w-[19px]" /> },
    {
      id: 'history',
      path: `${CHATBOT_BASE}/history`,
      label: 'History',
      icon: <Clock className="h-[19px] w-[19px]" />,
      badge: isReturningGuest && requestHistory.length > 0 ? requestHistory.length : undefined,
    },
    { id: 'profile', path: `${CHATBOT_BASE}/profile`, label: 'Profile', icon: <UserCircle2 className="h-[19px] w-[19px]" /> },
  ];

  return (
    <nav
      aria-label="Main"
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 pb-safe supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur-xl',
        className
      )}
    >
      <div className="mx-auto grid h-[52px] w-full max-w-md grid-cols-3 px-2">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            onNavigate={() => navigate(item.path)}
          />
        ))}
      </div>
    </nav>
  );
}

function NavButton({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative flex items-center justify-center gap-1.5 touch-manipulation',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
        'motion-safe:active:scale-[0.96] motion-safe:transition-transform'
      )}
    >
      {/* Active lozenge slides its color/width; icon + label ride inside it */}
      <span
        className={cn(
          'relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-[background-color,color] duration-200 ease-out',
          isActive
            ? 'bg-accent/25 text-foreground dark:bg-accent/15'
            : 'text-muted-foreground group-hover:text-foreground'
        )}
      >
        <span className="relative">
          {item.icon}
          {item.badge != null && item.badge > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold leading-none text-primary-foreground">
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </span>
        <span
          className={cn(
            'overflow-hidden text-[12.5px] font-semibold leading-none transition-[max-width,opacity] duration-200 ease-out',
            isActive ? 'max-w-20 opacity-100' : 'max-w-0 opacity-0'
          )}
        >
          {item.label}
        </span>
      </span>
    </button>
  );
}
