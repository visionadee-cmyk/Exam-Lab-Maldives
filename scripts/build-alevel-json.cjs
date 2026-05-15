/**
 * Convert A-Level QP (+ paired MS) PDFs under public/pdf-pastpaer-q&a/A-Level
 * into src/data/papers/*.json with questions and mark-scheme answers.
 *
 * Usage: node scripts/build-alevel-json.cjs [--subject Biology-WBI11] [--limit N] [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const pdfparse = require('pdf-parse');

const ROOT = path.join(__dirname, '..');
const PDF_BASE = path.join(ROOT, 'public', 'pdf-pastpaer-q&a', 'A-Level');
const OUT_DIR = path.join(ROOT, 'src', 'data', 'papers');
const REPORT_PATH = path.join(ROOT, 'scripts', 'build-alevel-json-report.json');

const EDEXCEL_MONTH = {
  '01': 'jan',
  '06': 'may',
  '10': 'oct',
  '11': 'nov'
};

const SUBJECT_MAP = {
  'Accounting-WAC11': { slug: 'accounting', subjectId: 'accounting_ial_pearson', board: 'pearson' },
  'Biology-WBI11': { slug: 'biology', subjectId: 'biology_ial_pearson', board: 'pearson' },
  'Business-WBS11': { slug: 'business', subjectId: 'business_ial_pearson', board: 'pearson' },
  'Chemistry-WCH11': { slug: 'chemistry', subjectId: 'chemistry_ial_pearson', board: 'pearson' },
  'Economics-WEC11': { slug: 'economics', subjectId: 'economics_ial_pearson', board: 'pearson' },
  'Mathematics-WMA11': { slug: 'mathematics', subjectId: 'mathematics_ial_pearson', board: 'pearson' },
  'Physics-WPH11': { slug: 'physics', subjectId: 'physics_ial_pearson', board: 'pearson' },
  'ComputerScience-9618': {
    slug: 'computer_science',
    syllabus: '9618',
    subjectId: 'computer_science_ial_cambridge',
    board: 'cambridge'
  },
  'TravelTourism-9395': {
    slug: 'travel_tourism',
    syllabus: '9395',
    subjectId: 'travel_tourism_ial_cambridge',
    board: 'cambridge'
  }
};

const MONTH_TO_SESSION = {
  '01': 'january',
  '02': 'february',
  '03': 'march',
  '04': 'april',
  '05': 'may',
  '06': 'june',
  '07': 'july',
  '08': 'august',
  '09': 'september',
  '10': 'october',
  '11': 'november',
  '12': 'december'
};

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 0;
const subjectFilterIdx = args.indexOf('--subject');
const subjectFilter = subjectFilterIdx >= 0 ? args[subjectFilterIdx + 1] : null;

function sessionLabel(year, month, board) {
  if (board === 'pearson') {
    if (month === '01') return `January ${year}`;
    if (month === '06') return `May ${year}`;
    if (month === '10') return `October ${year}`;
    if (month === '11') return `November ${year}`;
  }
  const m = MONTH_TO_SESSION[month] || 'session';
  const cap = m.charAt(0).toUpperCase() + m.slice(1);
  if (month === '06') return `May/June ${year}`;
  if (month === '11') return `October/November ${year}`;
  if (month === '03') return `February/March ${year}`;
  return `${cap} ${year}`;
}

function variantSlug(raw) {
  if (!raw) return '';
  return '-v' + raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function parseFilenameCambridge(base, folderMeta) {
  const m = base.match(/^(.+?)-(\d{4})-unit(\d+)-(\d{4})-(\d{2})(?:-([\dA-Za-z]+))?-(qp|ms)$/i);
  if (!m) return null;

  const prefix = m[1];
  const syllabusFromName = prefix.match(/-(\d{4})$/);
  const syllabus = syllabusFromName ? syllabusFromName[1] : folderMeta.syllabus;
  const year = m[2];
  const unit = m[3];
  const month = m[5];
  const paperVariant = m[6] || null;
  const docType = m[7].toLowerCase();
  const session = MONTH_TO_SESSION[month] || month;
  const variantPart = paperVariant ? `-p${paperVariant}` : '';
  const docSuffix = docType === 'qp' ? 'qp' : 'ms';
  const paperId = `${folderMeta.slug}-${syllabus}-${year}-unit${unit}-${session}${variantPart}-${docSuffix}`;

  return {
    paperId,
    year,
    unit,
    month,
    paperVariant,
    sessionKey: session,
    session: sessionLabel(year, month, 'cambridge'),
    meta: { ...folderMeta, syllabus, subjectId: folderMeta.subjectId },
    docType,
    board: 'cambridge'
  };
}

function parseFilenamePearson(base, folderMeta) {
  const m = base.match(/^(.+?)-(W[A-Z0-9]+)-(\d{4})-unit(\d+)-(\d{4})-(\d{2})(?:-(.+))?-(qp|ms)$/i);
  if (!m) return null;

  const wcode = m[2].toLowerCase();
  const year = m[3];
  const unit = String(parseInt(m[4], 10));
  const month = m[6];
  const paperVariant = m[7] || null;
  const docType = m[8].toLowerCase();
  const sessionKey = EDEXCEL_MONTH[month] || month;
  const variantPart = variantSlug(paperVariant);
  const docSuffix = docType === 'qp' ? 'qp' : 'ms';
  const paperId = `${wcode}-${sessionKey}-${year}-unit${unit}${variantPart}-${docSuffix}`;

  return {
    paperId,
    year,
    unit,
    month,
    paperVariant,
    sessionKey,
    session: sessionLabel(year, month, 'pearson'),
    meta: { ...folderMeta, wcode, subjectId: folderMeta.subjectId },
    docType,
    board: 'pearson'
  };
}

function parseFilename(qpFile, folderName) {
  const base = qpFile.replace(/\.pdf$/i, '');
  const folderMeta = SUBJECT_MAP[folderName];
  if (!folderMeta) return null;

  if (folderMeta.board === 'cambridge') {
    return parseFilenameCambridge(base, folderMeta);
  }
  return parseFilenamePearson(base, folderMeta);
}

function extractPaperCode(text, fallback) {
  const w = text.match(/\b(W[A-Z]{2}\d{2})\s*\/\s*(\d{2}[A-Z]?)\b/i);
  if (w) return `${w[1].toUpperCase()}/${w[2]}`;
  const m = text.match(/\b(\d{4})\/(\d{1,2}[A-Z]?)\b/);
  if (m) return `${m[1]}/${m[2]}`;
  if (typeof fallback === 'string' && fallback.startsWith('W')) {
    return `${fallback.toUpperCase()}/01`;
  }
  return `${fallback}/`;
}

function isMcqPaper(text) {
  return /Multiple Choice|Paper\s+1\s+Multiple/i.test(text.slice(0, 2500));
}

function parseMcqAnswers(msText) {
  const answers = new Map();
  const start = msText.search(/Question\s+Answer\s+Marks/i);
  const section = start >= 0 ? msText.slice(start) : msText;
  const lines = section.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.replace(/\s+/g, ' ').trim();
    const m = line.match(/^(\d{1,2})\s+([A-D])\s+(\d+)\s*$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n >= 1 && n <= 60) {
        answers.set(n, { answer: m[2], marks: parseInt(m[3], 10) || 1 });
      }
    }
  }
  return answers;
}

function parseMcqQuestions(qpText) {
  const lines = qpText.split(/\r?\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^1\s+[A-Z]/.test(t) || /^1\s{2,}[A-Z]/.test(t)) {
      start = i;
      break;
    }
  }
  if (start < 0) return [];

  const questions = [];
  let i = start;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    const head = trimmed.match(/^(\d{1,2})\s+(.+)/);
    if (!head) {
      i++;
      continue;
    }
    const num = parseInt(head[1], 10);
    if (num < 1 || num > 60) {
      i++;
      continue;
    }
    if (questions.length && num !== questions[questions.length - 1].number + 1) {
      if (num <= questions[questions.length - 1].number) {
        i++;
        continue;
      }
    }

    let stem = head[2].trim();
    const options = [];
    i++;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) {
        i++;
        continue;
      }
      const nextHead = line.match(/^(\d{1,2})\s+(.+)/);
      if (nextHead) {
        const nextNum = parseInt(nextHead[1], 10);
        if (nextNum === num + 1 || (questions.length === 0 && nextNum > num)) {
          break;
        }
        if (nextNum > num && nextNum <= 60) break;
      }
      const opt = line.match(/^([A-D])\s+(.+)/);
      if (opt) {
        options.push({ letter: opt[1], text: opt[2].trim() });
      } else if (options.length && !/^©|UCLES|Turn over|BLANK/i.test(line)) {
        options[options.length - 1].text += ' ' + line;
      } else if (!options.length && !/^©|UCLES|Turn over|BLANK/i.test(line)) {
        stem += ' ' + line;
      }
      i++;
    }

    const optionTexts = options.map((o) => `${o.letter} ${o.text}`.trim());
    const fullQuestion =
      optionTexts.length > 0
        ? `${stem} ${optionTexts.join(', ')}`
        : stem;

    questions.push({
      number: num,
      stem: fullQuestion.trim(),
      options: optionTexts
    });
  }

  return questions;
}

function buildMcqJson(qpText, msText, info) {
  const answers = parseMcqAnswers(msText);
  const qpQuestions = parseMcqQuestions(qpText);
  const questions = [];
  const maxQ = Math.max(
    qpQuestions.length ? qpQuestions[qpQuestions.length - 1].number : 0,
    answers.size ? Math.max(...answers.keys()) : 0
  );

  for (let n = 1; n <= maxQ; n++) {
    const qpQ = qpQuestions.find((q) => q.number === n);
    const ans = answers.get(n);
    if (!qpQ && !ans) continue;
    const marks = ans?.marks || 1;
    questions.push({
      id: `q${n}`,
      number: n,
      type: 'multiple_choice',
      totalMarks: marks,
      marks,
      question: qpQ?.stem || `Question ${n}`,
      text: qpQ?.stem || `Question ${n}`,
      options: qpQ?.options || [],
      answer: ans?.answer || ''
    });
  }

  const code = extractPaperCode(qpText, info.meta.wcode || info.meta.syllabus);
  const unitNum = info.unit;
  const paperId = info.paperId;
  const msPaperId = paperId.replace(/-qp$/, '-ms');

  return {
    paperId,
    pairedMarkSchemeId: msPaperId,
    subjectId: info.meta.subjectId,
    code,
    session: info.session,
    title: `Paper ${unitNum} - Question Paper (MCQ)`,
    documentType: 'QP',
    totalMarks: questions.reduce((s, q) => s + (q.marks || 1), 0),
    timeMinutes: questions.length <= 40 ? 60 : 90,
    questions,
    _meta: { parser: 'mcq', questionCount: questions.length, answersMatched: questions.filter((q) => q.answer).length }
  };
}

/** Best-effort structured: store QP excerpt + MS answer blocks keyed by part id */
function parseStructuredMsAnswers(msText) {
  const parts = new Map();
  const re = /^(\d{1,2})\(([a-z])(?:\(([ivx]+)\))?\)\s*$/i;
  const lines = msText.split(/\r?\n/);
  let currentKey = null;
  let buffer = [];

  const flush = () => {
    if (!currentKey || !buffer.length) return;
    const answer = buffer
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\s*;\s*/g, '; ')
      .trim()
      .slice(0, 2000);
    if (answer.length > 2) parts.set(currentKey, answer);
    buffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || /^Question\s*$/i.test(line) || /^Answer\s*$/i.test(line) || /^Marks\s*$/i.test(line) || /^Guidance\s*$/i.test(line)) {
      continue;
    }
    if (/^GENERIC MARKING|Science-Specific|Page \d+ of/i.test(line)) continue;

    const m = line.match(re);
    if (m) {
      flush();
      const q = m[1];
      const letter = m[2];
      const roman = m[3];
      currentKey = roman ? `${q}${letter}_${roman}` : `${q}${letter}`;
      continue;
    }
    if (/^\d{1,2}\([a-z]\)/i.test(line)) continue;
    if (currentKey && !/^©|UCLES|Cambridge|Published|PUBLISHED/i.test(line)) {
      if (/^\d+\s*$/i.test(line) && buffer.length) continue;
      buffer.push(line);
    }
  }
  flush();
  return parts;
}

