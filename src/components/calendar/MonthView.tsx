import { isSameDay } from 'date-fns';
import { DateCell } from './DateCell';
import type { DateInfo } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  days: DateInfo[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onLongPress?: (date: Date) => void;
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView({ days, selectedDate, onSelectDate, onLongPress }: MonthViewProps) {
  return (
    <div className="flex-1 px-2 pb-4 animate-fade-in">
      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
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
