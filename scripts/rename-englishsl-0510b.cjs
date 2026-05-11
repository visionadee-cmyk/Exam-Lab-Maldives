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

let renamed = 0, skipped = 0;
const files = fs.readdirSync(baseDir);

for (const file of files) {
  if (!file.toLowerCase().endsWith('.pdf')) continue;
  if (file.startsWith(subjectName + '-')) { skipped++; continue; }
  
  // More flexible pattern: 0510_s15_qp_33.pdf or 0510_s15_tn_52_2.pdf
  const m = file.match(/^\d+_([msw]\d{2})_([a-z]+)(?:_(\d+))?(_\d+)?\.pdf$/i);
  if (!m) { console.log(`No match: ${file}`); continue; }
  
  const session = m[1].toLowerCase();
  const rawType = m[2].toLowerCase();
  const variant = m[3] || null;
  const sm = sessionMap[session];
  if (!sm) { console.log(`Unknown session: ${file}`); continue; }
  
  // Normalize type
  let type = rawType;
  if (type === 'pre') type = 'pm';
  
  const unit = variant ? String(variant)[0] : '1';
  const year = String(sm.y);
  const month = sm.m;
  
  const newName = `${subjectName}-${year}-unit${unit}-${year}-${month}-${type}.pdf`;
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
