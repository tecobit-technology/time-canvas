import { useState, useMemo } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isWeekend,
  format,
  addMonths,
  subMonths,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  startOfDay
} from 'date-fns';
import type { CalendarEvent, DateInfo, ViewType } from '@/types/calendar';

// Sample events for demo
const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: new Date(),
    startTime: '09:00',
    endTime: '09:30',
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Lunch with Sarah',
    date: new Date(),
    startTime: '12:30',
    endTime: '13:30',
    type: 'personal',
  },
  {
    id: '3',
    title: 'Project Review',
    date: addDays(new Date(), 1),
    startTime: '14:00',
    endTime: '15:00',
    type: 'meeting',
  },
  {
    id: '4',
    title: 'Gym Session',
    date: addDays(new Date(), 2),
    startTime: '18:00',
    endTime: '19:30',
    type: 'personal',
  },
  {
    id: '5',
    title: 'Independence Day',
    date: addDays(new Date(), 5),
    allDay: true,
    type: 'holiday',
  },
  {
    id: '6',
    title: 'Buy groceries',
    date: new Date(),
    allDay: true,
    type: 'note',
  },
];

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

  const today = useMemo(() => startOfDay(new Date()), []);

  // Get days for the month view (including padding days from adjacent months)
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start, end }).map((date): DateInfo => ({
      date,
      isToday: isSameDay(date, today),
      isWeekend: isWeekend(date),
      isCurrentMonth: isSameMonth(date, currentDate),
      events: events.filter(event => isSameDay(event.date, date)),
    }));
  }, [currentDate, today, events]);

  // Get days for the week view
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start, end }).map((date): DateInfo => ({
      date,
      isToday: isSameDay(date, today),
      isWeekend: isWeekend(date),
      isCurrentMonth: true,
      events: events.filter(event => isSameDay(event.date, date)),
    }));
  }, [currentDate, today, events]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return events.filter(event => isSameDay(event.date, selectedDate));
  }, [selectedDate, events]);

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const goToPrevious = () => {
    switch (view) {
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        setSelectedDate(subDays(selectedDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(subMonths(currentDate, 12));
        break;
    }
  };

  const goToNext = () => {
    switch (view) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        setSelectedDate(addDays(selectedDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(addMonths(currentDate, 12));
        break;
    }
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  return {
    currentDate,
    selectedDate,
    view,
    setView,
    monthDays,
    weekDays,
    selectedDateEvents,
    events,
    goToToday,
    goToPrevious,
    goToNext,
    selectDate,
    addEvent,
  };
}
