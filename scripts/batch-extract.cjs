const pdf = require('pdf-parse');
const fs = require('fs');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a/O-Level/Accounting-0452';
const outputDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/scripts';

// List of MS files to extract
const msFiles = [
  { name: 'ms-0452-2020-u1-june.txt', file: 'Accounting-0452-2020-unit1-2020-06-ms.pdf' },
  { name: 'ms-0452-2020-u1-nov.txt', file: 'Accounting-0452-2020-unit1-2020-11-ms.pdf' },
  { name: 'ms-0452-2020-u2-june.txt', file: 'Accounting-0452-2020-unit2-2020-06-ms.pdf' },
  { name: 'ms-0452-2020-u2-nov.txt', file: 'Accounting-0452-2020-unit2-2020-11-ms.pdf' },
  { name: 'ms-0452-2021-u1-june.txt', file: 'Accounting-0452-2021-unit1-2021-06-ms.pdf' },
  { name: 'ms-0452-2021-u1-nov.txt', file: 'Accounting-0452-2021-unit1-2021-11-ms.pdf' },
  { name: 'ms-0452-2021-u2-june.txt', file: 'Accounting-0452-2021-unit2-2021-06-ms.pdf' },
  { name: 'ms-0452-2021-u2-nov.txt', file: 'Accounting-0452-2021-unit2-2021-11-ms.pdf' },
  { name: 'ms-0452-2022-u1-june.txt', file: 'Accounting-0452-2022-unit1-2022-06-ms.pdf' },
  { name: 'ms-0452-2022-u1-nov.txt', file: 'Accounting-0452-2022-unit1-2022-11-ms.pdf' },
  { name: 'ms-0452-2022-u2-june.txt', file: 'Accounting-0452-2022-unit2-2022-06-ms.pdf' },
  { name: 'ms-0452-2022-u2-nov.txt', file: 'Accounting-0452-2022-unit2-2022-11-ms.pdf' },
  { name: 'ms-0452-2023-u1-june.txt', file: 'Accounting-0452-2023-unit1-2023-06-ms.pdf' },
  { name: 'ms-0452-2023-u1-nov.txt', file: 'Accounting-0452-2023-unit1-2023-11-ms.pdf' },
  { name: 'ms-0452-2023-u2-june.txt', file: 'Accounting-0452-2023-unit2-2023-06-ms.pdf' },
  { name: 'ms-0452-2023-u2-nov.txt', file: 'Accounting-0452-2023-unit2-2023-11-ms.pdf' },
  { name: 'ms-0452-2024-u1-june.txt', file: 'Accounting-0452-2024-unit1-2024-06-ms.pdf' },
  { name: 'ms-0452-2024-u1-nov.txt', file: 'Accounting-0452-2024-unit1-2024-11-ms.pdf' },
  { name: 'ms-0452-2024-u2-june.txt', file: 'Accounting-0452-2024-unit2-2024-06-ms.pdf' },
  { name: 'ms-0452-2024-u2-nov.txt', file: 'Accounting-0452-2024-unit2-2024-11-ms.pdf' },
  { name: 'ms-0452-2025-u1-june.txt', file: 'Accounting-0452-2025-unit1-2025-06-ms.pdf' },
  { name: 'ms-0452-2025-u2-june.txt', file: 'Accounting-0452-2025-unit2-2025-06-ms.pdf' },
];

async function extractAll() {
  for (const ms of msFiles) {
    const pdfPath = `${baseDir}/${ms.file}`;
    const outPath = `${outputDir}/${ms.name}`.replace(/\\/g, '/');
    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      fs.writeFileSync(outPath, data.text);
      console.log(`Extracted: ${ms.name} (${data.numpages} pages)`);
    } catch (err) {
      console.error(`Error extracting ${ms.name}: ${err.message}`);
    }
  }
  console.log('Done extracting all MS files!');
}

extractAll();
