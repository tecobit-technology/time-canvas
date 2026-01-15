import type { DateInfo } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface DateCellProps {
  dateInfo: DateInfo;
  isSelected: boolean;
  onClick: () => void;
  onLongPress?: () => void;
}

export function DateCell({ dateInfo, isSelected, onClick, onLongPress }: DateCellProps) {
  const { date, isToday, isWeekend, isCurrentMonth, events } = dateInfo;
  
  // Get unique event types for dots
  const eventTypes = [...new Set(events.map(e => e.type))];
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onLongPress?.();
  };

  return (
    <button
      onClick={onClick}
      onContextMenu={handleContextMenu}
      className={cn(
        "relative flex flex-col items-center justify-start p-1 aspect-square",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "rounded-xl",
        !isCurrentMonth && "opacity-40",
        isWeekend && isCurrentMonth && "bg-calendar-weekend",
        isSelected && !isToday && "bg-accent",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          "transition-colors duration-200",
          isToday && "bg-calendar-today text-calendar-today-foreground",
          isWeekend && !isToday && "text-calendar-weekend-foreground",
          isSelected && !isToday && "text-accent-foreground font-semibold"
        )}
      >
        {date.getDate()}
      </span>
      
      {/* Event indicator dots */}
      {eventTypes.length > 0 && (
        <div className="flex items-center justify-center gap-0.5 mt-0.5">
          {eventTypes.slice(0, 3).map((type) => (
            <span
              key={type}
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                type === 'personal' && "bg-event-personal",
                type === 'holiday' && "bg-event-holiday",
                type === 'note' && "bg-event-note",
                type === 'meeting' && "bg-event-meeting"
              )}
            />
          ))}
        </div>
      )}
    </button>
  );
}
