const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a';

const sessionMap = {
  's10': { year: '2010', month: '06' }, 's11': { year: '2011', month: '06' }, 's12': { year: '2012', month: '06' },
  's13': { year: '2013', month: '06' }, 's14': { year: '2014', month: '06' }, 's15': { year: '2015', month: '06' },
  's16': { year: '2016', month: '06' }, 's17': { year: '2017', month: '06' }, 's18': { year: '2018', month: '06' },
  's19': { year: '2019', month: '06' }, 's20': { year: '2020', month: '06' }, 's21': { year: '2021', month: '06' },
  's22': { year: '2022', month: '06' }, 's23': { year: '2023', month: '06' }, 's24': { year: '2024', month: '06' },
  's25': { year: '2025', month: '06' },
  'w10': { year: '2010', month: '11' }, 'w11': { year: '2011', month: '11' }, 'w12': { year: '2012', month: '11' },
  'w13': { year: '2013', month: '11' }, 'w14': { year: '2014', month: '11' }, 'w15': { year: '2015', month: '11' },
  'w16': { year: '2016', month: '11' }, 'w17': { year: '2017', month: '11' }, 'w18': { year: '2018', month: '11' },
  'w19': { year: '2019', month: '11' }, 'w20': { year: '2020', month: '11' }, 'w21': { year: '2021', month: '11' },
  'w22': { year: '2022', month: '11' }, 'w23': { year: '2023', month: '11' }, 'w24': { year: '2024', month: '11' },
  'm15': { year: '2015', month: '03' }, 'm16': { year: '2016', month: '03' }, 'm17': { year: '2017', month: '03' },
  'm18': { year: '2018', month: '03' }, 'm19': { year: '2019', month: '03' }, 'm20': { year: '2020', month: '03' },
  'm21': { year: '2021', month: '03' }, 'm22': { year: '2022', month: '03' }, 'm23': { year: '2023', month: '03' },
  'm24': { year: '2024', month: '03' }, 'm25': { year: '2025', month: '03' }
};

function renameFiles(dir) {
  const items = fs.readdirSync(dir);
  let renamed = 0;
  
  items.forEach(item => {
    const oldPath = path.join(dir, item);
    if (!fs.statSync(oldPath).isDirectory() && item.endsWith('.pdf')) {
      // Match pattern like 7707_s20_ms_11.pdf
      const match = item.match(/^(\d+)_([msw]\d{2})_(ms|qp|er|gt|ir|ci|pm)_?(\d+)?\.pdf$/i);
      
      if (match) {
        const [, code, session, type, variant] = match;
        const sessionInfo = sessionMap[session.toLowerCase()];
        
        if (sessionInfo) {
          const paperNum = variant ? variant.slice(0, 1) : '01';
          const newType = type === 'qp' ? 'qp' : type === 'ms' ? 'ms' : type;
          const newName = sessionInfo.year + '-unit' + paperNum + '-' + sessionInfo.year + '-' + sessionInfo.month + '-' + code + '-' + (variant || '01') + '-' + newType + '.pdf';
          
          const newPath = path.join(dir, newName);
          fs.renameSync(oldPath, newPath);
          console.log('Renamed: ' + item + ' -> ' + newName);
          renamed++;
        }
      }
    }
  });
  
  return renamed;
}

let totalRenamed = 0;
['O-Level', 'A-Level'].forEach(level => {
  const levelPath = path.join(baseDir, level);
  if (fs.existsSync(levelPath)) {
    fs.readdirSync(levelPath).forEach(subject => {
      const subjectPath = path.join(levelPath, subject);
      if (fs.statSync(subjectPath).isDirectory()) {
        totalRenamed += renameFiles(subjectPath);
      }
    });
  }
});

console.log('Total files renamed: ' + totalRenamed);
