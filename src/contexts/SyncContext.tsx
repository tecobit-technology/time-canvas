import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SyncStatus = 'online' | 'offline' | 'syncing' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: Date | null;
  isCloudEnabled: boolean;
  pendingChanges: number;
}

interface SyncContextValue extends SyncState {
  setCloudEnabled: (enabled: boolean) => void;
  triggerSync: () => Promise<void>;
  getLastSyncedText: () => string;
}

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export function useSyncStatus() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncStatus must be used within a SyncProvider');
  }
  return context;
}

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>('offline');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [isCloudEnabled, setIsCloudEnabled] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      if (isCloudEnabled) {
        setStatus('online');
      }
    };
    
    const handleOffline = () => {
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    if (!navigator.onLine) {
      setStatus('offline');
    } else if (isCloudEnabled) {
      setStatus('online');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isCloudEnabled]);

  const setCloudEnabled = useCallback((enabled: boolean) => {
    setIsCloudEnabled(enabled);
    if (enabled && navigator.onLine) {
      setStatus('online');
    } else if (!enabled) {
      setStatus('offline');
    }
  }, []);

  const triggerSync = useCallback(async () => {
    if (!isCloudEnabled || !navigator.onLine) {
      return;
    }

    setStatus('syncing');
    
    // Simulate sync operation (will be replaced with actual Supabase sync)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLastSyncedAt(new Date());
    setPendingChanges(0);
    setStatus('online');
  }, [isCloudEnabled]);

  const getLastSyncedText = useCallback(() => {
    if (!lastSyncedAt) {
      return 'Never synced';
    }

    const now = new Date();
    const diffMs = now.getTime() - lastSyncedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  }, [lastSyncedAt]);

  // Simulate some pending changes for demo
  useEffect(() => {
    if (!isCloudEnabled) {
      setPendingChanges(3); // Show pending changes when in local mode
    }
  }, [isCloudEnabled]);

  return (
    <SyncContext.Provider
      value={{
        status,
        lastSyncedAt,
        isCloudEnabled,
        pendingChanges,
        setCloudEnabled,
        triggerSync,
        getLastSyncedText,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}
