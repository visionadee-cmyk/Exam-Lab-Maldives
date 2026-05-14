/**
 * Practice pool for Cambridge 0610 Biology — load every matching MS JSON via glob
 * so Vite always bundles them (same pattern as interactiveMsPaperRegistry).
 */
const biology0610Modules = import.meta.glob('./papers/biology-0610-*-ms.json', { eager: true });

const LOCAL_PAPERS = Object.values(biology0610Modules).map((m) => m?.default ?? m);

function mapQuestion(paper, q) {
  const paperId = paper.paperId || paper.id || 'paper';
  const hasOptions = Array.isArray(q.options) && q.options.length > 0;
  const isMcq = q.type === 'multiple_choice';
  return {
    id: `${paperId}_${q.id}`,
    text: q.question,
    question: q.question,
    type: isMcq && hasOptions ? 'mcq' : isMcq ? 'short_answer' : 'structured',
    marks: q.marks ?? q.totalMarks ?? 1,
    correctAnswer: q.answer ?? '',
    options: hasOptions ? q.options : [],
    subjectId: paper.subjectId,
    paperId: paper.paperId
  };
}

/** All normalized questions from bundled 0610 mark-scheme JSON used as the local practice pool. */
export function getAllBiologyPracticeQuestions() {
  return LOCAL_PAPERS.flatMap((paper) => {
    if (!paper?.questions?.length) return [];
    return paper.questions.map((q) => mapQuestion(paper, q));
  });
}
