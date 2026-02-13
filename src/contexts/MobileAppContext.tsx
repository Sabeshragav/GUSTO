"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface MobileAppContextType {
    activeApp: string | null;
    activeAppData: unknown;
    recentApps: string[];
    persistedStates: Record<string, any>;

    openApp: (appId: string, data?: unknown) => void;
    goHome: () => void;
    closeApp: (appId: string) => void;

    getPersistedState: (appId: string) => any;
    setPersistedState: (appId: string, state: any) => void;
}

export const MobileAppContext = createContext<MobileAppContextType | undefined>(undefined);

export function MobileAppProvider({ children }: { children: ReactNode }) {
    const [activeApp, setActiveApp] = useState<string | null>(null);
    const [activeAppData, setActiveAppData] = useState<unknown>(undefined);
    const [recentApps, setRecentApps] = useState<string[]>([]);
    const [persistedStates, setPersistedStates] = useState<Record<string, any>>({});

    const addToRecents = useCallback((appId: string) => {
        setRecentApps(prev => {
            const filtered = prev.filter(id => id !== appId);
            return [appId, ...filtered].slice(0, 8);
        });
    }, []);

    const getPersistedState = useCallback((appId: string) => {
        return persistedStates[appId];
    }, [persistedStates]);

    const setPersistedState = useCallback((appId: string, state: any) => {
        setPersistedStates(prev => ({ ...prev, [appId]: state }));
    }, []);

    const openApp = useCallback((appId: string, data?: unknown) => {
        setActiveApp(appId);
        setActiveAppData(data);
        addToRecents(appId);
    }, [addToRecents]);

    const goHome = useCallback(() => {
        setActiveApp(null);
    }, []);

    const closeApp = useCallback((appId: string) => {
        if (activeApp === appId) setActiveApp(null);
        setRecentApps(prev => prev.filter(id => id !== appId));
        setPersistedStates(prev => {
            const next = { ...prev };
            delete next[appId];
            return next;
        });
    }, [activeApp]);

    return (
        <MobileAppContext.Provider value={{
            activeApp, activeAppData, recentApps, persistedStates,
            openApp, goHome, closeApp,
            getPersistedState, setPersistedState,
        }}>
            {children}
        </MobileAppContext.Provider>
    );
}

export function useMobileApp() {
    const ctx = useContext(MobileAppContext);
    if (!ctx) throw new Error("useMobileApp must be used within MobileAppProvider");
    return ctx;
}
