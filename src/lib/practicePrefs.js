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
