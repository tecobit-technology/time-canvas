import { Clock, FileText } from 'lucide-react';
import type { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface EventTileProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: () => void;
}

const typeColors: Record<CalendarEvent['type'], string> = {
  personal: 'bg-event-personal',
  holiday: 'bg-event-holiday',
  note: 'bg-event-note',
  meeting: 'bg-event-meeting',
};

export function EventTile({ event, compact = false, onClick }: EventTileProps) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left px-2 py-1 rounded-md",
          "bg-card shadow-card",
          "transition-shadow duration-200 hover:shadow-card-hover",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-1 h-4 rounded-full flex-shrink-0", typeColors[event.type])} />
          <span className="text-xs font-medium truncate">{event.title}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-xl",
        "bg-card shadow-card",
        "transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "animate-fade-in"
      )}
    >
      <div className="flex gap-3">
        <div className={cn("w-1 rounded-full flex-shrink-0", typeColors[event.type])} />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-card-foreground truncate">
            {event.title}
          </h4>
          
          {(event.startTime || event.allDay) && (
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm">
                {event.allDay ? 'All day' : `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`}
              </span>
            </div>
          )}
          
          {event.notes && (
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              <span className="text-sm truncate">{event.notes}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
