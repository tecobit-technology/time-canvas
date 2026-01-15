import { format } from 'date-fns';
import { EventTile } from './EventTile';
import type { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
}

const hours = Array.from({ length: 24 }, (_, i) => i);

export function DayView({ date, events }: DayViewProps) {
  // Separate all-day events from timed events
  const allDayEvents = events.filter(e => e.allDay);
  const timedEvents = events.filter(e => !e.allDay);

  // Helper to get events for a specific hour
  const getEventsForHour = (hour: number) => {
    return timedEvents.filter(event => {
      if (!event.startTime) return false;
      const eventHour = parseInt(event.startTime.split(':')[0], 10);
      return eventHour === hour;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide animate-fade-in">
      {/* All-day events section */}
      {allDayEvents.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            All Day
          </span>
          <div className="mt-2 space-y-2">
            {allDayEvents.map(event => (
              <EventTile key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
      
      {/* Hourly timeline */}
      <div className="relative">
        {hours.map(hour => {
          const hourEvents = getEventsForHour(hour);
          const timeLabel = format(new Date().setHours(hour, 0, 0, 0), 'h a');
          
          return (
            <div
              key={hour}
              className={cn(
                "flex border-b border-border/50 min-h-[60px]",
                hour === new Date().getHours() && "bg-accent/30"
              )}
            >
              {/* Time label */}
              <div className="w-16 flex-shrink-0 py-2 pr-3 text-right">
                <span className="text-xs text-muted-foreground">
                  {timeLabel}
                </span>
              </div>
              
              {/* Events area */}
              <div className="flex-1 py-1 pr-4 border-l border-border/50">
                <div className="space-y-1">
                  {hourEvents.map(event => (
                    <EventTile key={event.id} event={event} compact />
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
