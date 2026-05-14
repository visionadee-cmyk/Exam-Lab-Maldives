import biology06102021Unit1June from './papers/biology-0610-2021-unit1-june-ms.json';
import biology06102021Unit1November from './papers/biology-0610-2021-unit1-november-ms.json';
import biology06102021Unit2June from './papers/biology-0610-2021-unit2-june-ms.json';
import biology06102021Unit2November from './papers/biology-0610-2021-unit2-november-ms.json';
import biology06102021Unit3June from './papers/biology-0610-2021-unit3-june-ms.json';
import biology06102021Unit3November from './papers/biology-0610-2021-unit3-november-ms.json';
import biology06102021Unit6June from './papers/biology-0610-2021-unit6-june-ms.json';
import biology06102021Unit6November from './papers/biology-0610-2021-unit6-november-ms.json';

const LOCAL_PAPERS = [
  biology06102021Unit1June,
  biology06102021Unit1November,
  biology06102021Unit2June,
  biology06102021Unit2November,
  biology06102021Unit3June,
  biology06102021Unit3November,
  biology06102021Unit6June,
  biology06102021Unit6November
];

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
