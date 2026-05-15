/**
 * Practice pool: prefer QP JSON (stem + options + MS answers), fall back to MS-only JSON.
 */
const qpModules = import.meta.glob('./papers/biology-0610-*-qp.json', { eager: true });
const msModules = import.meta.glob('./papers/biology-0610-*-ms.json', { eager: true });

function paperBaseId(paperId) {
  return String(paperId).replace(/-(qp|ms)$/, '');
}

function pickPapers() {
  const byBase = new Map();
  for (const mod of Object.values(msModules)) {
    const paper = mod?.default ?? mod;
    if (paper?.paperId) byBase.set(paperBaseId(paper.paperId), paper);
  }
  for (const mod of Object.values(qpModules)) {
    const paper = mod?.default ?? mod;
    if (paper?.paperId) byBase.set(paperBaseId(paper.paperId), paper);
  }
  return [...byBase.values()];
}

const LOCAL_PAPERS = pickPapers();

function mapQuestion(paper, q) {
  const paperId = paper.paperId || paper.id || 'paper';
  const hasOptions = Array.isArray(q.options) && q.options.length > 0;
  const isMcq = q.type === 'multiple_choice';
  const stem = q.text || q.question || '';
  return {
    id: `${paperBaseId(paperId)}_${q.id}`,
    text: stem,
    question: stem,
    type: isMcq && hasOptions ? 'mcq' : isMcq ? 'short_answer' : 'structured',
    marks: q.marks ?? q.totalMarks ?? 1,
    correctAnswer: q.answer ?? '',
    options: hasOptions ? q.options : [],
    subjectId: paper.subjectId,
    paperId: paper.paperId
  };
}

export function getAllBiologyPracticeQuestions() {
  return LOCAL_PAPERS.flatMap((paper) => {
    if (!paper?.questions?.length) return [];
    return paper.questions.map((q) => mapQuestion(paper, q));
  });
}
