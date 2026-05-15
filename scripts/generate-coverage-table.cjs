/**
 * Generate HTML + CSV coverage tables (subject x year x month) for O-Level and A-Level builds.
 * Run: node scripts/generate-coverage-table.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_HTML = path.join(__dirname, 'coverage-report.html');
const OUT_CSV = path.join(__dirname, 'coverage-report.csv');
const OUT_MISSING_MS_CSV = path.join(__dirname, 'coverage-missing-ms.csv');

const MONTH_LABEL = {
  jan: 'January',
  january: 'January',
  feb: 'February',
  february: 'February',
  mar: 'March',
  march: 'March',
  apr: 'April',
  april: 'April',
  may: 'May',
  jun: 'June',
  june: 'June',
  jul: 'July',
  july: 'July',
  aug: 'August',
  august: 'August',
  sep: 'September',
  september: 'September',
  oct: 'October',
  october: 'October',
  nov: 'November',
  november: 'November',
  dec: 'December',
  december: 'December',
  '01': 'January',
  '02': 'February',
  '03': 'February-March session',
  '04': 'April session',
  '05': 'May session',
  '06': 'May-June session',
  '07': 'July session',
  '08': 'August session',
  '09': 'September session',
  '10': 'October session',
  '11': 'October-November session',
  '12': 'December session'
};

const MONTH_SORT = {
  jan: 1,
  january: 1,
  '01': 1,
  feb: 2,
  february: 2,
  '02': 2,
  mar: 3,
  march: 3,
  '03': 3,
  apr: 4,
  april: 4,
  '04': 4,
  may: 5,
  '05': 5,
  jun: 6,
  june: 6,
  '06': 6,
  jul: 7,
  july: 7,
  '07': 7,
  aug: 8,
  august: 8,
  '08': 8,
  sep: 9,
  september: 9,
  '09': 9,
  oct: 10,
  october: 10,
  '10': 10,
  nov: 11,
  november: 11,
  '11': 11,
  dec: 12,
  december: 12,
  '12': 12
};

const CONFIGS = [
  {
    level: 'O-Level',
    report: path.join(__dirname, 'build-olevel-json-report.json'),
    folders: {
      'Accounting-0452': 'Accounting',
      'Biology-0610': 'Biology',
      'BusinessStudies-0450': 'Business',
      'Chemistry-0620': 'Chemistry',
      'ComputerScience-0478': 'Computer Science',
      'Economics-0455': 'Economics',
      'EnglishFirstLanguage-0500': 'English First Language',
      'EnglishSecondLanguage-0510': 'English Second Language',
      'Mathematics-0580': 'Mathematics',
      'Physics-0625': 'Physics',
      'TravelTourism-0471': 'Travel & Tourism'
    }
  },
  {
    level: 'A-Level',
    report: path.join(__dirname, 'build-alevel-json-report.json'),
    folders: {
      'Accounting-WAC11': 'Accounting',
      'Biology-WBI11': 'Biology',
      'Business-WBS11': 'Business',
      'Chemistry-WCH11': 'Chemistry',
      'ComputerScience-9618': 'Computer Science',
      'Economics-WEC11': 'Economics',
      'Mathematics-WMA11': 'Mathematics',
      'Physics-WPH11': 'Physics',
      'TravelTourism-9395': 'Travel & Tourism'
    }
  }
];

function monthFromFile(file) {
  const m = file.match(/-(\d{4})-(\d{2})(?:-[^.]+)?-qp\.pdf$/i);
  if (m) return { key: m[2], label: MONTH_LABEL[m[2]] || m[2] };
  return { key: '??', label: 'Unknown' };
}

function monthFromPaperId(paperId) {
  if (!paperId) return { key: '??', label: 'Unknown' };
  const sessions = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
    'jan',
    'feb',
    'mar',
    'apr',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec'
  ];
  const lower = paperId.toLowerCase();
  for (const s of sessions.sort((a, b) => b.length - a.length)) {
    if (lower.includes(`-${s}-`)) {
      return { key: s, label: MONTH_LABEL[s] || s };
    }
  }
  return { key: '??', label: 'Unknown' };
}

function yearFromResult(r) {
  const fromId = r.paperId?.match(/-(\d{4})-unit/);
  if (fromId) return fromId[1];
  const fromFile = r.file?.match(/-(\d{4})-unit/);
  return fromFile ? fromFile[1] : '????';
}

function statusLabel(json, qp) {
  if (qp === 0) return '<span class="tag tag-na">N/A</span>';
  if (json === 0) return '<span class="tag tag-none">NONE</span>';
  if (json === qp) return '<span class="tag tag-all">ALL</span>';
  return `<span class="tag tag-partial">PARTIAL (${json}/${qp})</span>`;
}

function yearSummaryLabel(json, qp) {
  if (qp === 0) return 'N/A';
  if (json === 0) return 'NONE';
  if (json === qp) return 'ALL';
  return `PARTIAL ${json}/${qp}`;
}

function buildRows(cfg) {
  if (!fs.existsSync(cfg.report)) {
    console.warn('Missing report:', cfg.report);
    return [];
  }
  const report = JSON.parse(fs.readFileSync(cfg.report, 'utf8'));
  const buckets = new Map();

  for (const r of report.results) {
    const subject = cfg.folders[r.folder] || r.folder;
    const year = yearFromResult(r);
    const month = r.file ? monthFromFile(r.file) : monthFromPaperId(r.paperId);
    const k = `${cfg.level}|${subject}|${year}|${month.key}`;
    if (!buckets.has(k)) {
      buckets.set(k, {
        level: cfg.level,
        subject,
        year,
        monthKey: month.key,
        monthLabel: month.label,
        qp: 0,
        json: 0,
        low: 0,
        empty: 0,
        missing_ms: 0,
        error: 0,
        skip: 0
      });
    }
    const b = buckets.get(k);
    b.qp++;
    if (r.status === 'ok') b.json++;
    else if (r.status === 'low_answer_match') {
      b.json++;
      b.low++;
    } else if (r.status === 'structured_parse_empty') b.empty++;
    else if (r.status === 'missing_ms') b.missing_ms++;
    else if (r.status === 'error') b.error++;
    else b.skip++;
  }

  return [...buckets.values()].sort((a, b) => {
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
    if (a.year !== b.year) return a.year.localeCompare(b.year);
    return (MONTH_SORT[a.monthKey] || 99) - (MONTH_SORT[b.monthKey] || 99);
  });
}

/** Every QP PDF where paired *-ms.pdf was not found in the folder. */
function buildMissingMsList(cfg) {
  if (!fs.existsSync(cfg.report)) return [];
  const report = JSON.parse(fs.readFileSync(cfg.report, 'utf8'));
  const list = [];

  for (const r of report.results) {
    if (r.status !== 'missing_ms') continue;
    const subject = cfg.folders[r.folder] || r.folder;
    const year = yearFromResult(r);
    const month = r.file ? monthFromFile(r.file) : monthFromPaperId(r.paperId);
    const qpFile = r.file || '';
    const msFile = qpFile.replace(/-qp\.pdf$/i, '-ms.pdf');

    list.push({
      level: cfg.level,
      subject,
      year,
      monthKey: month.key,
      monthLabel: month.label,
      qpFile,
      msFile,
      paperId: r.paperId || '',
      folder: r.folder || ''
    });
  }

  return list.sort((a, b) => {
    if (a.level !== b.level) return a.level.localeCompare(b.level);
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
    if (a.year !== b.year) return a.year.localeCompare(b.year);
    return (MONTH_SORT[a.monthKey] || 99) - (MONTH_SORT[b.monthKey] || 99);
  });
}

