import { CheckCircle2 } from 'lucide-react';
import Brand from '../components/Brand';
import { trips } from '../data/trips';
import './Auth.css';

const POINTS = [
    'Trip plans with a 100-point eco score',
    `${trips.length} curated packages across northern Pakistan`,
    'Seasonal weather guidance and safety tips',
];

// Shared split layout for Sign In and Sign Up.
function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <div className="auth">
            <a className="skip-link" href="#main">Skip to content</a>
            <aside className="photo-hero auth-visual">
                <img className="photo-hero__media" srcSet="/assets/passu-cones-1280.jpg 1280w, /assets/passu-cones-2400.jpg 2400w" sizes="(min-width: 900px) 50vw, 100vw" src="/assets/passu-cones-2400.jpg" alt="" />
                <div className="photo-hero__scrim" />
                <Brand to="/" onPhoto />
                <div className="auth-visual-copy">
                    <p className="auth-visual-title">Discover Pakistan&rsquo;s <em>hidden gems</em></p>
                    <ul className="auth-visual-points" role="list">
                        {POINTS.map((p) => (
                            <li key={p}><CheckCircle2 size={18} aria-hidden="true" /> {p}</li>
                        ))}
                    </ul>
                </div>
            </aside>

            <main id="main" className="auth-main">
                <div className="auth-card">
                    <header className="auth-card-head">
                        <h1 className="auth-title">{title}</h1>
                        <p className="auth-subtitle">{subtitle}</p>
                    </header>
                    {children}
                    <p className="auth-footer">{footer}</p>
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;
