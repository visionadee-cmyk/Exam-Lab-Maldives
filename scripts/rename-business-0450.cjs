const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/public/pdf-pastpaer-q&a/O-Level/BusinessStudies-0450';
const subjectName = 'BusinessStudies-0450';

const sessionMap = {
  m10: { y: 2010, m: '03' }, m11: { y: 2011, m: '03' }, m12: { y: 2012, m: '03' }, m13: { y: 2013, m: '03' }, m14: { y: 2014, m: '03' },
  m15: { y: 2015, m: '03' }, m16: { y: 2016, m: '03' }, m17: { y: 2017, m: '03' }, m18: { y: 2018, m: '03' }, m19: { y: 2019, m: '03' },
  m20: { y: 2020, m: '03' }, m21: { y: 2021, m: '03' }, m22: { y: 2022, m: '03' }, m23: { y: 2023, m: '03' }, m24: { y: 2024, m: '03' },
  m25: { y: 2025, m: '03' },
  s10: { y: 2010, m: '06' }, s11: { y: 2011, m: '06' }, s12: { y: 2012, m: '06' }, s13: { y: 2013, m: '06' }, s14: { y: 2014, m: '06' },
  s15: { y: 2015, m: '06' }, s16: { y: 2016, m: '06' }, s17: { y: 2017, m: '06' }, s18: { y: 2018, m: '06' }, s19: { y: 2019, m: '06' },
  s20: { y: 2020, m: '06' }, s21: { y: 2021, m: '06' }, s22: { y: 2022, m: '06' }, s23: { y: 2023, m: '06' }, s24: { y: 2024, m: '06' },
  s25: { y: 2025, m: '06' },
  w10: { y: 2010, m: '11' }, w11: { y: 2011, m: '11' }, w12: { y: 2012, m: '11' }, w13: { y: 2013, m: '11' }, w14: { y: 2014, m: '11' },
  w15: { y: 2015, m: '11' }, w16: { y: 2016, m: '11' }, w17: { y: 2017, m: '11' }, w18: { y: 2018, m: '11' }, w19: { y: 2019, m: '11' },
  w20: { y: 2020, m: '11' }, w21: { y: 2021, m: '11' }, w22: { y: 2022, m: '11' }, w23: { y: 2023, m: '11' }, w24: { y: 2024, m: '11' },
  w25: { y: 2025, m: '11' }
};

let renamed = 0;
const files = fs.readdirSync(dir);

for (const file of files) {
  const oldPath = path.join(dir, file);
  if (fs.statSync(oldPath).isDirectory()) continue;
  if (!file.toLowerCase().endsWith('.pdf')) continue;
  if (file.startsWith(subjectName + '-')) continue;

  const m = file.match(/^(\d+)_([msw]\d{2})_(qp|ms|er|gt|ir|in|ci|pm)(?:_(\d+))?\.pdf$/i);
  if (!m) continue;

  const session = m[2].toLowerCase();
  const type = m[3].toLowerCase();
  const variant = m[4] || null;

  const sm = sessionMap[session];
  if (!sm) continue;

  const unit = variant ? String(variant)[0] : '1';
  const year = String(sm.y);
  const month = sm.m;

  const newName = `${subjectName}-${year}-unit${unit}-${year}-${month}-${type}.pdf`;
  const newPath = path.join(dir, newName);

  if (fs.existsSync(newPath)) continue;

  fs.renameSync(oldPath, newPath);
  renamed++;
}

console.log('Renamed:', renamed);
