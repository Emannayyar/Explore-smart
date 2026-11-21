import { Link } from 'react-router-dom';
import { ArrowRight, Map as MapIcon, Compass, Leaf, CloudSun } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { trips } from '../data/trips';
import { DESTINATIONS } from '../data/destinations';
import './Home.css';

const FEATURES = [
    { to: '/plan', icon: MapIcon, title: 'Trip planner', text: 'Set a destination, budget and group size and get a plan summary with matching packages.' },
    { to: '/explore', icon: Compass, title: 'Package comparison', text: 'Compare packages side by side: price, duration, rating, weather and eco level.' },
    { to: '/weather', icon: CloudSun, title: 'Weather awareness', text: 'Seasonal guidance and safety tips so you pick the right time to travel.' },
    { to: '/eco', icon: Leaf, title: 'Eco-friendly score', text: 'See how transport, stay, group size and activities change your trip’s impact.' },
];

const DESTINATION_CARDS = [
    { name: 'Hunza Valley', tagline: 'Northern paradise', image: '/assets/hunza_valley.png', alt: 'Terraced green fields beneath snow-capped peaks in Hunza Valley' },
    { name: 'Attabad Lake', tagline: 'Turquoise wonder', image: '/assets/attabad_lake.png', alt: 'Turquoise water of Attabad Lake surrounded by steep mountains' },
    { name: 'Fairy Meadows', tagline: 'Alpine beauty', image: '/assets/Fairy_meadows.png', alt: 'Alpine meadow and pine forest facing Nanga Parbat at Fairy Meadows' },
];

const STEPS = [
    { title: 'Tell us your trip', text: 'Destination, budget, travellers, days, stay and transport.' },
    { title: 'Read your smart plan', text: 'A summary with a 100-point eco score and what drives it.' },
    { title: 'Pick a package', text: 'Open a recommended package on the operator’s own site to book.' },
];

function Home() {
    const { user } = useAuth();

    return (
        <div>
            <section className="photo-hero home-hero" aria-labelledby="home-title">
                <img className="photo-hero__media" src="/assets/hunza_valley.png" alt="" />
                <div className="photo-hero__scrim" />
                <div className="container home-hero-inner">
                    <p className="home-hero-eyebrow">
                        {user ? `Welcome back, ${user.displayName}` : 'Trip planning for northern Pakistan'}
                    </p>
                    <h1 id="home-title" className="home-hero-title">
                        Smart, safe &amp; sustainable travel <em>for Pakistan</em>
                    </h1>
                    <p className="home-hero-lead">
                        Discover Pakistan&rsquo;s hidden gems with eco-scored packages, seasonal weather guidance
                        and a planner that fits your budget.
                    </p>
                    <div className="home-hero-cta">
                        <Link to="/plan" className="btn btn--photo btn--lg">
                            Plan your trip <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                        </Link>
                        <Link to="/explore" className="btn btn--photo-outline btn--lg">Explore trips</Link>
                    </div>
                    <ul className="home-hero-facts" role="list">
                        <li><strong>{trips.length}</strong> curated packages</li>
                        <li><strong>{DESTINATIONS.length}</strong> destinations</li>
                        <li><strong>100-point</strong> eco score</li>
                    </ul>
                </div>
            </section>

            <section className="container home-section" aria-labelledby="home-features-title">
                <div className="section-head">
                    <div>
                        <p className="eyebrow">Why ExploreSmart</p>
                        <h2 id="home-features-title" className="home-section-title">One place to plan, compare and check</h2>
                    </div>
                </div>
                <ul className="home-features" role="list">
                    {FEATURES.map(({ to, icon, title, text }) => {
                        const Icon = icon;
                        return (
                            <li key={to}>
                                <Link to={to} className="card home-feature">
                                    <span className="icon-chip" aria-hidden="true"><Icon size={20} /></span>
                                    <h3 className="home-feature-title">{title}</h3>
                                    <p className="home-feature-text">{text}</p>
                                    <span className="home-feature-more">Open <ArrowRight size={16} aria-hidden="true" /></span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>

            <section className="container home-section" aria-labelledby="home-dest-title">
                <div className="section-head">
                    <div>
                        <p className="eyebrow">Destinations</p>
                        <h2 id="home-dest-title" className="home-section-title">Explore Pakistan&rsquo;s beauty</h2>
                    </div>
                    <Link to="/explore" className="btn btn--secondary">
                        See all packages <ArrowRight size={16} className="btn__arrow" aria-hidden="true" />
                    </Link>
                </div>
                <ul className="home-destinations" role="list">
                    {DESTINATION_CARDS.map((d) => (
                        <li key={d.name}>
                            <Link to="/explore" className="home-destination">
                                <img src={d.image} alt={d.alt} className="home-destination-img" loading="lazy" />
                                <span className="home-destination-caption">
                                    <span className="home-destination-name">{d.name}</span>
                                    <span className="home-destination-tagline">{d.tagline}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="container home-section" aria-labelledby="home-steps-title">
                <div className="home-steps">
                    <div>
                        <p className="eyebrow">How it works</p>
                        <h2 id="home-steps-title" className="home-section-title">From idea to booking in three steps</h2>
                    </div>
                    <ol className="home-step-list" role="list">
                        {STEPS.map((s, i) => (
                            <li key={s.title} className="home-step">
                                <span className="home-step-index" aria-hidden="true">{i + 1}</span>
                                <div>
                                    <h3 className="home-step-title">{s.title}</h3>
                                    <p className="home-step-text">{s.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="container home-section">
                <div className="home-cta">
                    <h2 className="home-cta-title">Ready to explore Pakistan?</h2>
                    <p className="home-cta-text">Start planning your trip and see its eco score in under a minute.</p>
                    <Link to="/plan" className="btn btn--photo btn--lg">
                        Plan your trip <ArrowRight size={18} className="btn__arrow" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
