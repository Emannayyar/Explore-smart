import React, { useState } from 'react';
import {
    Mountain, Home, Map, Compass, Leaf, CloudSun, User, Sparkles,
    MessageCircle, MapPin, DollarSign, Users, Calendar, Utensils,
    Building  /* using Building as a fallback for Accommodation icon */, Truck /* using Truck for Transport icon */
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import { useTripContext } from '../context/TripContext';
import AIChatbot from '../components/AIChatbot';
import './PlanTrip.css';

function PlanTrip() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();
    const { saveTrip } = useTripContext();
    const navigate = useNavigate();

    const handleSaveTrip = () => {
        saveTrip();
        alert("Trip successfully generated and saved to your Dashboard!");
        navigate('/dashboard');
    };

    return (
        <div className="plan-page">
            <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

            {/* Top Navigation - Similar to Home but Plan Trip is active & colors are inverted for light theme */}
            <nav className="top-nav-light">
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
                    <Link to="/home" className="nav-link">
                        <Home size={16} /> Home
                    </Link>
                    <Link to="/plan" className="nav-link active">
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

            {/* Main Header / Title Section */}
            <div className="plan-header">
                <div className="badge-purple">
                    <Sparkles size={14} /> AI-Powered Trip Planning
                </div>
                <h1 className="plan-title">Plan Your Perfect Pakistan Adventure</h1>
                <p className="plan-subtitle">
                    Tell us your preferences and let our AI create a personalized travel plan<br />
                    just for you
                </p>
            </div>

            {/* Main Content Layout */}
            <div className="plan-layout">

                {/* Left Column: Form */}
                <div className="plan-form-card">
                    <div className="form-group-p">
                        <label><MapPin size={16} className="icon-emerald" /> Destination</label>
                        <select className="plan-input" defaultValue="Select your destination" style={{ cursor: 'pointer' }}>
                            <option value="Select your destination">Select your destination</option>
                            <option value="Hunza Valley">Hunza Valley</option>
                            <option value="Skardu">Skardu</option>
                            <option value="Naran Kaghan">Naran Kaghan</option>
                            <option value="Swat Valley">Swat Valley</option>
                            <option value="Murree">Murree</option>
                            <option value="Fairy Meadows">Fairy Meadows</option>
                            <option value="Neelum Valley">Neelum Valley</option>
                        </select>
                    </div>

                    <div className="form-group-p">
                        <label><DollarSign size={16} className="icon-emerald" /> Budget (PKR)</label>
                        <input type="text" placeholder="e.g. 50,000" className="plan-input" />
                    </div>

                    <div className="form-group-p">
                        <label><Users size={16} className="icon-emerald" /> Number of Travelers</label>
                        <input type="text" placeholder="e.g. 2" className="plan-input" />
                    </div>

                    <div className="form-group-p">
                        <label><Calendar size={16} className="icon-emerald" /> Trip Duration (Days)</label>
                        <input type="text" placeholder="e.g. 5" className="plan-input" />
                    </div>

                    <div className="form-group-p">
                        <label><Utensils size={16} className="icon-emerald" /> Food Preference</label>
                        <select className="plan-input" defaultValue="Local Cuisine" style={{ cursor: 'pointer' }}>
                            <option value="Local Cuisine">Local Cuisine</option>
                            <option value="International">International</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Mixed Options">Mixed Options</option>
                        </select>
                    </div>

                    <div className="form-group-p">
                        <label><Building size={16} className="icon-emerald" /> Accommodation Type</label>
                        <select className="plan-input" defaultValue="Hotel" style={{ cursor: 'pointer' }}>
                            <option value="Hotel">Hotel</option>
                            <option value="Resort">Resort</option>
                            <option value="Guest House">Guest House</option>
                            <option value="Camping">Camping</option>
                            <option value="Eco-Lodge">Eco-Lodge</option>
                        </select>
                    </div>

                    <div className="form-group-p">
                        <label><Truck size={16} className="icon-emerald" /> Transport Preference</label>
                        <select className="plan-input" defaultValue="Bus/Van (Most Eco-friendly)" style={{ cursor: 'pointer' }}>
                            <option value="Bus/Van (Most Eco-friendly)">Bus/Van (Most Eco-friendly)</option>
                            <option value="Train (Eco-friendly)">Train (Eco-friendly)</option>
                            <option value="Shared Car">Shared Car</option>
                            <option value="Private Car">Private Car</option>
                            <option value="Flight">Flight</option>
                        </select>
                    </div>

                    <button className="btn-generate" onClick={handleSaveTrip}>
                        <Sparkles size={18} /> Generate Smart Plan <span className="arrow">→</span>
                    </button>
                </div>

                {/* Right Column: AI Assistant & Stats */}
                <div className="plan-right-column">

                    <div className="ai-assistant-card">
                        <div className="ai-assistant-header">
                            <div className="ai-avatar">
                                <Sparkles size={20} color="white" />
                            </div>
                            <div className="ai-header-text">
                                <h3>AI Travel Assistant</h3>
                                <p>Powered by ExploreSmart</p>
                            </div>
                        </div>

                        <div className="ai-chat-bubble bubble-green">
                            <span>👋</span> Hello! I'll help you create the perfect Pakistan travel plan based on your preferences.
                        </div>

                        <div className="ai-chat-bubble bubble-blue">
                            <span>🎯</span> I'll consider weather conditions, budget constraints, and eco-friendly options.
                        </div>

                        <div className="ai-chat-bubble bubble-purple">
                            <span>✨</span> Fill out the form and I'll generate personalized recommendations instantly!
                        </div>
                    </div>

                    <div className="stats-grid-2">
                        <div className="stat-box">
                            <h2 className="text-emerald">10K+</h2>
                            <p>Plans Created</p>
                        </div>
                        <div className="stat-box">
                            <h2 className="text-emerald">98%</h2>
                            <p>Satisfaction</p>
                        </div>
                        <div className="stat-box">
                            <h2 className="text-blue">50+</h2>
                            <p>Destinations</p>
                        </div>
                        <div className="stat-box">
                            <h2 className="text-purple">24/7</h2>
                            <p>AI Support</p>
                        </div>
                    </div>

                </div>

            </div>

            {/* Floating Chat Widget */}
            <AIChatbot />

        </div>
    );
}

export default PlanTrip;
