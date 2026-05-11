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
        return;
      }
      
      // Extract type from filename
      let type = 'qp';
      if (item.includes('-ms') || item.includes('-ms_')) type = 'ms';
      else if (item.includes('-er')) type = 'er';
      else if (item.includes('-gt')) type = 'gt';
      else if (item.includes('-ir')) type = 'ir';
      else if (item.includes('-ci')) type = 'ci';
      else if (item.includes('-pm')) type = 'pm';
      
      // Extract year, unit, month from filename
      const yearMatch = item.match(/(\d{4})/);
      const unitMatch = item.match(/unit(\d+)/i);
      const monthMatch = item.match(/-(\d{2})-/);
      
      if (yearMatch && unitMatch && monthMatch) {
        const year = yearMatch[1];
        const unit = unitMatch[1];
        const month = monthMatch[1];
        
        const newName = subjectName + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + type + '.pdf';
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
