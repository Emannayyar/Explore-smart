// Maps an eco level ('High' | 'Medium' | 'Low') to a semantic UI tone.
const TONES = { High: 'success', Medium: 'warning', Low: 'danger' };

export const ecoTone = (level) => TONES[level] ?? 'warning';

// Tone for a single score factor (score/max ratio).
export const factorTone = (score, max) => {
    const ratio = max ? score / max : 0;
    if (ratio >= 0.6) return 'success';
    if (ratio >= 0.4) return 'warning';
    return 'danger';
};
