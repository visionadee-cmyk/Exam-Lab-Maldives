const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const pdfDir = path.join(__dirname, '../public/pdf-pastpaer-q&a/O-Level/Accounting-0452');
const outputDir = path.join(__dirname, '../scripts');

// Find all MS PDFs
const pdfFiles = fs.readdirSync(pdfDir).filter(file => file.includes('-ms.pdf'));

console.log(`Found ${pdfFiles.length} MS PDFs`);

pdfFiles.forEach(async (pdfFile) => {
  const pdfPath = path.join(pdfDir, pdfFile);
  const dataBuffer = fs.readFileSync(pdfPath);
  
  try {
    const data = await pdfParse(dataBuffer);
    const text = data.text;
    
    // Parse filename to extract year, unit, session
    // Format: Accounting-0452-2021-unit1-2021-06-ms.pdf
    const match = pdfFile.match(/Accounting-0452-(\d{4})-unit(\d)-(\d{4})-(\d{2})-ms\.pdf/);
    
    if (match) {
      const year = match[1];
      const unit = match[2];
      const monthNum = match[4];
      
      let month;
      if (monthNum === '06') {
        month = 'june';
      } else if (monthNum === '11') {
        month = 'nov';
      } else {
        month = monthNum;
      }
      
      const outputFile = `ms-0452-${year}-u${unit}-${month}.txt`;
      const outputPath = path.join(outputDir, outputFile);
      
      fs.writeFileSync(outputPath, text);
      console.log(`Extracted: ${pdfFile} -> ${outputFile}`);
    } else {
      console.log(`Could not parse filename: ${pdfFile}`);
    }
  } catch (error) {
    console.error(`Error processing ${pdfFile}:`, error.message);
  }
});
