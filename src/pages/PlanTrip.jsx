import { useEffect, useRef, useState } from 'react';
import {
    Sparkles, MapPin, Wallet, Users, Calendar, BedDouble, Bus, ArrowRight, ExternalLink, Leaf, Save, Check,
} from 'lucide-react';
import { useTripContext } from '../context/useTripContext';
import PageHeader from '../components/PageHeader';
import StatusNote from '../components/StatusNote';
import { trips } from '../data/trips';
import { DESTINATIONS } from '../data/destinations';
import { calculateEcoScore, ecoLevel, isValidUrl } from '../utils/ecoScore';
import { ecoTone, factorTone } from '../utils/ecoTone';
import './PlanTrip.css';

// Factor weights, read from the scoring module so this explainer never drifts from it.
const FACTORS = calculateEcoScore({}).breakdown.map(({ key, label, max }) => ({ key, label, max }));

function PlanTrip() {
    const { savePlan } = useTripContext();
    const [form, setForm] = useState({
        destination: '',
        budget: '',
        travelers: '',
        duration: '',
        accommodation: 'Hotel',
        transport: 'Bus',
    });
    const [formError, setFormError] = useState('');
    const [plan, setPlan] = useState(null);
    const [noticeId, setNoticeId] = useState(null);
    const [saveState, setSaveState] = useState({ phase: 'idle', message: '' });
    const resultRef = useRef(null);

    useEffect(() => {
        if (plan) resultRef.current?.focus();
    }, [plan]);

    const updateField = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (field === 'destination') setFormError('');
    };

    const handleSaveTrip = (e) => {
        e.preventDefault();
        if (!form.destination) {
            setFormError('Please select a destination to generate your plan.');
            return;
        }
        setFormError('');
        setNoticeId(null);
        setSaveState({ phase: 'idle', message: '' });
        setPlan({
            ...form,
            eco: calculateEcoScore({
                destination: form.destination,
                activities: [],
                groupSize: form.travelers,
                transport: form.transport,
                accommodation: form.accommodation,
            }),
        });
    };

    const handleSavePlan = async () => {
        const travelers = Number(plan.travelers);
        const duration = Number(plan.duration);
        if (!Number.isInteger(travelers) || travelers < 1 || travelers > 100
            || !Number.isInteger(duration) || duration < 1 || duration > 60) {
            setSaveState({ phase: 'error', message: 'Enter travelers (1-100) and duration (1-60 days), then generate the plan again to save it.' });
            return;
        }
        setSaveState({ phase: 'saving', message: '' });
        try {
            await savePlan({
                destination: plan.destination,
                budget: plan.budget.replace(/\D/g, ''),
                travelers,
                duration,
                accommodation: plan.accommodation,
                transport: plan.transport,
            });
            setSaveState({ phase: 'saved', message: 'Saved to your dashboard.' });
        } catch (err) {
            setSaveState({ phase: 'error', message: `Could not save this plan. ${err.message}` });
        }
    };

    const handleOpenTrip = (trip) => {
        if (isValidUrl(trip.sourceUrl)) {
            setNoticeId(null);
            window.open(trip.sourceUrl, '_blank', 'noopener,noreferrer');
        } else {
            setNoticeId(trip.id);
        }
    };

    const recommended = plan
        ? [
            ...trips.filter((t) => t.destination === plan.destination),
            ...trips.filter((t) => t.destination !== plan.destination),
        ]
        : [];

    const planLevel = plan ? ecoLevel(plan.eco.total) : null;

    return (
        <div className="container page">
            <PageHeader
                eyebrow="Smart trip planning"
                title="Plan your perfect Pakistan adventure"
                subtitle="Tell us your preferences and get a plan summary with an eco score and packages that match."
            />

            <div className="plan-layout">
                <div className="plan-main">
                    <form className="card plan-form" onSubmit={handleSaveTrip} noValidate aria-labelledby="plan-form-title">
                        <div className="card__header">
                            <h2 id="plan-form-title" className="card__title">Trip details</h2>
                        </div>

                        <div className="form-grid">
                            <div className="field plan-field-wide">
                                <label htmlFor="plan-destination" className="field__label"><MapPin size={16} aria-hidden="true" /> Destination</label>
                                <select
                                    id="plan-destination"
                                    className="select"
                                    value={form.destination}
                                    onChange={updateField('destination')}
                                    required
                                    aria-invalid={formError ? true : undefined}
                                    aria-describedby={formError ? 'plan-destination-error' : undefined}
                                >
                                    <option value="">Select your destination</option>
                                    {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {formError && <p id="plan-destination-error" className="field__error" role="alert">{formError}</p>}
                            </div>

                            <div className="field">
                                <label htmlFor="plan-budget" className="field__label"><Wallet size={16} aria-hidden="true" /> Budget (PKR)</label>
                                <input id="plan-budget" type="text" inputMode="numeric" placeholder="e.g. 50,000" className="input" value={form.budget} onChange={updateField('budget')} />
                            </div>

                            <div className="field">
                                <label htmlFor="plan-travelers" className="field__label"><Users size={16} aria-hidden="true" /> Number of travelers</label>
                                <input id="plan-travelers" type="text" inputMode="numeric" placeholder="e.g. 2" className="input" value={form.travelers} onChange={updateField('travelers')} />
                            </div>

                            <div className="field">
                                <label htmlFor="plan-duration" className="field__label"><Calendar size={16} aria-hidden="true" /> Trip duration (days)</label>
                                <input id="plan-duration" type="text" inputMode="numeric" placeholder="e.g. 5" className="input" value={form.duration} onChange={updateField('duration')} />
                            </div>

                            <div className="field">
                                <label htmlFor="plan-accommodation" className="field__label"><BedDouble size={16} aria-hidden="true" /> Accommodation</label>
                                <select id="plan-accommodation" className="select" value={form.accommodation} onChange={updateField('accommodation')}>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Camping">Camping</option>
                                    <option value="Guest House">Guest House</option>
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="plan-transport" className="field__label"><Bus size={16} aria-hidden="true" /> Transport</label>
                                <select id="plan-transport" className="select" value={form.transport} onChange={updateField('transport')}>
                                    <option value="Bus">Bus</option>
                                    <option value="Coaster">Coaster</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn--primary btn--lg plan-submit">
                            <Sparkles size={18} aria-hidden="true" /> Generate smart plan
                            <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                        </button>
                    </form>

                    {plan && (
                        <section ref={resultRef} tabIndex={-1} className="card plan-result" aria-labelledby="plan-result-title">
                            <div className="plan-result-head">
                                <div>
                                    <p className="eyebrow">Your smart plan</p>
                                    <h2 id="plan-result-title" className="plan-result-title">{plan.destination}</h2>
                                </div>
                                <div className="plan-score">
                                    <p className="plan-score-total">{plan.eco.total}<span>/100</span></p>
                                    <span className={`badge badge--${ecoTone(planLevel)}`}><Leaf size={12} aria-hidden="true" /> {plan.eco.rating}</span>
                                </div>
                            </div>

                            <dl className="plan-summary">
                                <div><dt>Budget (PKR)</dt><dd>{plan.budget || 'Not specified'}</dd></div>
                                <div><dt>Travelers</dt><dd>{plan.travelers || 'Not specified'}</dd></div>
                                <div><dt>Duration</dt><dd>{plan.duration ? `${plan.duration} days` : 'Not specified'}</dd></div>
                                <div><dt>Accommodation</dt><dd>{plan.accommodation}</dd></div>
                                <div><dt>Transport</dt><dd>{plan.transport}</dd></div>
                            </dl>

                            <h3 className="plan-subheading">Eco score breakdown</h3>
                            <ul className="plan-breakdown" role="list">
                                {plan.eco.breakdown.map((b) => (
                                    <li key={b.key} className="plan-breakdown-row">
                                        <span className="plan-breakdown-label">{b.label}</span>
                                        <div className="meter plan-breakdown-meter" role="img" aria-label={`${b.label}: ${b.score} of ${b.max}`}>
                                            <div className={`meter__fill meter__fill--${factorTone(b.score, b.max)}`} style={{ width: `${(b.score / b.max) * 100}%` }} />
                                        </div>
                                        <span className="plan-breakdown-value">{b.score}/{b.max}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="plan-explanation">{plan.eco.explanation}</p>

                            <div className="plan-save">
                                <button
                                    type="button"
                                    className="btn btn--secondary"
                                    onClick={handleSavePlan}
                                    disabled={saveState.phase === 'saving' || saveState.phase === 'saved'}
                                >
                                    {saveState.phase === 'saved'
                                        ? <><Check size={18} aria-hidden="true" /> Saved</>
                                        : <><Save size={18} aria-hidden="true" /> {saveState.phase === 'saving' ? 'Saving…' : 'Save to dashboard'}</>}
                                </button>
                                {saveState.message && (
                                    <StatusNote tone={saveState.phase === 'saved' ? 'success' : 'danger'}>{saveState.message}</StatusNote>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="plan-side" aria-label="Recommendations and scoring">
                    {plan && (
                        <section className="card" aria-labelledby="plan-recs-title">
                            <div className="card__header">
                                <h2 id="plan-recs-title" className="card__title">Recommended trips</h2>
                            </div>
                            <ul className="plan-rec-list" role="list">
                                {recommended.map((trip) => {
                                    const eco = calculateEcoScore(trip);
                                    return (
                                        <li key={trip.id}>
                                            <button type="button" className="plan-rec" onClick={() => handleOpenTrip(trip)}>
                                                <img src={trip.image} alt="" className="plan-rec-img" />
                                                <span className="plan-rec-info">
                                                    <span className="plan-rec-title">{trip.title}</span>
                                                    <span className="plan-rec-loc"><MapPin size={12} aria-hidden="true" /> {trip.location}</span>
                                                    <span className="plan-rec-meta">
                                                        <span>PKR {trip.price}</span>
                                                        <span className={`badge badge--${ecoTone(ecoLevel(eco.total))}`}>Eco {eco.total}/100</span>
                                                    </span>
                                                </span>
                                                <ExternalLink size={16} className="plan-rec-icon" aria-hidden="true" />
                                                <span className="visually-hidden">(opens the operator&rsquo;s site in a new tab)</span>
                                            </button>
                                            {noticeId === trip.id && (
                                                <p className="field__error plan-rec-notice" role="status">Booking link not available for this trip yet.</p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )}

                    <section className="card card--sunken" aria-labelledby="plan-explainer-title">
                        <div className="card__header">
                            <span className="icon-chip" aria-hidden="true"><Leaf size={18} /></span>
                            <h2 id="plan-explainer-title" className="card__title">How the eco score works</h2>
                        </div>
                        <p className="plan-explainer-text">Every plan is scored out of 100 across five factors:</p>
                        <ul className="plan-factor-list" role="list">
                            {FACTORS.map((f) => (
                                <li key={f.key}><span>{f.label}</span><strong>{f.max} pts</strong></li>
                            ))}
                        </ul>
                        <p className="plan-explainer-text">Shared transport, camping or shared rooms and larger groups score higher.</p>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default PlanTrip;
