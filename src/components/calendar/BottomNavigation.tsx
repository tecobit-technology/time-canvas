import { Calendar, CalendarDays, LayoutGrid, Rows3 } from 'lucide-react';
import type { ViewType } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems: { view: ViewType; label: string; icon: typeof Calendar }[] = [
  { view: 'day', label: 'Day', icon: Rows3 },
  { view: 'week', label: 'Week', icon: CalendarDays },
  { view: 'month', label: 'Month', icon: LayoutGrid },
  { view: 'year', label: 'Year', icon: Calendar },
];

export function BottomNavigation({ activeView, onViewChange }: BottomNavigationProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-nav shadow-nav"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ view, label, icon: Icon }) => {
          const isActive = activeView === view;
          return (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "min-w-[64px] min-h-[48px]", // Ensure 48dp tap target
                "transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "active:bg-secondary/50" // Touch feedback
              )}
              aria-label={`Switch to ${label} view`}
              aria-pressed={isActive}
            >
              <Icon
                className={cn(
                  "w-6 h-6 mb-1 transition-colors duration-200",
                  isActive ? "text-nav-active" : "text-nav-foreground"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-nav-active" : "text-nav-foreground"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
