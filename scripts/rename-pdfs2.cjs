const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a';

function renameFiles(dir, subjectName) {
  const items = fs.readdirSync(dir);
  let renamed = 0;
  
  items.forEach(item => {
    const oldPath = path.join(dir, item);
    if (!fs.statSync(oldPath).isDirectory() && item.endsWith('.pdf')) {
      // Match pattern like 2020-unit1-2020-06-7707-11-qp.pdf
      const match = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-(\d+)(?:-(\d+))?-(qp|ms|er|gt|ir|ci|pm|qp_?\d+|ms_?\d+)\.pdf$/i);
      
      if (match) {
        const [, year, unit, , month, code, variant, type] = match;
        
        // Extract type from the match
        let newType = 'qp';
        if (type.startsWith('ms')) newType = 'ms';
        else if (type.startsWith('er')) newType = 'er';
        else if (type.startsWith('gt')) newType = 'gt';
        else if (type.startsWith('ir')) newType = 'ir';
        else if (type.startsWith('ci')) newType = 'ci';
        else if (type.startsWith('pm')) newType = 'pm';
        else if (type.startsWith('qp')) newType = 'qp';
        
        const newName = subjectName + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + newType + '.pdf';
        
        const newPath = path.join(dir, newName);
        
        // Only rename if file doesn't already exist
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
