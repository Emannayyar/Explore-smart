import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map as MapIcon, Compass, Leaf, CloudSun, User,
    CloudRain, AlertTriangle, Info, Sun, Cloud, Snowflake, Wind, Calendar, MapPin, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import AIChatbot from '../components/AIChatbot';
import './Weather.css';

function Weather() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="weather-page">
            <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

            {/* Top Navigation - Light Theme */}
            <nav className="top-nav-light">
                <div className="nav-brand">
                    <div className="brand-logo-small bg-green-nav">
                        <Mountain size={20} color="white" />
                    </div>
                    <div className="brand-text">
                        <span className="brand-name text-dark">ExploreSmart</span>
                        <span className="brand-sub text-green">AI Travel Planner</span>
                    </div>
                </div>

                <div className="nav-links">
                    <Link to="/home" className="nav-link text-dark">
                        <HomeIcon size={16} /> Home
                    </Link>
                    <Link to="/plan" className="nav-link text-dark">
                        <MapIcon size={16} /> Plan Trip
                    </Link>
                    <Link to="/explore" className="nav-link text-dark">
                        <Compass size={16} /> Explore Trips
                    </Link>
                    <Link to="/eco" className="nav-link text-dark">
                        <Leaf size={16} /> Eco Insights
                    </Link>
                    <Link to="/weather" className="nav-link text-dark active">
                        <CloudSun size={16} /> Weather
                    </Link>
                </div>

                <div className="nav-profile" onClick={() => setIsProfileOpen(true)} style={{ cursor: 'pointer' }}>
                    <div className="profile-icon bg-green-nav">
                        <User size={18} color="white" />
                    </div>
                    <div className="profile-text">
                        <span className="profile-name text-dark">{user?.displayName || 'Guest'}</span>
                        <span className="profile-action">View Profile</span>
                    </div>
                </div>
            </nav>

            <main className="weather-main">
                {/* Header Section */}
                <div className="weather-header-centered">
                    <div className="weather-badge-main">
                        <CloudSun size={14} /> Weather Intelligence
                    </div>
                    <h1 className="weather-main-title">Weather & Safety Alerts</h1>
                    <p className="weather-main-subtitle">
                        Real-time weather updates and safety information for popular destinations
                    </p>
                </div>

                {/* Alerts Section */}
                <div className="alerts-container">
                    <div className="alert-box alert-yellow">
                        <div className="alert-icon text-yellow-600">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="alert-content">
                            <h4><strong>Babusar Pass</strong> • Feb 1, 2026</h4>
                            <p>Road temporarily closed due to heavy snowfall</p>
                        </div>
                    </div>
                    <div className="alert-box alert-blue">
                        <div className="alert-icon text-blue-600">
                            <Info size={20} />
                        </div>
                        <div className="alert-content">
                            <h4><strong>Northern Areas</strong> • Feb 2, 2026</h4>
                            <p>Best season for travel - clear skies expected</p>
                        </div>
                    </div>
                </div>

                {/* Current Weather Conditions */}
                <div className="weather-section">
                    <div className="section-header-row">
                        <div className="section-title">
                            <CloudSun size={20} className="text-blue-500" />
                            <h2>Current Weather Conditions</h2>
                        </div>
                        <div className="destination-dropdown">
                            <MapPin size={16} className="text-slate-500" />
                            <span>All Destinations</span>
                            <ChevronDown size={16} className="text-slate-400" />
                        </div>
                    </div>

                    <div className="weather-grid">
                        {/* Card 1: Hunza Valley */}
                        <div className="weather-card">
                            <div className="card-top">
                                <span className="location-name"><MapPin size={14} className="text-slate-400"/> Hunza Valley</span>
                            </div>
                            <div className="temp-row">
                                <div className="weather-icon-lg bg-blue-50 text-blue-500">
                                    <Sun size={32} />
                                </div>
                                <div className="temp-info">
                                    <h2 className="temperature">18°C</h2>
                                    <span className="condition">Clear</span>
                                </div>
                            </div>
                            <div className="weather-details">
                                <div className="detail-item">
                                    <span className="label">UV Index</span>
                                    <span className="value">6</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Wind Speed</span>
                                    <span className="value">12 km/h</span>
                                </div>
                            </div>
                            <div className="status-badge status-safe">
                                <CheckCircleIcon /> Safe
                            </div>
                            <p className="card-footer-text">Perfect time for outdoor activities. Carry light layers.</p>
                        </div>

                        {/* Card 2: Skardu */}
                        <div className="weather-card">
                            <div className="card-top">
                                <span className="location-name"><MapPin size={14} className="text-slate-400"/> Skardu</span>
                            </div>
                            <div className="temp-row">
                                <div className="weather-icon-lg bg-blue-50 text-blue-500">
                                    <Cloud size={32} />
                                </div>
                                <div className="temp-info">
                                    <h2 className="temperature">15°C</h2>
                                    <span className="condition">Partly Cloudy</span>
                                </div>
                            </div>
                            <div className="weather-details">
                                <div className="detail-item">
                                    <span className="label">UV Index</span>
                                    <span className="value">5</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Wind Speed</span>
                                    <span className="value">15 km/h</span>
                                </div>
                            </div>
                            <div className="status-badge status-safe">
                                <CheckCircleIcon /> Safe
                            </div>
                            <p className="card-footer-text">Good weather for trekking. Pack warm clothing for evenings.</p>
                        </div>

                        {/* Card 3: Swat Valley */}
                        <div className="weather-card">
                            <div className="card-top">
                                <span className="location-name"><MapPin size={14} className="text-slate-400"/> Swat Valley</span>
                            </div>
                            <div className="temp-row">
                                <div className="weather-icon-lg bg-blue-50 text-blue-500">
                                    <Sun size={32} />
                                </div>
                                <div className="temp-info">
                                    <h2 className="temperature">22°C</h2>
                                    <span className="condition">Sunny</span>
                                </div>
                            </div>
                            <div className="weather-details">
                                <div className="detail-item">
                                    <span className="label">UV Index</span>
                                    <span className="value">7</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Wind Speed</span>
                                    <span className="value">8 km/h</span>
                                </div>
                            </div>
                            <div className="status-badge status-safe">
                                <CheckCircleIcon /> Safe
                            </div>
                            <p className="card-footer-text">Excellent weather conditions. Ideal for sightseeing.</p>
                        </div>

                        {/* Card 4: Naran Kaghan */}
                        <div className="weather-card">
                            <div className="card-top">
                                <span className="location-name"><MapPin size={14} className="text-slate-400"/> Naran Kaghan</span>
                            </div>
                            <div className="temp-row">
                                <div className="weather-icon-lg bg-blue-50 text-blue-500">
                                    <Cloud size={32} />
                                </div>
                                <div className="temp-info">
                                    <h2 className="temperature">12°C</h2>
                                    <span className="condition">Cloudy</span>
                                </div>
                            </div>
                            <div className="weather-details">
                                <div className="detail-item">
                                    <span className="label">UV Index</span>
                                    <span className="value">3</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Wind Speed</span>
                                    <span className="value">20 km/h</span>
                                </div>
                            </div>
                            <div className="status-badge status-caution">
                                <AlertTriangle size={14} /> Caution
                            </div>
                            <p className="card-footer-text">Possible rain. Keep rain gear handy and check road conditions.</p>
                        </div>

                        {/* Card 5: Murree */}
                        <div className="weather-card">
                            <div className="card-top">
                                <span className="location-name"><MapPin size={14} className="text-slate-400"/> Murree</span>
                            </div>
                            <div className="temp-row">
                                <div className="weather-icon-lg bg-blue-50 text-blue-500">
                                    <Sun size={32} />
                                </div>
                                <div className="temp-info">
                                    <h2 className="temperature">20°C</h2>
                                    <span className="condition">Pleasant</span>
                                </div>
                            </div>
                            <div className="weather-details">
                                <div className="detail-item">
                                    <span className="label">UV Index</span>
                                    <span className="value">5</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Wind Speed</span>
                                    <span className="value">10 km/h</span>
                                </div>
                            </div>
                            <div className="status-badge status-safe">
                                <CheckCircleIcon /> Safe
                            </div>
                            <p className="card-footer-text">Great weather for hill station visits. Light jacket recommended.</p>
                        </div>

                        {/* Card 6: Fairy Meadows */}
                        <div className="weather-card">
                            <div className="card-top">
                                <span className="location-name"><MapPin size={14} className="text-slate-400"/> Fairy Meadows</span>
                            </div>
                            <div className="temp-row">
                                <div className="weather-icon-lg bg-blue-50 text-blue-500">
                                    <Snowflake size={32} />
                                </div>
                                <div className="temp-info">
                                    <h2 className="temperature">10°C</h2>
                                    <span className="condition">Cold & Clear</span>
                                </div>
                            </div>
                            <div className="weather-details">
                                <div className="detail-item">
                                    <span className="label">UV Index</span>
                                    <span className="value">4</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Wind Speed</span>
                                    <span className="value">18 km/h</span>
                                </div>
                            </div>
                            <div className="status-badge status-caution">
                                <AlertTriangle size={14} /> Caution
                            </div>
                            <p className="card-footer-text">Cold temperatures. Essential to carry warm gear and check accessibility.</p>
                        </div>
                    </div>
                </div>

                {/* Best Season to Visit */}
                <div className="weather-section">
                    <div className="section-title">
                        <Calendar size={20} className="text-emerald-600" />
                        <h2>Best Season to Visit</h2>
                    </div>

                    <div className="season-grid">
                        {/* Spring */}
                        <div className="season-card">
                            <div className="season-header bg-pink">
                                <h3>Spring</h3>
                                <span>March - May</span>
                            </div>
                            <div className="season-body">
                                <div className="season-stat">
                                    <span className="stat-label">Temperature</span>
                                    <span className="stat-value">15-25°C</span>
                                </div>
                                <div className="season-stat">
                                    <span className="stat-label">Condition</span>
                                    <span className="stat-value font-semibold">Pleasant & Blooming</span>
                                </div>
                                <div className="season-tag tag-green">Excellent</div>
                                
                                <div className="activities-section">
                                    <span className="act-label">Popular Activities:</span>
                                    <div className="act-tags">
                                        <span className="act-tag">Hiking</span>
                                        <span className="act-tag">Sightseeing</span>
                                        <span className="act-tag">Photography</span>
                                        <span className="act-tag">Valley Tours</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summer */}
                        <div className="season-card">
                            <div className="season-header bg-orange">
                                <h3>Summer</h3>
                                <span>June - August</span>
                            </div>
                            <div className="season-body">
                                <div className="season-stat">
                                    <span className="stat-label">Temperature</span>
                                    <span className="stat-value">20-35°C</span>
                                </div>
                                <div className="season-stat">
                                    <span className="stat-label">Condition</span>
                                    <span className="stat-value font-semibold">Warm & Sunny</span>
                                </div>
                                <div className="season-tag tag-blue">Good</div>
                                
                                <div className="activities-section">
                                    <span className="act-label">Popular Activities:</span>
                                    <div className="act-tags">
                                        <span className="act-tag">Mountain Treks</span>
                                        <span className="act-tag">Lake Visits</span>
                                        <span className="act-tag">Camping</span>
                                        <span className="act-tag">Adventure Sports</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Autumn */}
                        <div className="season-card">
                            <div className="season-header bg-amber">
                                <h3>Autumn</h3>
                                <span>September - November</span>
                            </div>
                            <div className="season-body">
                                <div className="season-stat">
                                    <span className="stat-label">Temperature</span>
                                    <span className="stat-value">10-20°C</span>
                                </div>
                                <div className="season-stat">
                                    <span className="stat-label">Condition</span>
                                    <span className="stat-value font-semibold">Cool & Colorful</span>
                                </div>
                                <div className="season-tag tag-green">Excellent</div>
                                
                                <div className="activities-section">
                                    <span className="act-label">Popular Activities:</span>
                                    <div className="act-tags">
                                        <span className="act-tag">Scenic Drives</span>
                                        <span className="act-tag">Cultural Tours</span>
                                        <span className="act-tag">Photography</span>
                                        <span className="act-tag">Trekking</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Winter */}
                        <div className="season-card">
                            <div className="season-header bg-blue-main">
                                <h3>Winter</h3>
                                <span>December - February</span>
                            </div>
                            <div className="season-body">
                                <div className="season-stat">
                                    <span className="stat-label">Temperature</span>
                                    <span className="stat-value">-5-10°C</span>
                                </div>
                                <div className="season-stat">
                                    <span className="stat-label">Condition</span>
                                    <span className="stat-value font-semibold">Cold & Snowy</span>
                                </div>
                                <div className="season-tag tag-yellow">Fair</div>
                                
                                <div className="activities-section">
                                    <span className="act-label">Popular Activities:</span>
                                    <div className="act-tags">
                                        <span className="act-tag">Snow Activities</span>
                                        <span className="act-tag">Skiing</span>
                                        <span className="act-tag">Winter Sports</span>
                                        <span className="act-tag">Hot Springs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weather Safety Tips */}
                <div className="safety-tips-banner">
                    <div className="banner-header">
                        <AlertTriangle size={20} color="white" />
                        <h2>Weather Safety Tips</h2>
                    </div>
                    
                    <div className="tips-columns">
                        <div className="tips-col">
                            <h3 className="tips-col-title">
                                <CheckCircleIcon size={16} /> Before Your Trip
                            </h3>
                            <ul className="tips-ul">
                                <li>Check weather forecasts regularly</li>
                                <li>Pack appropriate clothing for the season</li>
                                <li>Plan flexible itineraries</li>
                            </ul>
                        </div>
                        <div className="tips-col">
                            <h3 className="tips-col-title">
                                <CheckCircleIcon size={16} /> During Your Trip
                            </h3>
                            <ul className="tips-ul">
                                <li>Stay updated with local weather alerts</li>
                                <li>Follow local authority guidelines</li>
                                <li>Have emergency contacts ready</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <AIChatbot />
        </div>
    );
}

// Helper SVG component to match the check icon exactly
function CheckCircleIcon({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}

export default Weather;
