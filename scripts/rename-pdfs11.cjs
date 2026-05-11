const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a';

function renameFiles(dir, subjectName) {
  const items = fs.readdirSync(dir);
  let renamed = 0;
  
  items.forEach(item => {
    const oldPath = path.join(dir, item);
    if (!fs.statSync(oldPath).isDirectory() && item.endsWith('.pdf')) {
      // Skip if already has subject name prefix
      if (item.startsWith(subjectName + '-')) {
        console.log('Skipping (has prefix): ' + item);
        return;
      }
      
      // Pattern: 2020-unit1-2020-06-7707-12-qp.pdf
      const match = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-(\d+)-(\d+)-(qp|ms|er|gt|ir|in|ci|pm)\.pdf$/i);
      
      if (match) {
        const [, year, unit, , month, code, variant, type] = match;
        const newName = subjectName + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + type + '.pdf';
        
        const newPath = path.join(dir, newName);
        if (!fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
          console.log('Renamed: ' + item + ' -> ' + newName);
          renamed++;
        } else {
          console.log('Exists: ' + newPath);
        }
        return;
      } else {
        console.log('No match: ' + item);
      }
    }
  });
  
  return renamed;
}

let totalRenamed = 0;
['O-Level'].forEach(level => {
  const levelPath = path.join(baseDir, level);
  if (fs.existsSync(levelPath)) {
    fs.readdirSync(levelPath).forEach(subject => {
      if (subject === 'Accounting-0452') {
        const subjectPath = path.join(levelPath, subject);
        if (fs.statSync(subjectPath).isDirectory()) {
          console.log('Processing: ' + subjectPath);
          totalRenamed += renameFiles(subjectPath, subject);
        }
      }
    });
  }
});

console.log('Total files renamed: ' + totalRenamed);
