const fs = require('fs');
const pdfparse = require('pdf-parse');

const pdfDir = 'C:\\Users\\maushaz.MADIHAA\\Desktop\\Rettey\\exam-lab-maldives\\exam-lab-mv\\public\\pdf-pastpaer-q&a\\O-Level\\Biology-0610';
const outputDir = 'C:\\Users\\maushaz.MADIHAA\\Desktop\\Rettey\\exam-lab-maldives\\exam-lab-mv\\scripts';

fs.readdirSync(pdfDir).forEach(file => {
  if (file.includes('0610') && file.includes('-ms.pdf') && !file.includes('5090')) {
    const pdfPath = `${pdfDir}\\${file}`;
    const dataBuffer = fs.readFileSync(pdfPath);
    
    pdfparse(dataBuffer).then(data => {
      const text = data.text;
      const outputFile = file.replace('.pdf', '.txt').replace('Biology-0610-', 'ms-0610-');
      fs.writeFileSync(`${outputDir}\\${outputFile}`, text);
      console.log(`Extracted: ${outputFile}`);
    }).catch(err => {
      console.error(`Error processing ${file}:`, err);
    });
  }
});

console.log('Extraction complete');
