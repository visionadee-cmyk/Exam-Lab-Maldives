/**
 * Render QP PDF pages to PNG and link images to questions in JSON.
 * Usage: node scripts/extract-qp-pdf-images.cjs [--subject biology_ial_pearson] [--limit N] [--skip-existing]
 */
const fs = require('fs');
const path = require('path');
const { createCanvas, Path2D } = require('@napi-rs/canvas');
const { pathToFileURL } = require('url');
if (typeof global.Path2D === 'undefined') global.Path2D = Path2D;

const PDFJS_DIR = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist');
const { resolveQpPdfPath, qpPdfWebPath } = require('./pdf-path-resolve.cjs');

const ROOT = path.join(__dirname, '..');
const PAPERS_DIR = path.join(ROOT, 'src', 'data', 'papers');
const PUBLIC_PAPERS = path.join(ROOT, 'public', 'papers');
const LOG_PATH = path.join(ROOT, 'scripts', 'extract-qp-images-log.txt');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const skipExisting = args.includes('--skip-existing');
const subjectIdx = args.indexOf('--subject');
const subjectFilter = subjectIdx >= 0 ? args[subjectIdx + 1] : null;
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 0;
const RENDER_SCALE = 1.35;

let pdfjsBundle = null;

function log(msg) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(msg);
  fs.appendFileSync(LOG_PATH, `${line}\n`);
}

function assetSlugFromPaperId(paperId) {
  return paperId
    .replace(/-qp$/i, '')
    .replace(/-ms$/i, '')
    .replace(/-unit\d+.*$/i, '');
}

function isQpFile(name) {
  return (
    name.endsWith('-qp.json') ||
    (/^biology-wbi\d+-.+\.json$/i.test(name) && !name.includes('-ms'))
  );
}

async function getPdfjs() {
  if (!pdfjsBundle) {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const wasmUrl = pathToFileURL(path.join(PDFJS_DIR, 'wasm/')).href;
    pdfjsBundle = { pdfjs, wasmUrl };
  }
  return pdfjsBundle;
}

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

function alreadyExtracted(outDir, expectedPages) {
  if (!fs.existsSync(outDir)) return false;
  const pngs = fs.readdirSync(outDir).filter((f) => /^page-\d+\.png$/i.test(f));
  return pngs.length >= Math.min(expectedPages || 1, 1);
}

async function renderPdfPages(pdfPath, outDir) {
  const { pdfjs, wasmUrl } = await getPdfjs();
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true, wasmUrl }).promise;

  const pages = [];

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const text = await page.getTextContent();
    const line = text.items.map((it) => it.str).join(' ');
    let questionNum = null;
    const qm = line.match(/Question\s+(\d{1,2})\b/i);
    if (qm) questionNum = parseInt(qm[1], 10);

    const viewport = page.getViewport({ scale: RENDER_SCALE });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const fileName = `page-${String(p).padStart(2, '0')}.png`;
    const outPath = path.join(outDir, fileName);

    if (!dryRun) {
      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    }

    pages.push({ page: p, fileName, questionNum });
  }

  return pages;
}

function wireImages(paper, pages, basePath) {
  if (!pages.length) return false;
  let changed = false;

  const byQ = new Map();
  for (const pg of pages) {
    if (pg.questionNum != null) {
      if (!byQ.has(pg.questionNum)) byQ.set(pg.questionNum, []);
      byQ.get(pg.questionNum).push(pg);
    }
  }

  for (const q of paper.questions || []) {
    const num = q.number ?? 0;
    const pg = byQ.get(num)?.[0];
    const fallbackPage = pages[Math.min(Math.max(num - 1, 0), pages.length - 1)];
    const img = pg
      ? `${basePath}/${pg.fileName}`
      : fallbackPage
        ? `${basePath}/${fallbackPage.fileName}`
        : `${basePath}/q${num}.png`;

    if (q.image !== img) {
      q.image = img;
      changed = true;
    }

    for (const part of q.parts || []) {
      const safe = String(part.id).replace(/\./g, '_');
      const partPath = `${basePath}/q${num}-${safe}.png`;
      if (part.image !== partPath) {
        part.image = partPath;
        changed = true;
      }
    }
  }

  const pageImages = pages.map((p) => `${basePath}/${p.fileName}`);
  const prev = paper.assets?.pageImages || [];
  if (JSON.stringify(prev) !== JSON.stringify(pageImages)) {
    paper.assets = { ...(paper.assets || {}), pageImages };
    changed = true;
  }

  return changed;
}

async function main() {
  fs.writeFileSync(LOG_PATH, `extract start ${new Date().toISOString()}\n`);
  const files = fs.readdirSync(PAPERS_DIR).filter(isQpFile);
  let done = 0;
  let skipped = 0;
  let noPdf = 0;
  let failed = 0;
  let pagesTotal = 0;

  for (const file of files) {
    if (limit > 0 && done >= limit) break;

    const full = path.join(PAPERS_DIR, file);
    const paper = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (subjectFilter && paper.subjectId !== subjectFilter) continue;
    if (!paper.questions?.length) continue;

    paper.paperId = paperIdFromFile(file, paper);

    const pdfPath = resolveQpPdfPath(paper);
    if (!pdfPath) {
      noPdf++;
      continue;
    }

    const slug = assetSlugFromPaperId(paper.paperId);
    const outDir = path.join(PUBLIC_PAPERS, slug);
    const basePath = `/papers/${slug}`;
    const webPdf = qpPdfWebPath(pdfPath);

    if (skipExisting && alreadyExtracted(outDir, 1)) {
      skipped++;
      paper.assets = { ...(paper.assets || {}), basePath, qpPdf: webPdf };
      if (!dryRun) {
        fs.writeFileSync(full, JSON.stringify(paper, null, 2), 'utf8');
      }
      continue;
    }

    if (!dryRun) fs.mkdirSync(outDir, { recursive: true });

    log(`render: ${file}`);
    try {
      const pages = await renderPdfPages(pdfPath, outDir);
      pagesTotal += pages.length;

      paper.assets = { ...(paper.assets || {}), basePath, qpPdf: webPdf };
      wireImages(paper, pages, basePath);

      if (!dryRun) {
        fs.writeFileSync(full, JSON.stringify(paper, null, 2), 'utf8');
        const n = fs.readdirSync(outDir).filter((f) => f.endsWith('.png')).length;
        log(`  ok ${n} png, ${pages.length} pages`);
      }
      done++;
    } catch (err) {
      failed++;
      log(`  error ${file}: ${err.message}`);
    }
  }

  const summary = `Done: ${done} rendered, ${skipped} skipped, ${noPdf} no pdf, ${failed} failed, ${pagesTotal} pages`;
  log(summary);
  console.log(`\n${summary}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
