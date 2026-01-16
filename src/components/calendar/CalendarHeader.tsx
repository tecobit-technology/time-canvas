import { ChevronLeft, ChevronRight, Search, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { ViewType } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { useCalendarMode } from '@/contexts/CalendarModeContext';
import { CalendarModeSwitcher } from './CalendarModeSwitcher';
import { SyncStatusIndicator } from './SyncStatusIndicator';
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
  onSettingsClick?: () => void;
  // Navigation hierarchy props
  canGoBack?: boolean;
  onGoBack?: () => void;
  previousView?: ViewType | null;
}

// Helper to get view label for back button
const viewLabels: Record<ViewType, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
  year: 'Year',
};

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onSearchClick,
  onSettingsClick,
  canGoBack = false,
  onGoBack,
  previousView,
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
    <header className="flex flex-col px-4 py-3 bg-background safe-top gap-2">
      {/* Top row: Back button (if hierarchical), Title, and navigation */}
      <div className="flex items-center justify-between gap-2">
        {/* Back button - only shown when in child view hierarchy */}
        {canGoBack && onGoBack ? (
          <button
            onClick={onGoBack}
            className={cn(
              "flex items-center gap-1 min-w-[48px] min-h-[48px] -ml-2",
              "text-primary hover:text-primary/80",
              "transition-colors duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
              "active:bg-secondary/50"
            )}
            aria-label={previousView ? `Back to ${viewLabels[previousView]}` : 'Go back'}
          >
            <ArrowLeft className="w-5 h-5" />
            {previousView && (
              <span className="text-sm font-medium hidden sm:inline">
                {viewLabels[previousView]}
              </span>
            )}
          </button>
        ) : (
          <div className="w-0 sm:w-0" />
        )}

        <div className="min-w-0 flex-1">{getHeaderText()}</div>
        
        {/* Navigation arrows */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onPrevious}
            className={cn(
              "p-2 rounded-full min-w-[48px] min-h-[48px] flex items-center justify-center",
              "text-muted-foreground hover:text-foreground hover:bg-secondary",
              "transition-colors duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "active:bg-secondary/50"
            )}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={onNext}
            className={cn(
              "p-2 rounded-full min-w-[48px] min-h-[48px] flex items-center justify-center",
              "text-muted-foreground hover:text-foreground hover:bg-secondary",
              "transition-colors duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "active:bg-secondary/50"
            )}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Bottom row: Mode switchers and tools */}
      <div className="flex items-center justify-between">
        {/* Left side: Calendar mode and sync status */}
        <div className="flex items-center gap-2">
          <CalendarModeSwitcher />
          <SyncStatusIndicator compact onClick={onSettingsClick} />
        </div>
        
        {/* Right side: Today button and search */}
        <div className="flex items-center gap-1.5">
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
        </div>
      </div>
    </header>
  );
}