function renderMissingMsHtml(missingList) {
  if (!missingList.length) {
    return `<section class="level-block" id="missing-ms">
      <h2>Missing mark schemes (all levels)</h2>
      <p class="meta">No missing MS PDFs recorded in the latest build reports.</p>
    </section>`;
  }

  const levels = [...new Set(missingList.map((r) => r.level))];
  let html = `<section class="missing-ms-block" id="missing-ms">
    <h2>Missing mark scheme PDFs</h2>
    <p class="meta">${missingList.length} question papers have no paired <code>*-ms.pdf</code> in the same folder. Add the MS file with the expected name below, then re-run <code>npm run build:olevel-json</code> or <code>build:alevel-json</code>.</p>`;

  for (const level of levels) {
    const levelItems = missingList.filter((r) => r.level === level);
    html += `<h3 id="missing-ms-${level.replace(/\s/g, '-')}">${esc(level)} (${levelItems.length})</h3>`;

    const subjects = [...new Set(levelItems.map((r) => r.subject))].sort();
    for (const subject of subjects) {
      const rows = levelItems.filter((r) => r.subject === subject);
      html += `<h4>${esc(subject)}</h4>
      <div class="table-wrap">
      <table class="missing-ms-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Session month</th>
            <th>QP PDF (have)</th>
            <th>MS PDF (missing)</th>
            <th>Paper ID</th>
          </tr>
        </thead>
        <tbody>`;

      for (const row of rows) {
        html += `<tr>
          <td>${esc(row.year)}</td>
          <td>${esc(row.monthLabel)}</td>
          <td class="file">${esc(row.qpFile)}</td>
          <td class="file missing">${esc(row.msFile)}</td>
          <td class="mono">${esc(row.paperId)}</td>
        </tr>`;
      }

      html += `</tbody></table></div>`;
    }
  }

  html += `</section>`;
  return html;

function failReasons(b) {
  const parts = [];
  if (b.empty) parts.push(`parse fail: ${b.empty}`);
  if (b.missing_ms) parts.push(`no MS: ${b.missing_ms}`);
  if (b.error) parts.push(`error: ${b.error}`);
  if (b.low) parts.push(`low match: ${b.low}`);
  if (b.skip) parts.push(`other: ${b.skip}`);
  return parts.length ? parts.join('; ') : '-';
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rowClass(b) {
  if (b.json === 0) return 'row-none';
  if (b.json < b.qp) return 'row-partial';
  return 'row-all';
}

function renderHtml(allRows, missingMsList) {
  const levels = [...new Set(allRows.map((r) => r.level))];
  let body = renderMissingMsHtml(missingMsList);

  for (const level of levels) {
    const levelRows = allRows.filter((r) => r.level === level);
    const subjects = [...new Set(levelRows.map((r) => r.subject))].sort();
    const summary = levelRows.reduce(
      (a, b) => {
        a.qp += b.qp;
        a.json += b.json;
        return a;
      },
      { qp: 0, json: 0 }
    );

    body += `<section class="level-block">
      <h2>${esc(level)}</h2>
      <p class="meta">${summary.json} / ${summary.qp} QP PDFs converted to JSON (${Math.round((100 * summary.json) / summary.qp || 0)}%)</p>
      <div class="legend">
        <span class="badge all">ALL</span> every QP has JSON &nbsp;
        <span class="badge partial">PARTIAL</span> some QPs missing JSON &nbsp;
        <span class="badge none">NONE</span> zero JSON for that row
      </div>`;

    for (const subject of subjects) {
      const rows = levelRows.filter((r) => r.subject === subject);
      const years = [...new Set(rows.map((r) => r.year))].sort();
      body += `<h3>${esc(subject)}</h3>
      <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Session month</th>
            <th>QP PDFs</th>
            <th>JSON created</th>
            <th>Not created</th>
            <th>Status</th>
            <th>Why failed</th>
          </tr>
        </thead>
        <tbody>`;

      for (const year of years) {
        const yearRows = rows.filter((r) => r.year === year);
        const yearJson = yearRows.reduce((s, r) => s + r.json, 0);
        const yearQp = yearRows.reduce((s, r) => s + r.qp, 0);
        yearRows.forEach((b, idx) => {
          body += `<tr class="${rowClass(b)}">
            ${idx === 0 ? `<td rowspan="${yearRows.length}" class="year-cell">${year}<br><small class="year-sum">${esc(yearSummaryLabel(yearJson, yearQp))}</small></td>` : ''}
            <td>${esc(b.monthLabel)}</td>
            <td class="num">${b.qp}</td>
            <td class="num">${b.json}</td>
            <td class="num">${b.qp - b.json}</td>
            <td>${statusLabel(b.json, b.qp)}</td>
            <td class="reason">${esc(failReasons(b))}</td>
          </tr>`;
        });
      }

      body += `</tbody></table></div>`;
    }
    body += `</section>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Exam Lab - JSON coverage by subject, year and month</title>
  <style>
    :root {
      --bg: #0f1419;
      --card: #1a2332;
      --border: #2d3a4f;
      --text: #e7ecf3;
      --muted: #8b9cb3;
      --all: #22c55e;
      --partial: #f59e0b;
      --none: #ef4444;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 1.5rem 2rem 3rem;
      line-height: 1.45;
    }
    h1 { font-size: 1.5rem; margin: 0 0 0.25rem; }
    .subtitle { color: var(--muted); margin-bottom: 1.5rem; font-size: 0.9rem; }
    h2 {
      font-size: 1.25rem;
      margin: 2rem 0 0.5rem;
      padding-bottom: 0.35rem;
      border-bottom: 2px solid var(--border);
    }
    h3 {
      font-size: 1rem;
      margin: 1.25rem 0 0.5rem;
      color: #a5b4fc;
    }
    h4 {
      font-size: 0.9rem;
      margin: 1rem 0 0.35rem;
      color: #c4b5fd;
      font-weight: 600;
    }
    .missing-ms-block {
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid var(--border);
    }
    .missing-ms-block h2 { color: #fca5a5; }
    td.file { font-size: 0.75rem; word-break: break-all; max-width: 280px; }
    td.file.missing { color: #fca5a5; font-weight: 600; }
    td.mono { font-size: 0.72rem; color: var(--muted); word-break: break-all; }
    .meta { color: var(--muted); font-size: 0.85rem; margin: 0 0 0.75rem; }
    .legend { font-size: 0.8rem; color: var(--muted); margin-bottom: 1rem; }
    .badge {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge.all { background: rgba(34,197,94,0.2); color: var(--all); }
    .badge.partial { background: rgba(245,158,11,0.2); color: var(--partial); }
    .badge.none { background: rgba(239,68,68,0.2); color: var(--none); }
    .tag {
      display: inline-block;
      padding: 0.12rem 0.4rem;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .tag-all { background: rgba(34,197,94,0.25); color: #86efac; }
    .tag-partial { background: rgba(245,158,11,0.25); color: #fcd34d; }
    .tag-none { background: rgba(239,68,68,0.25); color: #fca5a5; }
    .tag-na { background: rgba(148,163,184,0.2); color: #cbd5e1; }
    .year-sum { display: block; margin-top: 0.25rem; font-size: 0.72rem; }
    .table-wrap {
      overflow-x: auto;
      margin-bottom: 1rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--card);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }
    th, td {
      padding: 0.45rem 0.65rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      background: #243044;
      font-weight: 600;
      white-space: nowrap;
      position: sticky;
      top: 0;
    }
    td.num { text-align: center; font-variant-numeric: tabular-nums; }
    .year-cell {
      font-weight: 700;
      vertical-align: top;
      background: rgba(99,102,241,0.08);
      border-right: 1px solid var(--border);
    }
    .year-cell small { font-weight: 400; color: var(--muted); }
    tr.row-all { background: rgba(34,197,94,0.06); }
    tr.row-partial { background: rgba(245,158,11,0.05); }
    tr.row-none { background: rgba(239,68,68,0.06); }
    td.reason { color: var(--muted); font-size: 0.78rem; max-width: 220px; }
    tr:hover td { background: rgba(255,255,255,0.03); }
    .toc {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
    }
    .toc a { color: #93c5fd; text-decoration: none; }
    .toc a:hover { text-decoration: underline; }
    .toc ul { margin: 0.25rem 0; padding-left: 1.25rem; }
  </style>
</head>
<body>
  <h1>JSON coverage report</h1>
  <p class="subtitle">Generated ${new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC. O-Level and A-Level QP to JSON build status by exam session month. All labels are in English (ASCII).</p>
  <nav class="toc">
    <strong>Jump to</strong>
    <ul>
      <li><a href="#missing-ms">Missing mark schemes (${missingMsList.length})</a></li>
      ${levels.map((l) => `<li><a href="#${l.replace(/\s/g, '-')}">${l} coverage</a></li>`).join('')}
    </ul>
    <p style="margin:0.5rem 0 0;font-size:0.8rem;color:var(--muted)">CSV: <code>coverage-report.csv</code> (summary), <code>coverage-missing-ms.csv</code> (full missing MS list)</p>
  </nav>
  ${body}
</body>
</html>`;
}

function renderHtmlFixed(allRows, missingMsList) {
  let html = renderHtml(allRows, missingMsList);
  html = html.replace(/<\/?motion>/g, '');
  for (const level of [...new Set(allRows.map((r) => r.level))]) {
    html = html.replace(
      `<section class="level-block">`,
      `<section class="level-block" id="${level.replace(/\s/g, '-')}">`
    );
  }
  return html;
}

function writeCsv(allRows) {
  const header = [
    'Level',
    'Subject',
    'Year',
    'Session month',
    'Month code',
    'QP PDFs',
    'JSON created',
    'Not created',
    'Status',
    'Parse failed',
    'Missing MS',
    'Errors',
    'Low answer match'
  ];
  const lines = [header.join(',')];
  for (const b of allRows) {
    const status =
      b.json === 0 ? 'None' : b.json === b.qp ? 'All' : 'Partial';
    lines.push(
      [
        b.level,
        `"${b.subject}"`,
        b.year,
        `"${b.monthLabel}"`,
        b.monthKey,
        b.qp,
        b.json,
        b.qp - b.json,
        status,
        b.empty,
        b.missing_ms,
        b.error,
        b.low
      ].join(',')
    );
  }
  // UTF-8 BOM helps Excel on Windows show English text correctly
  fs.writeFileSync(OUT_CSV, '\uFEFF' + lines.join('\r\n'), 'utf8');
}

function writeMissingMsCsv(missingList) {
  const header = [
    'Level',
    'Subject',
    'Year',
    'Session month',
    'Month code',
    'Folder',
    'QP PDF filename',
    'Expected MS PDF filename',
    'Paper ID'
  ];
  const lines = [header.join(',')];
  for (const r of missingList) {
    lines.push(
      [
        r.level,
        `"${r.subject}"`,
        r.year,
        `"${r.monthLabel}"`,
        r.monthKey,
        `"${r.folder}"`,
        `"${r.qpFile}"`,
        `"${r.msFile}"`,
        `"${r.paperId}"`
      ].join(',')
    );
  }
  fs.writeFileSync(OUT_MISSING_MS_CSV, '\uFEFF' + lines.join('\r\n'), 'utf8');
}

function main() {
  const allRows = [];
  const missingMsList = [];
  for (const cfg of CONFIGS) {
    allRows.push(...buildRows(cfg));
    missingMsList.push(...buildMissingMsList(cfg));
  }
  const html = renderHtmlFixed(allRows, missingMsList);
  fs.writeFileSync(OUT_HTML, html, 'utf8');
  writeCsv(allRows);
  writeMissingMsCsv(missingMsList);
  console.log('Wrote:', OUT_HTML);
  console.log('Wrote:', OUT_CSV);
  console.log('Wrote:', OUT_MISSING_MS_CSV);
  console.log('Summary rows:', allRows.length);
  console.log('Missing MS:', missingMsList.length);
}

main();
