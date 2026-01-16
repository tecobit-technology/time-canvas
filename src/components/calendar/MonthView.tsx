import { isSameDay } from 'date-fns';
import { DateCell } from './DateCell';
import type { DateInfo } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { useCalendarMode } from '@/contexts/CalendarModeContext';
import { BS_WEEKDAYS_EN, BS_WEEKDAYS_SHORT } from '@/lib/calendarAdapter';

interface MonthViewProps {
  days: DateInfo[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onLongPress?: (date: Date) => void;
}

const weekDaysAD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({ days, selectedDate, onSelectDate, onLongPress }: MonthViewProps) {
  const { mode } = useCalendarMode();
  
  // Use Nepali weekday names when in BS mode
  const weekDays = mode === 'BS' ? BS_WEEKDAYS_SHORT : weekDaysAD;

  return (
    <div className="flex-1 px-2 pb-4 animate-fade-in">
      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-2">
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
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((dayInfo) => (
          <DateCell
            key={dayInfo.date.toISOString()}
            dateInfo={dayInfo}
            isSelected={isSameDay(dayInfo.date, selectedDate)}
            onClick={() => onSelectDate(dayInfo.date)}
            onLongPress={() => onLongPress?.(dayInfo.date)}
          />
        ))}
      </div>
    </div>
  );
}
