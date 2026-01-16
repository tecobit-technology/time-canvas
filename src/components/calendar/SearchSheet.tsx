import { useState, useMemo } from 'react';
import { format, isSameDay, parseISO, isValid } from 'date-fns';
import { Search, X, Calendar } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { EventTile } from './EventTile';
import type { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface SearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function SearchSheet({ 
  open, 
  onOpenChange, 
  events,
  onSelectEvent,
}: SearchSheetProps) {
  const [query, setQuery] = useState('');

  const filteredEvents = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    
    return events.filter(event => {
      // Search by title
      if (event.title.toLowerCase().includes(searchTerm)) return true;
      
      // Search by notes
      if (event.notes?.toLowerCase().includes(searchTerm)) return true;
      
      // Search by type
      if (event.type.toLowerCase().includes(searchTerm)) return true;
      
      // Search by date (format: "Jan 15", "January", "2024", etc.)
      const dateStr = format(event.date, 'MMMM d yyyy').toLowerCase();
      if (dateStr.includes(searchTerm)) return true;
      
      // Try parsing as date
      try {
        const parsed = new Date(query);
        if (isValid(parsed) && isSameDay(event.date, parsed)) return true;
      } catch {}
      
      return false;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [query, events]);

  const handleSelectEvent = (event: CalendarEvent) => {
    onSelectEvent(event);
    onOpenChange(false);
    setQuery('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setQuery('');
  };

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: { date: Date; events: CalendarEvent[] }[] = [];
    
    filteredEvents.forEach(event => {
      const existingGroup = groups.find(g => isSameDay(g.date, event.date));
      if (existingGroup) {
        existingGroup.events.push(event);
      } else {
        groups.push({ date: event.date, events: [event] });
      }
    });
    
    return groups;
  }, [filteredEvents]);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="top" className="h-[85vh] rounded-b-3xl px-4">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-3">
            {/* Close button - 48x48 tap target */}
            <button
              onClick={handleClose}
              className="min-w-[48px] min-h-[48px] -ml-2 flex items-center justify-center text-muted-foreground hover:text-foreground active:bg-secondary/50 rounded-lg transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
            <SheetTitle className="sr-only">Search Events</SheetTitle>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search events, dates..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 h-12 rounded-xl bg-secondary border-0 text-base"
                autoFocus
              />
            </div>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100%-80px)] scrollbar-hide">
          {query.trim() === '' ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Search for events by title, notes, or date
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try "meeting", "January 15", or "holiday"
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                No events found for "{query}"
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedEvents.map(group => (
                <div key={group.date.toISOString()}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 sticky top-0 bg-background py-1">
                    {format(group.date, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="space-y-2">
                    {group.events.map(event => (
                      <EventTile 
                        key={event.id} 
                        event={event} 
                        onClick={() => handleSelectEvent(event)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              
              <p className="text-center text-sm text-muted-foreground py-4">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
