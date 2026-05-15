const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PDF_BASE = path.join(ROOT, 'public', 'pdf-pastpaer-q&a', 'O-Level');

const SUBJECT_MAP = {
  'Accounting-0452': { slug: 'accounting', syllabus: '0452' },
  'Biology-0610': { slug: 'biology', syllabus: '0610' },
  'BusinessStudies-0450': { slug: 'business', syllabus: '0450' },
  'Chemistry-0620': { slug: 'chemistry', syllabus: '0620' },
  'ComputerScience-0478': { slug: 'computer_science', syllabus: '0478' },
  'Economics-0455': { slug: 'economics', syllabus: '0455' },
  'EnglishFirstLanguage-0500': { slug: 'english_first', syllabus: '0500' },
  'EnglishSecondLanguage-0510': { slug: 'english_second', syllabus: '0510' },
  'Mathematics-0580': { slug: 'mathematics', syllabus: '0580' },
  'Physics-0625': { slug: 'physics', syllabus: '0625' },
  'TravelTourism-0471': { slug: 'travel_tourism', syllabus: '0471' }
};

const MONTH_TO_SESSION = {
  '06': 'june', '11': 'november', '03': 'march'
};

function parseFilename(qpFile, folderName) {
  const base = qpFile.replace(/\.pdf$/i, '');
  const m = base.match(/^(.+?)-(\d{4})-unit(\d+)-(\d{4})-(\d{2})(?:-(\d{1,2}))?-(qp|ms)$/i);
  if (!m) return null;
  const folderMeta = SUBJECT_MAP[folderName];
  if (!folderMeta) return null;
  const syllabusFromName = m[1].match(/-(\d{4})$/);
  const syllabus = syllabusFromName ? syllabusFromName[1] : folderMeta.syllabus;
  const session = MONTH_TO_SESSION[m[5]] || m[5];
  const variantPart = m[6] ? `-p${m[6]}` : '';
  return `${folderMeta.slug}-${syllabus}-${m[2]}-unit${m[3]}-${session}${variantPart}-qp`;
}

const map = new Map();
let unparseable = 0;
for (const folder of fs.readdirSync(PDF_BASE)) {
  const dir = path.join(PDF_BASE, folder);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((x) => /-qp\.pdf$/i.test(x))) {
    const id = parseFilename(f, folder);
    if (!id) {
      unparseable++;
      continue;
    }
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(f);
  }
}
const dups = [...map.entries()].filter(([, a]) => a.length > 1);
console.log({ unique: map.size, dups: dups.length, unparseable });
if (dups.length) console.log('sample', dups.slice(0, 3));
