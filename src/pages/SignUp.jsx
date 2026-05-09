import React, { useState } from 'react';
import { Mountain, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignUp.css';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        if (email.trim() !== '') {
            login(email);
            navigate('/home');
        }
    };

    return (
        <div className="signup-page-wrapper">
            <div className="signup-container">

                {/* Left Panel */}
                <div className="signup-left">
                    <div className="brand-header">
                        <Link to="/" className="brand-logo-link">
                            <div className="brand-logo">
                                <Mountain size={28} color="white" />
                            </div>
                        </Link>
                        <div>
                            <h2 className="brand-name">ExploreSmart</h2>
                            <p className="brand-subtitle">AI Travel Planner</p>
                        </div>
                    </div>

                    <h1 className="left-hero-title">
                        Discover Pakistan's<br />Hidden Gems
                    </h1>

                    <p className="left-description">
                        Join thousands of travelers who trust ExploreSmart for intelligent, eco-friendly, and personalized travel planning across Pakistan.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="feature-icon-wrapper">
                                <Sparkles size={20} color="white" />
                            </div>
                            <div className="feature-content">
                                <h4 className="feature-title">AI-Powered Recommendations</h4>
                                <p className="feature-text">Personalized trip plans based on your preferences</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon-wrapper">
                                <Sparkles size={20} color="white" />
                            </div>
                            <div className="feature-content">
                                <h4 className="feature-title">Eco-Friendly Travel</h4>
                                <p className="feature-text">Make sustainable choices with our eco-score ratings</p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon-wrapper">
                                <Sparkles size={20} color="white" />
                            </div>
                            <div className="feature-content">
                                <h4 className="feature-title">Real-Time Updates</h4>
                                <p className="feature-text">Weather alerts and safety information</p>
                            </div>
                        </div>
                    </div>

                    <div className="stats-container">
                        <div className="stat-item">
                            <h3 className="stat-number">10K+</h3>
                            <p className="stat-label">Travelers</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-number">50+</h3>
                            <p className="stat-label">Destinations</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-number">98%</h3>
                            <p className="stat-label">Satisfaction</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="signup-right">
                    <div className="right-header">
                        <h2 className="welcome-title">Create Account</h2>
                        <p className="welcome-subtitle">Join us to start your journey</p>
                    </div>

                    <form className="signup-form" onSubmit={handleSignUp}>
                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={16} className="input-icon" color="#09b88a" /> Email Address
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <Lock size={16} className="input-icon" color="#09b88a" /> Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="show-password-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn full-width" style={{ marginTop: '1rem' }}>
                            <Sparkles size={18} /> Sign Up
                        </button>
                    </form>

                    <p className="login-prompt">
                        Already have an account? <Link to="/signin" className="login-link">Log In</Link>
                    </p>

                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-login">
                        <button className="social-btn">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" height="20" /> Google
                        </button>
                        <button className="social-btn">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width="20" height="20" /> Facebook
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SignUp;
