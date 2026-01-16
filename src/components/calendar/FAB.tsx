import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed right-4 bottom-[88px] z-40",
        "w-14 h-14 rounded-full",
        "bg-primary text-primary-foreground",
        "shadow-fab",
        "flex items-center justify-center",
        "transition-all duration-200",
        "hover:scale-105 hover:shadow-lg",
        "active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      aria-label="Add event"
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
}
