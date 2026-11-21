import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Mountain, Leaf, CloudSun, MapPin, Users, Clock, Bus, Car, Building2, Tent, Home as HouseIcon,
    AlertTriangle, CheckCircle2, Zap, ArrowRight, Info,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { DESTINATIONS } from '../data/destinations';
import { calculateEcoScore, ecoLevel } from '../utils/ecoScore';
import { ecoTone, factorTone } from '../utils/ecoTone';
import './EcoInsights.css';

// Rough per-person CO2 estimates (kg) used only for the footprint card.
const TRANSPORT_KG = { Bus: 40, Coaster: 35 };
const ACCOMMODATION_KG_PER_NIGHT = { Camping: 2, 'Shared Family Rooms': 6, Hotel: 15 };
const KG_PER_TREE_YEAR = 21;

const BREAKDOWN_ICONS = {
    destination: MapPin,
    activities: Leaf,
    groupSize: Users,
    transport: Car,
    accommodation: Building2,
};

const TRANSPORT_OPTIONS = [
    { value: 'Bus', icon: Bus, impact: 'Low impact', tone: 'low' },
    { value: 'Coaster', icon: Bus, impact: 'Low impact', tone: 'low' },
];

const ACCOMMODATION_OPTIONS = [
    { value: 'Camping', icon: Tent, impact: 'Low impact', tone: 'low' },
    { value: 'Hotel', icon: Building2, impact: 'Medium impact', tone: 'medium' },
    { value: 'Shared Family Rooms', icon: HouseIcon, impact: 'Low impact', tone: 'low' },
];

