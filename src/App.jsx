import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import PrivacySecurity from './pages/PrivacySecurity';
import Appearance from './pages/Appearance';
import ContactSupport from './pages/ContactSupport';
import AccountSettings from './pages/AccountSettings';
import ExploreTrips from './pages/ExploreTrips';
import EcoInsights from './pages/EcoInsights';
import Weather from './pages/Weather';
import { TripProvider } from './context/TripContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/plan" element={<PlanTrip />} />
          <Route path="/explore" element={<ExploreTrips />} />
          <Route path="/eco" element={<EcoInsights />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/privacy-security" element={<PrivacySecurity />} />
          <Route path="/appearance" element={<Appearance />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Routes>
      </BrowserRouter>
    </TripProvider>
    </AuthProvider>
  );
}

export default App;
