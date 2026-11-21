import { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getStoredTheme, setThemePreference } from '../utils/theme';
import './Appearance.css';

const OPTIONS = [
    { value: 'light', label: 'Light', description: 'Warm, bright interface', icon: Sun },
    { value: 'dark', label: 'Dark', description: 'Easy on the eyes at night', icon: Moon },
    { value: 'auto', label: 'Auto', description: 'Matches your system setting', icon: Monitor },
];

function Appearance() {
    const [theme, setTheme] = useState(getStoredTheme);
    const [saved, setSaved] = useState(false);

    const handleChange = (value) => {
        setTheme(setThemePreference(value));
        setSaved(true);
    };

    const current = OPTIONS.find((o) => o.value === theme);

    return (
        <div className="container container--narrow page">
            <PageHeader
                backTo="/home"
                title="Appearance"
                subtitle="Choose how ExploreSmart looks on this device."
            />

            <section className="card" aria-labelledby="appear-theme-title">
                <fieldset className="choice-group">
                    <legend id="appear-theme-title" className="appear-legend">Theme</legend>
                    <div className="choice-grid appear-grid">
                        {OPTIONS.map(({ value, label, description, icon }) => {
                            const Icon = icon;
                            return (
                                <label key={value} className="choice appear-option">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value={value}
                                        className="choice__input"
                                        checked={theme === value}
                                        onChange={() => handleChange(value)}
                                    />
                                    <span className={`appear-preview appear-preview--${value}`} aria-hidden="true">
                                        <Icon size={22} />
                                    </span>
                                    <span className="choice__title">{label}</span>
                                    <span className="choice__meta">{description}</span>
                                </label>
                            );
                        })}
                    </div>
                </fieldset>
                <p className="appear-status" role="status">
                    {saved ? `${current.label} theme applied and saved on this device.` : ''}
                </p>
            </section>
        </div>
    );
}

export default Appearance;