function ChoiceGroup({ legend, icon, name, options, value, onChange }) {
    const LegendIcon = icon;
    return (
        <fieldset className="choice-group">
            <legend className="choice-group__legend"><LegendIcon size={16} aria-hidden="true" /> {legend}</legend>
            <div className="choice-grid">
                {options.map(({ value: optionValue, icon: optionIcon, impact, tone }) => {
                    const Icon = optionIcon;
                    return (
                        <label key={optionValue} className="choice">
                            <input
                                type="radio"
                                className="choice__input"
                                name={name}
                                value={optionValue}
                                checked={value === optionValue}
                                onChange={() => onChange(optionValue)}
                            />
                            <Icon size={20} className="choice__icon" aria-hidden="true" />
                            <span className="choice__title">{optionValue}</span>
                            <span className="choice__meta">
                                <span className={tone === 'low' ? 'choice__dot' : 'choice__dot choice__dot--warning'} aria-hidden="true" />
                                {impact}
                            </span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

function EcoInsights() {
    // Form State
    const [destination, setDestination] = useState('');
    const [travelers, setTravelers] = useState('');
    const [duration, setDuration] = useState('');
    const [transportType, setTransportType] = useState('');
    const [accommodationType, setAccommodationType] = useState('');

    // Result State
    const [result, setResult] = useState(null);
    const isCalculated = result !== null;

    const isFormValid = destination !== '' && travelers !== '' && duration !== '' && transportType !== '' && accommodationType !== '';

    const handleCalculate = (e) => {
        e.preventDefault();
        if (isFormValid) {
            const days = Math.max(1, parseInt(duration, 10) || 1);
            const people = Math.max(1, parseInt(travelers, 10) || 1);
            const eco = calculateEcoScore({
                destination,
                activities: [],
                groupSize: people,
                transport: transportType,
                accommodation: accommodationType,
            });
            const perPerson = (TRANSPORT_KG[transportType] ?? 40) + (ACCOMMODATION_KG_PER_NIGHT[accommodationType] ?? 15) * days;
            const co2Kg = perPerson * people;
            setResult({ eco, destination, days, people, transportType, accommodationType, co2Kg, trees: Math.max(1, Math.ceil(co2Kg / KG_PER_TREE_YEAR)) });
        }
    };

    const level = result ? ecoLevel(result.eco.total) : null;
    const weak = result ? result.eco.breakdown.filter((b) => b.score / b.max < 0.6) : [];
    const strong = result ? result.eco.breakdown.filter((b) => b.score / b.max >= 0.6) : [];

    return (
        <div className="container page">
            <PageHeader
                eyebrow="Eco-score calculator"
                title="Eco-friendly travel insights"
                subtitle="Calculate your trip's environmental impact and get personalised sustainability recommendations."
            />

            <div className="eco-layout">
                <form className="card" onSubmit={handleCalculate} aria-labelledby="eco-form-title">
                    <div className="card__header">
                        <span className="icon-chip" aria-hidden="true"><Leaf size={18} /></span>
                        <h2 id="eco-form-title" className="card__title">Trip details</h2>
                    </div>

                    <div className="form-stack">
                        <div className="field">
                            <label htmlFor="eco-destination" className="field__label"><MapPin size={16} aria-hidden="true" /> Destination</label>
                            <select id="eco-destination" className="select" value={destination} onChange={(e) => setDestination(e.target.value)} required>
                                <option value="" disabled>Select destination</option>
                                {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="eco-travelers" className="field__label"><Users size={16} aria-hidden="true" /> Number of travelers</label>
                                <input id="eco-travelers" type="number" min="1" placeholder="e.g. 4" className="input" value={travelers} onChange={(e) => setTravelers(e.target.value)} aria-describedby="eco-travelers-hint" required />
                                <p id="eco-travelers-hint" className="field__hint">Larger groups reduce per-person impact.</p>
                            </div>

                            <div className="field">
                                <label htmlFor="eco-duration" className="field__label"><Clock size={16} aria-hidden="true" /> Trip duration (days)</label>
                                <input id="eco-duration" type="number" min="1" placeholder="e.g. 5" className="input" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                            </div>
                        </div>

                        <ChoiceGroup legend="Transport type" icon={Car} name="eco-transport" options={TRANSPORT_OPTIONS} value={transportType} onChange={setTransportType} />
                        <ChoiceGroup legend="Accommodation type" icon={Building2} name="eco-accommodation" options={ACCOMMODATION_OPTIONS} value={accommodationType} onChange={setAccommodationType} />

                        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={!isFormValid}>
                            {isFormValid ? 'Calculate eco-score' : 'Fill all fields to calculate'}
                        </button>
                    </div>
                </form>

                <div className="eco-results" aria-live="polite">
                    {!isCalculated ? (
                        <div className="card card--sunken empty-state eco-empty">
                            <span className="icon-chip icon-chip--lg icon-chip--neutral" aria-hidden="true"><Leaf size={28} /></span>
                            <h2 className="empty-state__title">Your eco-score will appear here</h2>
                            <p className="empty-state__text">Fill in your trip details to calculate your environmental impact and get personalised sustainability tips.</p>
                            <p className="status-note eco-empty-tip">
                                <Info size={16} aria-hidden="true" />
                                <span><strong>Tip:</strong> eco-friendly transport and accommodation raise your score.</span>
                            </p>
                        </div>
                    ) : (
                        <>
                            <section className="eco-score" aria-labelledby="eco-score-title">
                                <div className="eco-score-ring">
                                    <svg viewBox="0 0 36 36" className="eco-ring" role="img" aria-label={`Eco score ${result.eco.total} out of 100`}>
                                        <path className="eco-ring-track" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="eco-ring-value" strokeDasharray={`${result.eco.total}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <text x="18" y="18.5" className="eco-ring-number">{result.eco.total}</text>
                                        <text x="18" y="24" className="eco-ring-sub">/ 100</text>
                                    </svg>
                                </div>
                                <div className="eco-score-info">
                                    <h2 id="eco-score-title" className="eco-score-title">Your eco-score</h2>
                                    <span className={`badge badge--${ecoTone(level)}`}>{level} eco level</span>
                                    <p className="eco-score-rating">{result.eco.rating}</p>
                                </div>
                            </section>

                            <section className="card" aria-labelledby="eco-breakdown-title">
                                <div className="card__header">
                                    <span className="icon-chip" aria-hidden="true"><Info size={18} /></span>
                                    <h3 id="eco-breakdown-title" className="card__title">Impact breakdown</h3>
                                </div>
                                <ul className="eco-breakdown" role="list">
                                    {result.eco.breakdown.map((b) => {
                                        const Icon = BREAKDOWN_ICONS[b.key] || Leaf;
                                        const tone = factorTone(b.score, b.max);
                                        return (
                                            <li className="eco-breakdown-row" key={b.key}>
                                                <span className="eco-breakdown-label"><Icon size={16} aria-hidden="true" /> {b.label}</span>
                                                <div className="meter eco-breakdown-meter" role="img" aria-label={`${b.label}: ${b.score} of ${b.max}`}>
                                                    <div className={`meter__fill meter__fill--${tone}`} style={{ width: `${(b.score / b.max) * 100}%` }} />
                                                </div>
                                                <span className={`eco-breakdown-value eco-tone-${tone}`}>{b.score}/{b.max}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>

                            <section className="card eco-footprint" aria-labelledby="eco-footprint-title">
                                <span className="icon-chip icon-chip--info icon-chip--lg" aria-hidden="true"><CloudSun size={24} /></span>
                                <div>
                                    <h3 id="eco-footprint-title" className="eco-footprint-title">Estimated carbon footprint</h3>
                                    <p className="eco-footprint-value">{result.co2Kg.toLocaleString()} kg CO₂</p>
                                    <p className="text-muted">For your {result.days}-day trip with {result.people} traveler{result.people === 1 ? '' : 's'}</p>
                                </div>
                            </section>

                            <section className="card" aria-labelledby="eco-tips-title">
                                <div className="card__header">
                                    <span className="icon-chip icon-chip--success" aria-hidden="true"><CheckCircle2 size={18} /></span>
                                    <h3 id="eco-tips-title" className="card__title">Personalised tips</h3>
                                </div>
                                <ul className="eco-checklist" role="list">
                                    <li>
                                        <CheckCircle2 size={18} aria-hidden="true" />
                                        {result.accommodationType === 'Hotel'
                                            ? 'Consider camping or shared family rooms to lower your accommodation impact.'
                                            : `Great choice staying in ${result.accommodationType === 'Camping' ? 'a campsite' : 'shared family rooms'} - it keeps your accommodation impact low.`}
                                    </li>
                                    <li><CheckCircle2 size={18} aria-hidden="true" /> Use reusable water bottles and minimise plastic waste.</li>
                                    <li><CheckCircle2 size={18} aria-hidden="true" /> Support local businesses and artisans during your trip.</li>
                                </ul>
                            </section>

                            <section className="card" aria-labelledby="eco-recs-title">
                                <div className="card__header">
                                    <span className="icon-chip icon-chip--accent" aria-hidden="true"><Zap size={18} /></span>
                                    <h3 id="eco-recs-title" className="card__title">Environmental recommendations</h3>
                                </div>

                                <ul className="eco-recs" role="list">
                                    <li className="eco-rec">
                                        <span className="icon-chip icon-chip--accent" aria-hidden="true"><Zap size={18} /></span>
                                        <div>
                                            <h4 className="eco-rec-title">{result.eco.rating} - Score: {result.eco.total}/100</h4>
                                            <p className="eco-rec-text">{result.eco.explanation}</p>
                                        </div>
                                    </li>

                                    {weak.map((b) => (
                                        <li className="eco-rec eco-rec--alert" key={b.key}>
                                            <span className="icon-chip icon-chip--warning" aria-hidden="true"><AlertTriangle size={18} /></span>
                                            <div>
                                                <h4 className="eco-rec-title">{b.label} impact: {b.score}/{b.max}</h4>
                                                <p className="eco-rec-text">This factor is pulling your score down. Small changes here can noticeably improve your trip&rsquo;s environmental footprint.</p>
                                            </div>
                                        </li>
                                    ))}

                                    {strong.map((b) => (
                                        <li className="eco-rec" key={b.key}>
                                            <span className="icon-chip icon-chip--success" aria-hidden="true"><CheckCircle2 size={18} /></span>
                                            <div>
                                                <h4 className="eco-rec-title">{b.label}: {b.score}/{b.max}</h4>
                                                <p className="eco-rec-text">A strong eco-friendly result for this part of your trip.</p>
                                            </div>
                                        </li>
                                    ))}

                                    <li className="eco-rec">
                                        <span className="icon-chip" aria-hidden="true"><Leaf size={18} /></span>
                                        <div>
                                            <h4 className="eco-rec-title">Carbon offset opportunity</h4>
                                            <p className="eco-rec-text">Your trip produces about {result.co2Kg.toLocaleString()} kg CO₂. Offset this by planting around {result.trees} tree{result.trees === 1 ? '' : 's'} or donating to Pakistan&rsquo;s forest restoration projects.</p>
                                        </div>
                                    </li>

                                    <li className="eco-rec">
                                        <span className="icon-chip" aria-hidden="true"><CheckCircle2 size={18} /></span>
                                        <div>
                                            <h4 className="eco-rec-title">Essential eco-practices for your {result.days}-day trip</h4>
                                            <ul className="eco-bullets">
                                                <li>Carry reusable water bottles to avoid single-use plastic</li>
                                                <li>Use biodegradable soap and avoid single-use plastics</li>
                                                <li>Stay on marked trails to protect fragile ecosystems</li>
                                                <li>Support local businesses - buy from artisans, eat at local restaurants</li>
                                                <li>Take all trash with you - leave {result.destination} cleaner than you found it</li>
                                            </ul>
                                        </div>
                                    </li>

                                    <li className="eco-rec">
                                        <span className="icon-chip" aria-hidden="true"><Mountain size={18} /></span>
                                        <div>
                                            <h4 className="eco-rec-title">Respect {result.destination}</h4>
                                            <p className="eco-rec-text">Respect altitude limits, don&rsquo;t disturb wildlife, avoid littering on trails, and support local conservation efforts to preserve {result.destination}&rsquo;s natural beauty.</p>
                                        </div>
                                    </li>
                                </ul>
                            </section>

                            <Link to="/explore?eco=1" className="btn btn--primary btn--lg btn--block">
                                Explore Eco-Friendly Packages <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EcoInsights;
