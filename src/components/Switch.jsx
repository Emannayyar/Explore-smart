// Accessible on/off control: a real <button role="switch" aria-checked>.
export function Switch({ checked, onChange, label, labelledBy, describedBy, id, disabled = false }) {
    return (
        <button
            type="button"
            role="switch"
            id={id}
            className="switch"
            aria-checked={checked}
            aria-label={label}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            disabled={disabled}
            onClick={() => onChange(!checked)}
        >
            <span className="switch__thumb" aria-hidden="true" />
        </button>
    );
}

// Title + description + switch, in the shared .setting-row layout.
export function ToggleRow({ id, title, description, checked, onChange }) {
    return (
        <div className="setting-row">
            <div className="setting-row__text">
                <span id={`${id}-label`} className="setting-row__title">{title}</span>
                {description && <span id={`${id}-desc`} className="setting-row__desc">{description}</span>}
            </div>
            <Switch
                id={id}
                checked={checked}
                onChange={onChange}
                labelledBy={`${id}-label`}
                describedBy={description ? `${id}-desc` : undefined}
            />
        </div>
    );
}