function extractStructuredQuestionStems(qpText) {
  const stems = new Map();
  const re = /(\d{1,2})\s*\(\s*([a-z])\s*\)\s*(?:\(\s*([ivx]+)\s*\)\s*)?/gi;
  let m;
  while ((m = re.exec(qpText))) {
    const key = m[3] ? `${m[1]}${m[2]}_${m[3]}` : `${m[1]}${m[2]}`;
    const idx = m.index;
    const snippet = qpText.slice(idx, idx + 400).replace(/\s+/g, ' ').trim();
    if (!stems.has(key)) stems.set(key, snippet);
  }
  return stems;
}

function buildStructuredJson(qpText, msText, info) {
  const msAnswers = parseStructuredMsAnswers(msText);
  const qpStems = extractStructuredQuestionStems(qpText);
  const questions = [];
  const byQuestion = new Map();

  for (const [key, answer] of msAnswers) {
    const qNum = parseInt(key.match(/^\d+/)[0], 10);
    if (!byQuestion.has(qNum)) byQuestion.set(qNum, []);
    byQuestion.get(qNum).push({
      id: key,
      text: qpStems.get(key) || `Part ${key}`,
      marks: 1,
      type: 'structured',
      answer
    });
  }

  for (const [qNum, parts] of [...byQuestion.entries()].sort((a, b) => a[0] - b[0])) {
    const totalMarks = parts.length;
    questions.push({
      id: `q${qNum}`,
      number: qNum,
      type: 'structured',
      totalMarks,
      marks: totalMarks,
      question: qpStems.get(`${qNum}a`) || `Question ${qNum}`,
      text: qpStems.get(`${qNum}a`) || `Question ${qNum}`,
      parts
    });
  }

  const code = extractPaperCode(qpText, info.meta.wcode || info.meta.syllabus);
  return {
    paperId: info.paperId,
    pairedMarkSchemeId: info.paperId.replace(/-qp$/, '-ms'),
    subjectId: info.meta.subjectId,
    code,
    session: info.session,
    title: `Unit ${info.unit} - Question Paper`,
    documentType: 'QP',
    totalMarks: questions.reduce((s, q) => s + (q.totalMarks || 0), 0),
    timeMinutes: 90,
    questions,
    _meta: {
      parser: 'structured',
      partCount: msAnswers.size,
      questionCount: questions.length
    }
  };
}

