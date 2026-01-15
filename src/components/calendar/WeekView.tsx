import { format, isSameDay } from 'date-fns';
import type { DateInfo } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  days: DateInfo[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ days, selectedDate, onSelectDate }: WeekViewProps) {
  return (
    <div className="flex-1 overflow-hidden animate-fade-in">
      {/* Week header */}
      <div className="flex border-b border-border sticky top-0 bg-background z-10">
        <div className="w-12 flex-shrink-0" />
        {days.map(dayInfo => (
          <button
            key={dayInfo.date.toISOString()}
            onClick={() => onSelectDate(dayInfo.date)}
            className={cn(
              "flex-1 py-3 text-center transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isSameDay(dayInfo.date, selectedDate) && "bg-accent"
            )}
          >
            <span
              className={cn(
                "text-xs font-medium",
                dayInfo.isWeekend ? "text-calendar-weekend-foreground" : "text-muted-foreground"
              )}
            >
              {format(dayInfo.date, 'EEE')}
            </span>
            <span
              className={cn(
                "flex items-center justify-center w-8 h-8 mx-auto rounded-full text-sm font-semibold mt-1",
                dayInfo.isToday && "bg-calendar-today text-calendar-today-foreground"
              )}
            >
              {format(dayInfo.date, 'd')}
            </span>
            
            {/* Event dots */}
            {dayInfo.events.length > 0 && (
              <div className="flex justify-center gap-0.5 mt-1">
                {dayInfo.events.slice(0, 3).map((event, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      event.type === 'personal' && "bg-event-personal",
                      event.type === 'holiday' && "bg-event-holiday",
                      event.type === 'note' && "bg-event-note",
                      event.type === 'meeting' && "bg-event-meeting"
                    )}
                  />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-280px)]">
        {hours.map(hour => {
          const timeLabel = format(new Date().setHours(hour, 0, 0, 0), 'h a');
          
          return (
            <div key={hour} className="flex border-b border-border/30 min-h-[48px]">
              <div className="w-12 flex-shrink-0 py-1 pr-2 text-right">
                <span className="text-2xs text-muted-foreground">{timeLabel}</span>
              </div>
              
              {days.map(dayInfo => {
                const hourEvents = dayInfo.events.filter(e => {
                  if (!e.startTime || e.allDay) return false;
                  return parseInt(e.startTime.split(':')[0], 10) === hour;
                });
                
                return (
                  <div
                    key={dayInfo.date.toISOString()}
                    className={cn(
                      "flex-1 border-l border-border/30 p-0.5",
                      isSameDay(dayInfo.date, new Date()) && 
                      hour === new Date().getHours() && 
                      "bg-accent/30"
                    )}
                  >
                    {hourEvents.map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "px-1 py-0.5 rounded text-2xs truncate text-white",
                          event.type === 'personal' && "bg-event-personal",
                          event.type === 'holiday' && "bg-event-holiday",
                          event.type === 'note' && "bg-event-note",
                          event.type === 'meeting' && "bg-event-meeting"
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
