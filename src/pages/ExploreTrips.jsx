import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map, Compass, Leaf, CloudSun, User, Sparkles,
    Heart, MapPin, Star, Calendar, Sun, Cloud, Info, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import AIChatbot from '../components/AIChatbot';
import './ExploreTrips.css';

const packages = [
    {
        id: 1,
        image: '/assets/hunza_valley.png',
        ecoLevel: 'High',
        title: 'Hunza Valley Premium Experience',
        location: 'Hunza Valley',
        rating: 4.9,
        reviews: 234,
        duration: '5 days',
        weather: 'Excellent',
        tags: ['Attabad Lake', 'Baltit Fort', 'Eagle Nest'],
        price: '45,000',
    },
    {
        id: 2,
        image: '/assets/hero_bg.png',
        ecoLevel: 'High',
        title: 'Northern Areas Adventure',
        location: 'Skardu & Hunza',
        rating: 4.8,
        reviews: 189,
        duration: '7 days',
        weather: 'Good',
        tags: ['Shangrila Resort', 'Deosai Plains', 'Satpara Lake'],
        price: '52,000',
    },
    {
        id: 3,
        image: '/assets/attabad_lake.png',
        ecoLevel: 'Medium',
        title: 'Scenic Lakes Tour',
        location: 'Naran Kaghan',
        rating: 4.7,
        reviews: 156,
        duration: '4 days',
        weather: 'Excellent',
        tags: ['Saif-ul-Malook', 'Lulusar Lake', 'Babusar Top'],
        price: '38,000',
    },
    {
        id: 4,
        image: '/assets/Mirpur AJK PAKISTAN.jpg',
        ecoLevel: 'Low',
        title: 'Heritage & Culture Experience',
        location: 'Murree',
        rating: 4.6,
        reviews: 203,
        duration: '3 days',
        weather: 'Good',
        tags: ['Badshahi Mosque', 'Lahore Fort', 'Food Street'],
        price: '28,000',
    },
    {
        id: 5,
        image: '/assets/Swat valley.jpg',
        ecoLevel: 'High',
        title: 'Mountain Paradise Package',
        location: 'Swat Valley',
        rating: 4.8,
        reviews: 178,
        duration: '5 days',
        weather: 'Excellent',
        tags: ['Kalam Valley', 'Malam Jabba', 'Ushu Forest'],
        price: '42,000',
    },
    {
        id: 6,
        image: '/assets/Fairy_meadows.png',
        ecoLevel: 'Medium',
        title: 'Coastal Getaway',
        location: 'Fairy meadows',
        rating: 4.5,
        reviews: 142,
        duration: '4 days',
        weather: 'Good',
        tags: ['Beach Resorts', 'Clifton', 'Port Grand'],
        price: '35,000',
    }
];

function ExploreTrips() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="explore-page">
            <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} username="amanjawaid434" email="amanjawaid434@gmail.com" />

            {/* Top Navigation */}
            <nav className="top-nav">
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
                        <HomeIcon size={16} /> Home
                    </Link>
                    <Link to="/plan" className="nav-link">
                        <Map size={16} /> Plan Trip
                    </Link>
                    <Link to="/explore" className="nav-link active">
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

            <main className="explore-content">
                <h1 className="explore-title">Recommended Travel Packages</h1>

                <div className="packages-grid">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="package-card">
                            <div className="card-image-wrapper">
                                <img src={pkg.image} alt={pkg.title} className="card-image" />
                                <button className="heart-btn">
                                    <Heart size={18} color="#64748b" />
                                </button>
                                <div className={`eco-badge eco-${pkg.ecoLevel.toLowerCase()}`}>
                                    <Leaf size={14} /> Eco: {pkg.ecoLevel}
                                </div>
                            </div>

                            <div className="card-body">
                                <h3 className="card-title">{pkg.title}</h3>
                                
                                <div className="card-location">
                                    <MapPin size={14} color="#10b981" />
                                    <span>{pkg.location}</span>
                                </div>

                                <div className="card-stats">
                                    <div className="stat-item">
                                        <Star size={14} fill="#facc15" color="#facc15" />
                                        <span className="rating-score">{pkg.rating}</span>
                                        <span className="rating-count">({pkg.reviews})</span>
                                    </div>
                                    <div className="stat-item">
                                        <Calendar size={14} color="#64748b" />
                                        <span>{pkg.duration}</span>
                                    </div>
                                </div>

                                <div className="card-weather">
                                    {pkg.weather === 'Excellent' ? (
                                        <Sun size={16} color="#3b82f6" />
                                    ) : (
                                        <CloudSun size={16} color="#3b82f6" />
                                    )}
                                    <span>Weather: <span className={`weather-status ${pkg.weather === 'Excellent' ? 'text-green' : 'text-blue'}`}>{pkg.weather}</span></span>
                                </div>

                                <div className="card-tags">
                                    {pkg.tags.map((tag, idx) => (
                                        <span key={idx} className="tag-pill">{tag}</span>
                                    ))}
                                </div>

                                <div className="card-footer">
                                    <div className="price-section">
                                        <span className="price-label">Starting from</span>
                                        <span className="price-amount">PKR {pkg.price}</span>
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <button className="btn-eco-details">
                                        <Info size={16} /> Eco Details
                                    </button>
                                    <button className="btn-book">
                                        Book Now <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bottom-actions">
                    <button className="btn-plan-another">
                        Plan Another Trip
                    </button>
                </div>
            </main>

            <AIChatbot />
        </div>
    );
}

export default ExploreTrips;
