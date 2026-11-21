import { useCallback, useEffect, useMemo, useState } from 'react';
import { TripContext } from './tripContextObject';
import { useAuth } from './useAuth';
import { api } from '../api/client';

// Saved trips for the signed-in user, kept in sync with the API.
export const TripProvider = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id;
    // Trips are tagged with the user they were loaded for, so a different user never sees stale data.
    const [store, setStore] = useState({ userId: null, trips: [] });
    const savedTrips = useMemo(() => (store.userId === userId ? store.trips : []), [store, userId]);
    const loading = Boolean(userId) && store.userId !== userId;

    const setTrips = useCallback((update) => {
        setStore((prev) => ({ ...prev, trips: update(prev.trips) }));
    }, []);

    const refresh = useCallback(async () => {
        const data = await api.get('/saved-trips');
        setStore({ userId, trips: data.savedTrips });
    }, [userId]);

    useEffect(() => {
        if (!userId) return undefined;
        let cancelled = false;
        api.get('/saved-trips')
            .then((data) => { if (!cancelled) setStore({ userId, trips: data.savedTrips }); })
            .catch(() => { if (!cancelled) setStore({ userId, trips: [] }); });
        return () => { cancelled = true; };
    }, [userId]);

    const add = useCallback(async (body) => {
        const data = await api.post('/saved-trips', body);
        setTrips((prev) => (prev.some((t) => t.id === data.savedTrip.id) ? prev : [data.savedTrip, ...prev]));
        return data.savedTrip;
    }, [setTrips]);

    const savePlan = useCallback((plan) => add({ kind: 'plan', ...plan }), [add]);
    const saveCatalogTrip = useCallback((tripId) => add({ kind: 'trip', tripId }), [add]);

    const removeSavedTrip = useCallback(async (id) => {
        await api.del(`/saved-trips/${id}`);
        setTrips((prev) => prev.filter((t) => t.id !== id));
    }, [setTrips]);

    const isTripSaved = useCallback(
        (tripId) => savedTrips.some((t) => t.kind === 'trip' && t.tripId === tripId),
        [savedTrips],
    );

    const value = useMemo(
        () => ({ savedTrips, loading, savePlan, saveCatalogTrip, removeSavedTrip, isTripSaved, refresh }),
        [savedTrips, loading, savePlan, saveCatalogTrip, removeSavedTrip, isTripSaved, refresh],
    );

    return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
