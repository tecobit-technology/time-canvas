import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSyncStatus, SyncStatus } from '@/contexts/SyncContext';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SyncStatusIndicatorProps {
  compact?: boolean;
  onClick?: () => void;
}

const statusConfig: Record<SyncStatus, {
  icon: typeof Cloud;
  label: string;
  className: string;
}> = {
  online: {
    icon: Cloud,
    label: 'Cloud Connected',
    className: 'text-green-500',
  },
  offline: {
    icon: CloudOff,
    label: 'Local Mode',
    className: 'text-muted-foreground',
  },
  syncing: {
    icon: RefreshCw,
    label: 'Syncing...',
    className: 'text-primary animate-spin',
  },
  error: {
    icon: AlertCircle,
    label: 'Sync Error',
    className: 'text-destructive',
  },
};

export function SyncStatusIndicator({ compact = false, onClick }: SyncStatusIndicatorProps) {
  const { status, isCloudEnabled, pendingChanges, getLastSyncedText } = useSyncStatus();
  
  const config = statusConfig[status];
  const Icon = config.icon;

  const indicator = (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 p-2 rounded-full tap-target",
        "text-muted-foreground hover:text-foreground hover:bg-secondary",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      aria-label={config.label}
    >
      <div className="relative">
        <Icon className={cn("w-5 h-5", config.className)} />
        {!isCloudEnabled && pendingChanges > 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
        )}
      </div>
      
      {!compact && (
        <div className="flex items-center gap-1.5">
          <Badge 
            variant={isCloudEnabled ? "default" : "secondary"}
            className="text-[10px] px-1.5 py-0"
          >
            {isCloudEnabled ? 'Cloud' : 'Local'}
          </Badge>
        </div>
      )}
    </button>
  );

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {indicator}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-medium">{config.label}</p>
          {isCloudEnabled && <p className="text-muted-foreground">{getLastSyncedText()}</p>}
          {!isCloudEnabled && pendingChanges > 0 && (
            <p className="text-amber-500">{pendingChanges} pending changes</p>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return indicator;
}
