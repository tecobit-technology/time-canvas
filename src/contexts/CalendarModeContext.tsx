import { createContext, useContext, useState, ReactNode } from 'react';
import type { CalendarMode } from '@/lib/calendarAdapter';

interface CalendarModeContextType {
  mode: CalendarMode;
  setMode: (mode: CalendarMode) => void;
  toggleMode: () => void;
}

const CalendarModeContext = createContext<CalendarModeContextType | undefined>(undefined);

export function CalendarModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<CalendarMode>('AD');

  const toggleMode = () => {
    setMode(prev => prev === 'AD' ? 'BS' : 'AD');
  };

  return (
    <CalendarModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </CalendarModeContext.Provider>
  );
}

export function useCalendarMode() {
  const context = useContext(CalendarModeContext);
  if (!context) {
    throw new Error('useCalendarMode must be used within a CalendarModeProvider');
  }
  return context;
}
