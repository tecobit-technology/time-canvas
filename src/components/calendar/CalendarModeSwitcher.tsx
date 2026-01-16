import { useCalendarMode } from '@/contexts/CalendarModeContext';
import { cn } from '@/lib/utils';

export function CalendarModeSwitcher() {
  const { mode, setMode } = useCalendarMode();

  return (
    <div className="flex items-center bg-secondary rounded-full p-0.5">
      <button
        onClick={() => setMode('AD')}
        className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200",
          mode === 'AD'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        AD
      </button>
      <button
        onClick={() => setMode('BS')}
        className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200",
          mode === 'BS'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        BS
      </button>
    </div>
  );
}
