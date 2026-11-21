import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, Compass, Leaf, CloudSun, Menu, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useDialogFocus } from '../hooks/useDialogFocus';
import Brand from './Brand';
import './TopNav.css';

const NAV_ITEMS = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/plan', label: 'Plan Trip', icon: Map },
    { to: '/explore', label: 'Explore Trips', icon: Compass },
    { to: '/eco', label: 'Eco Insights', icon: Leaf },
    { to: '/weather', label: 'Weather', icon: CloudSun },
];

const linkClass = ({ isActive }) => (isActive ? 'appnav-link appnav-link--active' : 'appnav-link');

function TopNav({ onOpenProfile, profileOpen }) {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const firstLinkRef = useRef(null);
    const closeMenu = () => setMenuOpen(false);
    useDialogFocus(menuOpen, firstLinkRef, closeMenu);

    const name = user?.displayName || '';
    const initial = name.charAt(0).toUpperCase();

    return (
        <header className="appnav">
            <div className="appnav-bar">
                <Brand />

                <nav className="appnav-links" aria-label="Main">
                    {NAV_ITEMS.map(({ to, label, icon }) => {
                        const Icon = icon;
                        return (
                            <NavLink key={to} to={to} className={linkClass}>
                                <Icon size={16} aria-hidden="true" /> {label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="appnav-actions">
                    <button
                        type="button"
                        className="appnav-profile"
                        onClick={onOpenProfile}
                        aria-haspopup="dialog"
                        aria-expanded={profileOpen}
                        aria-label={`Profile menu for ${name}`}
                    >
                        <span className="appnav-avatar" aria-hidden="true">{initial}</span>
                        <span className="appnav-profile-text">
                            <span className="appnav-profile-name">{name}</span>
                            <span className="appnav-profile-hint">View profile</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        className="appnav-menu-btn btn btn--secondary btn--icon"
                        onClick={() => setMenuOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={menuOpen}
                        aria-label="Open navigation menu"
                    >
                        <Menu size={20} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="appnav-scrim" data-open={menuOpen} onClick={closeMenu} aria-hidden="true" />
            <div
                className="appnav-drawer"
                data-open={menuOpen}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <div className="appnav-drawer-head">
                    <Brand tagline={false} onClick={closeMenu} />
                    <button type="button" className="btn btn--ghost btn--icon" onClick={closeMenu} aria-label="Close navigation menu">
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>
                <nav aria-label="Main">
                    <ul className="appnav-drawer-list" role="list">
                        {NAV_ITEMS.map(({ to, label, icon }, index) => {
                            const Icon = icon;
                            return (
                                <li key={to}>
                                    <NavLink
                                        to={to}
                                        className={linkClass}
                                        onClick={closeMenu}
                                        ref={index === 0 ? firstLinkRef : undefined}
                                    >
                                        <Icon size={18} aria-hidden="true" /> {label}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default TopNav;
