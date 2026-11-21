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
import NotFound from './pages/NotFound';
import AppLayout from './components/AppLayout';
import { RequireAuth, PublicOnly } from './components/RequireAuth';
import { TripProvider } from './context/TripContext';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <TripProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/signin" element={<PublicOnly><SignIn /></PublicOnly>} />
                        <Route path="/signup" element={<PublicOnly><SignUp /></PublicOnly>} />

                        <Route element={<RequireAuth />}>
                            <Route element={<AppLayout />}>
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
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </TripProvider>
        </AuthProvider>
    );
}

export default App;
