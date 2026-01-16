import { isSameDay, isWithinInterval, startOfDay, endOfDay, differenceInDays, addDays } from 'date-fns';
import type { CalendarEvent, EventPosition } from '@/types/calendar';

// Check if an event spans multiple days
export function isMultiDayEvent(event: CalendarEvent): boolean {
  if (!event.endDate) return false;
  return !isSameDay(event.date, event.endDate);
}

// Check if a date falls within an event's range
export function isDateInEventRange(date: Date, event: CalendarEvent): boolean {
  const eventStart = startOfDay(event.date);
  const eventEnd = event.endDate ? endOfDay(event.endDate) : endOfDay(event.date);
  
  return isWithinInterval(date, { start: eventStart, end: eventEnd });
}

// Get all events that occur on a specific date (including multi-day events)
export function getEventsForDate(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event => isDateInEventRange(date, event));
}

// Calculate event positions for a week row in the month view
export function calculateEventPositions(
  weekDays: Date[],
  events: CalendarEvent[],
  maxVisibleEvents: number = 3
): { positions: EventPosition[]; overflowCounts: number[] } {
  const positions: EventPosition[] = [];
  const overflowCounts: number[] = new Array(7).fill(0);
  const rowSlots: Map<number, string>[] = weekDays.map(() => new Map());
  
  // Get all events that touch this week
  const weekEvents = events.filter(event => {
    return weekDays.some(day => isDateInEventRange(day, event));
  });
  
  // Sort events: multi-day first, then by start date, then by title
  weekEvents.sort((a, b) => {
    const aIsMulti = isMultiDayEvent(a);
    const bIsMulti = isMultiDayEvent(b);
    
    if (aIsMulti && !bIsMulti) return -1;
    if (!aIsMulti && bIsMulti) return 1;
    
    const dateDiff = a.date.getTime() - b.date.getTime();
    if (dateDiff !== 0) return dateDiff;
    
    return a.title.localeCompare(b.title);
  });
  
  // Assign positions to each event
  weekEvents.forEach(event => {
    // Find which columns this event spans in this week
    let startCol = -1;
    let endCol = -1;
    
    for (let col = 0; col < 7; col++) {
      if (isDateInEventRange(weekDays[col], event)) {
        if (startCol === -1) startCol = col;
        endCol = col;
      }
    }
    
    if (startCol === -1) return; // Event doesn't touch this week
    
    // Check if this is the actual start/end of the event
    const isStart = isSameDay(weekDays[startCol], event.date);
    const isEnd = event.endDate 
      ? isSameDay(weekDays[endCol], event.endDate)
      : isSameDay(weekDays[endCol], event.date);
    
    // Find a row that's free for all columns this event spans
    let row = 0;
    let foundRow = false;
    
    while (!foundRow && row < maxVisibleEvents) {
      let rowIsFree = true;
      for (let col = startCol; col <= endCol; col++) {
        if (rowSlots[col].has(row)) {
          rowIsFree = false;
          break;
        }
      }
      
      if (rowIsFree) {
        foundRow = true;
      } else {
        row++;
      }
    }
    
    if (row >= maxVisibleEvents) {
      // This event overflows - count it for each day
      for (let col = startCol; col <= endCol; col++) {
        overflowCounts[col]++;
      }
      return;
    }
    
    // Reserve this row for all columns
    for (let col = startCol; col <= endCol; col++) {
      rowSlots[col].set(row, event.id);
    }
    
    positions.push({
      event,
      startCol,
      endCol,
      isStart,
      isEnd,
      row,
    });
  });
  
  return { positions, overflowCounts };
}

// Get the duration of an event in days
export function getEventDuration(event: CalendarEvent): number {
  if (!event.endDate) return 1;
  return differenceInDays(event.endDate, event.date) + 1;
}
