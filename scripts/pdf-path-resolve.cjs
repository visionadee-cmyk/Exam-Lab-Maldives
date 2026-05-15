const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PDF_O = path.join(ROOT, 'public', 'pdf-pastpaer-q&a', 'O-Level');
const PDF_A = path.join(ROOT, 'public', 'pdf-pastpaer-q&a', 'A-Level');

const SESSION_MONTH = {
  jan: '01',
  january: '01',
  may: '06',
  jun: '06',
  june: '06',
  oct: '10',
  october: '10',
  nov: '11',
  november: '11',
  mar: '03',
  march: '03'
};

const CAMBRIDGE_SYLLABUS_FOLDER = {
  '0452': 'Accounting-0452',
  '0610': 'Biology-0610',
  '0450': 'BusinessStudies-0450',
  '0620': 'Chemistry-0620',
  '0478': 'ComputerScience-0478',
  '0455': 'Economics-0455',
  '0500': 'EnglishFirstLanguage-0500',
  '0510': 'EnglishSecondLanguage-0510',
  '0580': 'Mathematics-0580',
  '0625': 'Physics-0625',
  '0471': 'TravelTourism-0471',
  '9395': 'TravelTourism-9395',
  '7707': 'Accounting-0452',
  '5090': 'Biology-0610',
  '9618': 'ComputerScience-9618',
  '9708': 'Economics-9708',
  '9709': 'Mathematics-9709',
  '9702': 'Physics-9702'
};

function listPdfDirs(base) {
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).filter((f) => {
    try {
      return fs.statSync(path.join(base, f)).isDirectory();
    } catch {
      return false;
    }
  });
}

function buildWcodeFolderMap() {
  const map = {};
  for (const folder of listPdfDirs(PDF_A)) {
    const m = folder.match(/^(.+)-(W[A-Z]{2}\d+)/i);
    if (m) map[m[2].toLowerCase()] = folder;
  }
  return map;
}

const WCODE_FOLDER = buildWcodeFolderMap();

function pearsonPdfName(paperId) {
  const m = paperId.match(/^([a-z0-9]+)-([a-z]+)-(\d{4})-unit(\d+)/i);
  if (!m) return null;
  const [, wcode, session, year, unit] = m;
  const month = SESSION_MONTH[session.toLowerCase()];
  if (!month) return null;
  const wLower = wcode.toLowerCase();
  const folder = WCODE_FOLDER[wLower] || null;
  const prefix = wcode.replace(/\d+$/, '').toLowerCase();
  const subjectTag =
    prefix === 'wbi'
      ? 'Biology'
      : prefix === 'wch'
        ? 'Chemistry'
        : prefix === 'wph'
          ? 'Physics'
          : prefix === 'wma' || prefix === 'wst'
            ? 'Mathematics'
            : prefix === 'wac'
              ? 'Accounting'
              : prefix === 'wec'
                ? 'Economics'
                : prefix === 'wbs'
                  ? 'Business'
                  : 'Subject';
  const file = `${subjectTag}-${wcode.toUpperCase()}-${year}-unit${unit}-${year}-${month}-qp.pdf`;
  return { folder, file, month, year, unit, wcode: wcode.toUpperCase() };
}

function parseCambridgePaperId(paperId) {
  const stem = paperId.replace(/-qp$/i, '');
  const m = stem.match(
    /^[a-z_]+-(\d{4})-(\d{4})-unit(\d+)-([a-z]+)(?:-(p\d+))?$/i
  );
  if (!m) return null;
  const [, syllabus, year, unit, session, variant] = m;
  const month = SESSION_MONTH[session.toLowerCase()];
  if (!month) return null;
  return { syllabus, year, unit, session, month, variant: variant || null };
}

