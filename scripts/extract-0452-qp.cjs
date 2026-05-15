const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const pdfDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a/O-Level/Accounting-0452';
const outputDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/scripts';

const qpFiles = [
  'Accounting-0452-2020-unit1-2020-06-qp.pdf',
  'Accounting-0452-2020-unit1-2020-11-qp.pdf',
  'Accounting-0452-2020-unit2-2020-06-qp.pdf',
  'Accounting-0452-2020-unit2-2020-11-qp.pdf',
  'Accounting-0452-2021-unit1-2021-06-qp.pdf',
  'Accounting-0452-2021-unit1-2021-11-qp.pdf',
  'Accounting-0452-2021-unit2-2021-06-qp.pdf',
  'Accounting-0452-2021-unit2-2021-11-qp.pdf',
  'Accounting-0452-2022-unit1-2022-06-qp.pdf',
  'Accounting-0452-2022-unit1-2022-11-qp.pdf',
  'Accounting-0452-2022-unit2-2022-06-qp.pdf',
  'Accounting-0452-2022-unit2-2022-11-qp.pdf',
  'Accounting-0452-2023-unit1-2023-06-qp.pdf',
  'Accounting-0452-2023-unit1-2023-11-qp.pdf',
  'Accounting-0452-2023-unit2-2023-06-qp.pdf',
  'Accounting-0452-2023-unit2-2023-11-qp.pdf',
  'Accounting-0452-2024-unit1-2024-06-qp.pdf',
  'Accounting-0452-2024-unit1-2024-11-qp.pdf',
  'Accounting-0452-2024-unit2-2024-06-qp.pdf',
  'Accounting-0452-2024-unit2-2024-11-qp.pdf',
  'Accounting-0452-2025-unit1-2025-06-qp.pdf',
  'Accounting-0452-2025-unit2-2025-06-qp.pdf'
];

async function extractPDF(pdfFile) {
  const pdfPath = path.join(pdfDir, pdfFile);
  const match = pdfFile.match(/Accounting-0452-(\d+)-unit(\d+)-(\d+)-(\d+)-qp\.pdf/);
  if (!match) return;
  
  const [, year, unit, year2, month] = match;
  let monthName;
  if (month === '06') {
    monthName = 'june';
  } else if (month === '11') {
    monthName = 'nov';
  } else {
    monthName = month;
  }
  const outputPath = path.join(outputDir, `qp-0452-${year}-u${unit}-${monthName}.txt`).replace(/\\/g, '/');
  
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    fs.writeFileSync(outputPath, data.text);
    console.log(`Extracted: ${pdfFile} -> qp-0452-${year}-u${unit}-${monthName}.txt (${data.numpages} pages)`);
  } catch (err) {
    console.error(`Error extracting ${pdfFile}:`, err.message);
  }
}

async function extractAll() {
  console.log(`Extracting ${qpFiles.length} QP PDFs...`);
  for (const file of qpFiles) {
    await extractPDF(file);
  }
  console.log('Done!');
}

extractAll();