async function extractPdf(filePath) {
  const buf = fs.readFileSync(filePath);
  const data = await pdfparse(buf);
  return data.text || '';
}

async function processQp(qpPath, folderName) {
  const qpFile = path.basename(qpPath);
  const parsed = parseFilename(qpFile, folderName);
  if (!parsed) return { status: 'skip_filename', file: qpFile };

  const msFile = qpFile.replace(/-qp\.pdf$/i, '-ms.pdf');
  const msPath = path.join(path.dirname(qpPath), msFile);
  if (!fs.existsSync(msPath)) {
    return { status: 'missing_ms', file: qpFile, paperId: parsed.paperId };
  }

  const qpText = await extractPdf(qpPath);
  const msText = await extractPdf(msPath);
  const mcq = isMcqPaper(qpText);

  let json;
  if (mcq) {
    json = buildMcqJson(qpText, msText, parsed);
    if (!json.questions.length) {
      return { status: 'mcq_parse_empty', file: qpFile, paperId: parsed.paperId };
    }
  } else {
    json = buildStructuredJson(qpText, msText, parsed);
    if (!json.questions.length) {
      return { status: 'structured_parse_empty', file: qpFile, paperId: parsed.paperId };
    }
  }

  const outPath = path.join(OUT_DIR, `${parsed.paperId}.json`);
  if (!dryRun) {
    fs.writeFileSync(outPath, JSON.stringify(json, null, 2), 'utf8');
  }

  let status = 'ok';
  if (json._meta?.parser === 'mcq' && json._meta.answersMatched < json._meta.questionCount * 0.8) {
    status = 'low_answer_match';
  }

  return {
    status,
    file: qpFile,
    paperId: parsed.paperId,
    parser: json._meta.parser,
    questions: json.questions.length,
    matched: json._meta.answersMatched,
    total: json._meta.questionCount,
    outPath
  };
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const folders = fs
    .readdirSync(PDF_BASE, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => SUBJECT_MAP[name])
    .filter((name) => !subjectFilter || name === subjectFilter);

  const report = { startedAt: new Date().toISOString(), dryRun, results: [] };
  let processed = 0;

  for (const folder of folders) {
    const dir = path.join(PDF_BASE, folder);
    const qpFiles = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('-qp.pdf'));
    console.log(`\n=== ${folder} (${qpFiles.length} QP) ===`);

    for (const qpFile of qpFiles) {
      if (limit > 0 && processed >= limit) break;
      const qpPath = path.join(dir, qpFile);
      try {
        const result = await processQp(qpPath, folder);
        report.results.push({ folder, ...result });
        console.log(`${result.status}: ${qpFile}${result.questions ? ` (${result.questions} q)` : ''}`);
        processed++;
      } catch (err) {
        report.results.push({ folder, status: 'error', file: qpFile, error: err.message });
        console.error(`error: ${qpFile}`, err.message);
      }
    }
    if (limit > 0 && processed >= limit) break;
  }

  const summary = report.results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  report.summary = summary;
  report.finishedAt = new Date().toISOString();

  if (!dryRun) {
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
  }
  console.log('\nSummary:', summary);
  console.log(dryRun ? '(dry run — no files written)' : `Report: ${REPORT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
