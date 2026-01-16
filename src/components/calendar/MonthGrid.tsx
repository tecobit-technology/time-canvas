import { useMemo, useRef, useEffect, useState } from 'react';
import { isSameDay } from 'date-fns';
import type { DateInfo, CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { useCalendarMode } from '@/contexts/CalendarModeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { adToBS, toNepaliNumeral, BS_WEEKDAYS_SHORT } from '@/lib/calendarAdapter';
import { calculateEventPositions } from '@/lib/eventUtils';
import { EventPill } from './EventPill';

interface MonthGridProps {
  days: DateInfo[];
  events: CalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onLongPress?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const weekDaysAD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_EVENTS = 3;

export function MonthGrid({ 
  days, 
  events, 
  selectedDate, 
  onSelectDate, 
  onLongPress,
  onEventClick 
}: MonthGridProps) {
  const { mode } = useCalendarMode();
  const isMobile = useIsMobile();
  const maxVisibleEvents = isMobile ? 1 : MAX_VISIBLE_EVENTS;
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(0);
  
  const weekDays = mode === 'BS' ? BS_WEEKDAYS_SHORT : weekDaysAD;
  
  // Measure cell width for event pill positioning
  useEffect(() => {
    const updateCellWidth = () => {
      if (gridRef.current) {
        const gridWidth = gridRef.current.offsetWidth;
        setCellWidth(gridWidth / 7);
      }
    };
    
    updateCellWidth();
    window.addEventListener('resize', updateCellWidth);
    return () => window.removeEventListener('resize', updateCellWidth);
  }, []);
  
  // Group days into weeks
  const weeks = useMemo(() => {
    const result: DateInfo[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);
  
  // Calculate event positions for each week
  const weekEventPositions = useMemo(() => {
    return weeks.map(week => {
      const weekDates = week.map(d => d.date);
      return calculateEventPositions(weekDates, events, maxVisibleEvents);
    });
  }, [weeks, events, maxVisibleEvents]);

  const handleContextMenu = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    onLongPress?.(date);
  };

  const baseRowHeight = isMobile ? 60 : 80;
  const eventRowHeight = isMobile ? 18 : 20;

  const eventPillLayout = {
    topOffset: isMobile ? 22 : 32,
    rowHeight: eventRowHeight,
    height: isMobile ? 16 : 18,
  };

  return (
    <div className="shrink-0 px-2 pb-4 animate-fade-in">
      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "text-center text-xs font-medium py-2",
              index === 0 || index === 6 
                ? "text-calendar-weekend-foreground" 
                : "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid - week by week */}
      <div ref={gridRef} className="space-y-0.5">
        {weeks.map((week, weekIndex) => {
          const { positions, overflowCounts } = weekEventPositions[weekIndex];
          
          return (
            <div 
              key={weekIndex} 
              className="relative grid grid-cols-7 gap-0.5"
              style={{ minHeight: `${baseRowHeight + maxVisibleEvents * eventRowHeight}px` }}
            >
              {/* Date cells */}
              {week.map((dayInfo, dayIndex) => {
                const { date, isToday, isWeekend, isCurrentMonth } = dayInfo;
                const isSelected = isSameDay(date, selectedDate);
                const overflow = overflowCounts[dayIndex];
                
                const displayDay = mode === 'BS' 
                  ? toNepaliNumeral(adToBS(date).day)
                  : date.getDate();
                
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => onSelectDate(date)}
                    onContextMenu={(e) => handleContextMenu(e, date)}
                    className={cn(
                      "relative flex flex-col items-center pt-1",
                      "transition-colors duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                      "rounded-lg",
                      !isCurrentMonth && "opacity-40",
                      isWeekend && isCurrentMonth && "bg-calendar-weekend/50",
                      isSelected && !isToday && "bg-accent",
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium",
                        "transition-colors duration-200",
                        isToday && "bg-calendar-today text-calendar-today-foreground",
                        isWeekend && !isToday && "text-calendar-weekend-foreground",
                        isSelected && !isToday && "text-accent-foreground font-semibold"
                      )}
                    >
                      {displayDay}
                    </span>
                    
                    {/* Overflow indicator */}
                    {overflow > 0 && (
                      <span className="absolute bottom-1 text-2xs text-muted-foreground font-medium">
                        +{overflow} more
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Event pills layer */}
              {positions.map((position) => (
                <EventPill
                  key={`${position.event.id}-${weekIndex}`}
                  position={position}
                  cellWidth={cellWidth}
                  layout={eventPillLayout}
                  onClick={() => onEventClick?.(position.event)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
