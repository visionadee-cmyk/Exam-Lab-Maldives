const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a/O-Level/TravelTourism-0471';
const subjectName = 'TravelTourism-0471';

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
};

let renamed = 0, skipped = 0, errors = [];
const files = fs.readdirSync(baseDir);

for (const file of files) {
  if (!file.toLowerCase().endsWith('.pdf')) continue;
  if (file.startsWith(subjectName + '-')) { skipped++; continue; }
  if (file.includes('solved') || file.includes('notice')) { skipped++; continue; }
  
  // Pattern: 0471_s17_qp_11.pdf or 0471_s17_qp_01.pdf
  // Also handle: 0471_s16_qp_1.pdf (single digit variant)
  const m = file.match(/^\d+_([msw]\d{2})_(qp|ms|er|gt|in|ci|pm)(?:_(\d+))?\.pdf$/i);
  if (!m) { errors.push(`No match: ${file}`); continue; }
  
  const session = m[1].toLowerCase();
  const rawType = m[2].toLowerCase();
  const variant = m[3] || null;
  const sm = sessionMap[session];
  if (!sm) { errors.push(`Unknown session: ${file}`); continue; }
  
  // Extract unit from variant (first digit)
  // variant like "11", "12", "13" -> unit 1
  // variant like "21", "22", "23" -> unit 2
  const unit = variant ? String(variant)[0] : '1';
  const year = String(sm.y);
  const month = sm.m;
  
  const newName = `${subjectName}-${year}-unit${unit}-${year}-${month}-${rawType}.pdf`;
  const oldPath = path.join(baseDir, file);
  const newPath = path.join(baseDir, newName);
  
  if (fs.existsSync(newPath)) { 
    console.log(`Skip (exists): ${file}`);
    skipped++; 
    continue; 
  }
  
  fs.renameSync(oldPath, newPath);
  renamed++;
  console.log(`Renamed: ${file} -> ${newName}`);
}

console.log(`\nDone: ${renamed} renamed, ${skipped} skipped`);
if (errors.length) {
  console.log('Errors:', errors.slice(0, 20));
  if (errors.length > 20) console.log(`... and ${errors.length - 20} more`);
}
