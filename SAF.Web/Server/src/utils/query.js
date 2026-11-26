/** Reads a `?limit=` value: `fallback` when missing or invalid, never above `max`. */
export function clampLimit(value, fallback, max) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 1) return fallback;
    return Math.min(parsed, max);
}
