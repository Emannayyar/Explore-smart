import React from 'react';
import { Sparkles, Mountain, Plane, Globe, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
    return (
        <div className="app-container">
            {/* Background Decorators */}
            <div className="bg-decorator decorator-1">
                <Mountain size={120} strokeWidth={1} />
            </div>
            <div className="bg-decorator decorator-2">
                <Plane size={150} strokeWidth={1} />
            </div>

            {/* Main Content */}
            <main className="main-content">
                <header className="hero-section">
                    <h1 className="hero-title">
                        Explore<span className="text-primary">Smart</span>
                    </h1>

                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>AI-Powered Travel Planning for Pakistan</span>
                        <Sparkles size={16} />
                    </div>

                    <p className="hero-description">
                        Discover the beauty of Pakistan with intelligent trip planning,<br />
                        eco-friendly insights, and personalized recommendations
                    </p>

                    <div className="hero-actions">
                        <Link to="/signup" className="btn btn-primary">
                            Get Started <Sparkles size={18} />
                        </Link>
                        <Link to="/signin" className="btn btn-outline">
                            Log In
                        </Link>
                    </div>
                </header>

                <section className="features-section">
                    <div className="feature-card">
                        <div className="feature-icon bg-cyan">
                            <Sparkles size={24} color="white" />
                        </div>
                        <h3 className="feature-title">AI Trip Planner</h3>
                        <p className="feature-text">
                            Smart itineraries tailored to your preferences
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon bg-green">
                            <Map size={24} color="white" />
                        </div>
                        <h3 className="feature-title">Eco-Friendly Travel</h3>
                        <p className="feature-text">
                            Sustainable tourism with eco-score insights
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon bg-blue">
                            <Globe size={24} color="white" />
                        </div>
                        <h3 className="feature-title">Real-Time Weather</h3>
                        <p className="feature-text">
                            Live updates and safety alerts
                        </p>
                    </div>
                </section>
            </main>

            <footer className="footer">
                Powered by AI • Designed for Adventure • Built for Sustainability
            </footer>
        </div>
    );
}

export default Landing;
