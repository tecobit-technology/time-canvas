import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { ViewType } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { useCalendarMode } from '@/contexts/CalendarModeContext';
import { CalendarModeSwitcher } from './CalendarModeSwitcher';
import { 
  adToBS, 
  formatBSDate, 
  BS_MONTHS, 
  getGregorianEquivalent 
} from '@/lib/calendarAdapter';

interface CalendarHeaderProps {
  currentDate: Date;
  view: ViewType;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onSearchClick?: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onSearchClick,
}: CalendarHeaderProps) {
  const { mode } = useCalendarMode();
  const bsDate = adToBS(currentDate);

  const getHeaderText = () => {
    if (mode === 'BS') {
      // Bikram Sambat mode
      switch (view) {
        case 'day':
          return (
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">
                {BS_MONTHS[bsDate.month]} {bsDate.day}
              </span>
              <span className="text-sm text-muted-foreground">
                {bsDate.year} BS • {format(currentDate, 'MMM d, yyyy')}
              </span>
            </div>
          );
        case 'week':
          return (
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">
                {BS_MONTHS[bsDate.month]} {bsDate.year}
              </span>
              <span className="text-sm text-muted-foreground">
                {getGregorianEquivalent(currentDate)}
              </span>
            </div>
          );
        case 'month':
          return (
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">
                {BS_MONTHS[bsDate.month]}
              </span>
              <span className="text-sm text-muted-foreground">
                {bsDate.year} BS • {getGregorianEquivalent(currentDate)}
              </span>
            </div>
          );
        case 'year':
          return (
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight">
                {bsDate.year} BS
              </span>
              <span className="text-sm text-muted-foreground">
                {format(currentDate, 'yyyy')} AD
              </span>
            </div>
          );
      }
    }

    // Gregorian (AD) mode - original behavior
    switch (view) {
      case 'day':
        return (
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">
              {format(currentDate, 'EEEE')}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(currentDate, 'MMMM d, yyyy')}
            </span>
          </div>
        );
      case 'week':
        return (
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">
              Week {format(currentDate, 'w')}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(currentDate, 'MMMM yyyy')}
            </span>
          </div>
        );
      case 'month':
        return (
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">
              {format(currentDate, 'MMMM')}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(currentDate, 'yyyy')}
            </span>
          </div>
        );
      case 'year':
        return (
          <span className="text-2xl font-bold tracking-tight">
            {format(currentDate, 'yyyy')}
          </span>
        );
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background safe-top">
      <div className="flex-1 min-w-0">{getHeaderText()}</div>
      
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Calendar Mode Switcher */}
        <CalendarModeSwitcher />
        
        {/* Search button */}
        {onSearchClick && (
          <button
            onClick={onSearchClick}
            className={cn(
              "p-2 rounded-full tap-target flex items-center justify-center",
              "text-muted-foreground hover:text-foreground hover:bg-secondary",
              "transition-colors duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Search events"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
        
        <button
          onClick={onToday}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full",
            "bg-accent text-accent-foreground",
            "transition-colors duration-200",
            "hover:bg-primary hover:text-primary-foreground",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          {mode === 'BS' ? 'आज' : 'Today'}
        </button>
        
        <button
          onClick={onPrevious}
          className={cn(
            "p-2 rounded-full tap-target flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:bg-secondary",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={onNext}
          className={cn(
            "p-2 rounded-full tap-target flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:bg-secondary",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
