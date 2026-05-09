import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map as MapIcon, Compass, Leaf, CloudSun, User,
    ArrowLeft, Palette, Sun, Moon, Monitor, MessageCircle, Sparkles, X, Send
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import AIChatbot from '../components/AIChatbot';
import './Appearance.css';

function Appearance() {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();
    const [selectedTheme, setSelectedTheme] = useState('light'); // 'light', 'dark', 'auto'

    return (
        <div className="appearance-page">
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

            <main className="appearance-main">
                <div className="appearance-container">

                    {/* Header Section */}
                    <div className="appearance-header-wrapper">
                        <div className="header-top">
                            <button className="back-btn" onClick={() => navigate('/home')}>
                                <ArrowLeft size={16} />
                                <span>Back to Home</span>
                            </button>
                        </div>

                        <div className="header-content-wrapper">
                            <div className="header-titles">
                                <h1>Appearance</h1>
                                <p>Customize how ExploreSmart looks for you</p>
                            </div>
                            <div className="header-icon-large purple-palette">
                                <Palette size={32} color="white" />
                            </div>
                        </div>
                    </div>

                    {/* Theme Card */}
                    <section className="appearance-card">
                        <div className="appearance-card-header">
                            <h2>Theme</h2>
                        </div>

                        <div className="appearance-card-body theme-options">
                            {/* Light Mode */}
                            <div 
                                className={`theme-option ${selectedTheme === 'light' ? 'selected' : ''}`}
                                onClick={() => setSelectedTheme('light')}
                            >
                                <div className="theme-icon-wrapper light-icon">
                                    <Sun size={24} />
                                </div>
                                <h3>Light Mode</h3>
                                <p>Clean and bright interface</p>
                            </div>

                            {/* Dark Mode */}
                            <div 
                                className={`theme-option ${selectedTheme === 'dark' ? 'selected' : ''}`}
                                onClick={() => setSelectedTheme('dark')}
                            >
                                <div className="theme-icon-wrapper dark-icon">
                                    <Moon size={24} />
                                </div>
                                <h3>Dark Mode</h3>
                                <p>Easy on the eyes at night</p>
                            </div>

                            {/* Auto Mode */}
                            <div 
                                className={`theme-option ${selectedTheme === 'auto' ? 'selected' : ''}`}
                                onClick={() => setSelectedTheme('auto')}
                            >
                                <div className="theme-icon-wrapper auto-icon">
                                    <Monitor size={24} />
                                </div>
                                <h3>Auto</h3>
                                <p>Matches system preference</p>
                            </div>
                        </div>
                    </section>
                    
                    <div className="save-btn-container">
                        <button className="btn-save-preferences">
                            Save Preferences
                        </button>
                    </div>

                </div>
            </main>

            {/* Floating Chat Widget */}
            <AIChatbot />
        </div>
    );
}

export default Appearance;
