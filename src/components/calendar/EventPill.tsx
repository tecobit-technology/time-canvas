import type { EventPosition } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface EventPillProps {
  position: EventPosition;
  cellWidth: number;
  onClick?: () => void;
}

const typeColors: Record<string, { bg: string; text: string }> = {
  personal: { bg: 'bg-event-personal', text: 'text-white' },
  holiday: { bg: 'bg-event-holiday', text: 'text-white' },
  note: { bg: 'bg-event-note', text: 'text-white' },
  meeting: { bg: 'bg-event-meeting', text: 'text-white' },
};

export function EventPill({ position, cellWidth, onClick }: EventPillProps) {
  const { event, startCol, endCol, isStart, isEnd, row } = position;
  const colors = typeColors[event.type] || typeColors.personal;
  
  // Calculate width and position
  const spanCols = endCol - startCol + 1;
  const width = cellWidth * spanCols - 4; // 4px for margins
  const left = cellWidth * startCol + 2; // 2px left margin
  const top = 32 + row * 20; // 32px for day number, 20px per event row
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "absolute h-[18px] flex items-center px-1.5 text-2xs font-medium truncate",
        "transition-all duration-150 hover:brightness-110 hover:shadow-sm",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        colors.bg,
        colors.text,
        // Rounded corners based on start/end
        isStart && isEnd && "rounded-md",
        isStart && !isEnd && "rounded-l-md rounded-r-none",
        !isStart && isEnd && "rounded-r-md rounded-l-none",
        !isStart && !isEnd && "rounded-none"
      )}
      style={{
        width: `${width}px`,
        left: `${left}px`,
        top: `${top}px`,
      }}
      title={event.title}
    >
      {isStart && (
        <span className="truncate">{event.title}</span>
      )}
    </button>
  );
}
