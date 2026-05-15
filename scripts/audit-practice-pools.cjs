/**
 * Audit practice pools (mirrors paperPracticePool.js logic).
 * Run: node scripts/audit-practice-pools.cjs
 */
const fs = require('fs');
const path = require('path');

const PAPERS = path.join(__dirname, '..', 'src', 'data', 'papers');

const SUBJECT_ALIASES = { accounting_cambridge_olevel: 'accounting_olevel' };
const UI_SUBJECTS = [
  'biology_igcse', 'chemistry_igcse', 'physics_igcse', 'mathematics_igcse',
  'accounting_igcse', 'accounting_olevel', 'economics_igcse', 'business_igcse',
  'computer_science_igcse', 'english_first_igcse', 'english_second_igcse',
  'travel_tourism_igcse',
  'biology_ial_pearson', 'chemistry_ial_pearson', 'physics_ial_pearson',
  'mathematics_ial_pearson', 'accounting_ial_pearson', 'economics_ial_pearson',
  'business_ial_pearson',
  'travel_tourism_ial_cambridge', 'computer_science_ial_cambridge'
];

function resolveSubjectId(s) {
  return SUBJECT_ALIASES[s] || s || '';
}

function extractMcqLetter(text) {
  if (!text) return '';
  const t = String(text).trim();
  if (/^[A-D]$/i.test(t)) return t.toUpperCase();
  const m = String(text).match(/only correct answer is\s+([A-D])/i);
  return m ? m[1].toUpperCase() : '';
}

function extractMcqLettersFromMs(text) {
  if (!text) return [];
  const letters = [];
  const re = /only correct answer is\s+([A-D])\b/gi;
  let m;
  while ((m = re.exec(text)) !== null) letters.push(m[1].toUpperCase());
  return letters;
}

function isQpFile(name) {
  return (
    name.endsWith('-qp.json') ||
    (/^biology-wbi\d+-.+\.json$/i.test(name) && !name.includes('-ms'))
  );
}

function countPaper(paper) {
  let mcq = 0;
  let short = 0;
  const sid = resolveSubjectId(paper.subjectId);

  for (const q of paper.questions || []) {
    if (q.type === 'multiple_choice' && extractMcqLetter(q.answer)) mcq++;

    for (const part of q.parts || []) {
      if (part.type === 'mcq' && extractMcqLetter(part.answer)) {
        mcq++;
        continue;
      }
      const letters = extractMcqLettersFromMs(part.answer);
      mcq += letters.length;
      if (!letters.length && part.answer && String(part.answer).length < 350) {
        if (!/only correct answer is|Number Answer Mark|B1 for/i.test(part.answer)) {
          short++;
        }
      }
    }
  }
  return { mcq, short, sid };
}

const bySubject = new Map();

for (const file of fs.readdirSync(PAPERS).filter(isQpFile)) {
  const paper = JSON.parse(fs.readFileSync(path.join(PAPERS, file), 'utf8'));
  if (!paper.questions?.length) continue;
  const { mcq, short, sid } = countPaper(paper);
  if (!bySubject.has(sid)) bySubject.set(sid, { mcq: 0, short: 0, papers: 0 });
  const row = bySubject.get(sid);
  row.mcq += mcq;
  row.short += short;
  row.papers++;
}

console.log('=== Practice pool audit ===\n');
console.log('UI subject'.padEnd(32), 'MCQ'.padStart(7), 'Short'.padStart(7), 'Papers'.padStart(7), 'Status');
console.log('-'.repeat(62));

for (const sid of UI_SUBJECTS) {
  const row = bySubject.get(sid) || { mcq: 0, short: 0, papers: 0 };
  const total = row.mcq + row.short;
  const status = total >= 10 ? 'OK' : total > 0 ? 'LOW' : 'EMPTY';
  console.log(
    sid.padEnd(32),
    String(row.mcq).padStart(7),
    String(row.short).padStart(7),
    String(row.papers).padStart(7),
    status
  );
}
