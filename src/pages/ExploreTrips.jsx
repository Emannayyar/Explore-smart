import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Heart, MapPin, Star, Calendar, Sun, CloudSun, Info, ArrowRight, X, Leaf, Map as MapIcon,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { useTripContext } from '../context/useTripContext';
import { trips } from '../data/trips';
import { calculateEcoScore, ecoLevel, isValidUrl } from '../utils/ecoScore';
import { ecoTone, factorTone } from '../utils/ecoTone';
import './ExploreTrips.css';

function ExploreTrips() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { savedTrips, isTripSaved, saveCatalogTrip, removeSavedTrip } = useTripContext();
    // notice: { id, kind: 'booking' | 'save', message } shown inline on one card
    const [notice, setNotice] = useState(null);
    const [detailTrip, setDetailTrip] = useState(null);
    const closeRef = useRef(null);
    useDialogFocus(Boolean(detailTrip), closeRef, () => setDetailTrip(null));

    const ecoOnly = searchParams.get('eco') === '1';
    const scored = trips.map((trip) => ({ trip, eco: calculateEcoScore(trip) }));
    const visible = ecoOnly ? scored.filter(({ eco }) => eco.total >= 60) : scored;

    const handleBook = (trip) => {
        if (isValidUrl(trip.sourceUrl)) {
            setNotice(null);
            window.open(trip.sourceUrl, '_blank', 'noopener,noreferrer');
        } else {
            setNotice({ id: trip.id, kind: 'booking' });
        }
    };

    // The heart toggles whether this catalogue trip is saved to the account.
    const handleSave = async (trip) => {
        setNotice(null);
        try {
            if (isTripSaved(trip.id)) {
                const record = savedTrips.find((t) => t.kind === 'trip' && t.tripId === trip.id);
                await removeSavedTrip(record.id);
            } else {
                await saveCatalogTrip(trip.id);
            }
        } catch (err) {
            setNotice({ id: trip.id, kind: 'save', message: `Could not update saved trips. ${err.message}` });
        }
    };

    const showAll = () => setSearchParams({});
    const detailEco = detailTrip ? calculateEcoScore(detailTrip) : null;

    return (
        <div className="container page">
            <PageHeader
                eyebrow="Explore trips"
                title="Recommended travel packages"
                subtitle="Compare curated packages across northern Pakistan. Every trip carries an eco score out of 100."
                actions={(
                    <Link to="/plan" className="btn btn--secondary">
                        <MapIcon size={18} aria-hidden="true" /> Plan a custom trip
                    </Link>
                )}
            />

            {ecoOnly && (
                <div className="explore-filter" role="status">
                    <span className="explore-filter-text"><Leaf size={16} aria-hidden="true" /> Showing eco-friendly trips only (eco score 60 or higher).</span>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={showAll}>Show all trips</button>
                </div>
            )}

            <ul className="explore-grid" role="list">
                {visible.map(({ trip: pkg, eco }) => {
                    const level = ecoLevel(eco.total);
                    const titleId = `explore-trip-${pkg.id}`;
                    return (
                        <li key={pkg.id} className="card card--flush explore-card">
                            <div className="explore-media">
                                <img src={pkg.image} alt="" className="explore-img" loading="lazy" />
                                <button
                                    type="button"
                                    className="explore-heart"
                                    onClick={() => handleSave(pkg)}
                                    aria-label={`Save ${pkg.title}`}
                                    aria-pressed={isTripSaved(pkg.id)}
                                >
                                    <Heart size={18} fill={isTripSaved(pkg.id) ? 'currentColor' : 'none'} aria-hidden="true" />
                                </button>
                                <span className={`badge badge--${ecoTone(level)} explore-eco`}>
                                    <Leaf size={12} aria-hidden="true" /> Eco: {level}
                                </span>
                            </div>

                            <div className="explore-body">
                                <h2 id={titleId} className="explore-title">{pkg.title}</h2>
                                <p className="explore-location"><MapPin size={14} aria-hidden="true" /> {pkg.location}</p>

                                <ul className="explore-stats" role="list">
                                    <li><Star size={14} className="explore-star" aria-hidden="true" /> <strong>{pkg.rating}</strong> <span className="text-muted">({pkg.reviews} reviews)</span></li>
                                    <li><Calendar size={14} aria-hidden="true" /> {pkg.duration}</li>
                                    <li>
                                        {pkg.weather === 'Excellent' ? <Sun size={14} aria-hidden="true" /> : <CloudSun size={14} aria-hidden="true" />}
                                        Weather: <strong>{pkg.weather}</strong>
                                    </li>
                                </ul>

                                <ul className="explore-tags" role="list" aria-label="Highlights">
                                    {pkg.tags.map((tag) => (
                                        <li key={tag} className="badge badge--outline">{tag}</li>
                                    ))}
                                </ul>

                                <div className="explore-footer">
                                    <p className="explore-price">
                                        <span className="explore-price-label">Starting from</span>
                                        <span className="explore-price-amount">PKR {pkg.price}</span>
                                    </p>
                                    <div className="explore-actions">
                                        <button type="button" className="btn btn--secondary btn--sm explore-action-btn" onClick={() => setDetailTrip(pkg)}>
                                            <Info size={16} aria-hidden="true" /> Eco details
                                        </button>
                                        <button type="button" className="btn btn--primary btn--sm explore-action-btn" onClick={() => handleBook(pkg)}>
                                            Book now <ArrowRight size={16} className="btn__arrow" aria-hidden="true" />
                                            <span className="visually-hidden">(opens the operator&rsquo;s site in a new tab)</span>
                                        </button>
                                    </div>
                                </div>

                                {notice?.id === pkg.id && notice.kind === 'booking' && (
                                    <p className="field__error" role="status">Booking link not available for this trip yet.</p>
                                )}
                                {notice?.id === pkg.id && notice.kind === 'save' && (
                                    <p className="field__error" role="status">{notice.message}</p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            <div className="explore-bottom">
                <Link to="/plan" className="btn btn--primary btn--lg">
                    Plan another trip <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                </Link>
            </div>

            {detailTrip && detailEco && (
                <div className="modal-backdrop" onClick={() => setDetailTrip(null)}>
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="explore-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button ref={closeRef} type="button" className="btn btn--ghost btn--icon modal__close" onClick={() => setDetailTrip(null)} aria-label="Close eco details">
                            <X size={20} aria-hidden="true" />
                        </button>
                        <p className="eyebrow">Eco details</p>
                        <h2 id="explore-modal-title" className="explore-modal-title">{detailTrip.title}</h2>

                        <div className="explore-modal-score">
                            <p className="explore-modal-total">{detailEco.total}<span>/100</span></p>
                            <span className={`badge badge--${ecoTone(ecoLevel(detailEco.total))}`}>{detailEco.rating}</span>
                        </div>

                        <ul className="explore-modal-breakdown" role="list">
                            {detailEco.breakdown.map((b) => (
                                <li key={b.key}>
                                    <span className="explore-modal-factor">{b.label}</span>
                                    <div className="meter" role="img" aria-label={`${b.label}: ${b.score} of ${b.max}`}>
                                        <div className={`meter__fill meter__fill--${factorTone(b.score, b.max)}`} style={{ width: `${(b.score / b.max) * 100}%` }} />
                                    </div>
                                    <strong>{b.score}/{b.max}</strong>
                                </li>
                            ))}
                        </ul>

                        <dl className="explore-modal-facts">
                            <div><dt>Destination</dt><dd>{detailTrip.destination}</dd></div>
                            <div><dt>Activities</dt><dd>{detailTrip.activities.join(', ')}</dd></div>
                            <div><dt>Group size</dt><dd>{detailTrip.groupSize}</dd></div>
                            <div><dt>Transport</dt><dd>{detailTrip.transport}</dd></div>
                            <div><dt>Accommodation</dt><dd>{detailTrip.accommodation}</dd></div>
                        </dl>
                        <p className="explore-modal-explanation">{detailEco.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExploreTrips;
