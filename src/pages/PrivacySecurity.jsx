import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, Database, Download, UserX, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { api, getToken } from '../api/client';
import PageHeader from '../components/PageHeader';
import PasswordField from '../components/PasswordField';
import { ToggleRow } from '../components/Switch';
import StatusNote from '../components/StatusNote';
import './PrivacySecurity.css';

const MIN_PASSWORD = 8;

function PrivacySecurity() {
    const { user, updateUser, signOut } = useAuth();
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordStatus, setPasswordStatus] = useState({ tone: 'info', message: '' });
    const [passwordPending, setPasswordPending] = useState(false);

    const [privacyStatus, setPrivacyStatus] = useState({ tone: 'info', message: '' });
    const [dataStatus, setDataStatus] = useState({ tone: 'info', message: '' });

    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const prefs = user.preferences;

    const setPassword = (field) => (value) => setPasswords((p) => ({ ...p, [field]: value }));

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!passwords.current) errors.current = 'Enter your current password.';
        if (passwords.next.length < MIN_PASSWORD) errors.next = `Use at least ${MIN_PASSWORD} characters.`;
        if (passwords.confirm !== passwords.next) errors.confirm = 'Passwords do not match.';
        setPasswordErrors(errors);
        setPasswordStatus({ tone: 'info', message: '' });
        if (Object.keys(errors).length > 0) return;

        setPasswordPending(true);
        try {
            await api.put('/me/password', { currentPassword: passwords.current, newPassword: passwords.next });
            setPasswords({ current: '', next: '', confirm: '' });
            setPasswordStatus({ tone: 'success', message: 'Your password was updated. Other devices were signed out.' });
        } catch (err) {
            setPasswordStatus({ tone: 'danger', message: err.message });
        } finally {
            setPasswordPending(false);
        }
    };

    // Each privacy switch saves straight away.
    const privacyToggle = (key) => async (value) => {
        setPrivacyStatus({ tone: 'info', message: '' });
        try {
            const data = await api.patch('/me', { preferences: { [key]: value } });
            updateUser(data.user);
            setPrivacyStatus({ tone: 'success', message: 'Privacy settings saved.' });
        } catch (err) {
            setPrivacyStatus({ tone: 'danger', message: `Could not save that setting. ${err.message}` });
        }
    };

    // The export needs the bearer token, so fetch it and save the response as a file.
    const handleDownload = async () => {
        setDataStatus({ tone: 'info', message: '' });
        try {
            const res = await fetch('/api/me/export', { headers: { Authorization: `Bearer ${getToken()}` } });
            if (!res.ok) throw new Error(`Request failed (${res.status})`);
            const url = URL.createObjectURL(await res.blob());
            const link = document.createElement('a');
            link.href = url;
            link.download = 'explore-smart-data.json';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            setDataStatus({ tone: 'success', message: 'Your data was downloaded.' });
        } catch (err) {
            setDataStatus({ tone: 'danger', message: `Could not download your data. ${err.message}` });
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (!deletePassword) {
            setDeleteError('Enter your password to confirm.');
            return;
        }
        setDeleteError('');
        setDeleting(true);
        try {
            await api.del('/me', { password: deletePassword });
        } catch (err) {
            setDeleteError(err.message);
            setDeleting(false);
            return;
        }
        navigate('/');
        signOut();
    };

    const cancelDelete = () => {
        setConfirmingDelete(false);
        setDeletePassword('');
        setDeleteError('');
    };

    return (
        <div className="container container--narrow page">
            <PageHeader
                backTo="/home"
                title="Privacy & Security"
                subtitle="Manage your password, privacy preferences and data."
            />

            <div className="privacy-stack">
                <section className="card" aria-labelledby="privacy-password-title">
                    <div className="card__header">
                        <span className="icon-chip icon-chip--info" aria-hidden="true"><Lock size={18} /></span>
                        <h2 id="privacy-password-title" className="card__title">Change password</h2>
                    </div>

                    <form className="form-stack" onSubmit={handlePasswordSubmit} noValidate>
                        <PasswordField id="privacy-current" label="Current password" value={passwords.current} onChange={setPassword('current')} error={passwordErrors.current} showIcon={false} />
                        <PasswordField id="privacy-new" label="New password" value={passwords.next} onChange={setPassword('next')} error={passwordErrors.next} hint={`At least ${MIN_PASSWORD} characters.`} autoComplete="new-password" showIcon={false} />
                        <PasswordField id="privacy-confirm" label="Confirm new password" value={passwords.confirm} onChange={setPassword('confirm')} error={passwordErrors.confirm} autoComplete="new-password" showIcon={false} />
                        <button type="submit" className="btn btn--primary privacy-submit" disabled={passwordPending}>
                            {passwordPending ? 'Updating…' : 'Update password'}
                        </button>
                    </form>
                    {passwordStatus.message && <div className="privacy-status"><StatusNote tone={passwordStatus.tone}>{passwordStatus.message}</StatusNote></div>}
                </section>

                <section className="card" aria-labelledby="privacy-settings-title">
                    <div className="card__header">
                        <span className="icon-chip" aria-hidden="true"><Eye size={18} /></span>
                        <h2 id="privacy-settings-title" className="card__title">Privacy settings</h2>
                    </div>
                    <div className="setting-list">
                        <ToggleRow id="privacy-profile" title="Show my profile to other travellers" description="Allow others to discover your profile" checked={prefs.profilePublic} onChange={privacyToggle('profilePublic')} />
                        <ToggleRow id="privacy-stats" title="Share my travel activity" description="Help improve recommendations for everyone" checked={prefs.shareActivity} onChange={privacyToggle('shareActivity')} />
                        <ToggleRow id="privacy-data" title="Allow usage data collection" description="Let us learn from how you use ExploreSmart" checked={prefs.dataCollection} onChange={privacyToggle('dataCollection')} />
                    </div>
                    {privacyStatus.message && <div className="privacy-status"><StatusNote tone={privacyStatus.tone}>{privacyStatus.message}</StatusNote></div>}
                </section>

                <section className="card" aria-labelledby="privacy-data-title">
                    <div className="card__header">
                        <span className="icon-chip icon-chip--neutral" aria-hidden="true"><Database size={18} /></span>
                        <h2 id="privacy-data-title" className="card__title">Data management</h2>
                    </div>
                    <ul className="privacy-actions" role="list">
                        <li>
                            <button type="button" className="privacy-action" onClick={handleDownload}>
                                <Download size={20} aria-hidden="true" />
                                <span className="privacy-action-text">
                                    <span className="privacy-action-title">Download my data</span>
                                    <span className="privacy-action-desc">Get a copy of your profile and saved trips</span>
                                </span>
                                <ChevronRight size={18} aria-hidden="true" />
                            </button>
                        </li>
                    </ul>
                    {dataStatus.message && <div className="privacy-status"><StatusNote tone={dataStatus.tone}>{dataStatus.message}</StatusNote></div>}
                </section>

                <section className="card privacy-danger" aria-labelledby="privacy-danger-title">
                    <div className="card__header">
                        <span className="icon-chip icon-chip--danger" aria-hidden="true"><UserX size={18} /></span>
                        <h2 id="privacy-danger-title" className="card__title">Danger zone</h2>
                    </div>
                    <h3 className="privacy-danger-heading">Delete account</h3>
                    <p className="privacy-danger-text">Once you delete your account, there is no going back. This removes all your data permanently.</p>
                    {confirmingDelete ? (
                        <form className="form-stack" onSubmit={handleDeleteAccount} noValidate>
                            <PasswordField id="privacy-delete-password" label="Enter your password to confirm" value={deletePassword} onChange={setDeletePassword} error={deleteError} showIcon={false} />
                            <div className="privacy-delete-actions">
                                <button type="submit" className="btn btn--danger" disabled={deleting}>
                                    {deleting ? 'Deleting…' : 'Permanently delete my account'}
                                </button>
                                <button type="button" className="btn btn--secondary" onClick={cancelDelete} disabled={deleting}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button type="button" className="btn btn--danger privacy-submit" onClick={() => setConfirmingDelete(true)}>Delete my account</button>
                    )}
                </section>
            </div>
        </div>
    );
}

export default PrivacySecurity;
