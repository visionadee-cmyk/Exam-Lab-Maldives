const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a';

function ensurePrefixed(dir, subjectName) {
  const items = fs.readdirSync(dir);
  let renamed = 0;

  for (const item of items) {
    const oldPath = path.join(dir, item);
    if (fs.statSync(oldPath).isDirectory()) continue;
    if (!item.toLowerCase().endsWith('.pdf')) continue;
    if (item.startsWith(subjectName + '-')) continue;

    const m = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-(\w+)-(\d+)-(qp|ms|er|gt|ir|in|ci|pm)\.pdf$/i);
    if (!m) continue;

    const [, year, unit, , month, , , type] = m;
    const newName = `${subjectName}-${year}-unit${unit}-${year}-${month}-${type}.pdf`;
    const newPath = path.join(dir, newName);

    if (fs.existsSync(newPath)) {
      // If already exists, don't overwrite.
      continue;
    }

    fs.renameSync(oldPath, newPath);
    renamed++;
  }

  return renamed;
}

let total = 0;
for (const level of ['O-Level', 'A-Level']) {
  const levelPath = path.join(baseDir, level);
  if (!fs.existsSync(levelPath)) continue;

  for (const subject of fs.readdirSync(levelPath)) {
    const subjectPath = path.join(levelPath, subject);
    if (!fs.statSync(subjectPath).isDirectory()) continue;
    total += ensurePrefixed(subjectPath, subject);
  }
}

console.log('Renamed to add missing subject prefix:', total);
