import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Leaf, TrendingUp, ArrowRight, ExternalLink, Trash2, User, Settings, Shield } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useTripContext } from '../context/useTripContext';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';
import StatusNote from '../components/StatusNote';
import { trips as catalogue } from '../data/trips';
import { ecoLevel, isValidUrl } from '../utils/ecoScore';
import { ecoTone } from '../utils/ecoTone';
import './Dashboard.css';

const TABS = [
    { id: 'trips', label: 'My trips' },
    { id: 'impact', label: 'Eco-impact summary' },
    { id: 'settings', label: 'Account settings' },
];

const formatDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

// Booking page for a saved catalogue trip, when the catalogue has a valid link for it.
const bookingUrl = (saved) => {
    if (saved.kind !== 'trip') return null;
    const url = catalogue.find((t) => t.id === saved.tripId)?.sourceUrl;
    return isValidUrl(url) ? url.trim() : null;
};

function Dashboard() {
    const [activeTab, setActiveTab] = useState('trips');
    const [stats, setStats] = useState(null);
    const [statsError, setStatsError] = useState(false);
    const [removeError, setRemoveError] = useState('');
    const { user } = useAuth();
    const { savedTrips, loading, removeSavedTrip } = useTripContext();

    // Reload the stats whenever the saved trips change (a trip was removed, etc.).
    useEffect(() => {
        let cancelled = false;
        api.get('/stats')
            .then((data) => { if (!cancelled) { setStats(data); setStatsError(false); } })
            .catch(() => { if (!cancelled) setStatsError(true); });
        return () => { cancelled = true; };
    }, [savedTrips]);

    const statCards = [
        { key: 'saved', label: 'Saved trips', value: stats?.savedTrips, icon: MapPin, tone: '' },
        { key: 'eco', label: 'Eco-friendly trips', value: stats?.ecoFriendlyTrips, icon: Leaf, tone: 'icon-chip--success' },
        { key: 'score', label: 'Average eco score', value: stats?.averageEcoScore, icon: TrendingUp, tone: 'icon-chip--info' },
    ];

    const onTabKeyDown = (e) => {
        const index = TABS.findIndex((t) => t.id === activeTab);
        let next = null;
        if (e.key === 'ArrowRight') next = (index + 1) % TABS.length;
        if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = TABS.length - 1;
        if (next === null) return;
        e.preventDefault();
        setActiveTab(TABS[next].id);
        document.getElementById(`dash-tab-${TABS[next].id}`)?.focus();
    };

    const handleRemove = async (id) => {
        setRemoveError('');
        try {
            await removeSavedTrip(id);
        } catch (err) {
            setRemoveError(`Could not remove that trip. ${err.message}`);
        }
    };

    // Figures for the impact tab come from the saved trips themselves.
    const scored = [...savedTrips].sort((a, b) => b.eco.total - a.eco.total);
    const best = scored[0];
    const weakest = scored[scored.length - 1];
    const average = scored.length ? Math.round(scored.reduce((sum, t) => sum + t.eco.total, 0) / scored.length) : null;
    const ecoCount = scored.filter((t) => t.eco.total >= 60).length;

    return (
        <div className="container page">
            <PageHeader
                eyebrow="My dashboard"
                title={`Welcome back, ${user.displayName}`}
                subtitle="Your saved trips, eco impact and account in one place."
                actions={(
                    <Link to="/plan" className="btn btn--primary">
                        Plan a trip <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                    </Link>
                )}
            />

            <section aria-label="Your stats">
                <ul className="dash-stats" role="list">
                    {statCards.map(({ key, label, value, icon, tone }) => {
                        const Icon = icon;
                        return (
                            <li key={key} className="card dash-stat">
                                <span className={`icon-chip dash-stat-icon ${tone}`} aria-hidden="true"><Icon size={20} /></span>
                                <p className="dash-stat-value">{value ?? '—'}</p>
                                <p className="dash-stat-label">{label}</p>
                                {value === null && <p className="field__hint">Save a trip to see this</p>}
                            </li>
                        );
                    })}
                </ul>
                {statsError && <StatusNote tone="warning">Could not load your stats right now.</StatusNote>}
            </section>

            <section className="card dash-panel-card" aria-label="Dashboard sections">
                <div className="tabs" role="tablist" aria-label="Dashboard sections" onKeyDown={onTabKeyDown}>
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            id={`dash-tab-${t.id}`}
                            type="button"
                            role="tab"
                            className="tabs__tab"
                            aria-selected={activeTab === t.id}
                            aria-controls={`dash-panel-${t.id}`}
                            tabIndex={activeTab === t.id ? 0 : -1}
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div
                    id={`dash-panel-${activeTab}`}
                    role="tabpanel"
                    aria-labelledby={`dash-tab-${activeTab}`}
                    className="dash-panel"
                    tabIndex={0}
                >
                    {activeTab === 'trips' && (
                        loading ? (
                            <p className="field__hint" role="status">Loading your trips…</p>
                        ) : savedTrips.length === 0 ? (
                            <div className="empty-state">
                                <span className="icon-chip icon-chip--lg icon-chip--neutral" aria-hidden="true"><MapPin size={28} /></span>
                                <h2 className="empty-state__title">No saved trips yet</h2>
                                <p className="empty-state__text">Save a plan from Plan Trip, or tap the heart on a package in Explore Trips, and it will show up here.</p>
                                <Link to="/plan" className="btn btn--primary">Plan your first trip</Link>
                            </div>
                        ) : (
                            <>
                                {removeError && <StatusNote tone="danger">{removeError}</StatusNote>}
                                <ul className="dash-trip-list" role="list">
                                    {savedTrips.map((t) => {
                                        const url = bookingUrl(t);
                                        return (
                                            <li key={t.id} className="dash-trip">
                                                <div className="dash-trip-main">
                                                    <h3 className="dash-trip-title">{t.title}</h3>
                                                    <p className="dash-trip-meta">
                                                        <MapPin size={14} aria-hidden="true" /> {t.destination}
                                                        <span className="badge badge--outline">{t.kind === 'trip' ? 'Package' : 'Smart plan'}</span>
                                                        <span className={`badge badge--${ecoTone(ecoLevel(t.eco.total))}`}>
                                                            <Leaf size={12} aria-hidden="true" /> {t.eco.total}/100 · {t.eco.rating}
                                                        </span>
                                                    </p>
                                                    <p className="dash-trip-date">Saved {formatDate(t.createdAt)}</p>
                                                </div>
                                                <div className="dash-trip-actions">
                                                    {url && (
                                                        <a className="btn btn--secondary btn--sm" href={url} target="_blank" rel="noopener noreferrer">
                                                            Open booking page <ExternalLink size={14} aria-hidden="true" />
                                                            <span className="visually-hidden">(opens in a new tab)</span>
                                                        </a>
                                                    )}
                                                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => handleRemove(t.id)}>
                                                        <Trash2 size={16} aria-hidden="true" /> Remove
                                                        <span className="visually-hidden"> {t.title}</span>
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        )
                    )}

                    {activeTab === 'impact' && (
                        savedTrips.length === 0 ? (
                            <div className="empty-state">
                                <span className="icon-chip icon-chip--lg icon-chip--success" aria-hidden="true"><Leaf size={28} /></span>
                                <h2 className="empty-state__title">No eco figures yet</h2>
                                <p className="empty-state__text">Save a trip and its eco score will be summarised here. You can also score any trip with the calculator.</p>
                                <Link to="/eco" className="btn btn--secondary">Open Eco Insights</Link>
                            </div>
                        ) : (
                            <dl className="dash-impact">
                                <div className="card card--sunken"><dt>Average eco score</dt><dd>{average}/100</dd></div>
                                <div className="card card--sunken"><dt>Trips scoring 60 or higher</dt><dd>{ecoCount} of {scored.length}</dd></div>
                                <div className="card card--sunken"><dt>Best trip</dt><dd>{best.title} <span className="dash-impact-score">{best.eco.total}/100</span></dd></div>
                                <div className="card card--sunken"><dt>Weakest trip</dt><dd>{weakest.title} <span className="dash-impact-score">{weakest.eco.total}/100</span></dd></div>
                            </dl>
                        )
                    )}

                    {activeTab === 'settings' && (
                        <div className="dash-account">
                            <h2 className="dash-legend"><User size={18} aria-hidden="true" /> Your profile</h2>
                            <dl className="dash-impact">
                                <div><dt>Name</dt><dd>{user.name}</dd></div>
                                <div><dt>Email</dt><dd>{user.email}</dd></div>
                                <div><dt>Phone</dt><dd>{user.phone || 'Not set'}</dd></div>
                                <div><dt>Location</dt><dd>{user.location || 'Not set'}</dd></div>
                            </dl>
                            <div className="dash-settings-actions">
                                <Link to="/account-settings" className="btn btn--primary"><Settings size={18} aria-hidden="true" /> Account settings</Link>
                                <Link to="/privacy-security" className="btn btn--secondary"><Shield size={18} aria-hidden="true" /> Privacy &amp; security</Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
