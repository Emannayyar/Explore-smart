import { useEffect, useState } from 'react';
import {
    CloudSun, AlertTriangle, Sun, Cloud, CloudFog, CloudRain, CloudLightning, Snowflake, Calendar, MapPin, CheckCircle2,
    ShieldCheck, RefreshCw,
} from 'lucide-react';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';
import StatusNote from '../components/StatusNote';
import './Weather.css';

const ICONS = { clear: Sun, cloudy: Cloud, fog: CloudFog, rain: CloudRain, snow: Snowflake, storm: CloudLightning };

// Simple advisory for one destination from its live reading, or null when nothing stands out.
function advisoryFor(d) {
    const reasons = [];
    if (d.category === 'snow') reasons.push('snowfall');
    if (d.category === 'storm') reasons.push('thunderstorms');
    if (d.category === 'rain') reasons.push('rain');
    if (d.windKmh >= 40) reasons.push(`strong wind (${Math.round(d.windKmh)} km/h)`);
    if (d.uvIndex !== null && d.uvIndex >= 8) reasons.push(`very high UV (${d.uvIndex})`);
    if (reasons.length === 0) return null;
    return `${d.name}: caution, ${reasons.join(' and ')}. Check road and trail conditions before you set out.`;
}

const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const SEASONS = [
    { name: 'Spring', months: 'March - May', temp: '15-25°C', condition: 'Pleasant and blooming', rating: 'Excellent', tone: 'success', activities: ['Hiking', 'Sightseeing', 'Photography', 'Valley tours'] },
    { name: 'Summer', months: 'June - August', temp: '20-35°C', condition: 'Warm and sunny', rating: 'Good', tone: 'info', activities: ['Mountain treks', 'Lake visits', 'Camping', 'Adventure sports'] },
    { name: 'Autumn', months: 'September - November', temp: '10-20°C', condition: 'Cool and colourful', rating: 'Excellent', tone: 'success', activities: ['Scenic drives', 'Cultural tours', 'Photography', 'Trekking'] },
    { name: 'Winter', months: 'December - February', temp: '-5 to 10°C', condition: 'Cold and snowy', rating: 'Fair', tone: 'warning', activities: ['Snow activities', 'Skiing', 'Winter sports', 'Hot springs'] },
];

const ALL = 'all';

