// Deterministic eco score. Max points: Destination 20, Activities 25,
// Group Size 15, Transport 20, Accommodation 20 = 100.

const MAX = { destination: 20, activities: 25, groupSize: 15, transport: 20, accommodation: 20 };

const norm = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : '');

// Environmental factor (0-1) per destination; fragile / over-touristed places are lower.
const DESTINATION_FACTORS = {
    'hunza valley': 0.75,
    'skardu': 0.7,
    'naran kaghan': 0.5,
    'swat valley': 0.65,
    'murree': 0.35,
    'fairy meadows': 0.55,
    'neelum valley': 0.7,
};
const DEFAULT_DESTINATION_FACTOR = 0.5;

// Friendliness (0-1) per activity.
const ACTIVITY_FACTORS = {
    'hiking': 0.95,
    'trekking': 0.9,
    'camping': 0.75,
    'bonfire': 0.35,
    'atv rides': 0.1,
    'atv ride': 0.1,
    'atv': 0.1,
};
const DEFAULT_ACTIVITY_FACTOR = 0.5;

const TRANSPORT_POINTS = { 'bus': 19, 'coaster': 18 };
const DEFAULT_TRANSPORT_POINTS = 8;

const ACCOMMODATION_POINTS = {
    'camping': 19,
    'shared family rooms': 19,
    'guest house': 15,
    'hotel': 11,
    'individual rooms': 6,
    'private rooms': 6,
    'private room': 6,
};
const DEFAULT_ACCOMMODATION_POINTS = 9;

const DEFAULT_GROUP_POINTS = 9;

const clampInt = (n, max) => Math.max(0, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

function destinationScore(destination) {
    const f = DESTINATION_FACTORS[norm(destination)] ?? DEFAULT_DESTINATION_FACTOR;
    return clampInt(f * MAX.destination, MAX.destination);
}

function activitiesScore(activities) {
    const list = Array.isArray(activities) ? activities : [];
    if (list.length === 0) return clampInt(DEFAULT_ACTIVITY_FACTOR * MAX.activities, MAX.activities);
    const sum = list.reduce((acc, a) => acc + (ACTIVITY_FACTORS[norm(a)] ?? DEFAULT_ACTIVITY_FACTOR), 0);
    return clampInt((sum / list.length) * MAX.activities, MAX.activities);
}

function groupScore(groupSize) {
    const n = typeof groupSize === 'number' ? groupSize : parseInt(String(groupSize ?? '').replace(/[^\d.]/g, ''), 10);
    if (!Number.isFinite(n) || n < 1) return DEFAULT_GROUP_POINTS;
    const t = Math.min(1, (n - 1) / 14);
    return clampInt(6 + 9 * t, MAX.groupSize);
}

function transportScore(transport) {
    return clampInt(TRANSPORT_POINTS[norm(transport)] ?? DEFAULT_TRANSPORT_POINTS, MAX.transport);
}

function accommodationScore(accommodation) {
    return clampInt(ACCOMMODATION_POINTS[norm(accommodation)] ?? DEFAULT_ACCOMMODATION_POINTS, MAX.accommodation);
}

function ratingFor(total) {
    if (total >= 80) return 'Highly Eco-Friendly';
    if (total >= 60) return 'Eco-Friendly';
    if (total >= 40) return 'Moderate';
    if (total >= 20) return 'Less Eco-Friendly';
    return 'High Environmental Impact';
}

export function calculateEcoScore(input) {
    const { destination, activities, groupSize, transport, accommodation } = input || {};
    const breakdown = [
        { key: 'destination', label: 'Destination', score: destinationScore(destination), max: MAX.destination },
        { key: 'activities', label: 'Activities', score: activitiesScore(activities), max: MAX.activities },
        { key: 'groupSize', label: 'Group Size', score: groupScore(groupSize), max: MAX.groupSize },
        { key: 'transport', label: 'Transport', score: transportScore(transport), max: MAX.transport },
        { key: 'accommodation', label: 'Accommodation', score: accommodationScore(accommodation), max: MAX.accommodation },
    ];
    const total = breakdown.reduce((s, b) => s + b.score, 0);
    const rating = ratingFor(total);

    const ratio = (b) => b.score / b.max;
    const sorted = [...breakdown].sort((a, b) => ratio(b) - ratio(a));
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    const explanation = best.key === worst.key || ratio(best) === ratio(worst)
        ? `This trip scores ${total}/100 (${rating}) with a balanced mix of factors.`
        : `This trip scores ${total}/100 (${rating}). Its strongest factor is ${best.label.toLowerCase()} (${best.score}/${best.max}), while ${worst.label.toLowerCase()} (${worst.score}/${worst.max}) has the most room to improve.`;

    return { total, rating, breakdown, explanation };
}

export function ecoLevel(total) {
    if (total >= 80) return 'High';
    if (total >= 60) return 'Medium';
    return 'Low';
}

export function isValidUrl(str) {
    if (typeof str !== 'string' || !str.trim()) return false;
    try {
        const u = new URL(str.trim());
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
}
