import { useState } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { BottomNavigation } from '@/components/calendar/BottomNavigation';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { MonthGrid } from '@/components/calendar/MonthGrid';
import { DayView } from '@/components/calendar/DayView';
import { WeekView } from '@/components/calendar/WeekView';
import { YearView } from '@/components/calendar/YearView';
import { EventList } from '@/components/calendar/EventList';
import { FAB } from '@/components/calendar/FAB';
import { AddEventSheet } from '@/components/calendar/AddEventSheet';
import { EventDetailSheet } from '@/components/calendar/EventDetailSheet';
import { SearchSheet } from '@/components/calendar/SearchSheet';
import type { CalendarEvent } from '@/types/calendar';

const Index = () => {
  const {
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
    updateEvent,
    deleteEvent,
  } = useCalendar();

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleLongPress = (date: Date) => {
    selectDate(date);
    setShowAddEvent(true);
  };

  const handleSelectMonth = (date: Date) => {
    selectDate(date);
    setView('month');
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleSearchSelect = (event: CalendarEvent) => {
    selectDate(event.date);
    setShowSearch(false);
    setSelectedEvent(event);
  };

  return (
    <div className="flex flex-col min-h-screen max-h-screen bg-background">
      {/* Header */}
      <CalendarHeader
        currentDate={view === 'day' ? selectedDate : currentDate}
        view={view}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onSearchClick={() => setShowSearch(true)}
      />

      {/* Main content area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {view === 'month' && (
          <>
            <MonthGrid
              days={monthDays}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={selectDate}
              onLongPress={handleLongPress}
              onEventClick={handleEventClick}
            />
            <div className="flex-1 overflow-y-auto border-t border-border pb-20">
              <EventList
                date={selectedDate}
                events={selectedDateEvents}
                onEventClick={handleEventClick}
              />
            </div>
          </>
        )}

        {view === 'day' && (
          <DayView
            date={selectedDate}
            events={selectedDateEvents}
            onEventClick={handleEventClick}
          />
        )}

        {view === 'week' && (
          <WeekView
            days={weekDays}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              selectDate(date);
              setView('day');
            }}
          />
        )}

        {view === 'year' && (
          <YearView
            year={currentDate.getFullYear()}
            events={events}
            onSelectMonth={handleSelectMonth}
          />
        )}
      </main>

      {/* FAB */}
      <FAB onClick={() => setShowAddEvent(true)} />

      {/* Bottom Navigation */}
      <BottomNavigation activeView={view} onViewChange={setView} />

      {/* Add Event Sheet */}
      <AddEventSheet
        open={showAddEvent}
        onOpenChange={setShowAddEvent}
        selectedDate={selectedDate}
        onAddEvent={addEvent}
      />

      {/* Event Detail Sheet */}
      <EventDetailSheet
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />

      {/* Search Sheet */}
      <SearchSheet
        open={showSearch}
        onOpenChange={setShowSearch}
        events={events}
        onSelectEvent={handleSearchSelect}
      />
    </div>
  );
};

export default Index;
