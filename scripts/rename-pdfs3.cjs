const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a';

function renameFiles(dir, subjectName) {
  const items = fs.readdirSync(dir);
  let renamed = 0;
  
  items.forEach(item => {
    const oldPath = path.join(dir, item);
    if (!fs.statSync(oldPath).isDirectory() && item.endsWith('.pdf')) {
      // Pattern 1: 2020-unit1-2020-06-7707-11-qp.pdf (from first rename)
      let match = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-(\d+)-(\d+)-(qp|ms|er|gt|ir|ci|pm)\.pdf$/i);
      
      // Pattern 2: 2015-unit1-2015-01-WAC01-01-qp.pdf (Edexcel format)
      if (!match) {
        match = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-([A-Z]+)(\d+)-(\d+)-(qp|ms|er|gt|ir|ci|pm)\.pdf$/i);
      }
      
      if (match) {
        let newName;
        if (match.length === 7) {
          // Pattern 1: SubjectCode-Year-Unit-Year-Month-Type
          const [, year, unit, , month, code, variant, type] = match;
          newName = subjectName + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + type + '.pdf';
        } else {
          // Pattern 2: SubjectCode-Year-Unit-Year-Month-Type (Edexcel)
          const [, year, unit, , month, code, codeNum, variant, type] = match;
          newName = subjectName + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + type + '.pdf';
        }
        
        const newPath = path.join(dir, newName);
        
        if (!fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
          console.log('Renamed: ' + item + ' -> ' + newName);
          renamed++;
        }
      }
    }
  });
  
  return renamed;
}

let totalRenamed = 0;
['O-Level', 'A-Level'].forEach(level => {
  const levelPath = path.join(baseDir, level);
  if (fs.existsSync(levelPath)) {
    fs.readdirSync(levelPath).forEach(subject => {
      const subjectPath = path.join(levelPath, subject);
      if (fs.statSync(subjectPath).isDirectory()) {
        totalRenamed += renameFiles(subjectPath, subject);
      }
    });
  }
});

console.log('Total files renamed: ' + totalRenamed);
