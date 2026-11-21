import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Map as MapIcon } from 'lucide-react';
import './NotFound.css';

function NotFound() {
    const { pathname } = useLocation();

    return (
        <div className="container page nf-page">
            <p className="nf-code" aria-hidden="true">404</p>
            <div className="nf-copy">
                <p className="eyebrow">Page not found</p>
                <h1 className="nf-title">This trail doesn&rsquo;t lead anywhere.</h1>
                <p className="nf-text">
                    We couldn&rsquo;t find <code className="nf-path">{pathname}</code>. It may have moved, or the link may be mistyped.
                </p>
                <div className="nf-actions">
                    <Link to="/home" className="btn btn--primary"><ArrowLeft size={18} aria-hidden="true" /> Back to Home</Link>
                    <Link to="/plan" className="btn btn--secondary"><MapIcon size={18} aria-hidden="true" /> Plan a trip</Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
