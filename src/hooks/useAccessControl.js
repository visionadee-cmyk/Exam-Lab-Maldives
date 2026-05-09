import { useAuth } from '../contexts/AuthContext';

const PLAN_LEVELS = {
  free: 0,
  answers: 1,
  full: 2,
  pro: 3,
};

export function useAccessControl() {
  const { userData } = useAuth();

  const userPlan = userData?.plan || 'free';
  const userSubjects = userData?.subjects || [];
  const planLevel = PLAN_LEVELS[userPlan] || 0;

  const hasAccess = (requiredPlan) => {
    const requiredLevel = PLAN_LEVELS[requiredPlan] || 0;
    return planLevel >= requiredLevel;
  };

  const hasSubjectAccess = (subject) => {
    return userSubjects.includes('all') || userSubjects.includes(subject);
  };

  const canViewAnswers = () => hasAccess('answers');
  const canUsePracticeMode = () => hasAccess('full');
  const canResetPapers = () => hasAccess('full');
  const hasProAccess = () => hasAccess('pro');

  const checkAccess = (feature) => {
    switch (feature) {
      case 'viewAnswers':
        return canViewAnswers();
      case 'practiceMode':
        return canUsePracticeMode();
      case 'resetPapers':
        return canResetPapers();
      case 'proAccess':
        return hasProAccess();
      default:
        return false;
    }
  };

  return {
    userPlan,
    userSubjects,
    hasAccess,
    hasSubjectAccess,
    canViewAnswers,
    canUsePracticeMode,
    canResetPapers,
    hasProAccess,
    checkAccess,
  };
}
