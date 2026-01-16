export type EventType = 'personal' | 'holiday' | 'note' | 'meeting';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;           // Start date (for single-day events, this is the only date)
  endDate?: Date;       // End date (for multi-day events)
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  type: EventType;
  notes?: string;
  color?: string;
}

export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface DateInfo {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

// For rendering event pills in month view
export interface EventPosition {
  event: CalendarEvent;
  startCol: number;     // Column index (0-6) where event starts in this week
  endCol: number;       // Column index (0-6) where event ends in this week
  isStart: boolean;     // Is this the start of the event?
  isEnd: boolean;       // Is this the end of the event?
  row: number;          // Vertical stacking position
}
