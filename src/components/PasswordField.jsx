import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

// Labelled password input with a show/hide toggle, optional hint and inline error.
function PasswordField({ id, label, value, onChange, error, hint, autoComplete = 'current-password', required = false, placeholder, showIcon = true }) {
    const [visible, setVisible] = useState(false);
    const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

    return (
        <div className="field">
            <label htmlFor={id} className="field__label">
                {showIcon && <Lock size={16} aria-hidden="true" />} {label}
            </label>
            <div className="input-group input-group--with-action">
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    className="input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                />
                <button
                    type="button"
                    className="input-group__action"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={`Show ${label.toLowerCase()}`}
                    aria-pressed={visible}
                >
                    {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
            </div>
            {hint && <p id={`${id}-hint`} className="field__hint">{hint}</p>}
            {error && <p id={`${id}-error`} className="field__error">{error}</p>}
        </div>
    );
}

export default PasswordField;
