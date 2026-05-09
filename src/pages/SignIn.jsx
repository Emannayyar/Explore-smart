import React, { useState } from 'react';
import { Mountain, Mail, Lock, Eye, EyeOff, MapPin, Plane } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignIn.css';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        if (email.trim() !== '') {
            login(email);
            navigate('/home');
        }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Background Decorators */}
            <div className="bg-decorator decorator-map">
                <MapPin size={40} strokeWidth={1.5} />
            </div>
            <div className="bg-decorator decorator-plane">
                <Plane size={40} strokeWidth={1.5} />
            </div>
            <div className="bg-decorator decorator-mountain">
                <Mountain size={40} strokeWidth={1.5} />
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Mountain size={28} color="white" />
                    </div>
                    <h2 className="auth-title">Welcome Back!</h2>
                    <p className="auth-subtitle">Sign in to continue your smart travel journey</p>
                </div>

                <form className="auth-form" onSubmit={handleSignIn}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Enter your email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="show-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span className="checkbox-custom"></span>
                            Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="submit-btn full-width">
                        Log In
                    </button>
                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login">
                    <button type="button" className="social-btn">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" height="18" /> Google
                    </button>
                    <button type="button" className="social-btn">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" width="18" height="18" /> Facebook
                    </button>
                </div>

                <p className="signup-prompt">
                    Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default SignIn;
