import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContextObject';
import { api, getToken, setToken, clearToken } from '../api/client';

// The server sends `name`; components read `displayName`.
const withDisplayName = (u) => (u ? { ...u, displayName: u.name } : null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(getToken()));

    // Load the current user once on start when a token exists.
    useEffect(() => {
        if (!getToken()) return undefined;
        let cancelled = false;
        api.get('/me')
            .then((data) => { if (!cancelled) setUser(withDisplayName(data.user)); })
            .catch((err) => { if (err.status === 401) clearToken(); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const startSession = useCallback((data) => {
        setToken(data.token);
        const next = withDisplayName(data.user);
        setUser(next);
        return next;
    }, []);

    const signIn = useCallback(
        async (email, password) => startSession(await api.post('/auth/signin', { email, password })),
        [startSession],
    );

    const signUp = useCallback(
        async (name, email, password) => startSession(await api.post('/auth/signup', { name, email, password })),
        [startSession],
    );

    const signOut = useCallback(async () => {
        try {
            await api.post('/auth/signout');
        } catch {
            // The token may already be invalid; signing out locally is enough.
        }
        clearToken();
        setUser(null);
    }, []);

    // Merge new profile data (e.g. the user returned by PATCH /api/me) into the current user.
    const updateUser = useCallback((patch) => {
        setUser((prev) => (prev ? withDisplayName({ ...prev, ...patch }) : prev));
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const data = await api.get('/me');
            setUser(withDisplayName(data.user));
        } catch (err) {
            if (err.status === 401) {
                clearToken();
                setUser(null);
            }
        }
    }, []);

    const value = useMemo(
        () => ({ user, loading, signIn, signUp, signOut, updateUser, refreshUser }),
        [user, loading, signIn, signUp, signOut, updateUser, refreshUser],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
