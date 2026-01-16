import { useState, useCallback } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
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
import { SettingsSheet } from '@/components/calendar/SettingsSheet';
import type { CalendarEvent, ViewType } from '@/types/calendar';

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

  const navigation = useNavigationHistory('month');

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleLongPress = (date: Date) => {
    selectDate(date);
    setShowAddEvent(true);
  };

  // Hierarchical navigation: Year → Month
  const handleSelectMonth = useCallback((date: Date) => {
    selectDate(date);
    navigation.navigateTo('month', view, date);
    setView('month');
  }, [selectDate, navigation, view, setView]);

  // Hierarchical navigation: Month/Week → Day
  const handleSelectDay = useCallback((date: Date) => {
    selectDate(date);
    navigation.navigateTo('day', view, date);
    setView('day');
  }, [selectDate, navigation, view, setView]);

  // Bottom navigation: resets the stack (lateral navigation)
  const handleBottomNavChange = useCallback((newView: ViewType) => {
    navigation.resetStack(newView);
    setView(newView);
  }, [navigation, setView]);

  // Back button handler
  const handleGoBack = useCallback(() => {
    const previousState = navigation.goBack();
    if (previousState) {
      setView(previousState.view);
      if (previousState.date) {
        selectDate(previousState.date);
      }
    }
  }, [navigation, setView, selectDate]);

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
      {/* Header with back navigation support */}
      <CalendarHeader
        currentDate={view === 'day' ? selectedDate : currentDate}
        view={view}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onSearchClick={() => setShowSearch(true)}
        onSettingsClick={() => setShowSettings(true)}
        canGoBack={navigation.canGoBack}
        onGoBack={handleGoBack}
        previousView={navigation.getPreviousView()}
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
            <div className="flex-1 min-h-0 overflow-y-auto border-t border-border pb-24">
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
            onSelectDate={handleSelectDay}
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
      <FAB
        onClick={() => setShowAddEvent(true)}
        className={view === 'month' ? 'bottom-[148px]' : 'bottom-[88px]'}
      />

      {/* Bottom Navigation - uses lateral navigation (resets stack) */}
      <BottomNavigation activeView={view} onViewChange={handleBottomNavChange} />

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

      {/* Settings Sheet */}
      <SettingsSheet
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </div>
  );
};

export default Index;
