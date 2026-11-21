import { useState } from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';
import { ToggleRow } from '../components/Switch';
import StatusNote from '../components/StatusNote';
import './AccountSettings.css';

function AccountSettings() {
    const { user, updateUser } = useAuth();

    const [form, setForm] = useState({
        name: user.name,
        phone: user.phone,
        location: user.location,
        about: user.about,
    });
    const [prefs, setPrefs] = useState({
        emailNotifications: user.preferences.emailNotifications,
        tripReminders: user.preferences.tripReminders,
        weatherAlerts: user.preferences.weatherAlerts,
    });
    const [status, setStatus] = useState({ tone: 'info', message: '' });
    const [saving, setSaving] = useState(false);

    const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
    const setPref = (key) => (value) => setPrefs((p) => ({ ...p, [key]: value }));

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            setStatus({ tone: 'danger', message: 'Enter your name before saving.' });
            return;
        }
        setSaving(true);
        setStatus({ tone: 'info', message: '' });
        try {
            const data = await api.patch('/me', { ...form, preferences: prefs });
            updateUser(data.user);
            setStatus({ tone: 'success', message: 'Your account settings were saved.' });
        } catch (err) {
            setStatus({ tone: 'danger', message: `Could not save your settings. ${err.message}` });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container container--narrow page">
            <PageHeader
                backTo="/home"
                title="Account Settings"
                subtitle="Manage your profile and travel preferences."
            />

            <form className="acct-form" onSubmit={handleSaveChanges}>
                <section className="card" aria-labelledby="acct-profile-title">
                    <div className="card__header">
                        <span className="icon-chip" aria-hidden="true"><User size={18} /></span>
                        <h2 id="acct-profile-title" className="card__title">Profile information</h2>
                    </div>

                    <div className="form-stack">
                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="acct-name" className="field__label"><User size={16} aria-hidden="true" /> Full name</label>
                                <input id="acct-name" type="text" className="input" value={form.name} onChange={setField('name')} autoComplete="name" maxLength={80} required />
                            </div>
                            <div className="field">
                                <label htmlFor="acct-email" className="field__label"><Mail size={16} aria-hidden="true" /> Email address</label>
                                <input id="acct-email" type="email" className="input" value={user.email} readOnly aria-describedby="acct-readonly-hint" />
                            </div>
                            <div className="field">
                                <label htmlFor="acct-phone" className="field__label"><Phone size={16} aria-hidden="true" /> Phone number</label>
                                <input id="acct-phone" type="tel" className="input" placeholder="+92 3XX XXXXXXX" autoComplete="tel" value={form.phone} onChange={setField('phone')} maxLength={30} />
                            </div>
                            <div className="field">
                                <label htmlFor="acct-location" className="field__label"><MapPin size={16} aria-hidden="true" /> Location</label>
                                <input id="acct-location" type="text" className="input" placeholder="City, Country" autoComplete="address-level2" value={form.location} onChange={setField('location')} maxLength={100} />
                            </div>
                        </div>
                        <p id="acct-readonly-hint" className="field__hint">Your email is your sign-in and can&rsquo;t be changed here.</p>

                        <div className="field">
                            <label htmlFor="acct-about" className="field__label">About me</label>
                            <textarea
                                id="acct-about"
                                className="textarea"
                                placeholder="Tell us about yourself and your travel interests..."
                                value={form.about}
                                onChange={setField('about')}
                                maxLength={500}
                                rows={4}
                            />
                        </div>
                    </div>
                </section>

                <section className="card" aria-labelledby="acct-prefs-title">
                    <div className="card__header">
                        <h2 id="acct-prefs-title" className="card__title">Notification preferences</h2>
                    </div>
                    <div className="setting-list">
                        <ToggleRow id="acct-email-alerts" title="Email notifications" description="Receive trip updates and recommendations" checked={prefs.emailNotifications} onChange={setPref('emailNotifications')} />
                        <ToggleRow id="acct-reminders" title="Trip reminders" description="Get a reminder before your saved trips" checked={prefs.tripReminders} onChange={setPref('tripReminders')} />
                        <ToggleRow id="acct-weather" title="Weather alerts" description="Be told about weather changes at your destinations" checked={prefs.weatherAlerts} onChange={setPref('weatherAlerts')} />
                    </div>
                </section>

                <div className="acct-actions">
                    <button type="submit" className="btn btn--primary btn--lg" disabled={saving}>
                        <Save size={18} aria-hidden="true" /> {saving ? 'Saving…' : 'Save changes'}
                    </button>
                    {status.message && <StatusNote tone={status.tone}>{status.message}</StatusNote>}
                </div>
            </form>
        </div>
    );
}

export default AccountSettings;