function findFolderForSyllabus(syllabus) {
  if (CAMBRIDGE_SYLLABUS_FOLDER[syllabus]) {
    for (const base of [PDF_O, PDF_A]) {
      const dir = path.join(base, CAMBRIDGE_SYLLABUS_FOLDER[syllabus]);
      if (fs.existsSync(dir)) return { base, folder: CAMBRIDGE_SYLLABUS_FOLDER[syllabus] };
    }
  }
  for (const base of [PDF_O, PDF_A]) {
    const hit = listPdfDirs(base).find((f) => f.endsWith(`-${syllabus}`));
    if (hit) return { base, folder: hit };
  }
  return null;
}

function resolveCambridgePdf(paperId) {
  const parsed = parseCambridgePaperId(paperId);
  if (!parsed) return null;

  const loc = findFolderForSyllabus(parsed.syllabus);
  if (!loc) return null;

  const dir = path.join(loc.base, loc.folder);
  const variantSuffix = parsed.variant ? `-${parsed.variant}` : '';
  const exactRe = new RegExp(
    `-${parsed.year}-unit0?${parsed.unit}-${parsed.year}-${parsed.month}${variantSuffix}-qp\\.pdf$`,
    'i'
  );
  const looseRe = new RegExp(
    `${parsed.year}.*unit0?${parsed.unit}.*${parsed.month}.*${variantSuffix || ''}.*-qp\\.pdf$`,
    'i'
  );

  const files = fs.readdirSync(dir).filter((f) => /-qp\.pdf$/i.test(f));
  const exact = files.find((f) => exactRe.test(f));
  if (exact) return path.join(dir, exact);
  const loose = files.find((f) => looseRe.test(f));
  if (loose) return path.join(dir, loose);

  const unitSessionRe = new RegExp(
    `unit0?${parsed.unit}.*${parsed.month}.*-qp\\.pdf$`,
    'i'
  );
  const unitHit = files.find((f) => unitSessionRe.test(f) && f.includes(parsed.year));
  return unitHit ? path.join(dir, unitHit) : null;
}

function cambridgePdfSearch(paperId, base) {
  const hit = resolveCambridgePdf(paperId);
  if (hit) return hit;

  const stem = paperId.replace(/-qp$/i, '').toLowerCase();
  for (const folder of listPdfDirs(base)) {
    const dir = path.join(base, folder);
    for (const f of fs.readdirSync(dir)) {
      if (!/-qp\.pdf$/i.test(f)) continue;
      const name = f.replace(/\.pdf$/i, '').toLowerCase();
      if (name.includes(stem.slice(-30))) return path.join(dir, f);
    }
  }
  return null;
}

function resolveQpPdfPath(paper) {
  if (paper.assets?.qpPdf) {
    const rel = paper.assets.qpPdf.replace(/^\//, '');
    const full = path.join(ROOT, 'public', rel);
    if (fs.existsSync(full)) return full;
  }

  const paperId = paper.paperId || paper.id || '';
  const pearson = pearsonPdfName(paperId.replace(/-qp$/i, ''));
  if (pearson?.folder) {
    const dir = path.join(PDF_A, pearson.folder);
    const exact = path.join(dir, pearson.file);
    if (fs.existsSync(exact)) return exact;
    if (fs.existsSync(dir)) {
      const month = pearson.month;
      const re = new RegExp(
        `${pearson.year}.*unit0?${pearson.unit}.*${month}.*-qp\\.pdf$`,
        'i'
      );
      const hit = fs.readdirSync(dir).find((f) => re.test(f));
      if (hit) return path.join(dir, hit);
    }
  }

  const cambridge = resolveCambridgePdf(paperId);
  if (cambridge) return cambridge;

  for (const base of [PDF_A, PDF_O]) {
    const hit = cambridgePdfSearch(paperId, base);
    if (hit) return hit;
  }
  return null;
}

function qpPdfWebPath(absPath) {
  if (!absPath) return null;
  const pub = path.join(ROOT, 'public');
  const rel = path.relative(pub, absPath).replace(/\\/g, '/');
  return `/${rel}`;
}

module.exports = {
  resolveQpPdfPath,
  qpPdfWebPath,
  pearsonPdfName,
  SESSION_MONTH,
  parseCambridgePaperId
};
