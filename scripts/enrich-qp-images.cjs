/**
 * Add image paths + PDF links to QP JSON files (WBI11-style asset layout).
 * Run: node scripts/enrich-qp-images.cjs [--dry-run] [--subject biology_ial_pearson]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAPERS_DIR = path.join(ROOT, 'src', 'data', 'papers');
const { resolveQpPdfPath, qpPdfWebPath } = require('./pdf-path-resolve.cjs');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const subjectIdx = args.indexOf('--subject');
const subjectFilter = subjectIdx >= 0 ? args[subjectIdx + 1] : null;

function paperIdFromFile(file, paper) {
  const stem = file.replace(/\.json$/i, '');
  const curated = stem.match(/biology-(wbi\d+)-([a-z]+)(\d{4})-unit(\d+)/i);
  if (curated) {
    const session = { jan: 'jan', may: 'may', jun: 'may', oct: 'oct' }[curated[2].toLowerCase()] || curated[2].toLowerCase();
    return `${curated[1].toLowerCase()}-${session}-${curated[3]}-unit${curated[4]}-qp`;
  }
  if (paper.paperId) return paper.paperId;
  if (paper.id && /-qp$/i.test(paper.id)) return paper.id;
  return stem.endsWith('-qp') ? stem : `${stem}-qp`;
}

function assetSlugFromPaperId(paperId) {
  if (!paperId) return null;
  return paperId
    .replace(/-qp$/i, '')
    .replace(/-ms$/i, '')
    .replace(/-unit\d+.*$/i, '');
}

function enrichPaper(paper, file) {
  const canonicalId = paperIdFromFile(file, paper);
  if (/biology-wbi\d+-/i.test(file) || !paper.paperId) paper.paperId = canonicalId;
  const slug = assetSlugFromPaperId(paper.paperId);
  if (!slug) return false;
  const basePath = `/papers/${slug}`;
  const pdfAbs = resolveQpPdfPath(paper);
  const pdfUrl = qpPdfWebPath(pdfAbs);
  let changed = false;

  if (!paper.assets?.basePath || paper.assets.basePath !== basePath) {
    paper.assets = { ...(paper.assets || {}), basePath };
    changed = true;
  }
  if (pdfUrl && paper.assets.qpPdf !== pdfUrl) {
    paper.assets.qpPdf = pdfUrl;
    changed = true;
  }

  const unitMatch = paper.paperId?.match(/unit(\d+)/i);
  if (unitMatch && !paper.unit) {
    paper.unit = `Unit ${unitMatch[1]}`;
    changed = true;
  }

  for (const q of paper.questions || []) {
    const num = q.number ?? 0;
    const qImg = `${basePath}/q${num}.png`;
    if (!q.image) {
      q.image = qImg;
      changed = true;
    }

    for (const part of q.parts || []) {
      const safePart = String(part.id).replace(/\./g, '_');
      const pImg = `${basePath}/q${num}-${safePart}.png`;
      if (!part.image) {
        part.image = pImg;
        changed = true;
      }
    }
  }

  return changed;
}

function isQpFile(name) {
  return (
    name.endsWith('-qp.json') ||
    /^biology-wbi\d+-.+\.json$/i.test(name) ||
    /^biology-wbi\d+-.+-qp\.json$/i.test(name)
  );
}

function main() {
  const files = fs.readdirSync(PAPERS_DIR).filter(isQpFile);
  let updated = 0;

  for (const file of files) {
    const full = path.join(PAPERS_DIR, file);
    const paper = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (subjectFilter && paper.subjectId !== subjectFilter) continue;
    if (!paper.questions?.length) continue;

    const changed = enrichPaper(paper, file);
    if (changed) {
      updated++;
      if (!dryRun) {
        fs.writeFileSync(full, JSON.stringify(paper, null, 2), 'utf8');
      }
      console.log(changed ? 'updated' : 'skip', file);
    }
  }

  console.log(dryRun ? `Would update ${updated} files` : `Updated ${updated} files`);
}

main();
