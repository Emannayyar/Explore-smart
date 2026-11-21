import { Link } from 'react-router-dom';
import './Brand.css';

export function BrandMark({ size = 36 }) {
    return (
        <svg className="brand-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
            <rect className="brand-mark__tile" width="40" height="40" rx="11" />
            <circle className="brand-mark__sun" cx="27.5" cy="12.5" r="3.75" />
            <path className="brand-mark__peak" d="M5 31 L15.5 15 L21 23 L24.75 18 L35 31 Z" />
        </svg>
    );
}

function Brand({ to = '/home', tagline = true, onPhoto = false, onClick }) {
    return (
        <Link to={to} className={onPhoto ? 'brand brand--on-photo' : 'brand'} onClick={onClick}>
            <BrandMark />
            <span className="brand__text">
                <span className="brand__name">ExploreSmart</span>
                {tagline && <span className="brand__tagline">Trip planner · Northern Pakistan</span>}
            </span>
        </Link>
    );
}

export default Brand;
