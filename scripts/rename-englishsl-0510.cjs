const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a/O-Level/EnglishSecondLanguage-0510';
const subjectName = 'EnglishSecondLanguage-0510';

const sessionMap = {
  s15: { y: 2015, m: '06' }, s16: { y: 2016, m: '06' },
  s17: { y: 2017, m: '06' }, s18: { y: 2018, m: '06' },
  s19: { y: 2019, m: '06' }, s20: { y: 2020, m: '06' },
  s21: { y: 2021, m: '06' }, s22: { y: 2022, m: '06' },
  s23: { y: 2023, m: '06' }, s24: { y: 2024, m: '06' },
  s25: { y: 2025, m: '06' },
  w15: { y: 2015, m: '11' }, w16: { y: 2016, m: '11' },
  w17: { y: 2017, m: '11' }, w18: { y: 2018, m: '11' },
  w19: { y: 2019, m: '11' }, w20: { y: 2020, m: '11' },
  w21: { y: 2021, m: '11' }, w22: { y: 2022, m: '11' },
  w23: { y: 2023, m: '11' }, w24: { y: 2024, m: '11' },
  w25: { y: 2025, m: '11' },
  m17: { y: 2017, m: '03' }, m18: { y: 2018, m: '03' },
  m19: { y: 2019, m: '03' }, m20: { y: 2020, m: '03' },
  m21: { y: 2021, m: '03' }, m22: { y: 2022, m: '03' },
  m23: { y: 2023, m: '03' }, m24: { y: 2024, m: '03' },
  m25: { y: 2025, m: '03' },
};

function normalizeType(raw) {
  const t = raw.toLowerCase();
  if (t === 'pre') return 'pm';
  return t;
}

let renamed = 0, skipped = 0, errors = [];
const files = fs.readdirSync(baseDir);

for (const file of files) {
  if (!file.toLowerCase().endsWith('.pdf')) continue;
  if (file.startsWith(subjectName + '-')) { skipped++; continue; }
  if (file.includes('_solved') || file.includes('_notice')) { skipped++; continue; }
  
  // Pattern: 0510_s17_qp_12.pdf or 0510_m17_ms_12.pdf
  const m = file.match(/^\d+_([msw]\d{2})_(qp|ms|er|gt|qr|rp|tn|ts|ci|pm|in|ir)(?:_(\d+))?\.pdf$/i);
  if (!m) { errors.push(`No match: ${file}`); continue; }
  
  const session = m[1].toLowerCase();
  const rawType = m[2].toLowerCase();
  const variant = m[3] || null;
  const sm = sessionMap[session];
  if (!sm) { errors.push(`Unknown session: ${file}`); continue; }
  
  const type = normalizeType(rawType);
  // Extract unit from variant (first digit)
  const unit = variant ? String(variant)[0] : '1';
  const year = String(sm.y);
  const month = sm.m;
  
  const newName = `${subjectName}-${year}-unit${unit}-${year}-${month}-${type}.pdf`;
  const oldPath = path.join(baseDir, file);
  const newPath = path.join(baseDir, newName);
  
  if (fs.existsSync(newPath)) { skipped++; continue; }
  
  fs.renameSync(oldPath, newPath);
  renamed++;
  console.log(`Renamed: ${file} -> ${newName}`);
}

console.log(`\nDone: ${renamed} renamed, ${skipped} skipped`);
if (errors.length) console.log('Errors:', errors.slice(0, 10));
