import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Shield, 
  Database, 
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSyncStatus } from '@/contexts/SyncContext';
import { useCalendarMode } from '@/contexts/CalendarModeContext';

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { 
    status, 
    isCloudEnabled, 
    pendingChanges, 
    setCloudEnabled, 
    triggerSync,
    getLastSyncedText 
  } = useSyncStatus();
  const { mode } = useCalendarMode();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await triggerSync();
    setIsSyncing(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl flex flex-col">
        <SheetHeader className="text-left pb-4 flex-shrink-0">
          <SheetTitle className="text-xl">
            {mode === 'BS' ? 'सेटिङ्स' : 'Settings'}
          </SheetTitle>
          <SheetDescription>
            {mode === 'BS' ? 'डाटा र गोपनीयता प्रबन्ध गर्नुहोस्' : 'Manage your data and privacy preferences'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pb-12 -mx-6 px-6">
          {/* Sync Status Card */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isCloudEnabled ? (
                  <div className="p-2 rounded-full bg-green-500/10">
                    <Cloud className="w-5 h-5 text-green-500" />
                  </div>
                ) : (
                  <div className="p-2 rounded-full bg-muted">
                    <CloudOff className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">
                    {isCloudEnabled ? 'Cloud Connected' : 'Local Mode'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isCloudEnabled 
                      ? `Last synced: ${getLastSyncedText()}`
                      : `${pendingChanges} changes pending backup`
                    }
                  </p>
                </div>
              </div>
              <Badge variant={isCloudEnabled ? "default" : "secondary"}>
                {status === 'syncing' ? 'Syncing' : isCloudEnabled ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {isCloudEnabled && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleSync}
                disabled={isSyncing || status === 'syncing'}
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            )}
          </div>

          {/* Data & Privacy Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {mode === 'BS' ? 'डाटा र गोपनीयता' : 'Data & Privacy'}
            </h3>

            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {/* Encrypted Local Storage */}
              <div className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Encrypted Local Storage</h4>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Your calendar data is encrypted and stored securely on your device using SQLite.
                  </p>
                </div>
              </div>

              {/* Optional Cloud Backup */}
              <div className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                  <Cloud className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Optional Cloud Backup</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Sync your events across devices with end-to-end encryption.
                      </p>
                    </div>
                    <Switch 
                      checked={isCloudEnabled}
                      onCheckedChange={setCloudEnabled}
                    />
                  </div>
                  {!isCloudEnabled && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/50 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Enable cloud backup to sync your {pendingChanges} pending changes and access your calendar from any device.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Device Storage */}
              <div className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 mt-0.5">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Device Storage</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Using local SQLite database for fast, offline-first performance.
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      This device
                    </span>
                    <span>~2.4 MB used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {mode === 'BS' ? 'सुरक्षा' : 'Security'}
            </h3>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-500/10 mt-0.5">
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Privacy Protected</h4>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      AES-256 encryption at rest
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      No third-party data sharing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      End-to-end encrypted sync
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Backup to Cloud Button */}
          {!isCloudEnabled && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setCloudEnabled(true)}
            >
              <Cloud className="w-4 h-4 mr-2" />
              Enable Cloud Backup
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
