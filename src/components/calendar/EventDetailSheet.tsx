import { useState } from 'react';
import { format } from 'date-fns';
import { X, Trash2, Edit3, Calendar, Clock, Bell, FileText, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { CalendarEvent, EventType } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface EventDetailSheetProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onDelete: (id: string) => void;
}

const eventTypes: { type: EventType; label: string; color: string }[] = [
  { type: 'personal', label: 'Personal', color: 'bg-event-personal' },
  { type: 'meeting', label: 'Meeting', color: 'bg-event-meeting' },
  { type: 'note', label: 'Note', color: 'bg-event-note' },
  { type: 'holiday', label: 'Holiday', color: 'bg-event-holiday' },
];

export function EventDetailSheet({ 
  event, 
  open, 
  onOpenChange, 
  onUpdate, 
  onDelete 
}: EventDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Edit form state
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('personal');
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  // Sync form state when event changes
  const initializeForm = () => {
    if (event) {
      setTitle(event.title);
      setEventType(event.type);
      setAllDay(event.allDay || false);
      setStartTime(event.startTime || '09:00');
      setEndTime(event.endTime || '10:00');
      setNotes(event.notes || '');
    }
  };

  const handleEdit = () => {
    initializeForm();
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!event || !title.trim()) return;

    onUpdate(event.id, {
      title: title.trim(),
      type: eventType,
      allDay,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      notes: notes.trim() || undefined,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      setShowDeleteDialog(false);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  if (!event) return null;

  const typeInfo = eventTypes.find(t => t.type === event.type);

  return (
    <>
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-[75vh] rounded-t-3xl px-4 pb-safe-bottom">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <SheetTitle className="text-lg font-semibold">
                {isEditing ? 'Edit Event' : 'Event Details'}
              </SheetTitle>
              {isEditing ? (
                <Button
                  onClick={handleSave}
                  disabled={!title.trim()}
                  size="sm"
                  className="rounded-full px-5"
                >
                  Save
                </Button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteDialog(true)}
                    className="p-2 text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </SheetHeader>

          <div className="space-y-6 overflow-y-auto">
            {isEditing ? (
              <>
                {/* Title input */}
                <Input
                  placeholder="Event title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                  autoFocus
                />

                {/* Event type selector */}
                <div>
                  <span className="text-sm font-medium text-muted-foreground mb-3 block">
                    Event Type
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {eventTypes.map(({ type, label, color }) => (
                      <button
                        key={type}
                        onClick={() => setEventType(type)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
                          "transition-all duration-200 border-2",
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
              </>
            ) : (
              <>
                {/* View mode */}
                <div className="flex items-start gap-3">
                  <div className={cn("w-1 h-16 rounded-full flex-shrink-0", typeInfo?.color)} />
                  <div>
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                      "bg-secondary"
                    )}>
                      <span className={cn("w-2 h-2 rounded-full", typeInfo?.color)} />
                      {typeInfo?.label}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">
                    {format(event.date, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">
                    {event.allDay 
                      ? 'All day' 
                      : `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`
                    }
                  </span>
                </div>

                {/* Notes */}
                {event.notes && (
                  <div className="p-3 bg-secondary rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Notes</span>
                    </div>
                    <p className="text-foreground">{event.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
