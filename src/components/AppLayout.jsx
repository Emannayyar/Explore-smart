import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopNav from './TopNav';
import ProfileSidebar from './ProfileSidebar';
import AIChatbot from './AIChatbot';
import './AppLayout.css';

// Shell for every in-app page: skip link, nav, main landmark, profile panel and trip guide (once).
function AppLayout() {
    const [profileOpen, setProfileOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Pages can open the trip guide via useOutletContext().openChat
    const outletContext = useMemo(() => ({ openChat: () => setChatOpen(true) }), []);

    return (
        <div className="app-shell">
            <a className="skip-link" href="#main">Skip to content</a>
            <TopNav onOpenProfile={() => setProfileOpen(true)} profileOpen={profileOpen} />

            <main id="main" className="app-shell-main" tabIndex={-1}>
                <Outlet context={outletContext} />
            </main>

            <footer className="app-shell-footer">
                <div className="container app-shell-footer-inner">
                    <p>ExploreSmart · Final Year Project</p>
                    <p>Trip packages shown here are sample data. Photos via Wikimedia Commons, CC BY-SA (<a href="/assets/CREDITS.md">credits</a>).</p>
                </div>
            </footer>

            <ProfileSidebar isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
            <AIChatbot open={chatOpen} onOpenChange={setChatOpen} />
        </div>
    );
}

export default AppLayout;
