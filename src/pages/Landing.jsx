import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Leaf } from 'lucide-react';
import Brand from '../components/Brand';
import { trips } from '../data/trips';
import { DESTINATIONS } from '../data/destinations';
import { calculateEcoScore } from '../utils/ecoScore';
import './Landing.css';

const sampleTrip = trips[0];
const sampleEco = calculateEcoScore(sampleTrip);

const FEATURES = [
    {
        title: 'Plan a trip in minutes',
        text: 'Choose a destination, budget, group size, stay and transport. You get a plan summary with an eco score and matching packages.',
    },
    {
        title: `Compare ${trips.length} curated packages`,
        text: `Packages across ${DESTINATIONS.length} northern destinations, each with price, duration, rating and a link to the original operator.`,
    },
    {
        title: 'Know the impact and the season',
        text: 'Every trip is scored out of 100 for its environmental impact, with seasonal guidance and weather safety tips for each region.',
    },
];

function Landing() {
    return (
        <div className="landing">
            <a className="skip-link" href="#main">Skip to content</a>

            <header className="landing-header">
                <div className="container landing-header-inner">
                    <Brand to="/" onPhoto />
                    <nav className="landing-header-actions" aria-label="Account">
                        <Link to="/signin" className="btn btn--photo-outline btn--sm landing-login">Log in</Link>
                        <Link to="/signup" className="btn btn--photo btn--sm">Sign up</Link>
                    </nav>
                </div>
            </header>

            <main id="main">
                <section className="photo-hero landing-hero" aria-labelledby="landing-title">
                    <img className="photo-hero__media" src="/assets/attabad_lake.png" alt="" />
                    <div className="photo-hero__scrim" />

                    <div className="container landing-hero-grid">
                        <div className="landing-hero-copy">
                            <p className="landing-eyebrow">Trip planning for northern Pakistan</p>
                            <h1 id="landing-title" className="landing-title">
                                Go north.<br />
                                <em>Tread lightly.</em>
                            </h1>
                            <p className="landing-lead">
                                Plan trips to Hunza, Skardu, Swat and beyond. Compare packages, see an eco score
                                for every trip and check the season before you go.
                            </p>
                            <div className="landing-cta">
                                <Link to="/signup" className="btn btn--photo btn--lg">
                                    Get started <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                                </Link>
                                <Link to="/signin" className="btn btn--photo-outline btn--lg">Log in</Link>
                            </div>
                        </div>

                        <aside className="landing-score" aria-label="Example eco score">
                            <p className="landing-score-label"><Leaf size={14} aria-hidden="true" /> Eco score</p>
                            <p className="landing-score-value">{sampleEco.total}<span>/100</span></p>
                            <p className="landing-score-trip">{sampleTrip.title}</p>
                            <p className="landing-score-rating">{sampleEco.rating}</p>
                        </aside>
                    </div>

                    <p className="container landing-caption">
                        <MapPin size={14} aria-hidden="true" /> Attabad Lake, Hunza
                    </p>
                </section>

                <section className="container landing-features" aria-labelledby="landing-features-title">
                    <h2 id="landing-features-title" className="landing-features-title">
                        Everything to check before you set off
                    </h2>
                    <ol className="landing-feature-list" role="list">
                        {FEATURES.map((f, i) => (
                            <li key={f.title} className="landing-feature">
                                <span className="landing-feature-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                                <h3 className="landing-feature-title">{f.title}</h3>
                                <p className="landing-feature-text">{f.text}</p>
                            </li>
                        ))}
                    </ol>
                    <Link to="/signup" className="btn btn--primary btn--lg">
                        Create a free account <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                    </Link>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="container landing-footer-inner">
                    <p>ExploreSmart · Final Year Project</p>
                    <p>Designed for adventure, built for sustainability.</p>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
