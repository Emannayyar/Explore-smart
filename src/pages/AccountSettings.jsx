import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map as MapIcon, Compass, Leaf, CloudSun, User,
    ArrowLeft, Save, Square, CheckSquare, MessageCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import AIChatbot from '../components/AIChatbot';
import './AccountSettings.css';

function AccountSettings() {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();

    // Form State
    const [phone, setPhone] = useState('+92 300 1234567');
    const [location, setLocation] = useState('City, Country');
    const [about, setAbout] = useState('');

    // Preferences State
    const [ecoFriendly, setEcoFriendly] = useState(false);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [marketing, setMarketing] = useState(false);

    const handleSaveChanges = () => {
        // Implementation for saving changes
        console.log("Saving changes...");
    };

    return (
        <div className="account-settings-page">
            <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

            {/* Top Navigation - Light Theme */}
            <nav className="top-nav-light">
                <div className="logo cursor-pointer" onClick={() => navigate('/home')}>
                    <div className="logo-icon bg-green-nav">
                        <Mountain color="white" size={24} />
                    </div>
                    <div className="logo-text">
                        <h1 className="text-dark">ExploreSmart</h1>
                        <p className="text-green">AI Travel Planner</p>
                    </div>
                </div>

                <div className="nav-links">
                    <Link to="/home" className="nav-link text-dark"><HomeIcon size={18} /> Home</Link>
                    <Link to="/plan" className="nav-link text-dark"><MapIcon size={18} /> Plan Trip</Link>
                    <Link to="/explore" className="nav-link text-dark"><Compass size={18} /> Explore Trips</Link>
                    <Link to="/eco" className="nav-link text-dark"><Leaf size={18} /> Eco Insights</Link>
                    <Link to="/weather" className="nav-link text-dark"><CloudSun size={18} /> Weather</Link>
                </div>

                <div className="profile-section cursor-pointer" onClick={() => setIsProfileOpen(true)}>
                    <div className="profile-icon">
                        <User size={18} color="white" />
                    </div>
                    <div className="profile-text">
                        <span className="profile-name text-dark">{user?.displayName || 'Guest'}</span>
                        <span className="profile-action">View Profile</span>
                    </div>
                </div>
            </nav>

            <main className="settings-main">
                <button className="back-btn" onClick={() => navigate('/home')}>
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div className="settings-header-title">
                    <h1>Account Settings</h1>
                    <p>Manage your profile and preferences</p>
                </div>

                {/* Profile Information Section */}
                <section className="settings-form-section">
                    <h2>Profile Information</h2>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label><User size={16} className="input-icon" /> Full Name</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={user?.displayName || 'Guest'} 
                                readOnly
                                disabled
                            />
                        </div>
                        
                        <div className="form-group">
                            <label><CloudSun size={16} className="input-icon opacity-0" /> Email Address</label>
                            <input 
                                type="email" 
                                className="form-input" 
                                value={user?.email || 'guest@example.com'} 
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label><Compass size={16} className="input-icon opacity-0" /> Phone Number</label>
                            <input 
                                type="tel" 
                                className="form-input" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label><MapIcon size={16} className="input-icon" /> Location</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <div className="form-group full-width mt-4">
                        <label>About Me</label>
                        <textarea 
                            className="form-input textarea" 
                            placeholder="Tell us about yourself and your travel interests..."
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={4}
                        ></textarea>
                    </div>
                </section>

                {/* Travel Preferences Section */}
                <section className="settings-form-section mt-6">
                    <h2>Travel Preferences</h2>
                    
                    <div className="preferences-list">
                        <div 
                            className={`preference-card ${ecoFriendly ? 'active' : ''}`}
                            onClick={() => setEcoFriendly(!ecoFriendly)}
                        >
                            <div className="pref-checkbox">
                                {ecoFriendly ? <CheckSquare size={22} className="text-purple-500" /> : <Square size={22} className="text-gray-400" />}
                            </div>
                            <div className="pref-content">
                                <h3>Prefer Eco-Friendly Options</h3>
                                <p>Prioritize sustainable travel recommendations</p>
                            </div>
                        </div>

                        <div 
                            className={`preference-card ${emailAlerts ? 'active' : ''}`}
                            onClick={() => setEmailAlerts(!emailAlerts)}
                        >
                            <div className="pref-checkbox">
                                {emailAlerts ? <CheckSquare size={22} className="text-purple-500" /> : <Square size={22} className="text-gray-400" />}
                            </div>
                            <div className="pref-content">
                                <h3>Email Notifications</h3>
                                <p>Receive trip updates and recommendations</p>
                            </div>
                        </div>

                        <div 
                            className={`preference-card ${marketing ? 'active' : ''}`}
                            onClick={() => setMarketing(!marketing)}
                        >
                            <div className="pref-checkbox">
                                {marketing ? <CheckSquare size={22} className="text-purple-500" /> : <Square size={22} className="text-gray-400" />}
                            </div>
                            <div className="pref-content">
                                <h3>Marketing Communications</h3>
                                <p>Get travel deals and special offers</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Actions */}
            <div className="floating-actions">
                <button className="btn-save-changes" onClick={handleSaveChanges}>
                    <Save size={18} /> Save Changes
                </button>
                <div className="chat-widget-wrapper">
                    <AIChatbot />
                </div>
            </div>
        </div>
    );
}

export default AccountSettings;
