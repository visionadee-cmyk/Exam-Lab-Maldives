const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a';
const manifestPath = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-manifest.json';

const folderToBoard = {
  'O-Level': 'Cambridge_O-Level',
  'A-Level': 'Edexcel_IAL',
  'IGCSE': 'Cambridge_IGCSE'
};

const folderToLevel = {
  'O-Level': 'OLEVEL',
  'A-Level': 'ALEVEL',
  'IGCSE': 'OLEVEL'
};

function shouldInclude(subject, file) {
  if (!file.toLowerCase().endsWith('.pdf')) return false;
  // Check if file has subject prefix
  const hasSubjectPrefix = file.startsWith(subject + '-');
  if (!hasSubjectPrefix) {
    // Skip non-prefixed files that look like QP/MS
    const isQPMS = /(^|[-_])(qp|ms|question|mark)([-_]|\.)/i.test(file);
    if (isQPMS) return false;
  }
  return true;
}

const manifest = { OLEVEL: {}, ALEVEL: {} };

const levelFolders = fs.readdirSync(baseDir);
for (const levelFolder of levelFolders) {
  const levelPath = path.join(baseDir, levelFolder);
  if (!fs.statSync(levelPath).isDirectory()) continue;
  
  const levelKey = folderToLevel[levelFolder];
  if (!levelKey) continue;
  
  const subjectFolders = fs.readdirSync(levelPath);
  for (const subjectFolder of subjectFolders) {
    const subjectPath = path.join(levelPath, subjectFolder);
    if (!fs.statSync(subjectPath).isDirectory()) continue;
    
    // Get board from level mapping
    const boardKey = folderToBoard[levelFolder] || 'Cambridge_O-Level';
    if (!manifest[levelKey][boardKey]) manifest[levelKey][boardKey] = {};
    
    const files = fs.readdirSync(subjectPath)
      .filter(f => shouldInclude(subjectFolder, f))
      .sort();
    
    if (files.length > 0) {
      manifest[levelKey][boardKey][subjectFolder] = files;
    }
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Manifest regenerated');

// Count files
let total = 0;
Object.values(manifest).forEach(level => {
  Object.values(level).forEach(board => {
    Object.values(board).forEach(files => total += files.length);
  });
});
console.log(`Total PDFs in manifest: ${total}`);
