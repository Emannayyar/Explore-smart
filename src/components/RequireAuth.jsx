import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Loading() {
    return <p className="auth-loading" role="status">Loading…</p>;
}

// Layout-route guard: signed-out visitors go to /signin and come back afterwards.
export function RequireAuth() {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) return <Loading />;
    if (!user) return <Navigate to="/signin" replace state={{ from: location }} />;
    return <Outlet />;
}

// For /signin and /signup: signed-in users go straight to /home.
export function PublicOnly({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) return <Loading />;
    if (user) return <Navigate to={location.state?.from?.pathname || '/home'} replace />;
    return children;
}
