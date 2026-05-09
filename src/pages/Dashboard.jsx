import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map as MapIcon, Compass, Leaf, CloudSun, User,
    MapPin, TrendingUp, Award, MessageCircle, Users, Settings, Lock, Mail,
    Sparkles, X, Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import { useTripContext } from '../context/TripContext';
import AIChatbot from '../components/AIChatbot';
import './Dashboard.css';

function Dashboard() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('My Trips');
    const { user } = useAuth();
    const { savedTripsCount } = useTripContext();

    return (
        <div className="dashboard-page">
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
                    <Link to="/weather" className="nav-link text-dark">
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

            <main className="dashboard-main">
                {/* Header Profile Section */}
                <header className="dashboard-header">
                    <div className="header-avatar">
                        <User size={40} color="white" />
                    </div>
                    <div className="header-info">
                        <h1>My Dashboard</h1>
                        <p>Welcome back,<br />{user?.displayName || 'Guest'}!</p>
                    </div>
                </header>

                {/* Stats Cards Section */}
                <section className="stats-cards-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <MapPin size={24} className="text-blue-500" />
                            <span className="stat-label-small">Total</span>
                        </div>
                        <h2>{savedTripsCount}</h2>
                        <p>Saved Trips</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <Leaf size={24} className="text-green-500" />
                            <span className="stat-label-small">High</span>
                        </div>
                        <h2>{savedTripsCount > 0 ? savedTripsCount : 0}</h2>
                        <p>Eco-Friendly Trips</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <TrendingUp size={24} className="text-purple-500" />
                            <span className="stat-label-small">Score</span>
                        </div>
                        <h2>{savedTripsCount > 0 ? '85%' : '0%'}</h2>
                        <p>Eco Rating</p>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <Award size={24} className="text-yellow-500" />
                            <span className="stat-label-small">Impact</span>
                        </div>
                        <h2>{savedTripsCount > 0 ? (savedTripsCount * 1.5).toFixed(1) : 0}</h2>
                        <p>Tons CO₂ Saved</p>
                    </div>
                </section>

                {/* Content Tabs area */}
                <section className="dashboard-content-area">
                    <div className="tabs-container">
                        <div className="tabs-nav">
                            <div
                                className={`tab-item ${activeTab === 'My Trips' ? 'active' : ''}`}
                                onClick={() => setActiveTab('My Trips')}
                            >
                                <span>My Trips</span>
                            </div>
                            <div
                                className={`tab-item ${activeTab === 'Eco-Impact Summary' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Eco-Impact Summary')}
                            >
                                <span>Eco-Impact Summary</span>
                            </div>
                            <div
                                className={`tab-item ${activeTab === 'Account Settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Account Settings')}
                            >
                                <span>Account Settings</span>
                            </div>
                        </div>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'My Trips' && (
                            savedTripsCount === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon-wrapper">
                                        <MapPin size={48} className="text-slate-300" strokeWidth={1.5} />
                                    </div>
                                    <h3>No saved trips yet</h3>
                                    <p>Start planning your dream trip to Pakistan!</p>
                                    <Link to="/plan">
                                        <button className="btn-plan-first">Plan Your First Trip</button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon-wrapper">
                                        <MapPin size={48} className="text-green-500" strokeWidth={1.5} />
                                    </div>
                                    <h3>You have {savedTripsCount} saved {savedTripsCount === 1 ? 'trip' : 'trips'}!</h3>
                                    <p>Ready to start your adventure in Pakistan?</p>
                                    <Link to="/plan">
                                        <button className="btn-plan-first" style={{ marginTop: '1rem' }}>Plan Another Trip</button>
                                    </Link>
                                </div>
                            )
                        )}

                        {activeTab === 'Eco-Impact Summary' && (
                            <div className="eco-impact-summary">
                                <h2 className="section-title">Your Environmental Impact</h2>

                                <div className="overall-score-card">
                                    <div className="score-info">
                                        <h3>Overall Eco-Score</h3>
                                        <p>Based on your travel choices</p>
                                    </div>
                                    <div className="score-value">
                                        <span className="huge-number">{savedTripsCount > 0 ? '85' : '0'}</span>
                                        <span className="score-denominator">out of 100</span>
                                    </div>
                                </div>

                                <div className="impact-cards-row">
                                    <div className="impact-card footprint-card">
                                        <Leaf size={28} className="icon-green mb-3" />
                                        <h4>Carbon Footprint</h4>
                                        <div className="impact-value text-green-dark">
                                            {savedTripsCount > 0 ? (savedTripsCount * 1.5).toFixed(1) : '0'} tons
                                        </div>
                                        <p>CO₂ saved through eco-friendly choices</p>
                                    </div>

                                    <div className="impact-card group-card">
                                        <Users size={28} className="icon-blue mb-3" />
                                        <h4>Group Travel Impact</h4>
                                        <div className="impact-value text-blue-dark">35%</div>
                                        <p>Lower per-person environmental impact</p>
                                    </div>
                                </div>

                                <div className="achievements-section">
                                    <div className="achievement-header">
                                        <Award size={20} className="text-orange" />
                                        <h3>Eco-Friendly Achievements</h3>
                                    </div>
                                    <div className="achievement-item">
                                        <div className="achievement-icon bg-green-solid">
                                            <Leaf size={16} color="white" />
                                        </div>
                                        <div className="achievement-text">
                                            <h4>Eco Warrior</h4>
                                            <p>{savedTripsCount} high eco-score trips planned</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Account Settings' && (
                            <div className="account-settings-content">
                                <h2 className="section-title">Account Settings</h2>

                                <div className="settings-section">
                                    <div className="settings-header">
                                        <User size={18} className="icon-emerald-dark" />
                                        <h3>Profile Information</h3>
                                    </div>
                                    <div className="settings-body">
                                        <div className="form-group-acc">
                                            <label>Full Name</label>
                                            <input type="text" className="settings-input" defaultValue={user?.displayName || "Guest"} />
                                        </div>
                                        <div className="form-group-acc">
                                            <label><Mail size={14} className="icon-emerald-dark" /> Email Address</label>
                                            <input type="email" className="settings-input" defaultValue={user?.email || "No email provided"} />
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-section">
                                    <div className="settings-header">
                                        <Settings size={18} className="icon-emerald-dark" />
                                        <h3>Travel Preferences</h3>
                                    </div>
                                    <div className="settings-body">
                                        <div className="pref-item">
                                            <div className="pref-text">
                                                <h4>Prefer eco-friendly options</h4>
                                                <p>Prioritize sustainable travel choices</p>
                                            </div>
                                            <div className="toggle-switch active">
                                                <div className="toggle-thumb"></div>
                                            </div>
                                        </div>
                                        <div className="pref-item border-top">
                                            <div className="pref-text">
                                                <h4>Email notifications</h4>
                                                <p>Receive trip recommendations and alerts</p>
                                            </div>
                                            <div className="toggle-switch disabled">
                                                <div className="toggle-thumb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-section">
                                    <div className="settings-header">
                                        <Lock size={18} className="icon-emerald-dark" />
                                        <h3>Change Password</h3>
                                    </div>
                                    <div className="settings-body">
                                        <div className="form-group-acc">
                                            <label>Current Password</label>
                                            <input type="password" className="settings-input" placeholder="Enter current password" />
                                        </div>
                                        <div className="form-group-acc">
                                            <label>New Password</label>
                                            <input type="password" className="settings-input" placeholder="Enter new password" />
                                        </div>
                                        <div className="form-group-acc">
                                            <label>Confirm New Password</label>
                                            <input type="password" className="settings-input" placeholder="Confirm new password" />
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-save-settings">
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Floating Chat Widget */}
            <AIChatbot />
        </div>
    );
}

export default Dashboard;
