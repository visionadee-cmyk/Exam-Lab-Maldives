import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_ROOT = path.join(__dirname, '../public/pdf-pastpaer-q&a');
const OUTPUT = path.join(__dirname, '../src/data/pdf-manifest.json');

function isPDF(file) {
  return file.endsWith('.pdf');
}

function groupPapers(files, levelPrefix) {
  const groups = {};
  files.forEach(file => {
    const rel = path.relative(path.join(PDF_ROOT, levelPrefix), file);
    const parts = rel.split(path.sep);
    if (parts.length < 2) return;
    const subject = parts[0];
    const filename = parts[parts.length - 1];
    if (!groups[subject]) groups[subject] = [];
    groups[subject].push(filename);
  });
  return groups;
}

function scanDir(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      scanDir(full, acc);
    } else if (e.isFile() && isPDF(e.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function main() {
  const allFiles = scanDir(PDF_ROOT);
  const manifest = {
    OLEVEL: {},
    ALEVEL: {}
  };

  // Detect OLEVEL folders
  const olevelFolders = fs.readdirSync(PDF_ROOT).filter(d =>
    fs.statSync(path.join(PDF_ROOT, d)).isDirectory() &&
    (d.includes('IGCSE') || d.includes('O-Level'))
  );

  // Detect ALEVEL folders
  const alevelFolders = fs.readdirSync(PDF_ROOT).filter(d =>
    fs.statSync(path.join(PDF_ROOT, d)).isDirectory() &&
    (d.includes('AS-A-Level') || d.includes('IAL'))
  );

  olevelFolders.forEach(folder => {
    const folderPath = path.join(PDF_ROOT, folder);
    const files = scanDir(folderPath);
    manifest.OLEVEL[folder] = groupPapers(files, folder);
  });

  alevelFolders.forEach(folder => {
    const folderPath = path.join(PDF_ROOT, folder);
    const files = scanDir(folderPath);
    manifest.ALEVEL[folder] = groupPapers(files, folder);
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
  console.log('✅ PDF manifest generated to src/data/pdf-manifest.json');
}

main();
