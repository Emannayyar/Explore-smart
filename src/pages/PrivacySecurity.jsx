import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map as MapIcon, Compass, Leaf, CloudSun, User,
    ArrowLeft, Shield, Lock, Eye, EyeOff, Database, Download, Trash2, UserX, Square, CheckSquare, Sparkles, X, MessageCircle, Send
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import AIChatbot from '../components/AIChatbot';
import './PrivacySecurity.css';

function PrivacySecurity() {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Privacy checkboxes
    const [showProfile, setShowProfile] = useState(true);
    const [shareStats, setShareStats] = useState(true);
    const [allowLocation, setAllowLocation] = useState(false);

    return (
        <div className="ps-page">
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

            <main className="ps-main">
                <div className="ps-container">

                    {/* Header Section */}
                    <div className="ps-header-wrapper">
                        <div className="header-top">
                            <button className="back-btn" onClick={() => navigate('/home')}>
                                <ArrowLeft size={16} />
                                <span>Back to Home</span>
                            </button>
                        </div>

                        <div className="header-content-wrapper">
                            <div className="header-titles">
                                <h1>Privacy & Security</h1>
                                <p>Manage your data and security settings</p>
                            </div>
                            <div className="header-icon-large orange-shield">
                                <Shield size={32} color="white" />
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Password & Authentication */}
                    <section className="ps-card">
                        <div className="ps-card-header">
                            <div className="ps-icon-wrapper bg-blue-100">
                                <Lock size={20} color="#3b82f6" />
                            </div>
                            <h2>Password & Authentication</h2>
                        </div>

                        <div className="ps-card-body">
                            <div className="form-group">
                                <label>Current Password</label>
                                <div className="input-with-icon">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        className="btn-eye"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" placeholder="Enter new password" />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" placeholder="Confirm new password" />
                            </div>

                            <button className="btn-update-password">
                                Update Password
                            </button>

                            <div className="two-factor-box">
                                <div className="tf-info">
                                    <h4>Two-Factor Authentication</h4>
                                    <p>Add an extra layer of security to your account</p>
                                </div>
                                <div
                                    className={`tf-toggle ${twoFactorEnabled ? 'active' : ''}`}
                                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                >
                                    <div className="tf-thumb"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Privacy Settings */}
                    <section className="ps-card">
                        <div className="ps-card-header">
                            <div className="ps-icon-wrapper bg-purple-100">
                                <Eye size={20} color="#a855f7" />
                            </div>
                            <h2>Privacy Settings</h2>
                        </div>

                        <div className="ps-card-body p-0 gap-0">
                            <div className="privacy-option" onClick={() => setShowProfile(!showProfile)}>
                                <div className="checkbox-wrapper">
                                    {showProfile ?
                                        <div className="custom-check checked"><CheckSquare size={20} color="#a855f7" /></div> :
                                        <div className="custom-check"><Square size={20} color="#cbd5e1" /></div>
                                    }
                                </div>
                                <div className="option-text">
                                    <h4>Show my profile to other travelers</h4>
                                    <p>Allow others to discover your profile</p>
                                </div>
                            </div>

                            <div className="privacy-option" onClick={() => setShareStats(!shareStats)}>
                                <div className="checkbox-wrapper">
                                    {shareStats ?
                                        <div className="custom-check checked"><CheckSquare size={20} color="#a855f7" /></div> :
                                        <div className="custom-check"><Square size={20} color="#cbd5e1" /></div>
                                    }
                                </div>
                                <div className="option-text">
                                    <h4>Share my travel statistics</h4>
                                    <p>Help improve recommendations for everyone</p>
                                </div>
                            </div>

                            <div className="privacy-option" onClick={() => setAllowLocation(!allowLocation)}>
                                <div className="checkbox-wrapper">
                                    {allowLocation ?
                                        <div className="custom-check checked black-check"><CheckSquare size={20} color="#334155" /></div> :
                                        <div className="custom-check"><Square size={20} color="#334155" fill="#334155" /></div>
                                    }
                                </div>
                                <div className="option-text">
                                    <h4>Allow location tracking</h4>
                                    <p>Enhance location-based recommendations</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Data Management */}
                    <section className="ps-card">
                        <div className="ps-card-header">
                            <div className="ps-icon-wrapper bg-teal-100">
                                <Database size={20} color="#14b8a6" />
                            </div>
                            <h2>Data Management</h2>
                        </div>

                        <div className="ps-card-body p-0 gap-0">
                            <div className="data-option border-bottom">
                                <div className="data-option-left">
                                    <Download size={20} color="#14b8a6" />
                                    <div className="data-text">
                                        <h4>Download My Data</h4>
                                        <p>Get a copy of your information</p>
                                    </div>
                                </div>
                                <div className="data-arrow arrow-teal">→</div>
                            </div>

                            <div className="data-option">
                                <div className="data-option-left">
                                    <Trash2 size={20} color="#ef4444" />
                                    <div className="data-text">
                                        <h4>Clear Browsing Data</h4>
                                        <p>Remove search history and cached data</p>
                                    </div>
                                </div>
                                <div className="data-arrow arrow-red">→</div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Danger Zone */}
                    <section className="ps-card danger-zone">
                        <div className="ps-card-header danger-header">
                            <div className="ps-icon-wrapper bg-red-100">
                                <UserX size={20} color="#ef4444" />
                            </div>
                            <h2>Danger Zone</h2>
                        </div>

                        <div className="danger-box">
                            <h4>Delete Account</h4>
                            <p>Once you delete your account, there is no going back. This action is permanent and will remove all your data.</p>
                            <button className="btn-delete-account">
                                Delete My Account
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Floating Chat Widget */}
            <AIChatbot />
        </div>
    );
}

export default PrivacySecurity;
