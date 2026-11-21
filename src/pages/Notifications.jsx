import { useEffect, useState } from 'react';
import { Bell, Trash2, Clock, CheckCheck, Check } from 'lucide-react';
import { api } from '../api/client';
import PageHeader from '../components/PageHeader';
import StatusNote from '../components/StatusNote';
import './Notifications.css';

function timeAgo(iso) {
    const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    return new Date(iso).toLocaleDateString();
}

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const unread = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        let cancelled = false;
        api.get('/notifications')
            .then((data) => { if (!cancelled) setNotifications(data.notifications); })
            .catch((err) => { if (!cancelled) setError(`Could not load notifications. ${err.message}`); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    // Run an API call, then apply the local change; show a message if it fails.
    const run = async (call, apply) => {
        setError('');
        try {
            await call();
            setNotifications(apply);
        } catch (err) {
            setError(`That did not work. ${err.message}`);
        }
    };

    const handleClearAll = () => run(() => api.del('/notifications'), () => []);
    const handleMarkAllRead = () => run(
        () => api.post('/notifications/read-all'),
        (list) => list.map((n) => ({ ...n, read: true })),
    );
    const handleMarkRead = (id) => run(
        () => api.patch(`/notifications/${id}`, { read: true }),
        (list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    const handleDelete = (id) => run(
        () => api.del(`/notifications/${id}`),
        (list) => list.filter((n) => n.id !== id),
    );

    return (
        <div className="container container--narrow page">
            <PageHeader
                backTo="/home"
                title="Notifications"
                subtitle={unread > 0 ? `${unread} unread · updates about your account and trips` : 'Updates about your account and trips'}
                actions={notifications.length > 0 && (
                    <>
                        <button type="button" className="btn btn--secondary btn--sm" onClick={handleMarkAllRead} disabled={unread === 0}>
                            <CheckCheck size={16} aria-hidden="true" /> Mark all as read
                        </button>
                        <button type="button" className="btn btn--danger-outline btn--sm" onClick={handleClearAll}>
                            Clear all
                        </button>
                    </>
                )}
            />

            {error && <StatusNote tone="danger">{error}</StatusNote>}

            {loading ? (
                <p className="field__hint" role="status">Loading notifications…</p>
            ) : notifications.length === 0 ? (
                <div className="card empty-state">
                    <span className="icon-chip icon-chip--lg icon-chip--neutral" aria-hidden="true"><Bell size={28} /></span>
                    <h2 className="empty-state__title">No notifications</h2>
                    <p className="empty-state__text">You&rsquo;re all caught up. Saving a trip or changing your password will show up here.</p>
                </div>
            ) : (
                <ul className="notif-list" role="list">
                    {notifications.map(({ id, title, body, createdAt, read }) => (
                        <li key={id} className={read ? 'card notif-item' : 'card notif-item notif-item--new'}>
                            <span className="icon-chip" aria-hidden="true"><Bell size={20} /></span>
                            <div className="notif-body">
                                <h2 className="notif-title">
                                    {title}
                                    {!read && <span className="badge badge--accent">New</span>}
                                </h2>
                                <p className="notif-message">{body}</p>
                                <p className="notif-time"><Clock size={14} aria-hidden="true" /> {timeAgo(createdAt)}</p>
                            </div>
                            {!read && (
                                <button
                                    type="button"
                                    className="btn btn--ghost btn--icon btn--sm"
                                    onClick={() => handleMarkRead(id)}
                                    aria-label={`Mark as read: ${title}`}
                                >
                                    <Check size={18} aria-hidden="true" />
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn--ghost btn--icon btn--sm notif-delete"
                                onClick={() => handleDelete(id)}
                                aria-label={`Delete notification: ${title}`}
                            >
                                <Trash2 size={18} aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Notifications;
