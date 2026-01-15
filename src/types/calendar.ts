export type EventType = 'personal' | 'holiday' | 'note' | 'meeting';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
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
