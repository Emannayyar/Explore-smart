// Theme preference: 'light' | 'dark' | 'auto'. Stored in localStorage under `theme`.
// The resolved theme is written to <html data-theme="light|dark">.
// index.html applies the stored theme before first paint with the same rules.

export const THEME_KEY = 'theme';
export const THEME_OPTIONS = ['light', 'dark', 'auto'];
const DEFAULT_THEME = 'light';

const darkQuery = () =>
    typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

export function getStoredTheme() {
    try {
        const value = localStorage.getItem(THEME_KEY);
        return THEME_OPTIONS.includes(value) ? value : DEFAULT_THEME;
    } catch {
        return DEFAULT_THEME;
    }
}

export function resolveTheme(preference) {
    if (preference === 'auto') return darkQuery()?.matches ? 'dark' : 'light';
    return preference === 'dark' ? 'dark' : 'light';
}

export function applyTheme(preference) {
    document.documentElement.setAttribute('data-theme', resolveTheme(preference));
}

export function setThemePreference(preference) {
    const value = THEME_OPTIONS.includes(preference) ? preference : DEFAULT_THEME;
    try {
        localStorage.setItem(THEME_KEY, value);
    } catch {
        // Storage unavailable (private mode); the theme still applies for this visit.
    }
    applyTheme(value);
    return value;
}

// Keeps "auto" in sync with the OS setting while the app is open.
export function watchSystemTheme() {
    const query = darkQuery();
    if (!query) return () => {};
    const onChange = () => {
        if (getStoredTheme() === 'auto') applyTheme('auto');
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
}
