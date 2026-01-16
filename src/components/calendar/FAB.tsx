import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABProps {
  onClick: () => void;
  className?: string;
}

export function FAB({ onClick, className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-40",
        "right-4",
        className ?? "bottom-[88px]",
        // 56dp FAB per Material Design (56x56 = 14 * 4 = w-14 h-14)
        "w-14 h-14 rounded-full",
        "bg-primary text-primary-foreground",
        "shadow-fab",
        "flex items-center justify-center",
        "transition-all duration-200",
        "hover:scale-105 hover:shadow-lg",
        "active:scale-95 active:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      aria-label="Add new event"
      style={{
        // Account for safe area on iOS
        marginBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
}
