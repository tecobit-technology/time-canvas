import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-full tap-target flex items-center justify-center",
        "text-muted-foreground hover:text-foreground hover:bg-secondary",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label="Search events"
    >
      <Search className="w-5 h-5" />
    </button>
  );
}