function Weather() {
    const [destination, setDestination] = useState(ALL);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        api.get('/weather')
            .then((res) => { if (!cancelled) { setData(res); setError(''); } })
            .catch((err) => {
                if (cancelled) return;
                setData(null);
                setError(err.status === 503
                    ? 'The weather service is unavailable right now. Please try again in a few minutes.'
                    : `Could not load the weather. ${err.message}`);
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [attempt]);

    const retry = () => {
        setLoading(true);
        setAttempt((n) => n + 1);
    };

    const all = data?.destinations ?? [];
    const cards = destination === ALL ? all : all.filter((d) => d.name === destination);
    const advisories = all.map(advisoryFor).filter(Boolean);

    return (
        <div className="container page">
            <PageHeader
                eyebrow="Weather and safety"
                title="Weather & safety alerts"
                subtitle="Current conditions for popular destinations and general seasonal guidance, to help you choose when to go."
            />

            {advisories.length > 0 && (
                <section className="wx-section" aria-labelledby="wx-alerts-title">
                    <h2 id="wx-alerts-title" className="visually-hidden">Advisories</h2>
                    <ul className="wx-alerts" role="list">
                        {advisories.map((text) => (
                            <li key={text} className="wx-alert wx-alert--warning">
                                <AlertTriangle size={20} aria-hidden="true" />
                                <div><p>{text}</p></div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="wx-section" aria-labelledby="wx-current-title">
                <div className="section-head">
                    <h2 id="wx-current-title" className="section-head__title">
                        <span className="icon-chip icon-chip--info" aria-hidden="true"><CloudSun size={18} /></span>
                        Conditions by destination
                    </h2>
                    <div className="field wx-filter">
                        <label htmlFor="wx-destination" className="field__label"><MapPin size={16} aria-hidden="true" /> Destination</label>
                        <select id="wx-destination" className="select" value={destination} onChange={(e) => setDestination(e.target.value)} disabled={all.length === 0}>
                            <option value={ALL}>All destinations</option>
                            {all.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>
                </div>

                {loading && (
                    <ul className="wx-grid" role="list" aria-busy="true" aria-label="Loading weather">
                        {[0, 1, 2].map((i) => <li key={i} className="card wx-skeleton" aria-hidden="true" />)}
                    </ul>
                )}

                {!loading && error && (
                    <div className="wx-error">
                        <StatusNote tone="danger">{error}</StatusNote>
                        <button type="button" className="btn btn--secondary" onClick={retry}>
                            <RefreshCw size={16} aria-hidden="true" /> Retry
                        </button>
                    </div>
                )}

                {!loading && data && (
                    <>
                        <p className="wx-updated">Updated {formatTime(data.updatedAt)} · Source: Open-Meteo</p>
                        <ul className="wx-grid" role="list">
                            {cards.map((d) => {
                                const Icon = ICONS[d.category] ?? Cloud;
                                const caution = advisoryFor(d) !== null;
                                return (
                                    <li key={d.name} className="card wx-card">
                                        <p className="wx-card-place"><MapPin size={14} aria-hidden="true" /> {d.name}</p>
                                        <div className="wx-card-temp">
                                            <span className="icon-chip icon-chip--info icon-chip--lg" aria-hidden="true"><Icon size={28} /></span>
                                            <div>
                                                <p className="wx-temp">{Math.round(d.temperatureC)}°C</p>
                                                <p className="text-muted">{d.condition}</p>
                                            </div>
                                        </div>
                                        <dl className="wx-details">
                                            <div><dt>Humidity</dt><dd>{d.humidity}%</dd></div>
                                            <div><dt>Wind speed</dt><dd>{Math.round(d.windKmh)} km/h</dd></div>
                                            <div><dt>UV index</dt><dd>{d.uvIndex ?? '—'}</dd></div>
                                        </dl>
                                        {caution ? (
                                            <span className="badge badge--warning"><AlertTriangle size={14} aria-hidden="true" /> Caution</span>
                                        ) : (
                                            <span className="badge badge--success"><CheckCircle2 size={14} aria-hidden="true" /> No advisories</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </section>

            <section className="wx-section" aria-labelledby="wx-season-title">
                <div className="section-head">
                    <h2 id="wx-season-title" className="section-head__title">
                        <span className="icon-chip" aria-hidden="true"><Calendar size={18} /></span>
                        Best season to visit <span className="badge badge--outline">General guidance</span>
                    </h2>
                </div>
                <ul className="wx-seasons" role="list">
                    {SEASONS.map((s) => (
                        <li key={s.name} className="card card--flush wx-season">
                            <div className="wx-season-head">
                                <h3 className="wx-season-name">{s.name}</h3>
                                <p className="text-muted">{s.months}</p>
                            </div>
                            <div className="wx-season-body">
                                <dl className="wx-details">
                                    <div><dt>Temperature</dt><dd>{s.temp}</dd></div>
                                    <div><dt>Condition</dt><dd>{s.condition}</dd></div>
                                </dl>
                                <span className={`badge badge--${s.tone}`}>{s.rating}</span>
                                <p className="wx-activities-label">Popular activities</p>
                                <ul className="wx-activities" role="list">
                                    {s.activities.map((act) => <li key={act} className="badge badge--outline">{act}</li>)}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="wx-tips" aria-labelledby="wx-tips-title">
                <h2 id="wx-tips-title" className="wx-tips-title"><ShieldCheck size={22} aria-hidden="true" /> Weather safety tips</h2>
                <div className="wx-tips-cols">
                    <div>
                        <h3 className="wx-tips-heading">Before your trip</h3>
                        <ul className="wx-tips-list">
                            <li>Check weather forecasts regularly</li>
                            <li>Pack appropriate clothing for the season</li>
                            <li>Plan flexible itineraries</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="wx-tips-heading">During your trip</h3>
                        <ul className="wx-tips-list">
                            <li>Follow local weather alerts and road updates</li>
                            <li>Follow local authority guidelines</li>
                            <li>Have emergency contacts ready</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Weather;
