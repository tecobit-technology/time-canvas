import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import type { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface YearViewProps {
  year: number;
  events: CalendarEvent[];
  onSelectMonth: (date: Date) => void;
}

const months = Array.from({ length: 12 }, (_, i) => i);

export function YearView({ year, events, onSelectMonth }: YearViewProps) {
  const today = new Date();

  const getMiniMonthDays = (monthIndex: number) => {
    const monthDate = new Date(year, monthIndex, 1);
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const hasEvents = (date: Date) => {
    return events.some(event => isSameDay(event.date, date));
  };

  const getEventType = (date: Date) => {
    const event = events.find(e => isSameDay(e.date, date));
    return event?.type;
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-20 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {months.map(monthIndex => {
          const monthDate = new Date(year, monthIndex, 1);
          const days = getMiniMonthDays(monthIndex);

          return (
            <button
              key={monthIndex}
              onClick={() => onSelectMonth(monthDate)}
              className={cn(
                "p-2 rounded-xl transition-colors",
                "hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <span className="block text-sm font-semibold text-foreground mb-2">
                {format(monthDate, 'MMM')}
              </span>

              <div className="grid grid-cols-7 gap-px">
                {days.map(day => {
                  const isCurrentMonth = isSameMonth(day, monthDate);
                  const isToday = isSameDay(day, today);
                  const eventType = getEventType(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "aspect-square flex items-center justify-center text-2xs",
                        !isCurrentMonth && "opacity-0",
                        isToday && "bg-calendar-today text-calendar-today-foreground rounded-full",
                        eventType === 'holiday' && !isToday && "text-event-holiday font-bold",
                        eventType === 'personal' && !isToday && "text-event-personal font-bold",
                        eventType === 'note' && !isToday && "text-event-note font-bold",
                        eventType === 'meeting' && !isToday && "text-event-meeting font-bold"
                      )}
                    >
                      {isCurrentMonth ? day.getDate() : ''}
                    </div>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 py-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-event-holiday" />
          <span className="text-xs text-muted-foreground">Holiday</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-event-personal" />
          <span className="text-xs text-muted-foreground">Personal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-event-note" />
          <span className="text-xs text-muted-foreground">Note</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-event-meeting" />
          <span className="text-xs text-muted-foreground">Meeting</span>
        </div>
      </div>
    </div>
  );
}
