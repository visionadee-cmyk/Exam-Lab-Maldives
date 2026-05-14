/** Remember last subject for /practice and bottom nav when URL has no :subjectId */
export const LAST_PRACTICE_SUBJECT_KEY = 'examLab_lastPracticeSubject';

export function readLastPracticeSubject() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(LAST_PRACTICE_SUBJECT_KEY);
  } catch {
    return null;
  }
}

export function defaultPracticeSubjectId() {
  return readLastPracticeSubject() || 'biology_igcse';
}

/** Trim / normalise subject ids from URL, state, or localStorage so practice routing stays reliable. */
export function normalizePracticeSubjectId(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const compact = s.replace(/\s+/g, '_');
  const lower = compact.toLowerCase();
  if (lower === 'biology_igcse' || lower === 'biology-igcse') return 'biology_igcse';
  return compact;
}
