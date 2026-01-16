import { format, isSameDay } from 'date-fns';
import { EventTile } from './EventTile';
import type { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { isMultiDayEvent, getEventDuration } from '@/lib/eventUtils';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

export function DayView({ date, events, onEventClick }: DayViewProps) {
  // Separate all-day and multi-day events from timed events
  const allDayEvents = events.filter(e => e.allDay || isMultiDayEvent(e));
  const timedEvents = events.filter(e => !e.allDay && !isMultiDayEvent(e));

  // Helper to get events for a specific hour
  const getEventsForHour = (hour: number) => {
    return timedEvents.filter(event => {
      if (!event.startTime) return false;
      const eventHour = parseInt(event.startTime.split(':')[0], 10);
      return eventHour === hour;
    });
  };

  // Get duration text for multi-day events
  const getMultiDayText = (event: CalendarEvent) => {
    if (!isMultiDayEvent(event)) return 'All day';
    const duration = getEventDuration(event);
    const isStart = isSameDay(date, event.date);
    const isEnd = event.endDate && isSameDay(date, event.endDate);
    
    if (isStart) return `Day 1 of ${duration}`;
    if (isEnd) return `Day ${duration} of ${duration}`;
    
    // Calculate which day this is
    const dayNum = Math.floor((date.getTime() - event.date.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `Day ${dayNum} of ${duration}`;
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide animate-fade-in pb-20">
      {/* All-day / Multi-day events section */}
      {allDayEvents.length > 0 && (
        <div className="px-4 py-3 border-b border-border bg-secondary/30">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            All Day
          </span>
          <div className="mt-2 space-y-2">
            {allDayEvents.map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer",
                  "transition-all duration-200 hover:scale-[1.01]",
                  "bg-card shadow-card hover:shadow-card-hover"
                )}
              >
                <div 
                  className={cn(
                    "w-1 self-stretch rounded-full",
                    event.type === 'personal' && "bg-event-personal",
                    event.type === 'holiday' && "bg-event-holiday",
                    event.type === 'note' && "bg-event-note",
                    event.type === 'meeting' && "bg-event-meeting"
                  )} 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{event.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {getMultiDayText(event)}
                  </span>
                </div>
                {isMultiDayEvent(event) && (
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full text-white",
                    event.type === 'personal' && "bg-event-personal",
                    event.type === 'holiday' && "bg-event-holiday",
                    event.type === 'note' && "bg-event-note",
                    event.type === 'meeting' && "bg-event-meeting"
                  )}>
                    Multi-day
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Hourly timeline */}
      <div className="relative">
        {hours.map(hour => {
          const hourEvents = getEventsForHour(hour);
          const timeLabel = format(new Date().setHours(hour, 0, 0, 0), 'h a');
          const isCurrentHour = hour === new Date().getHours() && isSameDay(date, new Date());
          
          return (
            <div
              key={hour}
              className={cn(
                "flex border-b border-border/50 min-h-[60px]",
                isCurrentHour && "bg-accent/30"
              )}
            >
              {/* Time label */}
              <div className="w-16 flex-shrink-0 py-2 pr-3 text-right">
                <span className={cn(
                  "text-xs",
                  isCurrentHour ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {timeLabel}
                </span>
              </div>
              
              {/* Events area */}
              <div className="flex-1 py-1 pr-4 border-l border-border/50">
                <div className="space-y-1">
                  {hourEvents.map(event => (
                    <EventTile 
                      key={event.id} 
                      event={event} 
                      compact 
                      onClick={() => onEventClick?.(event)}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
