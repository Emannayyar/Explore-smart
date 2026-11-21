import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Shared page title block: optional back link, eyebrow, title, subtitle, actions.
function PageHeader({ title, subtitle, eyebrow, backTo, backLabel = 'Back to Home', actions, align = 'start' }) {
    return (
        <header className={align === 'center' ? 'page-header page-header--center' : 'page-header'}>
            <div className="page-header__text">
                {backTo && (
                    <Link to={backTo} className="page-header__back">
                        <ArrowLeft size={16} aria-hidden="true" /> {backLabel}
                    </Link>
                )}
                {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                <h1 className="page-header__title">{title}</h1>
                {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header__actions">{actions}</div>}
        </header>
    );
}

export default PageHeader;
