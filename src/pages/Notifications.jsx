import React, { useState } from 'react';
import {
    Mountain, Home as HomeIcon, Map as MapIcon, Compass, Leaf, CloudSun, User,
    ArrowLeft, Bell, MapPin, Cloud, Info, CheckCircle2, Trash2, MessageCircle, X, Sparkles, Send
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import AIChatbot from '../components/AIChatbot';
import './Notifications.css';

function Notifications() {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user } = useAuth();

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'trip',
            icon: MapPin,
            iconBg: 'bg-green-light',
            iconColor: '#059669',
            title: 'Trip Saved Successfully',
            message: 'Your Hunza Valley trip has been added to your saved trips.',
            time: '2 minutes ago',
            isNew: true
        },
        {
            id: 2,
            type: 'weather',
            icon: Cloud,
            iconBg: 'bg-yellow-light',
            iconColor: '#d97706',
            title: 'Weather Alert: Swat Valley',
            message: 'Heavy rainfall expected in Swat Valley from Feb 5-7. Plan accordingly.',
            time: '1 hour ago',
            isNew: true
        },
        {
            id: 3,
            type: 'info',
            icon: Info,
            iconBg: 'bg-blue-light',
            iconColor: '#2563eb',
            title: 'New Eco-Friendly Routes Available',
            message: 'Explore sustainable travel options to Fairy Meadows with reduced carbon footprint.',
            time: '3 hours ago',
            isNew: false
        },
        {
            id: 4,
            type: 'success',
            icon: CheckCircle2,
            iconBg: 'bg-green-light',
            iconColor: '#059669',
            title: 'Profile Updated',
            message: 'Your account settings have been updated successfully.',
            time: '1 day ago',
            isNew: false
        },
        {
            id: 5,
            type: 'location',
            icon: MapPin,
            iconBg: 'bg-blue-light',
            iconColor: '#2563eb',
            title: 'Best Time to Visit Northern Areas',
            message: 'March-May and September-November are ideal months for visiting Gilgit-Baltistan.',
            time: '2 days ago',
            isNew: false
        },
        {
            id: 6,
            type: 'alert',
            icon: Cloud,
            iconBg: 'bg-yellow-light',
            iconColor: '#d97706',
            title: 'Road Closure Alert',
            message: 'Karakoram Highway temporarily closed near Attabad Lake due to landslide.',
            time: '3 days ago',
            isNew: false
        }
    ]);

    const handleClearAll = () => {
        setNotifications([]);
    };

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isNew: false })));
    };

    const handleDelete = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="notifications-page">
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

            <main className="notifications-main">
                <div className="notifications-container">
                    {/* Header Section */}
                    <div className="notifications-header">
                        <div className="header-top">
                            <button className="back-btn" onClick={() => navigate('/home')}>
                                <ArrowLeft size={16} />
                                <span>Back to Home</span>
                            </button>
                        </div>

                        <div className="header-content-wrapper">
                            <div className="header-titles">
                                <h1>Notifications</h1>
                                <p>Stay updated with your travel alerts</p>
                            </div>
                            <div className="header-icon-large">
                                <Bell size={32} color="white" />
                            </div>
                        </div>

                        <div className="header-actions">
                            <button className="btn-mark-read" onClick={handleMarkAllRead}>
                                Mark all as read
                            </button>
                            <button className="btn-clear" onClick={handleClearAll}>
                                Clear all
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">
                                <Bell size={48} className="text-slate-300 mb-4" />
                                <h3>No new notifications</h3>
                                <p>You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div key={notification.id} className={`notification-card ${notification.isNew ? 'is-new' : ''}`}>
                                    <div className="card-left">
                                        <div className={`notification-icon ${notification.iconBg}`}>
                                            <notification.icon size={20} color={notification.iconColor} />
                                        </div>
                                    </div>

                                    <div className="card-content">
                                        <div className="content-header">
                                            <h4>{notification.title}</h4>
                                            {notification.isNew && <span className="badge-new">New</span>}
                                        </div>
                                        <p className="message">{notification.message}</p>
                                        <div className="time-info">
                                            <span className="calendar-icon">📅</span>
                                            <span>{notification.time}</span>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        <button className="btn-delete" onClick={() => handleDelete(notification.id)}>
                                            <Trash2 size={18} color="#ef4444" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Floating Chat Widget */}
            <AIChatbot />
        </div>
    );
}

export default Notifications;
