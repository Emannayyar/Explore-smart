import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const TONES = {
    info: { className: 'status-note', Icon: Info },
    success: { className: 'status-note status-note--success', Icon: CheckCircle2 },
    warning: { className: 'status-note status-note--warning', Icon: AlertCircle },
    danger: { className: 'status-note status-note--danger', Icon: AlertCircle },
};

// Inline status message, e.g. "Your settings were saved."
function StatusNote({ tone = 'info', children }) {
    const { className, Icon } = TONES[tone] ?? TONES.info;
    return (
        <p className={className} role="status">
            <Icon size={16} aria-hidden="true" />
            <span>{children}</span>
        </p>
    );
}

export default StatusNote;
