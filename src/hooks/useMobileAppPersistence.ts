import { useState, useEffect, useRef, useContext } from 'react';
import { MobileAppContext } from '../contexts/MobileAppContext';

export function useMobileAppPersistence<T>(appId: string, initialState: T) {
    const context = useContext(MobileAppContext);
    const getPersisted = context?.getPersistedState;
    const setPersisted = context?.setPersistedState;

    // Initialize state from context if available, else use initial
    const [state, setState] = useState<T>(() => {
        if (getPersisted) {
            const saved = getPersisted(appId);
            return saved !== undefined ? saved : initialState;
        }
        return initialState;
    });

    // Keep ref to latest state for cleanup function access
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Save state to context when component unmounts
    useEffect(() => {
        if (!setPersisted) return;
        return () => {
            setPersisted(appId, stateRef.current);
        };
    }, [appId, setPersisted]);

    return [state, setState] as const;
}
