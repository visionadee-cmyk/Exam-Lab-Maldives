const pdf = require('pdf-parse');
const fs = require('fs');

const pdfPath = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a/O-Level/Accounting-0452/Accounting-0452-2020-unit1-2020-11-ms.pdf';
const outputPath = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/scripts/ms-0452-2020-u1-nov.txt'.replace(/\\/g, '/');

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
  fs.writeFileSync(outputPath, data.text);
  console.log('Saved to', outputPath);
  console.log('Total pages:', data.numpages);
}).catch(err => console.error('Error:', err));
