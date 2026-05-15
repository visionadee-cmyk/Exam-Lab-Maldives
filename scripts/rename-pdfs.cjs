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

function getSubjectFromFolder(folderName) {
  const parts = folderName.split('-');
  if (parts.length >= 2) {
    return parts[0];
  }
  return folderName;
}

function getCodeFromFolder(folderName) {
  const match = folderName.match(/([A-Z]+\d+)/i);
  return match ? match[1] : 'UNKNOWN';
}

function renameFiles(dir) {
  const items = fs.readdirSync(dir);
  let renamed = 0;
  const folderName = path.basename(dir);
  
  items.forEach(item => {
    const oldPath = path.join(dir, item);
    if (!fs.statSync(oldPath).isDirectory() && item.endsWith('.pdf')) {
      let newName = item;
      let shouldRename = false;
      
      // Pattern 1: 7707_s20_ms_11.pdf
      const match1 = item.match(/^(\d+)_([msw]\d{2})_(ms|qp|er|gt|ir|ci|pm)_?(\d+)?\.pdf$/i);
      if (match1) {
        const [, code, session, type, variant] = match1;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const paperNum = variant ? variant.slice(0, 1) : '01';
          const newType = type === 'qp' ? 'qp' : type === 'ms' ? 'ms' : type;
          newName = sessionInfo.year + '-unit' + paperNum + '-' + sessionInfo.year + '-' + sessionInfo.month + '-' + code + '-' + (variant || '01') + '-' + newType + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 1b: 9618_w25_gt.pdf (no variant number)
      const match1b = item.match(/^(\d+)_([msw]\d{2})_(ms|qp|er|gt|ir|ci|pm)\.pdf$/i);
      if (match1b && !shouldRename) {
        const [, code, session, type] = match1b;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const subject = getSubjectFromFolder(folderName);
          const newType = type === 'in' ? 'ir' : type;
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit1-' + sessionInfo.year + '-' + sessionInfo.month + '-01-' + newType + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 2: 2025-unit1-2025-10-WBI11-01A-ms.pdf -> 2025-unit1-2025-10-WBI11-01A-ms.pdf (already good)
      // Pattern 3: October 2025 - Unit 1 MS.pdf
      const match3 = item.match(/^(October|January|June)\s+(\d{4})\s*-\s*Unit\s+(\d+)\s*(MS|QP|ms|qp)(?:\s*(\d+))?\.pdf$/i);
      if (match3) {
        const [, month, year, unit, type, variant] = match3;
        const monthMap = { 'January': '01', 'June': '06', 'October': '10' };
        const newType = type.toLowerCase() === 'ms' ? 'ms' : 'qp';
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + year + '-unit' + unit + '-' + year + '-' + monthMap[month] + '-01' + (variant || '') + '-' + newType + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 4: wbi11-01-que-20210421.pdf
      const match4 = item.match(/^(wbi\d+)-(\d+)-([a-z]+)-(\d{7,8})\.pdf$/i);
      if (match4) {
        const [, code, unit, type, date] = match4;
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const newType = type.toLowerCase() === 'que' ? 'qp' : type.toLowerCase();
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code.toUpperCase() + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-01-' + newType + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 5: 5090_w25_ms_32.pdf
      const match5 = item.match(/^(\d+)_w(\d{2})_(ms|qp|er|gt|ir|ci|pm)_(\d+)\.pdf$/i);
      if (match5) {
        const [, code, sessionYear, type, variant] = match5;
        const year = '20' + sessionYear;
        const month = '11';
        const unit = variant.charAt(0);
        const newType = type.toLowerCase();
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + newType + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 6: October-2019-IAL-ms.pdf
      const match6 = item.match(/^(October|January|June)-(\d{4})-IAL-(ms|qp)\.pdf$/i);
      if (match6) {
        const [, month, year, type] = match6;
        const monthMap = { 'January': '01', 'June': '06', 'October': '10' };
        newName = year + '-unit1-' + year + '-' + monthMap[month] + '-IAL-01-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 7: 2023-unit1-2023-06-5090-12-qp.pdf (extract subject from folder)
      const match7 = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-(\d+)-(\d+)-(ms|qp|er|gt|ci)\.pdf$/i);
      if (match7) {
        const [, year, unit, , month, code, variant, type] = match7;
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 8: 2016-unit1-2016-01-WAC01-01-ms (1).pdf
      const match8 = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-([A-Z]+)(\d+)-(\d+)-(ms|qp)\s*\((\d+)\)\.pdf$/i);
      if (match8) {
        const [, year, unit, , month, code, codeNum, variant, type, copy] = match8;
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + codeNum + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 9: 2016-unit1-2016-06-WAC11-01-ms.pdf
      const match9 = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+)-(ms|qp)\.pdf$/i);
      if (match9) {
        const [, year, unit, , month, code, variant, type] = match9;
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 10: 2025-unit1-2025-10-WAC11-01A-ms.pdf (keep as is but add subject)
      const match10 = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+[A-Z]?)-(ms|qp)\.pdf$/i);
      if (match10) {
        const [, year, unit, , month, code, variant, type] = match10;
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 11: 2025-unit2-2025-06-WAC12-01-ms (1).pdf
      const match11 = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+)-(ms|qp)\s*\((\d+)\)\.pdf$/i);
      if (match11) {
        const [, year, unit, , month, code, variant, type] = match11;
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 12: Accounting-WAC11-2015-unit1-2015-01-ms.pdf (already good, just add subject)
      const match12 = item.match(/^([A-Za-z]+)-([A-Z]+\d+)-(\d{4})-unit(\d+)-(\d{4})-(\d{2})-(\d+)-(ms|qp|er|gt|ci)\.pdf$/i);
      if (match12) {
        const [, existingSubject, code, year, unit, , month, variant, type] = match12;
        const subject = getSubjectFromFolder(folderName);
        if (existingSubject.toLowerCase() !== subject.toLowerCase()) {
          newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 13: Biology-2025-unit1-2025-10-01-ms.pdf (missing code)
      const match13 = item.match(/^([A-Za-z]+)-(\d{4})-unit(\d+)-(\d{4})-(\d{2})-(\d+)-(ms|qp)\.pdf$/i);
      if (match13) {
        const [, subject, year, unit, , month, variant, type] = match13;
        const code = getCodeFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 14: October 2025 - Unit 1A MS.pdf
      const match14 = item.match(/^(October|January|June)\s+(\d{4})\s*-\s*Unit\s+(\d+)([A-Z]?)\s*(MS|QP)\.pdf$/i);
      if (match14) {
        const [, month, year, unit, variant, type] = match14;
        const monthMap = { 'January': '01', 'June': '06', 'October': '10' };
        const newType = type.toLowerCase();
        const subject = getSubjectFromFolder(folderName);
        const code = getCodeFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + monthMap[month] + '-' + (variant || '01') + '-' + newType + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 15: January-2021-IAL-ms.pdf
      const match15 = item.match(/^(January|June|October)-(\d{4})-IAL-(ms|qp)\.pdf$/i);
      if (match15) {
        const [, month, year, type] = match15;
        const monthMap = { 'January': '01', 'June': '06', 'October': '10' };
        const subject = getSubjectFromFolder(folderName);
        const code = getCodeFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit1-' + year + '-' + monthMap[month] + '-01-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 16: 2022-unit6-2022-01-WCH16-01-UNUSED-qp.pdf
      const match16 = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+)-UNUSED-(ms|qp)\.pdf$/i);
      if (match16) {
        const [, year, unit, , month, code, variant, type] = match16;
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 17: 9618_s21_er (1).pdf
      const match17 = item.match(/^(\d+)_([msw]\d{2})_([a-z]+)\s*\((\d+)\)\.pdf$/i);
      if (match17) {
        const [, code, session, type, copy] = match17;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const newType = type === 'er' ? 'er' : type === 'gt' ? 'gt' : type === 'in' ? 'ir' : type;
          const subject = getSubjectFromFolder(folderName);
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit1-' + sessionInfo.year + '-' + sessionInfo.month + '-01-' + newType + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 18: 9618_s21_er.pdf (without copy number)
      const match18 = item.match(/^(\d+)_([msw]\d{2})_([a-z]+)\.pdf$/i);
      if (match18) {
        const [, code, session, type] = match18;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const newType = type === 'er' ? 'er' : type === 'gt' ? 'gt' : type === 'in' ? 'ir' : type;
          const subject = getSubjectFromFolder(folderName);
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit1-' + sessionInfo.year + '-' + sessionInfo.month + '-01-' + newType + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 19: 9618_s21_ms_11.pdf -> extract unit from variant
      const match19 = item.match(/^(\d+)_([msw]\d{2})_(ms|qp)_(\d+)\.pdf$/i);
      if (match19) {
        const [, code, session, type, variant] = match19;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const unit = variant.charAt(0);
          const subject = getSubjectFromFolder(folderName);
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit' + unit + '-' + sessionInfo.year + '-' + sessionInfo.month + '-' + variant + '-' + type + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 19b: 9618_s21_ms_11 (1).pdf (with copy number)
      const match19b = item.match(/^(\d+)_([msw]\d{2})_(ms|qp)_(\d+)\s*\((\d+)\)\.pdf$/i);
      if (match19b) {
        const [, code, session, type, variant, copy] = match19b;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const unit = variant.charAt(0);
          const subject = getSubjectFromFolder(folderName);
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit' + unit + '-' + sessionInfo.year + '-' + sessionInfo.month + '-' + variant + '-' + type + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 20: October-2019-IAL-ms-1.pdf
      const match20 = item.match(/^(January|June|October)-(\d{4})-IAL-(ms|qp)-(\d+)\.pdf$/i);
      if (match20) {
        const [, month, year, type, copy] = match20;
        const monthMap = { 'January': '01', 'June': '06', 'October': '10' };
        const subject = getSubjectFromFolder(folderName);
        const code = getCodeFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit1-' + year + '-' + monthMap[month] + '-01-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 21: IAL files in root A-Level folder
      const match21 = item.match(/^(January|June|October)-(\d{4})-IAL-(ms|qp)\.pdf$/i);
      if (match21) {
        const [, month, year, type] = match21;
        const monthMap = { 'January': '01', 'June': '06', 'October': '10' };
        newName = 'IAL-IAL-' + year + '-unit1-' + year + '-' + monthMap[month] + '-01-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 22: 9618_s21_in_22.pdf (instructions)
      const match22 = item.match(/^(\d+)_([msw]\d{2})_(in|er|gt)_(\d+)\.pdf$/i);
      if (match22) {
        const [, code, session, type, variant] = match22;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const unit = variant.charAt(0);
          const newType = type === 'in' ? 'ir' : type;
          const subject = getSubjectFromFolder(folderName);
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit' + unit + '-' + sessionInfo.year + '-' + sessionInfo.month + '-' + variant + '-' + newType + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 22b: 9618_s21_in_22 (1).pdf (with copy number)
      const match22b = item.match(/^(\d+)_([msw]\d{2})_(in|er|gt)_(\d+)\s*\((\d+)\)\.pdf$/i);
      if (match22b) {
        const [, code, session, type, variant, copy] = match22b;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const unit = variant.charAt(0);
          const newType = type === 'in' ? 'ir' : type;
          const subject = getSubjectFromFolder(folderName);
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit' + unit + '-' + sessionInfo.year + '-' + sessionInfo.month + '-' + variant + '-' + newType + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 23: 2019-pure1-2019-01-WMA11-01-ms.pdf
      const match23 = item.match(/^(\d{4})-(pure|mechanics|stats|further)(\d+)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+)-(ms|qp)\.pdf$/i);
      if (match23) {
        const [, year, paperType, paperNum, , month, code, variant, type] = match23;
        const unitMap = { 'pure': '1', 'mechanics': '2', 'stats': '3', 'further': '4' };
        const unit = unitMap[paperType] || '1';
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 24: 2022-unit4-2022-01-WEC14-01-UNUSED-ms (1).pdf
      const match24 = item.match(/^(\d{4})-unit(\d+)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+)-UNUSED-(ms|qp)\s*\((\d+)\)\.pdf$/i);
      if (match24) {
        const [, year, unit, , month, code, variant, type] = match24;
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 25: 2020-s1-2020-10-WST01-01-ms.pdf
      const match25 = item.match(/^(\d{4})-([a-z]+\d*)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+)-(ms|qp)\.pdf$/i);
      if (match25) {
        const [, year, paperType, , month, code, variant, type] = match25;
        const unitMap = { 's1': '3', 's2': '4', 's3': '5', 's4': '6', 'pure1': '1', 'pure2': '2', 'pure3': '3', 'pure4': '4', 'pure5': '5', 'pure6': '6', 'mechanics1': '2', 'mechanics2': '4', 'mechanics3': '6', 'stats1': '3', 'stats2': '5', 'further1': '5', 'further2': '6' };
        const unit = unitMap[paperType.toLowerCase()] || '1';
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 26: 2022-pure4-2022-01-WMA14-01-a-ms.pdf
      const match26 = item.match(/^(\d{4})-(pure|mechanics|stats|further)(\d+)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+)-([a-z])-(ms|qp)\.pdf$/i);
      if (match26) {
        const [, year, paperType, paperNum, , month, code, variant, variant2, type] = match26;
        const unitMap = { 'pure': '1', 'mechanics': '2', 'stats': '3', 'further': '4' };
        const unit = unitMap[paperType] || '1';
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + variant2 + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 27: 2025-mechanics1-2025-10-WME01-01A-ms.pdf
      const match27 = item.match(/^(\d{4})-(pure|mechanics|stats|further|s)(\d*)-(\d{4})-(\d{2})-([A-Z]+\d+)-(\d+)([A-Z])-(ms|qp)\.pdf$/i);
      if (match27) {
        const [, year, paperType, paperNum, , month, code, variant, variant2, type] = match27;
        const unitMap = { 's': '3', 's1': '3', 's2': '4', 'pure': '1', 'pure1': '1', 'pure2': '2', 'pure3': '3', 'pure4': '4', 'pure5': '5', 'pure6': '6', 'mechanics': '2', 'mechanics1': '2', 'mechanics2': '4', 'mechanics3': '6', 'stats': '3', 'stats1': '3', 'stats2': '5', 'further': '5', 'further1': '5', 'further2': '6' };
        const key = (paperType + paperNum).toLowerCase();
        const unit = unitMap[key] || '1';
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-' + year + '-unit' + unit + '-' + year + '-' + month + '-' + variant + variant2 + '-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 28: 9618_w25_gt.pdf (no underscore between code and session)
      const match28 = item.match(/^(\d+)_([msw]\d{2})_([a-z]+)\.pdf$/i);
      if (match28) {
        const [, code, session, type] = match28;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const subject = getSubjectFromFolder(folderName);
          const newType = type === 'in' ? 'ir' : type;
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit1-' + sessionInfo.year + '-' + sessionInfo.month + '-01-' + newType + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 28b: 7707_w25_gt.pdf (4-digit code)
      const match28b = item.match(/^(\d{4})_([msw]\d{2})_([a-z]+)\.pdf$/i);
      if (match28b) {
        const [, code, session, type] = match28b;
        const sessionInfo = sessionMap[session.toLowerCase()];
        if (sessionInfo) {
          const subject = getSubjectFromFolder(folderName);
          const newType = type === 'in' ? 'ir' : type;
          newName = subject + '-' + code + '-' + sessionInfo.year + '-unit1-' + sessionInfo.year + '-' + sessionInfo.month + '-01-' + newType + '.pdf';
          shouldRename = true;
        }
      }
      
      // Pattern 28c: 7707_y20-22_gd.pdf
      const match28c = item.match(/^(\d+)_y(\d{2})-(\d{2})_([a-z]+)\.pdf$/i);
      if (match28c) {
        const [, code, year1, year2, type] = match28c;
        const subject = getSubjectFromFolder(folderName);
        newName = subject + '-' + code + '-20' + year1 + '-unit1-20' + year1 + '-01-01-' + type + '.pdf';
        shouldRename = true;
      }
      
      // Pattern 29: 52.pdf (just numbers)
      const match29 = item.match(/^(\d+)\.pdf$/i);
      if (match29) {
        const [, num] = match29;
        const subject = getSubjectFromFolder(folderName);
        const code = getCodeFromFolder(folderName);
        newName = subject + '-' + code + '-unknown-unit1-unknown-unknown-01-ms.pdf';
        shouldRename = true;
      }
      
      // Pattern 30: 52 (1).pdf
      const match30 = item.match(/^(\d+)\s*\((\d+)\)\.pdf$/i);
      if (match30) {
        const [, num, copy] = match30;
        const subject = getSubjectFromFolder(folderName);
        const code = getCodeFromFolder(folderName);
        newName = subject + '-' + code + '-unknown-unit1-unknown-unknown-01-ms.pdf';
        shouldRename = true;
      }
      
      if (shouldRename && newName !== item) {
        const newPath = path.join(dir, newName);
        try {
          fs.renameSync(oldPath, newPath);
          console.log('Renamed: ' + item + ' -> ' + newName);
          renamed++;
        } catch (e) {
          console.log('Error renaming: ' + item + ' - ' + e.message);
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

// Also process root A-Level folder for IAL files
const aLevelRoot = path.join(baseDir, 'A-Level');
if (fs.existsSync(aLevelRoot)) {
  totalRenamed += renameFiles(aLevelRoot);
}

console.log('Total files renamed: ' + totalRenamed);
