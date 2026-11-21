import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, LayoutDashboard, Settings, Bell, Shield, Palette, LifeBuoy, LogOut } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { api } from '../api/client';
import './ProfileSidebar.css';

const MENU = [
    { to: '/dashboard', label: 'My Dashboard', hint: 'Saved trips and eco impact', icon: LayoutDashboard },
    { to: '/account-settings', label: 'Account Settings', hint: 'Profile and travel preferences', icon: Settings },
    { to: '/notifications', label: 'Notifications', hint: 'Alerts and updates', icon: Bell },
    { to: '/privacy-security', label: 'Privacy & Security', hint: 'Password, data and permissions', icon: Shield },
    { to: '/appearance', label: 'Appearance', hint: 'Light, dark or automatic theme', icon: Palette },
    { to: '/contact-support', label: 'Contact Support', hint: 'Questions and help', icon: LifeBuoy },
];

const ProfileSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [unread, setUnread] = useState(0);
    const closeRef = useRef(null);
    useDialogFocus(isOpen, closeRef, onClose);

    // Refresh the unread count each time the panel opens.
    useEffect(() => {
        if (!isOpen) return undefined;
        let cancelled = false;
        api.get('/notifications')
            .then((data) => { if (!cancelled) setUnread(data.unread); })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [isOpen]);

    const name = user?.displayName || '';

    const handleLogout = () => {
        onClose();
        navigate('/');
        signOut();
    };

    return (
        <>
            <div className="profile-panel-scrim" data-open={isOpen} onClick={onClose} aria-hidden="true" />

            <aside
                className="profile-panel"
                data-open={isOpen}
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-panel-name"
            >
                <div className="profile-panel-head">
                    <button ref={closeRef} type="button" className="profile-panel-close btn btn--ghost btn--icon" onClick={onClose} aria-label="Close profile menu">
                        <X size={20} aria-hidden="true" />
                    </button>
                    <span className="profile-panel-avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
                    <h2 id="profile-panel-name" className="profile-panel-name">{name}</h2>
                    <p className="profile-panel-email">{user?.email}</p>
                </div>

                <nav className="profile-panel-nav" aria-label="Account">
                    <ul className="profile-panel-list" role="list">
                        {MENU.map(({ to, label, hint, icon }) => {
                            const Icon = icon;
                            return (
                                <li key={to}>
                                    <Link to={to} className="profile-panel-item" onClick={onClose}>
                                        <span className="icon-chip" aria-hidden="true"><Icon size={18} /></span>
                                        <span className="profile-panel-item-text">
                                            <span className="profile-panel-item-label">{label}</span>
                                            <span className="profile-panel-item-hint">{hint}</span>
                                        </span>
                                        {to === '/notifications' && unread > 0 && (
                                            <span className="badge badge--accent" aria-label={`${unread} unread`}>{unread}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="profile-panel-divider" />

                    <button type="button" className="profile-panel-item profile-panel-item--danger" onClick={handleLogout}>
                        <span className="icon-chip icon-chip--danger" aria-hidden="true"><LogOut size={18} /></span>
                        <span className="profile-panel-item-text">
                            <span className="profile-panel-item-label">Log out</span>
                            <span className="profile-panel-item-hint">Sign out of this device</span>
                        </span>
                    </button>
                </nav>

                <p className="profile-panel-footer">ExploreSmart v1.0 · Final Year Project</p>
            </aside>
        </>
    );
};

export default ProfileSidebar;
