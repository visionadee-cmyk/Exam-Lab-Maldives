const fs = require('fs');

const papers = [
  { year: 2020, unit: 2, session: 'June 2020', code: '7707/21', msFile: 'ms-0452-2020-u2-june.txt' },
  { year: 2020, unit: 2, session: 'November 2020', code: '7707/23', msFile: 'ms-0452-2020-u2-nov.txt' },
  { year: 2021, unit: 2, session: 'June 2021', code: '7707/21', msFile: 'ms-0452-2021-u2-june.txt' },
  { year: 2021, unit: 2, session: 'November 2021', code: '7707/23', msFile: 'ms-0452-2021-u2-nov.txt' },
  { year: 2022, unit: 2, session: 'June 2022', code: '7707/21', msFile: 'ms-0452-2022-u2-june.txt' },
  { year: 2022, unit: 2, session: 'November 2022', code: '7707/23', msFile: 'ms-0452-2022-u2-nov.txt' },
  { year: 2023, unit: 2, session: 'June 2023', code: '7707/21', msFile: 'ms-0452-2023-u2-june.txt' },
  { year: 2023, unit: 2, session: 'November 2023', code: '7707/23', msFile: 'ms-0452-2023-u2-nov.txt' },
  { year: 2024, unit: 2, session: 'June 2024', code: '7707/21', msFile: 'ms-0452-2024-u2-june.txt' },
  { year: 2024, unit: 2, session: 'November 2024', code: '7707/23', msFile: 'ms-0452-2024-u2-nov.txt' },
  { year: 2025, unit: 2, session: 'June 2025', code: '7707/21', msFile: 'ms-0452-2025-u2-june.txt' },
];

const scriptsDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/scripts';
const outputDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/src/data/papers';

for (const paper of papers) {
  const msPath = `${scriptsDir}/${paper.msFile}`.replace(/\\/g, '/');
  
  if (!fs.existsSync(msPath)) {
    console.log(`Skipping ${paper.year} Unit ${paper.unit} ${paper.session} - MS file not found`);
    continue;
  }
  
  const text = fs.readFileSync(msPath, 'utf8');
  
  // Extract questions from MS text
  const questions = [];
  const lines = text.split('\n');
  
  let currentQ = null;
  let currentPart = null;
  let inQuestion = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Match question patterns like "1(a)", "2(a)", etc.
    const qMatch = line.match(/^(\d)\((\w)\)\s*$/);
    if (qMatch) {
      if (currentQ) {
        questions.push(currentQ);
      }
      currentQ = {
        id: `q${qMatch[1]}`,
        number: parseInt(qMatch[1]),
        type: 'structured',
        totalMarks: 0,
        question: `Question ${qMatch[1]}`,
        parts: []
      };
      inQuestion = true;
      continue;
    }
    
    // Match marks at end of answer like "(1)" or "(2)OF"
    const marksMatch = line.match(/\((\d+)\)(?:OF)?$/);
    if (marksMatch && inQuestion && currentQ) {
      const marks = parseInt(marksMatch[1]);
      currentQ.totalMarks += marks;
      
      // Get the answer text (previous non-empty lines)
      let answerText = '';
      for (let j = i - 1; j >= 0; j--) {
        const prevLine = lines[j].trim();
        if (prevLine && !prevLine.match(/^\d+\(\w\)\s*$/) && !prevLine.match(/^Question\s+Answer\s+Marks/)) {
          answerText = prevLine + ' ' + answerText;
        } else if (prevLine.match(/^Question\s+Answer\s+Marks/)) {
          break;
        }
      }
      
      const partId = qMatch ? qMatch[2] : 'a';
      currentQ.parts.push({
        id: `${currentQ.id}_${partId}`,
        text: `Part ${partId}`,
        marks: marks,
        type: 'short_answer',
        answer: answerText.trim().substring(0, 500),
        keywords: []
      });
    }
  }
  
  if (currentQ) {
    questions.push(currentQ);
  }
  
  const json = {
    paperId: `accounting-7707-${paper.year}-unit${paper.unit}-${paper.session.toLowerCase().replace(' ', '-')}-ms`,
    subjectId: 'accounting_cambridge_olevel',
    code: paper.code,
    session: paper.session,
    title: `Accounting Unit ${paper.unit} - Mark Scheme`,
    totalMarks: questions.reduce((sum, q) => sum + q.totalMarks, 0),
    timeMinutes: 120,
    questions: questions
  };
  
  const outPath = `${outputDir}/accounting-7707-${paper.year}-unit${paper.unit}-${paper.session.toLowerCase().replace(' ', '-')}-ms.json`.replace(/\\/g, '/');
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
  console.log(`Created: ${outPath} (${questions.length} questions, ${json.totalMarks} marks)`);
}

console.log('Done creating all JSON files!');
