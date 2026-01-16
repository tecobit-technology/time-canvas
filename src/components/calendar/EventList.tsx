import { format } from 'date-fns';
import { EventTile } from './EventTile';
import type { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface EventListProps {
  date: Date;
  events: CalendarEvent[];
  className?: string;
  onEventClick?: (event: CalendarEvent) => void;
}

export function EventList({ date, events, className, onEventClick }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className={cn("px-4 py-8 text-center", className)}>
        <p className="text-muted-foreground text-sm">
          No events for {format(date, 'MMMM d')}
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          Tap + to add an event
        </p>
      </div>
    );
  }

  return (
    <div className={cn("px-4 space-y-2 py-3", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        {format(date, 'EEEE, MMMM d')}
      </h3>
      {events.map(event => (
        <EventTile 
          key={event.id} 
          event={event} 
          onClick={() => onEventClick?.(event)}
        />
      ))}
    </div>
  );
}
