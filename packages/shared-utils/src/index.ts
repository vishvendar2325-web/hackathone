/**
 * FOCUSFLOW - Shared Utility Helpers
 */

/**
 * Clean and normalize domain name (strip protocols, paths, www)
 */
export function normalizeDomain(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return rawUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  }
}

/**
 * Format duration in seconds into human-readable format (e.g., '1h 25m' or '45m')
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Calculate Doomscroll Fatigue Score (0 - 100) based on reels and time
 */
export function calculateDoomscrollFatigue(reelsCount: number, timeSpentSeconds: number): {
  score: number;
  level: 'HEALTHY' | 'MODERATE' | 'HEAVY' | 'CRITICAL';
  label: string;
} {
  // Score formula: reels count factor + duration density factor
  const minutes = timeSpentSeconds / 60;
  const rawScore = Math.min(100, Math.round(reelsCount * 0.4 + minutes * 0.8));

  if (rawScore < 20) {
    return { score: rawScore, level: 'HEALTHY', label: 'Fresh & Focused' };
  }
  if (rawScore < 50) {
    return { score: rawScore, level: 'MODERATE', label: 'Mild Fatigue' };
  }
  if (rawScore < 80) {
    return { score: rawScore, level: 'HEAVY', label: 'High Dopamine Strain' };
  }
  return { score: rawScore, level: 'CRITICAL', label: 'Severe Brainrot Alert' };
}

/**
 * Anonymize or hash sensitive strings for zero-PII telemetry
 */
export function sanitizeLog(text: string): string {
  return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
}
