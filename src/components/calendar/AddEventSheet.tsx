import { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Clock, Bell, FileText, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { CalendarEvent, EventType } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface AddEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

const eventTypes: { type: EventType; label: string; color: string }[] = [
  { type: 'personal', label: 'Personal', color: 'bg-event-personal' },
  { type: 'meeting', label: 'Meeting', color: 'bg-event-meeting' },
  { type: 'note', label: 'Note', color: 'bg-event-note' },
  { type: 'holiday', label: 'Holiday', color: 'bg-event-holiday' },
];

export function AddEventSheet({ open, onOpenChange, selectedDate, onAddEvent }: AddEventSheetProps) {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('personal');
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [reminder, setReminder] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;

    onAddEvent({
      title: title.trim(),
      date: selectedDate,
      type: eventType,
      allDay,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setEventType('personal');
    setAllDay(false);
    setStartTime('09:00');
    setEndTime('10:00');
    setReminder(true);
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-4 pb-safe-bottom">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <SheetTitle className="text-lg font-semibold">New Event</SheetTitle>
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
              size="sm"
              className="rounded-full px-5"
            >
              Save
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Title input */}
          <div>
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
              autoFocus
            />
          </div>

          {/* Event type selector */}
          <div>
            <span className="text-sm font-medium text-muted-foreground mb-3 block">
              Event Type
            </span>
            <div className="flex gap-2">
              {eventTypes.map(({ type, label, color }) => (
                <button
                  key={type}
                  onClick={() => setEventType(type)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
                    "transition-all duration-200",
                    "border-2",
                    eventType === type
                      ? "border-primary bg-accent"
                      : "border-transparent bg-secondary"
                  )}
                >
                  <span className={cn("w-2.5 h-2.5 rounded-full", color)} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date display */}
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>

          {/* All day toggle */}
          <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
            <span className="font-medium">All day</span>
            <Switch checked={allDay} onCheckedChange={setAllDay} />
          </div>

          {/* Time pickers */}
          {!allDay && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Start</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">End</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reminder toggle */}
          <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Reminder</span>
            </div>
            <Switch checked={reminder} onCheckedChange={setReminder} />
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
            </div>
            <Textarea
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] rounded-xl resize-none"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
