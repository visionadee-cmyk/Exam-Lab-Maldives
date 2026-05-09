export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function calculatePercentage(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

export function getGrade(percentage) {
  if (percentage >= 90) return { grade: 'A*', color: 'text-green-600' };
  if (percentage >= 80) return { grade: 'A', color: 'text-green-500' };
  if (percentage >= 70) return { grade: 'B', color: 'text-blue-500' };
  if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500' };
  if (percentage >= 50) return { grade: 'D', color: 'text-orange-500' };
  if (percentage >= 40) return { grade: 'E', color: 'text-orange-600' };
  return { grade: 'U', color: 'text-red-600' };
}
