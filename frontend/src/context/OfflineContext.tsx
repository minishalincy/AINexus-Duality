'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getQueue, removeRequest, updateRequest } from '@/lib/offline-sync';
import { WifiOff } from 'lucide-react';

interface OfflineContextType {
    isOnline: boolean;
    isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType>({
    isOnline: true,
    isSyncing: false,
});

export const useOffline = () => useContext(OfflineContext);

export const OfflineProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    const syncQueue = useCallback(async () => {
        if (isSyncing) return;
        setIsSyncing(true);
        console.log('Starting sync...');

        try {
            const queue = await getQueue();
            if (queue.length === 0) {
                console.log('Queue empty.');
                setIsSyncing(false);
                return;
            }

            // Sort by timestamp to preserve order
            queue.sort((a, b) => a.timestamp - b.timestamp);

            for (const req of queue) {
                if (!req.id) continue;

                console.log(`Replaying request: ${req.method} ${req.url}`);
                try {
                    const response = await fetch(req.url, {
                        method: req.method,
                        headers: req.headers,
                        body: JSON.stringify(req.body),
                    });

                    if (response.ok) {
                        // Smart Sync: Update subsequent requests if this was a temp creation
                        if (req.tempId) {
                            try {
                                const data = await response.clone().json();
                                if (data.id) {
                                    const realId = data.id;
                                    console.log(`Smart Sync: Replacing ${req.tempId} with ${realId}`);
                                    for (const item of queue) {
                                        if (item.id === req.id) continue;
                                        if (item.url.includes(req.tempId)) {
                                            const newUrl = item.url.replace(req.tempId, realId);
                                            if (item.id) {
                                                await updateRequest(item.id, { url: newUrl });
                                                item.url = newUrl;
                                            }
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error('Smart Sync error:', e);
                            }
                        }

                        await removeRequest(req.id);
                        console.log('Request synced successfully.');
                    } else {
                        console.error('Failed to sync request:', response.statusText);
                        // If it's a 4xx error, maybe we should discard it? 
                    }
                } catch (err) {
                    console.error('Network error during sync:', err);
                }
            }
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setIsSyncing(false);
        }
    }, [isSyncing]);

    useEffect(() => {
        // Initial check
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            syncQueue();
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [syncQueue]);

    return (
        <OfflineContext.Provider value={{ isOnline, isSyncing }}>
            {children}
            {!isOnline && (
                <div className="fixed bottom-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5">
                    <WifiOff size={20} />
                    <span className="text-sm font-medium">You are offline. Changes will sync when online.</span>
                </div>
            )}
        </OfflineContext.Provider>
    );
};
