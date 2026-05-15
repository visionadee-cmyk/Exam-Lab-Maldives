/**
 * Practice questions from bundled QP JSON (all subjects).
 */
import { extractMcqLetter, isPartAnswered } from '../lib/paperSchema.js';

const qpModules = import.meta.glob(
  ['./papers/*-qp.json', './papers/biology-wbi*.json'],
  { eager: true }
);

const SUBJECT_ALIASES = {
  accounting_cambridge_olevel: 'accounting_olevel'
};

function resolveSubjectId(subjectId) {
  if (!subjectId) return '';
  return SUBJECT_ALIASES[subjectId] || subjectId;
}

function paperBaseId(paperId) {
  return String(paperId).replace(/-(qp|ms)$/i, '');
}

function normalizeMcqOptions(rawOptions, answerLetter) {
  const opts = !Array.isArray(rawOptions) || !rawOptions.length
    ? ['A', 'B', 'C', 'D']
    : rawOptions.map((o) => {
        if (typeof o === 'object' && o?.id) {
          return o.text ? `${o.id}. ${o.text}` : String(o.id);
        }
        const s = String(o).trim();
        const m = s.match(/^([A-D])\b/i);
        return m ? `${m[1].toUpperCase()}. ${s.replace(/^[A-D]\s*/i, '')}` : s;
      });
  if (!answerLetter) return { options: opts, correctAnswer: '' };
  const hit = opts.find((o) => new RegExp(`^${answerLetter}\\b`, 'i').test(o));
  return { options: opts, correctAnswer: hit || answerLetter };
}

function extractMcqLettersFromMs(text) {
  if (!text) return [];
  const letters = [];
  const re = /only correct answer is\s+([A-D])\b/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    letters.push(m[1].toUpperCase());
  }
  return letters;
}

function isUsablePartStem(partText, qStem) {
  const t = (partText || '').trim();
  if (!t || /^Part\s+\d+/i.test(t) || t === 'Question') return false;
  if (t.length < 8 && !qStem) return false;
  return true;
}

function buildStem(qStem, partText) {
  const pt = (partText || '').trim();
  const qs = (qStem || '').trim();
  if (isUsablePartStem(pt, qs)) {
    if (qs && !pt.includes(qs.slice(0, Math.min(40, qs.length)))) {
      return pt.length > qs.length ? pt : `${qs}\n\n${pt}`;
    }
    return pt;
  }
  return qs || pt;
}

function isPracticeShortAnswer(part) {
  if (!isPartAnswered(part)) return false;
  const a = String(part.answer).trim();
  if (/only correct answer is/i.test(a)) return false;
  if (/Number Answer Mark|Partial Marks|B1 for|M1 for|A1 for/i.test(a)) return false;
  if (a.length > 350) return false;
  return true;
}

function baseQuestion(paper, q, part, base, stem, extra = {}) {
  const num = q.number ?? 0;
  const partId = part?.id ? `_${part.id}` : '';
  const img = part?.image || q.image;
  return {
    subjectId: resolveSubjectId(paper.subjectId),
    paperId: paper.paperId,
    paperSubjectId: paper.subjectId,
    images: img ? [img] : [],
    ...extra,
    id: `${base}_${q.id}${partId}${extra.idSuffix || ''}`,
    text: stem,
    question: stem
  };
}

function mapTopLevelMcq(paper, q, base) {
  const stem = (q.text || q.question || '').trim();
  if (!stem || q.type !== 'multiple_choice') return null;
  const letter = extractMcqLetter(q.answer || '');
  if (!letter) return null;
  const { options, correctAnswer } = normalizeMcqOptions(q.options, letter);
  return baseQuestion(paper, q, null, base, stem, {
    type: 'mcq',
    marks: q.marks ?? q.totalMarks ?? 1,
    correctAnswer: correctAnswer || letter,
    options
  });
}

function mapPartMcq(paper, q, part, base) {
  const stem = buildStem(q.question || q.text, part.text);
  if (!stem) return null;

  const letter = extractMcqLetter(part.answer || '');
  if (!letter && part.type !== 'mcq') return null;
  if (!letter) return null;

  const { options, correctAnswer } = normalizeMcqOptions(part.options, letter);
  return baseQuestion(paper, q, part, base, stem, {
    type: 'mcq',
    marks: part.marks ?? 1,
    correctAnswer: correctAnswer || letter,
    options
  });
}

function mapPearsonPartMcqs(paper, q, part, base) {
  const letters = extractMcqLettersFromMs(part.answer);
  if (!letters.length) return [];

  const stem = buildStem(q.question || q.text, part.text);
  if (!stem) return [];

  return letters.map((letter, idx) =>
    baseQuestion(paper, q, part, base, stem, {
      idSuffix: `_mcq${idx}`,
      type: 'mcq',
      marks: 1,
      correctAnswer: letter,
      options: ['A', 'B', 'C', 'D']
    })
  );
}

function mapPartShort(paper, q, part, base) {
  const stem = buildStem(q.question || q.text, part.text);
  if (!stem || !isPracticeShortAnswer(part)) return null;

  return baseQuestion(paper, q, part, base, stem, {
    type: 'short_answer',
    marks: part.marks ?? 1,
    correctAnswer: String(part.answer).trim(),
    options: []
  });
}

function* itemsFromPaper(paper) {
  const base = paperBaseId(paper.paperId || paper.id || 'paper');
  if (!paper?.questions?.length) return;

  for (const q of paper.questions) {
    const top = mapTopLevelMcq(paper, q, base);
    if (top) yield top;

    for (const part of q.parts || []) {
      const pearsonLetters = extractMcqLettersFromMs(part.answer);
      if (pearsonLetters.length > 0) {
        for (const pearson of mapPearsonPartMcqs(paper, q, part, base)) {
          yield pearson;
        }
        continue;
      }

      const partMcq = mapPartMcq(paper, q, part, base);
      if (partMcq) {
        yield partMcq;
        continue;
      }

      const short = mapPartShort(paper, q, part, base);
      if (short) yield short;
    }
  }
}

function buildPoolsBySubject() {
  const bySubject = new Map();
  for (const mod of Object.values(qpModules)) {
    const paper = mod?.default ?? mod;
    const sid = resolveSubjectId(paper?.subjectId);
    if (!sid) continue;

    for (const item of itemsFromPaper(paper)) {
      if (!item?.subjectId || item.subjectId !== sid) continue;
      if (!bySubject.has(sid)) bySubject.set(sid, []);
      bySubject.get(sid).push(item);
    }
  }
  return bySubject;
}

const POOLS_BY_SUBJECT = buildPoolsBySubject();

export function getPracticeQuestionsForSubject(subjectId) {
  const sid = resolveSubjectId(subjectId);
  const pool = POOLS_BY_SUBJECT.get(sid) || [];
  return pool.filter((q) => q.subjectId === sid);
}

export function pickPracticeQuestions(subjectId, topic, count = 10) {
  const all = getPracticeQuestionsForSubject(subjectId);
  if (!all.length) return [];

  let pool = all;
  if (topic?.trim()) {
    const t = topic.trim().toLowerCase();
    const narrowed = all.filter((q) => (q.text || '').toLowerCase().includes(t));
    if (narrowed.length) pool = narrowed;
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function getPracticePoolSize(subjectId) {
  return getPracticeQuestionsForSubject(subjectId).length;
}

export function getPracticePoolStats() {
  const stats = {};
  for (const [sid, list] of POOLS_BY_SUBJECT.entries()) {
    stats[sid] = {
      total: list.length,
      mcq: list.filter((q) => q.type === 'mcq').length
    };
  }
  return stats;
}
