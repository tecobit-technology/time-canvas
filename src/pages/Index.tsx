import { useState } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { BottomNavigation } from '@/components/calendar/BottomNavigation';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { MonthView } from '@/components/calendar/MonthView';
import { DayView } from '@/components/calendar/DayView';
import { WeekView } from '@/components/calendar/WeekView';
import { YearView } from '@/components/calendar/YearView';
import { EventList } from '@/components/calendar/EventList';
import { FAB } from '@/components/calendar/FAB';
import { AddEventSheet } from '@/components/calendar/AddEventSheet';

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
  } = useCalendar();

  const [showAddEvent, setShowAddEvent] = useState(false);

  const handleLongPress = (date: Date) => {
    selectDate(date);
    setShowAddEvent(true);
  };

  const handleSelectMonth = (date: Date) => {
    selectDate(date);
    setView('month');
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
      />

      {/* Main content area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {view === 'month' && (
          <>
            <MonthView
              days={monthDays}
              selectedDate={selectedDate}
              onSelectDate={selectDate}
              onLongPress={handleLongPress}
            />
            <div className="flex-1 overflow-y-auto border-t border-border pb-20">
              <EventList
                date={selectedDate}
                events={selectedDateEvents}
              />
            </div>
          </>
        )}

        {view === 'day' && (
          <DayView
            date={selectedDate}
            events={selectedDateEvents}
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
    </div>
  );
};

export default Index;
