import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map, Compass, Leaf, CloudSun, User, Sparkles,
    ArrowRight, Users, ShieldCheck, MessageCircle, DollarSign,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import AIChatbot from '../components/AIChatbot';
import './Home.css';

function Home() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="landing-page">
            <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} username="amanjawaid434" email="amanjawaid434@gmail.com" />

            {/* Top Navigation */}
            <nav className="top-nav">
                <div className="nav-brand">
                    <div className="brand-logo-small">
                        <Mountain size={20} color="white" />
                    </div>
                    <div className="brand-text">
                        <span className="brand-name">ExploreSmart</span>
                        <span className="brand-sub">AI Travel Planner</span>
                    </div>
                </div>

                <div className="nav-links">
                    <a href="#" className="nav-link active">
                        <HomeIcon size={16} /> Home
                    </a>
                    <Link to="/plan" className="nav-link">
                        <Map size={16} /> Plan Trip
                    </Link>
                    <Link to="/explore" className="nav-link">
                        <Compass size={16} /> Explore Trips
                    </Link>
                    <Link to="/eco" className="nav-link">
                        <Leaf size={16} /> Eco Insights
                    </Link>
                    <Link to="/weather" className="nav-link">
                        <CloudSun size={16} /> Weather
                    </Link>
                </div>

                <div className="nav-profile" onClick={() => setIsProfileOpen(true)} style={{ cursor: 'pointer' }}>
                    <div className="profile-icon">
                        <User size={18} color="white" />
                    </div>
                    <div className="profile-text">
                        <span className="profile-name">{user?.displayName || 'Guest'}</span>
                        <span className="profile-action">View Profile</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="new-hero-section">
                <div className="hero-content">
                    <div className="ai-badge">
                        <Sparkles size={14} color="#facc15" />
                        <span>AI-Powered Travel Intelligence</span>
                    </div>

                    <h1 className="hero-headline">
                        Smart, Safe & Sustainable<br />
                        <span className="text-highlight">Travel Planning</span><br />
                        for Pakistan
                    </h1>

                    <p className="hero-subheadline">
                        Discover Pakistan's hidden gems with AI-powered recommendations, eco-<br />
                        friendly options, and real-time travel insights.
                    </p>

                    <div className="hero-cta-group">
                        <Link to="/plan" className="btn-cyan" style={{ textDecoration: 'none' }}>
                            Plan Your Trip <ArrowRight size={16} />
                        </Link>
                        <Link to="/explore" className="btn-glass" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Explore Trips
                        </Link>
                    </div>

                    <div className="trust-indicators">
                        <div className="trust-item">
                            <Users size={14} /> 10,000+ Travelers
                        </div>
                        <div className="trust-item">
                            <ShieldCheck size={14} /> Verified Packages
                        </div>
                        <div className="trust-item">
                            <Leaf size={14} /> Eco Certified
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="features-container">
                <div className="section-header">
                    <h2>Why Choose ExploreSmart?</h2>
                    <p>Experience the future of travel planning with cutting-edge AI technology<br />and sustainable practices.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card-new">
                        <div className="feature-icon-box bg-purple">
                            <Sparkles size={20} color="white" />
                        </div>
                        <h3>AI Trip Planner</h3>
                        <p>Get personalized travel plans powered by AI, tailored to your preferences and budget.</p>
                    </div>

                    <div className="feature-card-new">
                        <div className="feature-icon-box bg-green">
                            <DollarSign size={20} color="white" />
                        </div>
                        <h3>Package Comparison</h3>
                        <p>Compare multiple travel packages side-by-side to find the best deal for your journey.</p>
                    </div>

                    <div className="feature-card-new">
                        <div className="feature-icon-box bg-blue">
                            <CloudSun size={20} color="white" />
                        </div>
                        <h3>Weather Awareness</h3>
                        <p>Real-time weather updates and safety alerts to help you plan the perfect trip.</p>
                    </div>

                    <div className="feature-card-new">
                        <div className="feature-icon-box bg-green-dark">
                            <Leaf size={20} color="white" />
                        </div>
                        <h3>Eco-Friendly Score</h3>
                        <p>Make sustainable choices with our environmental impact ratings for every trip.</p>
                    </div>
                </div>
            </section>

            {/* Destinations Section */}
            <section className="destinations-section">
                <div className="section-header">
                    <h2>Explore Pakistan's Beauty</h2>
                    <p>From majestic mountains to historic landmarks</p>
                </div>

                <div className="destinations-grid">
                    <div className="destination-card" style={{ backgroundImage: "url('/assets/hunza_valley.png')" }}>
                        <div className="destination-info">
                            <h3>Hunza Valley</h3>
                            <p>Northern Paradise</p>
                        </div>
                    </div>

                    <div className="destination-card" style={{ backgroundImage: "url('/assets/attabad_lake.png')" }}>
                        <div className="destination-info">
                            <h3>Attabad Lake</h3>
                            <p>Turquoise Wonder</p>
                        </div>
                    </div>

                    <div className="destination-card" style={{ backgroundImage: "url('/assets/Fairy_meadows.png')" }}>
                        <div className="destination-info">
                            <h3>Fairy Meadows</h3>
                            <p>Alpine Beauty</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="section-header">
                    <h2>Trusted by Travelers</h2>
                    <p>See what our community has to say</p>
                </div>

                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#facc15" color="#facc15" />)}
                        </div>
                        <p className="testimonial-text">"ExploreSmart made planning my Hunza trip so easy! The AI recommendations were spot-on."</p>
                        <div className="testimonial-author">
                            <div className="author-avatar bg-avatar-1"></div>
                            <div className="author-info">
                                <h4>Ayesha Khan</h4>
                                <span>Karachi</span>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#facc15" color="#facc15" />)}
                        </div>
                        <p className="testimonial-text">"Love the eco-friendly focus! Finally a platform that cares about sustainable tourism in Pakistan."</p>
                        <div className="testimonial-author">
                            <div className="author-avatar bg-avatar-2"></div>
                            <div className="author-info">
                                <h4>Ahmed Ali</h4>
                                <span>Lahore</span>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#facc15" color="#facc15" />)}
                        </div>
                        <p className="testimonial-text">"The weather alerts saved our trip! We rescheduled and had the most amazing experience."</p>
                        <div className="testimonial-author">
                            <div className="author-avatar bg-avatar-3"></div>
                            <div className="author-info">
                                <h4>Sara Malik</h4>
                                <span>Islamabad</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="footer-cta">
                <h2>Ready to Explore Pakistan?</h2>
                <p>Start planning your dream trip today with AI-powered recommendations</p>
                <Link to="/plan" className="btn-white" style={{ textDecoration: 'none' }}>
                    <Sparkles size={16} /> Plan Your Trip <ArrowRight size={16} />
                </Link>
            </section>
            {/* Floating Chat Widget */}
            <AIChatbot />
        </div>
    );
}

export default Home;
