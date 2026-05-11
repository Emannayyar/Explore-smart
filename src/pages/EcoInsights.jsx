import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map as MapIcon, Compass, Leaf, CloudSun, User,
    MapPin, Users, Clock, Plane, Train, Bus, Car, Building2, Tent, Home as HouseIcon,
    AlertTriangle, CheckCircle2, Zap, ArrowRight, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import AIChatbot from '../components/AIChatbot';
import './EcoInsights.css';

function EcoInsights() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();
    
    // Form State
    const [destination, setDestination] = useState('');
    const [travelers, setTravelers] = useState('');
    const [duration, setDuration] = useState('');
    const [transportType, setTransportType] = useState('');
    const [accommodationType, setAccommodationType] = useState('');
    
    // Result State
    const [isCalculated, setIsCalculated] = useState(false);

    const isFormValid = destination !== '' && travelers !== '' && duration !== '' && transportType !== '' && accommodationType !== '';

    const handleCalculate = () => {
        if (isFormValid) {
            setIsCalculated(true);
        }
    };

    return (
        <div className="eco-page">
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
                    <Link to="/eco" className="nav-link text-dark active">
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

            <main className="eco-main">
                <div className="eco-header-centered">
                    <div className="eco-badge-main">
                        <Leaf size={14} /> Eco-Score Calculator
                    </div>
                    <h1 className="eco-main-title">Eco-Friendly Travel Insights</h1>
                    <p className="eco-main-subtitle">
                        Calculate your trip's environmental impact and get<br />
                        personalized sustainability recommendations
                    </p>
                </div>

                <div className="eco-layout">
                    {/* Left Column: Form */}
                    <div className="eco-form-column">
                        <div className="form-section-title">
                            <Leaf size={20} className="text-emerald-500" />
                            <h2>Trip Details</h2>
                        </div>

                        <div className="eco-form-group">
                            <label><MapPin size={16} className="text-emerald-500" /> Destination</label>
                            <select className="eco-input" value={destination} onChange={(e) => setDestination(e.target.value)}>
                                <option value="" disabled>Select destination</option>
                                <option value="Hunza Valley">Hunza Valley</option>
                                <option value="Skardu">Skardu</option>
                                <option value="Naran Kaghan">Naran Kaghan</option>
                                <option value="Swat Valley">Swat Valley</option>
                                <option value="Murree">Murree</option>
                                <option value="Fairy Meadows">Fairy Meadows</option>
                                <option value="Neelum Valley">Neelum Valley</option>
                            </select>
                        </div>

                        <div className="eco-form-group">
                            <label><Users size={16} className="text-emerald-500" /> Number of Travelers</label>
                            <input type="number" min="1" placeholder="e.g., 4" className="eco-input" value={travelers} onChange={(e) => setTravelers(e.target.value)} />
                            <span className="eco-help-text">Larger groups reduce per-person environmental impact</span>
                        </div>

                        <div className="eco-form-group">
                            <label><Clock size={16} className="text-emerald-500" /> Trip Duration (days)</label>
                            <input type="number" min="1" placeholder="e.g., 5" className="eco-input" value={duration} onChange={(e) => setDuration(e.target.value)} />
                        </div>

                        {/* Transport Type */}
                        <div className="eco-selection-group">
                            <label><Car size={16} className="text-emerald-500" /> Transport Type</label>
                            <div className="selection-grid">
                                <div className={`selection-card ${transportType === 'Flight' ? 'selected' : ''}`} onClick={() => setTransportType('Flight')}>
                                    <Plane size={20} className={transportType === 'Flight' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Flight</span>
                                    <span className="impact-indicator impact-high"><span className="dot dot-red"></span> High impact</span>
                                </div>
                                <div className={`selection-card ${transportType === 'Train' ? 'selected' : ''}`} onClick={() => setTransportType('Train')}>
                                    <Train size={20} className={transportType === 'Train' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Train</span>
                                    <span className="impact-indicator impact-low"><span className="dot dot-green"></span> Low impact</span>
                                </div>
                                <div className={`selection-card ${transportType === 'Bus/Van' ? 'selected' : ''}`} onClick={() => setTransportType('Bus/Van')}>
                                    <Bus size={20} className={transportType === 'Bus/Van' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Bus/Van</span>
                                    <span className="impact-indicator impact-low"><span className="dot dot-green"></span> Low impact</span>
                                </div>
                                <div className={`selection-card ${transportType === 'Shared Car' ? 'selected' : ''}`} onClick={() => setTransportType('Shared Car')}>
                                    <Car size={20} className={transportType === 'Shared Car' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Shared Car</span>
                                    <span className="impact-indicator impact-medium"><span className="dot dot-orange"></span> Medium impact</span>
                                </div>
                                <div className={`selection-card ${transportType === 'Private Car' ? 'selected' : ''}`} onClick={() => setTransportType('Private Car')}>
                                    <Car size={20} className={transportType === 'Private Car' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Private Car</span>
                                    <span className="impact-indicator impact-high"><span className="dot dot-red"></span> High impact</span>
                                </div>
                            </div>
                        </div>

                        {/* Accommodation Type */}
                        <div className="eco-selection-group">
                            <label><Building2 size={16} className="text-emerald-500" /> Accommodation Type</label>
                            <div className="selection-grid-2">
                                <div className={`selection-card ${accommodationType === 'Eco-Lodge' ? 'selected' : ''}`} onClick={() => setAccommodationType('Eco-Lodge')}>
                                    <Leaf size={20} className={accommodationType === 'Eco-Lodge' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Eco-Lodge</span>
                                    <span className="impact-indicator impact-low"><span className="dot dot-green"></span> Low impact</span>
                                </div>
                                <div className={`selection-card ${accommodationType === 'Camping' ? 'selected' : ''}`} onClick={() => setAccommodationType('Camping')}>
                                    <Tent size={20} className={accommodationType === 'Camping' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Camping</span>
                                    <span className="impact-indicator impact-low"><span className="dot dot-green"></span> Low impact</span>
                                </div>
                                <div className={`selection-card ${accommodationType === 'Standard Hotel' ? 'selected' : ''}`} onClick={() => setAccommodationType('Standard Hotel')}>
                                    <Building2 size={20} className={accommodationType === 'Standard Hotel' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Standard Hotel</span>
                                    <span className="impact-indicator impact-medium"><span className="dot dot-orange"></span> Medium impact</span>
                                </div>
                                <div className={`selection-card ${accommodationType === 'Resort' ? 'selected' : ''}`} onClick={() => setAccommodationType('Resort')}>
                                    <HouseIcon size={20} className={accommodationType === 'Resort' ? 'text-emerald-600' : 'text-slate-500'} />
                                    <span className="card-title">Resort</span>
                                    <span className="impact-indicator impact-high"><span className="dot dot-red"></span> High impact</span>
                                </div>
                            </div>
                        </div>

                        {isFormValid ? (
                            <button className="btn-calculate-eco" onClick={handleCalculate}>
                                Calculate Eco-Score
                            </button>
                        ) : (
                            <button className="btn-calculate-eco" disabled>
                                Fill all fields to calculate
                            </button>
                        )}
                    </div>

                    {/* Right Column: Insights */}
                    <div className="eco-insights-column" style={!isCalculated ? { height: '100%' } : {}}>
                        {!isCalculated ? (
                            <div className="eco-insights-empty">
                                <div className="empty-icon-wrapper">
                                    <Leaf size={32} className="text-slate-400" />
                                </div>
                                
                                <div className="empty-score-badge">
                                    <span className="empty-line"></span> N/A
                                </div>
                                
                                <h2 className="empty-title">Your Eco-Score will appear here</h2>
                                <p className="empty-subtitle">
                                    Fill in your trip details to calculate your environmental<br />
                                    impact and get personalized sustainability tips
                                </p>
                                
                                <div className="empty-tip-box">
                                    <Info size={16} className="text-blue-500" />
                                    <p><strong>Tip:</strong> Choose eco-friendly transport and accommodations to improve your score!</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Score Card */}
                                <div className="eco-score-card">
                                    <div className="score-card-header">
                                        <h2>Your Eco-Score</h2>
                                        <Leaf size={24} color="white" />
                                    </div>
                                    <div className="score-card-body">
                                        <div className="circular-progress">
                                            <svg viewBox="0 0 36 36" className="circular-chart orange">
                                                <path className="circle-bg"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <path className="circle"
                                                    strokeDasharray="71, 100"
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <text x="18" y="16.5" className="percentage">71</text>
                                                <text x="18" y="22" className="percentage-sub">/ 100</text>
                                            </svg>
                                        </div>
                                        <div className="score-info">
                                            <span className="score-badge badge-orange">Medium</span>
                                            <p>Good, but can improve</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="breakdown-card">
                                    <div className="breakdown-header">
                                        <Info size={18} className="text-emerald-600" />
                                        <h3>Impact Breakdown</h3>
                                    </div>
                                    <div className="breakdown-list">
                                        <div className="breakdown-item">
                                            <div className="bd-label">
                                                <Car size={16} className="text-slate-500" /> Transport
                                            </div>
                                            <div className="bd-bar-container">
                                                <div className="bd-bar bg-red-500" style={{ width: '40%' }}></div>
                                            </div>
                                            <div className="bd-value text-red-500">40/100</div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div className="bd-label">
                                                <Users size={16} className="text-slate-500" /> Group Size
                                            </div>
                                            <div className="bd-bar-container">
                                                <div className="bd-bar bg-green-500" style={{ width: '80%' }}></div>
                                            </div>
                                            <div className="bd-value text-green-500">80/100</div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div className="bd-label">
                                                <Building2 size={16} className="text-slate-500" /> Accommodation
                                            </div>
                                            <div className="bd-bar-container">
                                                <div className="bd-bar bg-green-500" style={{ width: '98%' }}></div>
                                            </div>
                                            <div className="bd-value text-green-500">98/100</div>
                                        </div>
                                        <div className="breakdown-item">
                                            <div className="bd-label">
                                                <Clock size={16} className="text-slate-500" /> Duration
                                            </div>
                                            <div className="bd-bar-container">
                                                <div className="bd-bar bg-green-500" style={{ width: '80%' }}></div>
                                            </div>
                                            <div className="bd-value text-green-500">80/100</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Carbon Footprint */}
                                <div className="footprint-card">
                                    <div className="footprint-icon bg-blue-500">
                                        <CloudSun size={20} color="white" />
                                    </div>
                                    <div className="footprint-content">
                                        <h4>Estimated Carbon Footprint</h4>
                                        <h2 className="text-blue-600">20 tons CO₂</h2>
                                        <p>For your 4-day trip with 4 travelers</p>
                                    </div>
                                </div>

                                {/* Personalized Tips */}
                                <div className="tips-card">
                                    <div className="tips-header">
                                        <CheckCircle2 size={18} className="text-emerald-600" />
                                        <h3>Personalized Tips</h3>
                                    </div>
                                    <ul className="tips-list">
                                        <li>
                                            <div className="tip-check bg-emerald-100 text-emerald-600"><CheckCircle2 size={14}/></div>
                                            Consider using train or shared transport to reduce carbon emissions.
                                        </li>
                                        <li>
                                            <div className="tip-check bg-emerald-100 text-emerald-600"><CheckCircle2 size={14}/></div>
                                            Use reusable water bottles and minimize plastic waste.
                                        </li>
                                        <li>
                                            <div className="tip-check bg-emerald-100 text-emerald-600"><CheckCircle2 size={14}/></div>
                                            Support local businesses and artisans during your trip.
                                        </li>
                                    </ul>
                                </div>

                                {/* Personalized Recommendations List */}
                                <div className="recommendations-container">
                                    <div className="rec-header-top">
                                        <div className="rec-icon-wrapper bg-yellow-400">
                                            <Zap size={20} color="white" />
                                        </div>
                                        <h2>Personalized Environmental Recommendations</h2>
                                    </div>

                                    <div className="rec-list">
                                        <div className="rec-item">
                                            <Zap size={20} className="text-yellow-500" />
                                            <div className="rec-text">
                                                <h4>Good Progress - Score: 71/100</h4>
                                                <p>You're on the right track! Follow these suggestions to improve your environmental impact.</p>
                                            </div>
                                        </div>

                                        <div className="rec-item alert-border">
                                            <AlertTriangle size={20} className="text-orange-500" />
                                            <div className="rec-text">
                                                <h4 className="text-orange-600">Transport Impact: 40/100</h4>
                                                <p>Flights emit 10x more CO₂ than buses/trains. For domestic Pakistan trips, consider trains or buses to reduce emissions by up to 80%.</p>
                                                <div className="tip-badge bg-emerald-50 text-emerald-700">
                                                    <Leaf size={12}/> Tip: Train to Hunza saves 2.5 tons CO₂ vs flight
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rec-item">
                                            <Building2 size={20} className="text-emerald-600" />
                                            <div className="rec-text">
                                                <h4 className="text-emerald-700">Accommodation: 98/100 - Outstanding!</h4>
                                                <p>Excellent eco-friendly accommodation choice! You're supporting sustainable tourism and local communities.</p>
                                            </div>
                                        </div>

                                        <div className="rec-item">
                                            <Users size={20} className="text-blue-500" />
                                            <div className="rec-text">
                                                <h4 className="text-blue-700">Group Size: 80/100 - Efficient!</h4>
                                                <p>Good group size of 4 travelers. Sharing resources reduces per-person environmental impact significantly.</p>
                                            </div>
                                        </div>

                                        <div className="rec-item">
                                            <Leaf size={20} className="text-emerald-500" />
                                            <div className="rec-text">
                                                <h4 className="text-emerald-700">Carbon Offset Opportunity</h4>
                                                <p>Your trip produces 20 tons CO₂. Offset this by planting 200 trees or donating to Pakistan's forest restoration projects.</p>
                                            </div>
                                        </div>

                                        <div className="rec-item">
                                            <CheckCircle2 size={20} className="text-emerald-600" />
                                            <div className="rec-text">
                                                <h4 className="text-emerald-700">Essential Eco-Practices for Your 4-Day Trip</h4>
                                                <ul className="mini-bullet-list">
                                                    <li>Carry reusable water bottles - saves 40 plastic bottles</li>
                                                    <li>Use biodegradable soap and avoid single-use plastics</li>
                                                    <li>Stay on marked trails to protect fragile ecosystems</li>
                                                    <li>Support local businesses - buy from artisans, eat at local restaurants</li>
                                                    <li>Take all trash with you - leave Hunza Valley cleaner than you found it</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="rec-item">
                                            <Mountain size={20} className="text-purple-500" />
                                            <div className="rec-text">
                                                <h4 className="text-purple-700">Mountain Region Special Care</h4>
                                                <p>Hunza Valley is a fragile mountain ecosystem. Respect altitude limits, don't disturb wildlife, avoid littering on trails, and support local conservation efforts to preserve its natural beauty.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-explore-packages">
                                    Explore Eco-Friendly Packages
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <AIChatbot />
        </div>
    );
}

export default EcoInsights;
